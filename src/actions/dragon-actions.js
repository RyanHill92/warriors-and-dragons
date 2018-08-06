import AttackApi from './../api/mock-attacks';
import warriorActions from './warrior-actions';

let nextDragonId = 0;
const addDragon = name => {
  return {
    type: 'ADD_DRAGON',
    name,
    id: nextDragonId++
  };
}

const removeDragon = id => {
  return {
    type: 'REMOVE_DRAGON',
    id
  };
}

const attackAllWarriors = (value) => {
  return function (dispatch, getState) {
    const {warriors} = getState();
    for (let warrior of warriors) {
      dispatch(attackWarrior(warrior.id, value));
    }
  }
}

const attackWarrior = (id, value) => {
  return {
    type: 'ATTACK_WARRIOR',
    value,
    id
  }
}

const toggleCaptureAsync = id => {
  return function (dispatch, getState) {
    const {dragons} = getState();
    let dragonToCapture = dragons.filter((dragon) => {
      return dragon.id === id;
    })[0];

    if (dragonToCapture.health < 100 && dragonToCapture.wild === true) {
      dispatch({
        type: 'TOGGLE_CAPTURE',
        id
      });
      alert(`${dragonToCapture.name} was captured!`);
      return;
    } else if (dragonToCapture.wild === false) {
      dispatch({
        type: 'TOGGLE_CAPTURE',
        id
      });
      alert(`${dragonToCapture.name} was set free!`);
      return;
    }
    return AttackApi.dragonAttack().then((tactic) => {
      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * tactic.strength);
      dispatch(attackAllWarriors(totalDamage));
      alert(`${dragonToCapture.name} is too strong to be captured and attacked all warriors ${tactic.text} for ${totalDamage} damage!`);
    }).catch((err) => {
      alert(err);
    });
  }
}

const attackWarriorAsync = (dragonName, warriorName) => {
  return function (dispatch, getState) {
    const warriors = getState().warriors;
    let warriorToAttack = warriors.filter((warrior) => {
      return warrior.name.toLowerCase() === warriorName.toLowerCase();
    });
    //Use getState arg to determine whether warrior exists.
    if (warriorToAttack.length === 0) {
      alert('That warrior does not exist!');
      return;
    }

    //After warrior is slain, block any subsequent calls to the mock API.
    if (warriorToAttack[0].health === 0) {
      alert(`${warriorName} is already dead!`);
      return;
    }

    return AttackApi.dragonAttack().then((tactic) => {

      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * tactic.strength);
      dispatch(attackWarrior(warriorToAttack[0].id, totalDamage));
      alert(`${dragonName} attacked ${warriorName} ${tactic.text} for ${totalDamage} damage!`);
      return warriorToAttack[0].id;

    }).then((id) => {
      //Check for dragon death after most recent attack.
      //If so, throw an alert.
      let attackedWarrior = getState().warriors.filter((warrior) => {
        return warrior.id === id;
      })[0];
      if (attackedWarrior.health === 0) {
        alert(`${attackedWarrior.name} has been slain!`);
      } else if (attackedWarrior.armor > 0) {
        alert(`${attackedWarrior.name}'s armor blocked some of the damage.`);
      } else if ( attackedWarrior.armor === 0
        && attackedWarrior.conscious === true
        && warriorToAttack[0].armor > 0 ) {
        dispatch(warriorActions.toggleConscious(id));
        alert(`${attackedWarrior.name} has been knocked out!`);
      }
    }).catch((err) => {
      alert(err);
    });
  };
}

const setDragonVisibility = status => {
  return {
    type: 'SET_VISIBILITY',
    group: 'dragons',
    filter: status
  };
}

const dragonActions = {
  addDragon,
  removeDragon,
  toggleCaptureAsync,
  setDragonVisibility,
  attackWarriorAsync
};

export default dragonActions;
