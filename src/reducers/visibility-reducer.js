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

export default visibilityReducer;
