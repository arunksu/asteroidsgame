export default class Asteroid
{
  constructor(screenWidth, screenHeight)
  {
    this.x = screenWidth / 4;
    this.y = screenHeight / 4;
    this.angle = 0;
  }

  render(ctx)
  {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-25, 0);
    ctx.lineTo(-20, 25);
    ctx.lineTo(5, 30);
    ctx.lineTo(20, 10);
    ctx.lineTo(10, 10);
    ctx.lineTo(8, -8);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
