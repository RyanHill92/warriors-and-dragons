
//Receives object with two props, warriors and dragons, each with current filter as value.
//One or the other prop sent in action payload so that value of correct prop is set.
const visibilityReducer = (state, action) => {
  switch(action.type) {
    case 'SET_VISIBILITY':
      return {...state, [action.group]: action.filter};
    default:
      return state;
  }
}

export default visibilityReducer;
