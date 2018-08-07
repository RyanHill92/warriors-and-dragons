import AttackApi from './../api/mock-attacks';

let nextWarriorId = 0;
const addWarrior = name => {
  return {
    type: 'ADD_WARRIOR',
    id: nextWarriorId ++,
    name
  };
}

//Handler passed to onClickName in WarriorHeader.
const removeWarrior = id => {
  return {
    type: 'REMOVE_WARRIOR',
    id
  };
}

//Handler passed to onClickStatus in WarriorStats.
//Disabled if warrior already unconscious thanks to component logic.
const toggleConscious = id => {
  return {
    type: 'TOGGLE_CONSCIOUS',
    id
  };
}

//The Timer component passes this action creator
const decrementTime = id => {
  return {
    type: 'DECREMENT_TIME',
    id
  };
}

//The ticker is defined in the body of the Timer component.
//That ticker turns out to be another action creator. Sneaky!
const startTimer = (id, ticker) => {
  return {
    type: 'START_TIMER',
    ticker,
    id
  }
}

//onClick handler passed to FilterLinks.
const setWarriorVisibility = status => {
  return {
    type: 'SET_VISIBILITY',
    group: 'warriors',
    filter: status
  };
}

//Only dispatched by async thunk action creator below if certain conditions are met.
const attackDragon = (id, value) => {
  return {
    type: 'ATTACK_DRAGON',
    id,
    value
  };
}

//Changes dragon's dead property to true, so UI renders dead card.
const killDragon = id => {
  return {
    type: 'KILL_DRAGON',
    id
  }
}

//Dispatches attackDragon if certain conditions are met.
//Calls mockAPI for random attack type.
//onSubmit handler passed to input field in WarriorFooter.
const attackDragonAsync = (warriorName, dragonName) => {
  return function (dispatch, getState) {
    const dragons = getState().dragons;
    //Safe to take zeroth index because dragons reducer blocks duplicate names.
    let dragonToAttack = dragons.filter((dragon) => {
      return dragon.name.toLowerCase() === dragonName.toLowerCase();
    })[0];
    //Determine whether dragon exists.
    if (dragonToAttack === undefined) {
      alert('That dragon does not exist!');
      return;
    }
    //If dragon is captured, no attack action dispatched.
    if (!dragonToAttack.wild) {
      alert('Hold it! Warriors are at least decent enough not to attack their pets.');
      return;
    }
    //After dragon is slain, block any subsequent calls to the mock API or attack dispatches.
    if (dragonToAttack.health === 0) {
      alert(`${dragonName} is already dead!`);
      return;
    }

    return AttackApi.warriorAttack().then((weapon) => {
      //Use weapon strength and multiplier to randomly determine damage.
      //Then, call attackDragon action creator.
      //Finally, return the attacked dragon's id to chain one last then.
      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * weapon.strength);
      dispatch(attackDragon(dragonToAttack.id, totalDamage));
      alert(`${warriorName} attacked ${dragonName} ${weapon.text} for ${totalDamage} damage!`);
      return dragonToAttack.id;

    }).then((id) => {
      //Check for dragon death after most recent attack.
      //If so, throw an alert.
      let attackedDragon = getState().dragons.filter((dragon) => {
        return dragon.id === id;
      })[0];
      if (attackedDragon.health === 0) {
        alert(`${attackedDragon.name} has been slain!`);
        dispatch(killDragon(attackedDragon.id));
      }

    }).catch((err) => {
      alert(err);
    });
  };
}

const warriorActions = {
  addWarrior,
  removeWarrior,
  toggleConscious,
  setWarriorVisibility,
  attackDragonAsync,
  killDragon,
  decrementTime,
  startTimer
};

export default warriorActions;
