import React, {Component} from 'react';
import {connect} from 'react-redux';

import warriorActions from './../actions/warrior-actions';

//Component to replace WarriorFooter when unconscious.
//Unmounts once time reaches zero thanks to ternary expression in WarriorFooter.
//Passed warrior's id from same component.
class Timer extends Component {

  componentDidMount () {
    //The real magic!

    //The timer component starts the timer with the startTimer action creator,
    //passing another action creator (decrementTime) as the "ticker"
    //that startTimer expects. That ticker is kept in the store as
    //a property of the warrior UNTIL decrementTime brings the time to 0.
    //Then the interval is cleared, meaning this component will unmount for good.

    //In short, the interval ID, the interval callback, and the time are all
    //kept in the store as properties of the warrior. No mounting or unmounting,
    //therefore, interferes with the ticking each second.
    this.props.startTimer(this.props.id, () => this.props.decrement(this.props.id));
  }

  //Show ticking time until consciousness regained.
  //The ternary operator below makes the one second of visibility
  //in the CONSCIOUS filter link category seem natural.
  render () {
    const time = this.props.time;
    return (
      <div>
        {time === 10 ?
          <h1 style={{color: 'red'}}><em>POW!</em></h1> :
          <h5><em>{`Knocked out! Recovery in ${time}s...`}</em></h5>
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startTimer: (id, timer) => {
      dispatch(warriorActions.startTimer(id, timer));
    },
    decrement: id => {
      dispatch(warriorActions.decrementTime(id))
    }
  };
}
//No need for store access, but Timer components does need to dispatch toggleConscious.
const TimerWrapper = connect(
  null,
  mapDispatchToProps
)(Timer);

export default TimerWrapper;
