'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Dragons from './components/dragons';
import Warriors from './components/warriors';

import {store} from './store/store';

//Top level container.
//Determines columnar pattern for whole page.
//Contains styling code for welcome banner + instructions.
//Empty card body at bottom to keep some whitespace between last row of text and bottom of viewport.
const Profiles = () => {
  return (
    <div className="container">
      <div className="alert alert-success">
        <h1 className="display-4 text-center" style={{color: 'black'}}>Warriors & Dragons</h1>
        <hr className="my-1"/>
        <p><b>Directions:</b> {`To begin, add a warrior or dragon to the game board.
        Use the input field under any warrior or dragon to attack an opponent by name.
        While intact, warriors' armor will protect them from a portion of each blow,
        but the destruction of warriors' armor will render them temporarily unconscious.
        Click on any character's status to toggle it, or at least to try . . . and beware the consequences of
        attempting to capture a dragon who's too strong. Use the links at the bottom of the game board
        to toggle between views. Finally, click on characters' names to remove them from the game board.
        `}
      </p>
      </div>
      <div className="row">
        <div className="col-6">
          <Warriors />
        </div>
        <div className="col-6">
          <Dragons />
        </div>
      </div>
      <div className="row">
        <div className="card-body">
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Profiles/>
  </Provider>,
  document.getElementById('root')
);
