export default class Laser
{
  constructor(screenWidth, screenHeight)
  {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.initialized = false;
    this.hitAsteroid = false;
  }

  render(ctx)
  {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-5, 0);
    ctx.stroke();
    ctx.restore();
  }

  update(shipX, shipY, shipAngle, hitAsteroid)
  {
    if (this.initialized)
    {
      this.x += 2 * Math.cos(this.angle);
      this.y += 2 * Math.sin(this.angle);
      this.hitAsteroid = hitAsteroid;
    }
    else
    {
      this.x = shipX;
      this.y = shipY;
      this.angle = shipAngle;
      this.initialized = true;
    }
  }
}
