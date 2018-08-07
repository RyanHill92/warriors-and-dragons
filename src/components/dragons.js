import {connect} from 'react-redux';
import React, {Component} from 'react';

//Action Creators:
import dragonActions from './../actions/dragon-actions';

//Utility function to return only dragons of selected status:
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
          dispatch(dragonActions.addDragon(name.value));
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
//Allows AddDragon to dispatch ADD_DRAGON.
AddDragon = connect()(AddDragon);

//Presentation of dragon name.
//Passed event handler from DragonList.
const DragonHeader = ({
  dragon,
  onClickName
}) => {
  return (
    <h3
      style={{cursor: 'no-drop'}}
      onClick={() => onClickName(dragon.id)}
      >
      {dragon.name}
    </h3>
  );
}

//Presentation of dragon statistics.
//Passed event handler from DragonList.
//If dragon is dead, a "dead card" is rendered instead.
//Sizing of card specified below.
const DragonStats = ({
  dragon,
  onClickStatus
}) => {
  return (
    <div>
      {dragon.dead ?
        <div className="text-center">
          <div className="card" style={{backgroundColor: '#FF8C00', width: '60%'}}>
            <div className="card-body">
              <h1><i className="fab fa-gripfire"></i></h1>
              <p><em>Click name to scatter.</em></p>
            </div>
          </div>
        </div>
        :
        <ul>
          <li>{`Health: ${dragon.health}`}</li>
          <li>{`Species: ${dragon.species}`}</li>
          <li
            style={{cursor: 'alias'}}
            onClick={() => onClickStatus(dragon.id)}
            >
            {`Status: ${dragon.wild ? 'Wild' : 'Captured'}`}
          </li>
        </ul>
      }
    </div>
  );
}

//Presentation of dragon's attack input field.
//Passed event handler from DragonList.
//If dragon is dead, not rendered.
//Notice the undefined opponent variable to make ref function below possible.
//Blocks user from attacking before typing at least one character.
const DragonFooter = ({
  dragon,
  onSubmit
}) => {
  let opponent;
  if (dragon.dead) {
    return null;
  }
  return (
    <div>
      <form onSubmit={(e) => {
          e.preventDefault();
          if (opponent.value.length === 0) {
            return;
          }
          onSubmit(dragon.name, opponent.value);
          opponent.value = '';
        }}>
        <input ref={node => opponent = node}
               placeholder={'Enter warrior to attack!'}
          />
      </form>
    </div>
  );
}


//Wrapped with store-connected component VisibleDragonList.
//Passed state and dispatches as props which it passes on to children.
//Size of overall character card specified below.
const DragonList = ({
  dragons,
  onClickStatus,
  onClickName,
  onSubmit
}) => {
  return (
    dragons.map((dragon) => {
      return (
        <div key={dragon.id} className="card-body" style={{height: '200px'}}>
          <DragonHeader
            dragon={dragon}
            onClickName={id => onClickName(id)}
            />
          <DragonStats
            dragon={dragon}
            onClickStatus={id => onClickStatus(id)}
            />
          <DragonFooter
            dragon={dragon}
            onSubmit={(dragonName, warriorName) =>
              onSubmit(dragonName, warriorName)}
            />
        </div>
      );
    })
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

//Three action creators, two async thunks, passed as args to dispatch callbacks.
const mapDispatchToDragonListProps = dispatch => {
  return {
    onClickName: (id) => {
      dispatch(dragonActions.removeDragon(id));
    },
    onClickStatus: (id) => {
      dispatch(dragonActions.toggleCaptureAsync(id));
    },
    onSubmit: (dragonName, warriorName) => {
      dispatch(dragonActions.attackWarriorAsync(dragonName, warriorName));
    }
  };
};

//Store-container generated with connect().
//The "brains" behind DragonList's rendering.
const VisibleDragonList = connect(
  mapStateToDragonListProps,
  mapDispatchToDragonListProps
)(DragonList);

//Purely presentational.
//Displays a link for each status in the array.
//Passes that status to DragonFilterLink so that each link
//dispatches the TOGGLE_CAPTURE action with a different payload.
const DragonLinks = () => {
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
//Handler passed from store-linked container.
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

//One prop simply a recycled ownProp--DragonFilterLink receives status from DragonLinks.
//The other prop from store--active.
//All DragonLink needs to know to do its job.
const mapStateToDragonLinkProps = (state, ownProps) => {
  return {
    status: ownProps.status,
    active: state.visibility.dragons === ownProps.status
  };
};
//Action dispatcher passed as handler to DragonLink.
const mapDispatchToDragonLinkProps = dispatch => {
  return {
    onClickLink: (status) => {
      dispatch(dragonActions.setDragonVisibility(status));
    }
  };
};

//Connect-generated smart container for each dumb link.
const DragonFilterLink = connect(
  mapStateToDragonLinkProps,
  mapDispatchToDragonLinkProps
)(DragonLink);


//A simple presentational component to wrap all the smart ones above.
const Dragons = () => {
  return (
    <div>
      <AddDragon/>
      <br />
      <VisibleDragonList/>
      <br />
      <DragonLinks/>
    </div>
  );
}

//Export:
export default Dragons;
