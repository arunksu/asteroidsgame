import Ship from './ship';
import Asteroid from './asteroid'
import Laser from './laser'

export default class Game
{
  constructor()
  {
    // Variables.
    this.play = true;
    this.move = false;
    this.rotateRight = false;
    this.rotateLeft = false;
    this.shoot = false;
    this.previousTime = Math.floor(Date.now() / 1000);
    this.lives = 3;
    this.level = 1;
    this.points = 0;
    this.numberOfAsteroids = 10;
    this.asteroids = [];

    // Sound.
    this.fxLaser = new Audio('/laser.mp3');
    this.fxCrash = new Audio('/crash.mp3');
    this.fxShipDestroyed = new Audio('/shipdestroyed.mp3');

    // Canvas and context.
    this.canvas = document.createElement('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.createShip();
    this.createAsteroids(this.numberOfAsteroids);

    // Movement key bindings.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    // Other bindings and game loop.
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 10);
  }

  createShip()
  {
    // Create ship.
    this.ship = new Ship(this.canvas.width, this.canvas.height);

    // Create lasers list.
    this.lasers = [];
  }

  createAsteroids(number)
  {
    var i = 0;
    for (i = 0; i < number; i++)
    {
      var asteroid = new Asteroid(this.canvas.width, this.canvas.height, 0, 0, 0, 0, 'large');
      this.asteroids.push(asteroid);
    }
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

    // Check if all asteroids are destroyed.
    var len = this.asteroids.length;
    var i = 0;
    var allAsteroidsDestroyed = true;
    for (i = 0; i < len; i++)
    {
      if (this.asteroids[i].health > 0)
      {
        allAsteroidsDestroyed = false;
        break;
      }
    }
    if (allAsteroidsDestroyed) { this.newWave(); }

    // Ship.
    var hitShip = false;
    for (i = 0; i < len; i++)
    {
      var currentAsteroid = this.asteroids[i];
      if (currentAsteroid.health < 1) { continue; }
      if (currentAsteroid.x > this.ship.x - 20 &&
          currentAsteroid.x < this.ship.x + 20 &&
          currentAsteroid.y > this.ship.y - 20 &&
          currentAsteroid.y < this.ship.y + 20)
      {
        hitShip = true;
        break;
      }
    }

    // Handle ship hit or continue game.
    if (hitShip) { this.handleShipDestroyed(); }
    else { this.ship.update(this.move, this.rotateRight, this.rotateLeft); }

    // Asteroids.
    var ii = 0;
    for (i = 0; i < len; i++)
    {
      var currentAsteroid = this.asteroids[i];
      if (currentAsteroid.health < 1) { continue; }

      var collision = false;
      for (ii = 0; ii < len; ii++)
      {
        if (i != ii)
        {
          var otherAsteroid = this.asteroids[ii];
          if (otherAsteroid.health < 1) { continue; }
          if (currentAsteroid.x > otherAsteroid.x - 20 &&
              currentAsteroid.x < otherAsteroid.x + 20 &&
              currentAsteroid.y > otherAsteroid.y - 20 &&
              currentAsteroid.y < otherAsteroid.y + 20)
          {
            collision = true;
            if (this.fxCrash) { this.fxCrash.play(); }
          }
        }
      }
      this.asteroids[i].update(collision, false, false);
    }

    // Lasers.
    if (this.shoot && (this.previousTime != currentTime))
    {
      var laser = new Laser(this.canvas.width, this.canvas.height);
      this.lasers.push(laser);
      if (this.fxLaser) { this.fxLaser.play(); }
    }

    var lenLasers = this.lasers.length;
    var j = 0;
    for (j = 0; j < lenLasers; j++)
    {
      var currentLaser = this.lasers[j];
      var hitAsteroid = false
      if (currentLaser.hitAsteroid) { continue; }
      var asteroidDestroyed = false;
      var small1 = null;
      var small2 = null;

      // Check if laser hit asteroid.
      for (i = 0; i < len; i++)
      {
        var currentAsteroid = this.asteroids[i];
        if (currentAsteroid.health < 1) { continue; }
        if (currentAsteroid.x > currentLaser.x - 20 &&
            currentAsteroid.x < currentLaser.x + 20 &&
            currentAsteroid.y > currentLaser.y - 20 &&
            currentAsteroid.y < currentLaser.y + 20)
        {
          hitAsteroid = true;
          currentAsteroid.update(false, false, true);

          // Add points.
          if (currentAsteroid.size === 'small' && currentAsteroid.health < 1)
          {
            this.points += 5;
          }

          // If it was a large asteroid, spawn 2 new ones in the same
          // spot, going opposite directions, with slightly less
          // momentum than the large asteroid.
          if (currentAsteroid.health < 1 && currentAsteroid.size === 'large')
          {
            this.points += 10;
            asteroidDestroyed = true;
            var newX = currentAsteroid.x;
            var newY = currentAsteroid.y;
            var newSpeed = currentAsteroid.speed * 0.85;
            var small1Angle = Math.random() * 10;
            var small2Angle = small1Angle * 0.25;
            small1 = new Asteroid(this.canvas.width, this.canvas.height, newX, newY, small1Angle, newSpeed, 'small');
            small2 = new Asteroid(this.canvas.width, this.canvas.height, newX, newY, small2Angle, newSpeed, 'small');
          }
        }
      }
      if (asteroidDestroyed)
      {
        this.asteroids.push(small1);
        this.asteroids.push(small2);
      }
      this.lasers[j].update(this.ship.x, this.ship.y, this.ship.angle, hitAsteroid);
    }

    // Update time.
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
      if (this.asteroids[i].health < 1) { continue; }
      this.asteroids[i].render(this.ctx);
    }

    var lenLasers = this.lasers.length;
    var j = 0;
    for (j = 0; j < lenLasers; j++)
    {
      if (this.lasers[j].hitAsteroid) { continue; }
      this.lasers[j].render(this.ctx);
    }

    this.renderUI();
  }

  // New wave with 2 more asteroids than before.
  newWave()
  {
    if (this.lives < 1) { this.play = false }
    else
    {
      this.level += 1;
      this.numberOfAsteroids += 2;
      this.createAsteroids(this.numberOfAsteroids);
    }
  }

  // Reset game if ship is hit.
  handleShipDestroyed()
  {
    if (this.lives < 1) { this.play = false; }
    else
    {
      this.createShip();
      this.lives -= 1
      if (this.fxShipDestroyed) { this.fxShipDestroyed.play(); }
    }
    if (this.lives < 1 ) { this.play = false; }
  }

  handleGameOver()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText('GAME OVER - REFRESH PAGE FOR NEW GAME', 90, 300);
    this.ctx.fillText('YOU MADE IT TO LEVEL ' + this.level, 90, 350);
    this.ctx.fillText('YOU SCORED ' + this.points + ' POINTS', 90, 400);
  }

  renderUI()
  {
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText('LIVES: ' + this.lives, 20, this.canvas.height - 20);
    this.ctx.fillText('LEVEL: ' + this.level, 100, this.canvas.height - 20);
    this.ctx.fillText('POINTS: ' + this.points, 180, this.canvas.height - 20);
    this.ctx.fillText('UP ARROW: MOVE', 20, 30);
    this.ctx.fillText('LEFT/RIGHT ARROWS: ROTATE', 20, 50);
    this.ctx.fillText('SPACEBAR: FIRE', 20, 70);
  }

  // Game loop.
  loop()
  {
    if (this.play)
    {
      this.update();
      this.render();
    }
    else
    {
      this.handleGameOver();
    }
  }
}
