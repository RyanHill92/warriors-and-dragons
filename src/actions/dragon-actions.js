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

//Handler passed to onClickName in Dragon Header.
const removeDragon = id => {
  return {
    type: 'REMOVE_DRAGON',
    id
  };
}

//Consequence of trying to capture a dragon with too much health.
//Loops through all warriors, calling attackWarrior on individuals.
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

//Toggles warrior's dead property to true, so UI renders dead card.
const killWarrior = id => {
  return {
    type: 'KILL_WARRIOR',
    id
  };
}

//System of "smart" alerts to assess warrior condition based on armor,
//health, exposed, and conscious.
const getWarriorStatus = attackedWarrior => {
  return function (dispatch) {
    //Alert if warrior was slain.
    if (attackedWarrior.health === 0) {
      alert(`${attackedWarrior.name} has been slain!`);
      //Dispatch KILL_WARRIOR if killed.
      dispatch(killWarrior(attackedWarrior.id));
      return;
    //If armor still intact, notify of blocked damage.
    } else if (attackedWarrior.armor > 0) {
      alert(`${attackedWarrior.name}'s armor blocked some of the damage.`);
      return;
      //If armor was just demolished, render warrior unconscious and alert.
    } else if (attackedWarrior.armor === 0
      && attackedWarrior.conscious
      && !attackedWarrior.exposed ) {
        dispatch(warriorActions.toggleConscious(attackedWarrior.id));
        alert(`${attackedWarrior.name} has been knocked out!`);
        return;
      //If warrior is unconscious and would otherwise die from attack damage, alert of no effect.
    } else if (attackedWarrior.spared
      && !attackedWarrior.conscious
      && attackedWarrior.exposed) {
        alert(`...but ${attackedWarrior.name} would prefer to wake up before he's slain.`);
        return;
    }
  }
}

const toggleCapture = id => {
  return {
    type: 'TOGGLE_CAPTURE',
    id
  };
}

//One of three possibilities:
const toggleCaptureAsync = id => {
  return function (dispatch, getState) {
    const {dragons} = getState();
    let dragonToCapture = dragons.filter((dragon) => {
      return dragon.id === id;
    })[0];
    //(1)Clicked dragon captured because still wild and below 100 health.
    if (dragonToCapture.health < 100 && dragonToCapture.wild === true) {
      dispatch(toggleCapture(id));
      alert(`${dragonToCapture.name} was captured!`);
      return;
      //(2) Clicked dragon set free because currently captured.
    } else if (dragonToCapture.wild === false) {
      dispatch(toggleCapture(id));
      alert(`${dragonToCapture.name} was set free!`);
      return;
    }
    //(3)Clicked dragon above 100 and wild, so warriors all attacked.
    return AttackApi.dragonAttack().then((tactic) => {
      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * tactic.strength);
      dispatch(attackAllWarriors(totalDamage));
      alert(`${dragonToCapture.name} is too strong to be captured and attacked all warriors ${tactic.text} for ${totalDamage} damage!`);
      //Return list of warriors for status check in next then block.
      return getState().warriors;
    }).then((warriors) => {
      //Run status check on each warrior in store after attacks above.
      for (let warrior of warriors) {
        dispatch(getWarriorStatus(warrior));
      }
    })
    .catch((err) => {
      alert(err);
    });
  }
}

//Dispatches attackWarrior under certain conditions.
//Calls mockAPI for random attack type.
//Passed as onSubmit handler to input field in DragonFooter.
const attackWarriorAsync = (dragonName, warriorName) => {
  return function (dispatch, getState) {
    //Use getState arg to look for a name match in the store.
    const warriors = getState().warriors;
      //Safe to take zeroth index because duplicate names blocked in warriors reducer.
    let warriorToAttack = warriors.filter((warrior) => {
      return warrior.name.toLowerCase() === warriorName.toLowerCase();
    })[0];
    //No dispatch if entered name does not match an exisiting warrior.
    if (warriorToAttack === undefined) {
      alert('That warrior does not exist!');
      return;
    }

    //After warrior is slain, block any subsequent calls to the mock API.
    if (warriorToAttack.health === 0) {
      alert(`${warriorName} is already dead!`);
      return;
    }

    //Mock API call for attack tactic (strength and text).
    return AttackApi.dragonAttack().then((tactic) => {
      //Use randomly returned tactic x random damage multiplier to calculate attack strength.
      let damageMultiplier = Math.random() * 5;
      let totalDamage = Math.floor(damageMultiplier * tactic.strength);
      //Dispatch action and return id for next then call.
      dispatch(attackWarrior(warriorToAttack.id, totalDamage));
      alert(`${dragonName} attacked ${warriorName} ${tactic.text} for ${totalDamage} damage!`);
      return warriorToAttack.id;

    }).then((id) => {
      //Make another getState call to get data on the warrior post-attack.
      let attackedWarrior = getState().warriors.filter((warrior) => {
        return warrior.id === id;
      })[0];
      //Call utility function to trigger one of several smart alerts.
      dispatch(getWarriorStatus(attackedWarrior));
    }).catch((err) => {
      alert(err);
    });
  };
}

//onClick handler passed to FilterLinks.
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
  attackWarriorAsync,
  killWarrior
};

export default dragonActions;
