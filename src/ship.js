export default class Ship
{
  constructor(screenWidth, screenHeight)
  {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.health = 3;
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
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -13);
    ctx.lineTo(-15, 0);
    ctx.lineTo(-10, 13);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update(move, rotateRight, rotateLeft)
  {
    // Handle user input.
    if (move)
    {
      this.x += Math.cos(this.angle);
      this.y += Math.sin(this.angle);
    }
    if (rotateRight) { this.angle += 0.05; }
    if (rotateLeft) { this.angle -= 0.05; }

    // Screen wrapping.
    if(this.x < 0) { this.x = this.screenWidth; }
    if(this.y < 0) { this.y = this.screenHeight; }
    if(this.x > this.screenWidth) { this.x = 0; }
    if(this.y > this.screenHeight) { this.y = 0; }
  }
}
