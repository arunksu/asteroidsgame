export default class Ship
{
  constructor(screenWidth, screenHeight)
  {
    this.x = screenWidth / 2;
    this.y = screenHeight / 2;
    this.angle = 0;
    this.moving = false;
    this.moveLeft = false;
    this.moveRight = false;
  }

  render(ctx)
  {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(0, 15);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update(move, rotateRight, rotateLeft)
  {
    if (move) { this.y -= 2; }
    if (rotateRight) { this.angle += 0.05; }
    if (rotateLeft) { this.angle -= 0.5; }
  }
}
