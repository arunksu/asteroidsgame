export default class Asteroid
{
  constructor(screenWidth, screenHeight, x, y, size)
  {
    this.size = size;
    this.health = 10;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    if (size === 'small')
    {
      this.x = x;
      this.y = y;
    }
    else
    {
      this.x = Math.random() * screenWidth;
      this.y = Math.random() * screenHeight;
    }
    this.angle = Math.random() * 10;
    this.speed = Math.random() * 0.75;
  }

  render(ctx)
  {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    if (this.size === 'small')
    {
      ctx.moveTo(0, -10);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(5, 20);
      ctx.lineTo(10, 5);
      ctx.lineTo(8, -8);
    }
    else
    {
      ctx.moveTo(0, -10);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-15, 20);
      ctx.lineTo(5, 25);
      ctx.lineTo(15, 5);
      ctx.lineTo(5, 5);
      ctx.lineTo(8, -8);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  update(collision, hitShip, hitLaser)
  {
    if (collision) { this.angle *= -1; }
    if (hitShip) { this.health = 0; }
    if (hitLaser) { this.health -= 1; }

    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);

    // Screen wrapping.
    if(this.x < 0) { this.x = this.screenWidth; }
    if(this.y < 0) { this.y = this.screenHeight; }
    if(this.x > this.screenWidth) { this.x = 0; }
    if(this.y > this.screenHeight) { this.y = 0; }
  }
}
