//Receives individual warrior as state.
const warriorSubReducer = (state, action) => {
  switch(action.type) {
    //LOTS of possibilities...
    case 'ATTACK_WARRIOR':
      if (state.id !== action.id) {
        return state;
        //If armor intact and greater than damage to be inflicted,
        //deduct halved damage from armor.
      } else if (state.armor - (action.value * 0.5) > 0) {
        return {...state, armor: Math.floor(state.armor - (action.value*0.5))};
        //If damage to be inflicted will bring armor to zero or below,
        //set armor to zero.
      } else if (state.armor - (action.value * 0.5) <= 0 && state.armor !== 0) {
        return {...state, armor: 0};
        //If armor destroyed, warrior awake, and damage to be inflicted
        //enough to bring health to zero or below, set health to zero.
      } else if (state.armor === 0 && state.health - action.value <= 0 && state.conscious) {
        return {...state, health: 0};
        //If armor destroyed and damage to be inflicted enough to kill warrior,
        //but the warrior is asleep, return state with health as it was before
        //and the spared property set to true. This triggers a smart alert from
        //the getWarriorStatus function in warrior-actions.js.
      } else if (state.armor === 0 && state.health - action.value <= 0 && !state.conscious) {
        return {...state, spared: true};
        //If armor is destroyed and damage to be inflicted will not kill warrior,
        //simply deduct damage from health.
      } else if (state.armor === 0 && state.health - action.value > 0) {
        return {...state, health: state.health - action.value};
      } else {
        return state;
      }
    case 'TOGGLE_CONSCIOUS':
      if (state.id !== action.id) {
        return state;
      }
      //If armor is intact OR has been destroyed already,
      //there's no need to modify the exposed property.
      //Just knock the warrior out.
      if (state.exposed || state.armor > 0) {
        return {...state, conscious: !state.conscious, timeToConscious: 10};
      }
      //The exposed property plays into the ATTACK_WARRIOR logic above.
      //If a warrior already had his armor destroyed, then all subsequent
      //damage will be deducted in full from warrior's health.
      return {...state, conscious: !state.conscious, timeToConscious: 10, exposed: true};
    case 'ADD_WARRIOR':
      return {
        name: action.name,
        health: 100,
        armor: 100,
        conscious: true,
        timeToConscious: 0,
        timer: undefined,
        dead: false,
        exposed: false,
        id: action.id
      };
    case 'REMOVE_WARRIOR':
      return state.id !== action.id;
    //Setting dead to true triggers the UI to render a dead card.
    case 'KILL_WARRIOR':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, dead: true};
    //Thanks to the Timer component, this action is dispatched
    //every second from the timer below. Once the time decrements to zero,
    //this part of the reducer handles clearing the interval.
    case 'DECREMENT_TIME':
      if (state.id !== action.id) {
        return state;
      }
      if (state.timeToConscious === 0) {
        return {...state, timer: clearInterval(state.timer), conscious: true};
      }
      return {...state, timeToConscious: state.timeToConscious - 1};
    //Sets an interval and stores it as a property value of warrior.
    //Does not know or care what the ticker is, as long as it's a function.
    case 'START_TIMER':
      if (state.id !== action.id) {
        return state;
      }
      //Ensures only one interval is ever ticking at a time.
      if (state.timer !== undefined) {
        return state;
      }
      return {...state, timer: setInterval(() => {
        action.ticker(state.id);
      }, 1000)};
    default:
      return state;
  }
}

//Receives an array of warriors.
const warriorReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_WARRIOR':
      return state.map((warrior) => {
        return warriorSubReducer(warrior, action);
      });
    case 'ATTACK_ALL_WARRIORS':
      return state.map((warrior) => {
        return warriorSubReducer(warrior, action);
      })
    case 'TOGGLE_CONSCIOUS':
      return state.map((warrior) => {
        return warriorSubReducer(warrior, action);
      });
    case 'ADD_WARRIOR':
      let repeat = state.filter((warrior) => {
        return warrior.name === action.name;
      })
      if (repeat.length > 0) {
        return state;
      }
      return [...state, warriorSubReducer(null, action)];
    case 'REMOVE_WARRIOR':
      return state.filter((warrior) =>
        warriorSubReducer(warrior, action));
    case 'KILL_WARRIOR':
      return state.map((warrior) =>
        warriorSubReducer(warrior, action));
    case 'DECREMENT_TIME':
      return state.map((warrior) =>
        warriorSubReducer(warrior, action));
    case 'START_TIMER':
      return state.map((warrior) =>
        warriorSubReducer(warrior, action));
    default:
      return state;
  }
}

export default warriorReducer;
