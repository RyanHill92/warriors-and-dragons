import {connect} from 'react-redux';
import React, {Component} from 'react';

//Action Creators:
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

const toggleCapture = id => {
  return {
    type: 'TOGGLE_CAPTURE',
    id
  };
}

const setDragonVisibility = status => {
  return {
    type: 'SET_VISIBILITY',
    group: 'dragons',
    filter: status
  };
}

//Utility Functions:
const showVisibleDragons = (dragons, filter) => {
  switch(filter) {
    case 'WILD':
      return dragons.filter((dragon) => dragon.wild);
    case 'CAPTURED':
      return dragons.filter((dragon) => !dragon.wild);
    default:
      return dragons;
  }
}

//Child Components:

//An odd hybrid, a little of both behavior and presentation.
//With let binding here, AddDragon can wrap itself below with connect.
let AddDragon = ({dispatch}) => {
  let name;
  return (
    <div>
      <input ref={node => name = node} />
      <button
        onClick={() => {
          if (name.value.length === 0) {
            return;
          }
          dispatch(addDragon(name.value));
          name.value = '';
        }}
        >
        Add a Dragon
      </button>
    </div>
  );
}
//Called without args (null, null), the connect method
//passes the dispatch method to the wrapped component.
AddDragon = connect()(AddDragon);

//Purely presentational--controls how list of warriors is rendered.
//"Doesn't know" why it displays certain warriors and not others.
//"Dumb" in that it simply follows parent's directions.
const DragonList = ({
  dragons,
  onClickStatus,
  onClickName
}) => {
  return (
    dragons.map((dragon) =>
      <div key={dragon.id}>
        <h3
          style={{cursor: 'no-drop'}}
          onClick={() => onClickName(dragon.id)}
          >
          {dragon.name}
        </h3>
        <ul>
          <li>{`Health: ${dragon.health}`}</li>
          <li
            style={{cursor: 'alias'}}
            onClick={() => onClickStatus(dragon.id)}
            >
            {`Status: ${dragon.wild ? 'Wild' : 'Captured'}`}
          </li>
        </ul>
      </div>
    )
  );
}

//State here is sourced from the store object passed to Provider.
//The dragons prop is passed to DragonList.
const mapStateToDragonListProps = state => {
  return {
    dragons: showVisibleDragons(
      state.dragons,
      state.visibility.dragons
    )
  };
};
//These dispatcher methods take action creator calls as args.
const mapDispatchToDragonListProps = dispatch => {
  return {
    onClickName: (id) => {
      dispatch(removeDragon(id));
    },
    onClickStatus: (id) => {
      dispatch(toggleCapture(id));
    }
  };
};

//Another store-linked container generated with connect.
//The "brains" behind DragonList's dumb rendering.
const VisibleDragonList = connect(
  mapStateToDragonListProps,
  mapDispatchToDragonListProps
)(DragonList);

//Purely presentational.
//Displays a link for each status in the array.
//Passes that status to DragonFilterLink so that each link
//dispatches the TOGGLE_CAPTURE action with a different payload.
const DragonFooter = () => {
  const statuses = ['ALL', 'WILD', 'CAPTURED'];
  return (
    <div>
      Show:
      {' '}
      {statuses.map((status) => {
        return (
          <DragonFilterLink
            status={status}
            key={status[0]}
            />
        );
      })}
    </div>
  );
}

//Wrapped by DragonFilterLink, purely presentational.
//"Doesn't know" why the active link is a span.
//Simply inherits active from smart parent and follows directions.
//Status comes from the prop that DragonLinks passed to DragonFilterLink.
const DragonLink = ({
  status,
  active,
  onClickLink
}) => {
  if (active) {
    return (
      <span style={{margin: '5px'}}>{status}</span>
    );
  } else {
    //Notice below, the preventDefault call separate from passed handler.
    return (
      <a href='#'
         style={{margin: '5px'}}
         onClick={e => {
           e.preventDefault();
           onClickLink(status)
         }}
       >
       {status}
     </a>
    );
  }
}

//One prop simply a recycled ownProp; the other from store.
//All DragonLink needs to know to do its job.
const mapStateToDragonLinkProps = (state, ownProps) => {
  return {
    status: ownProps.status,
    active: state.visibility.dragons === ownProps.status
  };
};
const mapDispatchToDragonLinkProps = dispatch => {
  return {
    onClickLink: (status) => {
      dispatch(setDragonVisibility(status));
    }
  };
};

//Connect-generated smart container for each dumb link.
const DragonFilterLink = connect(
  mapStateToDragonLinkProps,
  mapDispatchToDragonLinkProps
)(DragonLink);

//The fruit of the above labors.
//A simple presentational component to wrap all the smart ones above.
const Dragons = () => {
  return (
    <div>
      <AddDragon/>
      <br />
      <VisibleDragonList/>
      <br />
      <DragonFooter/>
    </div>
  );
}

//Export:
export default Dragons;
