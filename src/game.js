import Ship from './ship';
import Asteroid from './asteroid'

export default class Game
{
  constructor()
  {
    // Variables.
    this.move = false;
    this.rotateRight = false;
    this.rotateLeft = false;
    this.shoot = false;

    // Canvas and context.
    this.canvas = document.createElement('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // Create ship.
    this.ship = new Ship(this.canvas.width, this.canvas.height);

    // Create asteroids.
    this.asteroids = [];
    var i = 0;
    for (i = 0; i < 10; i++)
    {
      var asteroid = new Asteroid(this.canvas.width, this.canvas.height);
      this.asteroids.push(asteroid);
    }

    // Movement key bindings.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    // Other bindings.
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 1);
  }

  handleKeyDown(event)
  {
    event.preventDefault();
    switch(event.key)
    {
      case 'ArrowUp':
        this.move = true;
        break;
      case 'ArrowRight':
        this.rotateRight = true;
        break;
      case 'ArrowLeft':
        this.rotateLeft = true;
        break;
    }
  }

  handleKeyUp(event)
  {
    event.preventDefault();
    switch(event.key)
    {
      case 'ArrowUp':
        this.move = false;
        break;
      case 'ArrowRight':
        this.rotateRight = false;
        break;
      case 'ArrowLeft':
        this.rotateLeft = false;
        break;
    }
  }

  update()
  {
    this.ship.update(this.move, this.moveRight, this.moveLeft);
  }

  render()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Ship.
    this.ship.render(this.ctx);

    // Asteroids.
    var len = this.asteroids.length;
    var i = 0;
    for (i = 0; i < len; i++)
    {
      this.asteroids[i].render(this.ctx);
    }
  }

  loop()
  {
    this.update();
    this.render();
  }
}
