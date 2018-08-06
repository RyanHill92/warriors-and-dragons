const expect = require('expect');
const {createStore} = require('redux');

const initialState = {
  warriors: [],
  dragons: [],
  visibility: {
    warriors: 'ALL',
    dragons: 'ALL'
  }
};

//Receives individual dragons as state.
const dragonSubReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_DRAGON':
      if (state.id !== action.id) {
        return state;
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
        health: 1000,
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

//Receives individual warrior as state.
const warriorSubReducer = (state, action) => {
  switch(action.type) {
    case 'ATTACK_WARRIOR':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, health: state.health - action.value};
    case 'TOGGLE_CONSCIOUS':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, conscious: !state.conscious};
    case 'ADD_WARRIOR':
      return {
        name: action.name,
        health: 100,
        conscious: true,
        id: action.id
      };
    case 'REMOVE_WARRIOR':
      return state.id !== action.id;
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
    case 'TOGGLE_CONSCIOUS':
      return state.map((warrior) => {
        return warriorSubReducer(warrior, action);
      });
    case 'ADD_WARRIOR':
      return [...state, warriorSubReducer(null, action)];
    case 'REMOVE_WARRIOR':
      return state.filter((warrior) =>
        warriorSubReducer(warrior, action));
    default:
      return state;
  }
}

const visibilitySubReducer = (state, action) => {
  switch(action.type) {
    case 'SET_VISIBILITY':
      if (Object.keys(state)[0] !== action.group) {
        return state;
      }
      return {}
    default:
      return state;
  }
}

//Receives object.
const visibilityReducer = (state, action) => {
  switch(action.type) {
    case 'SET_VISIBILITY':
      return {...state, [action.group]: action.filter};
    default:
      return state;
  }
}

let sampleSVAction = {
  type: 'SET_VISIBILITY',
  group: 'warriors',
  filter: 'CONSCIOUS'
}

const reducer = (state = initialState, action) => {
  return {
    warriors: warriorReducer(state.warriors, action),
    dragons: dragonReducer(state.dragons, action),
    visibility: visibilityReducer(state.visibility, action)
  };
}

const store = createStore(reducer);

// store.dispatch({
//   type: 'TOGGLE_CONSCIOUS',
//   id: 1
// });
//
// expect(store.getState().warriors[0]).toMatchObject({
//   name: 'Jeff',
//   conscious: false
// });
//
// store.dispatch({
//   type: 'ATTACK_DRAGON',
//   id: 1,
//   value: 100
// });
//
// expect(store.getState().dragons[0]).toMatchObject({
//   name: 'Lazarran',
//   health: 900
// });
//
// store.dispatch({
//   type: 'ATTACK_WARRIOR',
//   id: 2,
//   value: 50
// });
//
// expect(store.getState().warriors[1]).toMatchObject({
//   name: 'James',
//   health: 50
// });
//
// store.dispatch({
//   type: 'TOGGLE_CAPTURE',
//   id: 2
// });
//
// expect(store.getState().dragons[1]).toMatchObject({
//   name: 'Gorgoth',
//   wild: false
// });
//
// console.log('All tests passed!');

export {store};
