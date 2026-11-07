export const fieldWidth = 320;
export const fieldHeight = 300;
export const paddleY = 278;
export const paddleWidth = 64;
export const paddleHeight = 8;
export const ballRadius = 4;
export const brickWidth = 35;
export const brickHeight = 12;

interface Brick {
  id: number;
  row: number;
  x: number;
  y: number;
}

export class ArkanoidGame {
  paddleX = (fieldWidth - paddleWidth) / 2;
  ball = { x: fieldWidth / 2, y: paddleY - ballRadius, dx: 2, dy: -3 };
  bricks: Brick[] = Array.from({ length: 40 }, (_, id) => {
    const row = Math.floor(id / 8);
    return { id, row, x: 6 + (id % 8) * 39, y: 24 + row * 16 };
  });
  score = 0;
  lives = 3;
  private serveTicks = 36;

  movePaddle(center: number): void {
    this.paddleX = Math.max(0, Math.min(fieldWidth - paddleWidth, center - paddleWidth / 2));
    if (this.serveTicks > 0) this.ball.x = this.paddleX + paddleWidth / 2;
  }

  step(): 'game-over' | 'won' | undefined {
    if (this.serveTicks > 0) {
      this.serveTicks--;
      return;
    }

    const ball = this.ball;
    const previous = { x: ball.x, y: ball.y };
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.x <= ballRadius || ball.x >= fieldWidth - ballRadius) {
      ball.x = Math.max(ballRadius, Math.min(fieldWidth - ballRadius, ball.x));
      ball.dx *= -1;
    }
    if (ball.y <= ballRadius) {
      ball.y = ballRadius;
      ball.dy = Math.abs(ball.dy);
    }

    if (ball.dy > 0 && previous.y + ballRadius <= paddleY && ball.y + ballRadius >= paddleY) {
      const impactX = previous.x + (ball.x - previous.x) * (paddleY - ballRadius - previous.y) / ball.dy;
      if (impactX >= this.paddleX - ballRadius && impactX <= this.paddleX + paddleWidth + ballRadius) {
        const offset = (impactX - this.paddleX - paddleWidth / 2) / (paddleWidth / 2);
        const angle = Math.max(-1, Math.min(1, offset)) * Math.PI / 3;
        const speed = Math.min(5, Math.hypot(ball.dx, ball.dy) + 0.1);
        ball.y = paddleY - ballRadius;
        ball.dx = Math.sin(angle) * speed;
        ball.dy = -Math.cos(angle) * speed;
      }
    }

    const brick = this.bricks.find(({ x, y }) =>
      ball.x + ballRadius > x && ball.x - ballRadius < x + brickWidth &&
      ball.y + ballRadius > y && ball.y - ballRadius < y + brickHeight,
    );
    if (brick) {
      if (previous.y <= brick.y - ballRadius || previous.y >= brick.y + brickHeight + ballRadius) {
        ball.y = previous.y;
        ball.dy *= -1;
      } else {
        ball.x = previous.x;
        ball.dx *= -1;
      }
      this.bricks = this.bricks.filter(({ id }) => id !== brick.id);
      this.score += 10;
      if (this.bricks.length === 0) return 'won';
    }

    if (ball.y - ballRadius > fieldHeight) {
      this.lives--;
      if (this.lives === 0) return 'game-over';
      this.serveTicks = 36;
      this.ball = { x: this.paddleX + paddleWidth / 2, y: paddleY - ballRadius, dx: 2, dy: -3 };
    }

    return undefined;
  }

  snapshot() {
    return {
      paddleX: this.paddleX,
      ball: { x: this.ball.x, y: this.ball.y },
      bricks: this.bricks,
      score: this.score,
      lives: this.lives,
    };
  }
}
