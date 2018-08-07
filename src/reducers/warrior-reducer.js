//Receives individual warrior as state.
const warriorSubReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_WARRIOR':
      if (state.id !== action.id) {
        return state;
      //Deduct damage from armor
      } else if (state.armor - (action.value * 0.5) > 0) {
        return {...state, armor: Math.floor(state.armor - (action.value*0.5))};
      } else if (state.armor - (action.value * 0.5) <= 0 && state.armor !== 0) {
        return {...state, armor: 0};
      } else if (state.armor === 0 && state.health - action.value <= 0 && state.conscious) {
        return {...state, health: 0};
      } else if (state.armor === 0 && state.health - action.value <= 0 && !state.conscious) {
        return {...state, spared: true};
      } else if (state.armor === 0 && state.health - action.value > 0) {
        return {...state, health: state.health - action.value};
      } else {
        return state;
      }
    case 'TOGGLE_CONSCIOUS':
      if (state.id !== action.id) {
        return state;
      }

      if (state.exposed || state.armor > 0) {
        return {...state, conscious: !state.conscious};
      }

      return {...state, conscious: !state.conscious, exposed: true};
    case 'ADD_WARRIOR':
      return {
        name: action.name,
        health: 100,
        armor: 100,
        conscious: true,
        dead: false,
        exposed: false,
        id: action.id
      };
    case 'REMOVE_WARRIOR':
      return state.id !== action.id;
    case 'KILL_WARRIOR':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, dead: true};
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
    default:
      return state;
  }
}

export default warriorReducer;
