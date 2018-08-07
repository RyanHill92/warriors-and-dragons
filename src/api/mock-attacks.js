//Five possible attack types each for warriors and dragons.
const attacks = {
  warriorWeapons: {
    spear: {
      strength: 50,
      text: 'with a spear'
    },
    bow: {
      strength: 40,
      text: 'with a bow and arrow'
    },
    sword: {
      strength: 30,
      text: 'with a sharp sword'
    },
    club: {
      strength: 20,
      text: 'with a wooden club'
    },
    fists: {
      strength: 10,
      text: 'with bare fists'
    }
  },
  dragonTactics: {
    firebreath: {
      strength: 50,
      text: 'with fiery, blazing breath'
    },
    crush: {
      strength: 40,
      text: 'with crushing body weight'
    },
    bite: {
      strength: 30,
      text: 'with powerful jaws'
    },
    claw: {
      strength: 20,
      text: 'with razor-sharp claws'
    },
    tail: {
      strength: 10,
      text: 'with a swift tail-swipe'
    }
  },
};

//MockAPI = class with two static methods, each returning an attack after 1s. 
class AttackApi {
  static warriorAttack () {
    let randomNum = Math.floor(Math.random()*4.9);
    let weaponKey = Object.keys(attacks.warriorWeapons)[randomNum];
    let weapon = attacks.warriorWeapons[weaponKey];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(weapon);
      }, 1000);
    });
  }
  static dragonAttack () {
    let randomNum = Math.floor(Math.random()*4.9);
    let tacticKey = Object.keys(attacks.dragonTactics)[randomNum];
    let tactic = attacks.dragonTactics[tacticKey];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(tactic);
      }, 1000);
    });
  }
}

export default AttackApi;
