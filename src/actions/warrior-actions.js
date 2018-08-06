import AttackApi from './../api/mock-attacks';

let nextWarriorId = 0;
const addWarrior = name => {
  return {
    type: 'ADD_WARRIOR',
    id: nextWarriorId ++,
    name
  };
}

const removeWarrior = id => {
  return {
    type: 'REMOVE_WARRIOR',
    id
  };
}

const toggleConscious = id => {
  return {
    type: 'TOGGLE_CONSCIOUS',
    id
  };
}

const setWarriorVisibility = status => {
  return {
    type: 'SET_VISIBILITY',
    group: 'warriors',
    filter: status
  };
}

const attackDragon = (id, value) => {
  return {
    type: 'ATTACK_DRAGON',
    id,
    value
  };
}

const attackDragonAsync = (warriorName, dragonName) => {
  return function (dispatch, getState) {
    const dragons = getState().dragons;
    let dragonToAttack = dragons.filter((dragon) => {
      return dragon.name.toLowerCase() === dragonName.toLowerCase();
    });
    //Use getState arg to determine whether dragon exists.
    if (dragonToAttack.length === 0) {
      alert('That dragon does not exist!');
      return;
    }
    //If dragon is captured, block attack.
    if (dragonToAttack[0].wild === false) {
      alert('Hold it! Warriors are at least decent enough not to attack their pets.');
      return;
    }
    //After dragon is slain, block any subsequent calls to the mock API.
    if (dragonToAttack[0].health === 0) {
      alert(`${dragonName} is already dead!`);
      return;
    }

    return AttackApi.warriorAttack().then((weapon) => {
      //Use weapon strength and multiplier to randomly determine damage.
      //Then, call attackDragon action creator.
      //Finally, return the attacked dragon's id to chain one last then.
      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * weapon.strength);
      dispatch(attackDragon(dragonToAttack[0].id, totalDamage));
      alert(`${warriorName} attacked ${dragonName} ${weapon.text} for ${totalDamage} damage!`);
      return dragonToAttack[0].id;

    }).then((id) => {
      //Check for dragon death after most recent attack.
      //If so, throw an alert.
      let attackedDragon = getState().dragons.filter((dragon) => {
        return dragon.id === id;
      })[0];
      if (attackedDragon.health === 0) {
        alert(`${attackedDragon.name} has been slain!`);
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
  attackDragonAsync
};

export default warriorActions;
