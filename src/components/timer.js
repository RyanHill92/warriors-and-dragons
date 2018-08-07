import React, {Component} from 'react';
import {connect} from 'react-redux';

import warriorActions from './../actions/warrior-actions';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10
    }
    this.tick = this.tick.bind(this);
  }

  componentDidMount () {
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  tick () {
    if (this.state.time === 0) {
      clearInterval(this.timer);
      this.props.onZero(this.props.id);
      return;
    } else {
      this.setState(prevState => ({
        time: prevState.time - 1
      }));
    }
  }

  render () {
    const time = this.state.time;
    return (
      <h6><em>{`Knocked out! Recovery in ${time}s...`}</em></h6>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onZero: id => {
      dispatch(warriorActions.toggleConscious(id))
    }
  };
}

const TimerWrapper = connect(
  null,
  mapDispatchToProps
)(Timer);

export default TimerWrapper;
