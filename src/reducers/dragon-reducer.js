//Receives individual dragons as state.
const dragonSubReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_DRAGON':
      if (state.id !== action.id) {
        return state;
      }

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
      return {
        name: action.name,
        health: 500,
        wild: true,
        id: action.id
      };
    case 'REMOVE_DRAGON':
      return state.id !== action.id;
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
      return [...state, dragonSubReducer(null, action)];
    case 'REMOVE_DRAGON':
      return state.filter((dragon) =>
        dragonSubReducer(dragon, action));
    default:
      return state;
  }
}

export default dragonReducer;
