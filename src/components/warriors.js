import {connect} from 'react-redux';
import React, {Component} from 'react';

//Timer Component:
import Timer from './timer';

//Action Creators:
import warriorActions from './../actions/warrior-actions';

//Utilities:
const showVisibleWarriors = (warriors, filter) => {
  switch(filter) {
    case 'CONSCIOUS':
      return warriors.filter((warrior) => warrior.conscious);
    case 'UNCONSCIOUS':
      return warriors.filter((warrior) => !warrior.conscious);
    default:
      return warriors;
  }
}

//Child Components:
let AddWarrior = ({ dispatch }) => {
  let name;
  return (
    <div>
      <input ref={node => name = node} />
      <button onClick={() => {
          if (name.value.length === 0) {
            return;
          }
          dispatch(warriorActions.addWarrior(name.value));
          name.value = '';
      }}>
      Add a Warrior
      </button>
    </div>
  );
}
AddWarrior = connect()(AddWarrior);


const WarriorList = ({
  warriors,
  onClickStatus,
  onClickName,
  onSubmit
}) => {
  //To use ref successfully with each listed warrior's input,
  //I had to move the undefined variable opponent WITHIN the mapping function block.
  return (
    warriors.map((warrior) => {
      let opponent;
      return (
        <div key={warrior.id}>
          <h3
            style={{cursor: 'no-drop'}}
            onClick={() => onClickName(warrior.id)}
            >
            {warrior.name}
          </h3>
          <ul>
            <li>{`Health: ${warrior.health}`}</li>
            <li>{`Armor: ${warrior.armor}`}</li>
            <li
              style={{cursor: 'alias'}}
              onClick={() => {
                if (!warrior.conscious) {
                  alert(`If only it were that easy...`);
                  return;
                }
                onClickStatus(warrior.id);
                alert(`Nice going. ${warrior.name} is now unconscious.`);
              }}
              >
              {`Status: ${warrior.conscious ? 'Conscious' : 'Unconscious'}`}
            </li>
          </ul>
          <div>
            {warrior.conscious ? (
              <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (opponent.value.length === 0) {
                      return;
                    }
                    onSubmit(warrior.name, opponent.value);
                    opponent.value = '';
                  }}>
                  <input ref={node => opponent = node}
                         type="text"
                         placeholder={'Enter dragon to attack!'}
                    />
                </form>
              <br />
              </div>
              ) : (
              <Timer id={warrior.id}/>
              )
            }
          </div>
        </div>
      );
    })
  );
}

const mapStateToListProps = state => {
  return {
    warriors: showVisibleWarriors (
      state.warriors,
      state.visibility.warriors
    )
  };
}

const mapDispatchToListProps = dispatch => {
  return {
    onClickStatus: (id) => {
      dispatch(warriorActions.toggleConscious(id))
    },
    onClickName: (id) => {
      dispatch(warriorActions.removeWarrior(id))
    },
    onSubmit: (warriorName, dragonName) => {
      dispatch(warriorActions.attackDragonAsync(warriorName, dragonName))
    }
  };
}

const VisibleWarriorList = connect(
  mapStateToListProps,
  mapDispatchToListProps
)(WarriorList);

const WarriorLink = ({
  onClickLink,
  active,
  status
}) => {
  if (active) {
    return (
      <span style={{margin: '5px'}}>{status}</span>
    );
  } else {
    return (
      <a href='#'
         style={{margin: '5px'}}
         onClick={(e) => {
           e.preventDefault();
           onClickLink(status);
         }}
       >
       {status}
     </a>
    );
  }
}

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.status === state.visibility.warriors,
    status: ownProps.status
  };
}

const mapDispatchToLinkProps = dispatch => {
  return {
    onClickLink: (status) => {
      dispatch(warriorActions.setWarriorVisibility(status))
    }
  };
}

const WarriorFilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(WarriorLink);

const WarriorLinks = () => {
  const statuses = ['ALL', 'CONSCIOUS', 'UNCONSCIOUS'];
  return (
    <div>
      Show:
      {' '}
      {statuses.map((status) => {
        return (
          <WarriorFilterLink
            status={status}
            key={status[0]}
            />
        );
      })}
    </div>
  );
};

//Previously, this component was a class, with its own store subscription.
//I cut out those lifecycle hooks, though, and refactored so that
//Warriors didn't need to pass any props to its children.
//It used to pass several different dispatch calls and state-as-props,
//but since connect() can only wrap a single component at a time,
//refactoring to create several smart containers made best sense.
const Warriors = () => {
  return (
    <div>
      <AddWarrior />
      <br />
      <VisibleWarriorList />
      <br />
      <WarriorLinks />
    </div>
  );
}

//Export:
export default Warriors;
