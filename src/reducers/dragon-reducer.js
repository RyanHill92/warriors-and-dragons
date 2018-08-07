//Utility function for ADD_DRAGON action to set random species.
const getSpecies = () => {
  const speciesList = [
    'Red Darter',
    'Spiked Skyworm',
    'Cloud Piercer',
    'Greater Flamebeast',
    'Ridged Hawkhead',
    'Two-Tailed Slicer',
    'Danish Drilltooth',
    'Golden Fellsailor'
  ]
  let randomIndex = Math.floor(Math.random() * 7.9);
  return speciesList[randomIndex];
}

//Receives individual dragons as state.
const dragonSubReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_DRAGON':
      //Don't want to attack the wrong dragon!
      if (state.id !== action.id) {
        return state;
      }
      //Don't want to render a negative number for health! Dead is dead.
      if (state.health - action.value <= 0) {
        return {...state, health: 0};
      }

      return {...state, health: state.health - action.value};
    case 'TOGGLE_CAPTURE':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, wild: !state.wild};
    case 'ADD_DRAGON':
      //Create variable to hold return value so species is set for good.
      //Otherwise, new species for each re-render (if prop value IS the method call).
      let species = getSpecies();
      //Living until proven dead.
      //ID created and passed by AddDragon component.
      return {
        name: action.name,
        health: 500,
        species,
        wild: true,
        dead: false,
        id: action.id
      };
    case 'REMOVE_DRAGON':
      return state.id !== action.id;
    //Triggers rendering of dead card.
    case 'KILL_DRAGON':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, dead: true}
    default:
      return state;
  }
}

//Receives an array of dragons as state.
const dragonReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_DRAGON':
      return state.map((dragon) => {
        return dragonSubReducer(dragon, action);
      });
    case 'TOGGLE_CAPTURE':
      return state.map((dragon) => {
        return dragonSubReducer(dragon, action);
      });
    case 'ADD_DRAGON':
      let repeat = state.filter((dragon) => {
        return dragon.name === action.name;
      })
      //Check for duplicate name and if so, no addition.
      if (repeat.length > 0) {
        return state;
      }
      //No need to pass state on to subReducer.
      //We just want a single object returned, not an array.
      return [...state, dragonSubReducer(null, action)];
    case 'REMOVE_DRAGON':
      return state.filter((dragon) =>
        dragonSubReducer(dragon, action));
    case 'KILL_DRAGON':
      return state.map((dragon) =>
        dragonSubReducer(dragon, action))
    default:
      return state;
  }
}

export default dragonReducer;
