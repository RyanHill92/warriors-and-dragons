'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Dragons from './components/dragons';
import Warriors from './components/warriors';

import {store} from './store/store';

const Profiles = () => {
  return (
    <div className="container">
      <div className="alert alert-success">
        <h1 className="display-4 text-center">Warriors & Dragons</h1>
        <hr className="my-1"/>
      </div>
      <div className="row">
        <div className="col-6">
          <Warriors />
        </div>
        <div className="col-6">
          <Dragons />
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
