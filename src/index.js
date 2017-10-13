/*
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
*/

import './index.css';
import Ship from './ship';
import Asteroid from './asteroid'

var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

var ship = new Ship(canvas.width, canvas.height);
ship.render(ctx);

var i = 0;
for (i = 0; i < 10; i++)
{
  var asteroid = new Asteroid(canvas.width, canvas.height);
  asteroid.render(ctx);
}
