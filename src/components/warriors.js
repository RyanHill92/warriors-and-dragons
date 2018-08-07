import {connect} from 'react-redux';
import React, {Component} from 'react';

//Timer Component:
import Timer from './timer';

//Action Creators:
import warriorActions from './../actions/warrior-actions';

//Utility function to return only warriors of selected status.
//The || operator is key: for the first second of unconsciousness,
//the unconscious warrior's card will still be visible if the CONSCIOUS
//filter is activated. This way, the timer will still start because
//the Timer component will mount for one second before disappearing.
const showVisibleWarriors = (warriors, filter) => {
  switch(filter) {
    case 'CONSCIOUS':
      return warriors.filter((warrior) =>
        warrior.conscious || warrior.timeToConscious === 10);
    case 'UNCONSCIOUS':
      return warriors.filter((warrior) => !warrior.conscious);
    default:
      return warriors;
  }
}

//Child Components:

//Able to dispatch addWarrior because of connect call below.
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
//Still passed dispatch when both of connect's args are null.
AddWarrior = connect()(AddWarrior);

//Controls presentation of warrior name.
const WarriorHeader = ({
  warrior,
  onClickName
}) => {
  return (
    <h3
      style={{cursor: 'no-drop'}}
      onClick={() => onClickName(warrior.id)}
      >
      {warrior.name}
    </h3>
  );
}

//Displays either warrior statistics or dead card if dead is true.
//Sets size for dead card.
//Blocks user from toggling consciousness of knocked out warrior.
const WarriorStats = ({
  warrior,
  onClickStatus
}) => {
  return (
    <div>
      { warrior.dead ?
        <div className="text-center">
          <div className="card" style={{backgroundColor: '#DC143C', width: '60%'}}>
            <div className="card-body">
              <h1><i className="fas fa-skull"></i></h1>
              <p><em>Click name to bury.</em></p>
            </div>
          </div>
        </div>
         :
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
      }
    </div>
  );
}

//Renders either attack input field or time-to-consciousness ticker.
//Does not render at all if warrior dead.
//Notice the undefined opponent variable to make ref function below possible.
//Blocks user from attacking without first entering at least one character.
const WarriorFooter = ({
  warrior,
  onSubmit
}) => {
  let opponent;
  if (warrior.dead) {
    return null;
  }
  return(
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
        </div>
        ) : (
        <Timer id={warrior.id}
               time={warrior.timeToConscious}
          />
        )
      }
    </div>
  );
}

//Passes props from its store-connected container, generated below by connect().
//All three handlers passed on to children are action dispatchers.
//Sets exact size of each character card.
const WarriorList = ({
  warriors,
  onClickStatus,
  onClickName,
  onSubmit
}) => {
  return (
    warriors.map((warrior) => {
      return (
        <div key={warrior.id} className="card-body" style={{height: '200px'}}>
          <WarriorHeader
            warrior={warrior}
            onClickName={id => onClickName(id)}/>
          <WarriorStats
            warrior={warrior}
            onClickStatus={id => onClickStatus(id)}/>
          <WarriorFooter
            warrior={warrior}
            onSubmit={(warriorName, dragonName) =>
              onSubmit(warriorName, dragonName)}
            />
        </div>
      );
    })
  );
}

//Call of utility function above with two args from state.
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

//Presentational only.
//Knows to render a span instead of a link if passed active === true.
//Passed handler which dispatches an action, but it doesn't know that.
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

//Status passed down to WarriorLink from WarriorLinks.
//Active calculated straight from store.
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

//Smart container wraps each individual link.
//This component is the one rendered multiple times by WarriorLinks.
const WarriorFilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(WarriorLink);

//Renders one link for each status in array.
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
