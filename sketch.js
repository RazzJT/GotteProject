let player;
let invaders = [];
let bullets = [];
let invaderDirection = 1;
let lastMoveTime = 0; // Track the last time the invaders moved
const moveInterval = 1000; // Move every 1000 milliseconds (1 second)

// Shooting cooldown in milliseconds
const shootCooldown = 500;
// Variable to track the last shooting time
let lastShootTime = 0;

function setup() {
  createCanvas(1000, 500);
  player = new Player();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) { // Create multiple rows of invaders
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20));
    }
  }
}

function draw() {
  background(0);
  player.show();
  player.move();

  // Handle bullet movement and drawing
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    // Remove bullets that go off the screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    } else {
      // Check for bullet hitting any invader
      for (let j = invaders.length - 1; j >= 0; j--) {
        if (bullets[i] && bullets[i].hits(invaders[j])) {
          // Remove the hit invader and the bullet
          invaders.splice(j, 1);
          bullets.splice(i, 1);
          break; // Exit the inner loop if a hit is detected
        }
      }
    }
  }

  let currentTime = millis();
  if (currentTime - lastMoveTime > moveInterval) {
    let edgeDetected = false;
    // Move each invader and check for edge detection
    for (let invader of invaders) {
      invader.move(invaderDirection);
      if (invader.x > width - invader.r || invader.x < invader.r) {
        edgeDetected = true;
      }
    }

    if (edgeDetected) {
      invaderDirection *= -1; // Change direction
      for (let invader of invaders) {
        invader.shiftDown(); // Move all invaders down
      }
    }

    lastMoveTime = currentTime; // Update the time of the last move
  }

  // Draw each invader
  for (let invader of invaders) {
    invader.show();
  }
}



function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.setDirection(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDirection(-1);
  } else if (keyCode === 32) { // Spacebar to shoot
    // Check if enough time has passed since the last shot
    if (millis() - lastShootTime > shootCooldown) {
      bullets.push(new Bullet(player.x, height - 20));
      lastShootTime = millis(); // Update the last shooting time
    }
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player.setDirection(0);
  }
}


class Player {
  constructor() {
    this.x = width / 2;
    this.xdir = 0;
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, height - 10, 20, 20);
  }

  setDirection(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir * 5;
  }
}

class Invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20; // Size for drawing and collision detection
    this.stepSize = 20; // How far to move in each step
  }

  show() {
    fill(255, 0, 200);
    rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r); // Draw as square
  }

  move(direction) {
    // Adjusted to move in steps based on the direction and stepSize
    this.x += direction * this.stepSize;
  }

  shiftDown() {
    this.y += this.r; // Move down by its own size
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4; // Assuming a radius for the bullet for hitbox calculation
  }

  show() {
    fill(50, 0, 200);
    ellipse(this.x, this.y, this.r * 2, this.r * 2); // Draw bullet as circle
  }

  move() {
    this.y -= 10;
  }

  hits(invader) {
    let hitboxExtension = 5; // Extend the hitbox by 5 pixels on all sides
    let withinXBounds = this.x > invader.x - invader.r / 2 - hitboxExtension && this.x < invader.x + invader.r / 2 + hitboxExtension;
    let withinYBounds = this.y > invader.y - invader.r / 2 - hitboxExtension && this.y < invader.y + invader.r / 2 + hitboxExtension;
    return withinXBounds && withinYBounds;
  }
}
