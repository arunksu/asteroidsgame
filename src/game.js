import Ship from './ship';
import Asteroid from './asteroid'
import Laser from './laser'

export default class Game
{
  constructor()
  {
    // Variables.
    this.move = false;
    this.rotateRight = false;
    this.rotateLeft = false;
    this.shoot = false;
    this.previousTime = Math.floor(Date.now() / 1000);

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
      var asteroid = new Asteroid(this.canvas.width, this.canvas.height, 'large');
      this.asteroids.push(asteroid);
    }

    this.lasers = [];

    // Movement key bindings.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    // Other bindings and game loop.
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 1);
  }

  // Key down events.
  handleKeyDown(event)
  {
    event.preventDefault();
    switch(event.keyCode)
    {
      case 38:
        this.move = true;
        break;
      case 39:
        this.rotateRight = true;
        break;
      case 37:
        this.rotateLeft = true;
        break;
      case 32:
        this.shoot = true;
        break;
    }
  }

  // Key up events.
  handleKeyUp(event)
  {
    event.preventDefault();
    switch(event.keyCode)
    {
      case 38:
        this.move = false;
        break;
      case 39:
        this.rotateRight = false;
        break;
      case 37:
        this.rotateLeft = false;
        break;
      case 32:
        this.shoot = false;
        break;
    }
  }

  // Update.
  update()
  {
    // Get Data.now(). Floor it by 100.
    var currentTime = Math.floor(Date.now() / 100);

    // Ship.
    this.ship.update(this.move, this.rotateRight, this.rotateLeft);

    // Asteroids.
    var len = this.asteroids.length;
    var i = 0;
    var ii = 0;
    for (i = 0; i < len; i++)
    {
      var currentAsteroid = this.asteroids[i];
      var collision = false;
      for (ii = 0; ii < len; ii++)
      {
        if (i != ii)
        {
          var otherAsteroid = this.asteroids[ii];
          if (currentAsteroid.x > otherAsteroid.x - 20 &&
              currentAsteroid.x < otherAsteroid.x + 20 &&
              currentAsteroid.y > otherAsteroid.y - 20 &&
              currentAsteroid.y < otherAsteroid.y + 20)
          {
            collision = true;
          }
        }
      }
      this.asteroids[i].update(collision);
    }

    // Lasers.
    if (this.shoot && (this.previousTime != currentTime))
    {
      var laser = new Laser(this.canvas.width, this.canvas.height);
      this.lasers.push(laser);
    }

    var lenLasers = this.lasers.length;
    var j = 0;
    for (j = 0; j < lenLasers; j++)
    {
      this.lasers[j].update(this.ship.x, this.ship.y, this.ship.angle);
    }

    this.previousTime = currentTime;
  }

  // Render.
  render()
  {
    // Clear.
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

    var lenLasers = this.lasers.length;
    var j = 0;
    for (j = 0; j < lenLasers; j++)
    {
      this.lasers[j].render(this.ctx);
    }
  }

  // Game loop.
  loop()
  {
    this.update();
    this.render();
  }
}
