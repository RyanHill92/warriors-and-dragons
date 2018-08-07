//Used earlier on for testing. See below.
import expect from 'expect';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dragonReducer from './../reducers/dragon-reducer';
import warriorReducer from './../reducers/warrior-reducer';
import visibilityReducer from './../reducers/visibility-reducer';

//Empty store when app first started up.
const initialState = {
  warriors: [],
  dragons: [],
  visibility: {
    warriors: 'ALL',
    dragons: 'ALL'
  }
};

//Top-level reducer passed to createStore.
const reducer = (state = initialState, action) => {
  return {
    warriors: warriorReducer(state.warriors, action),
    dragons: dragonReducer(state.dragons, action),
    visibility: visibilityReducer(state.visibility, action)
  };
}

//Second arg makes it possible to use thunks as action creators. 
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

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
