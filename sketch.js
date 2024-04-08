let player;
let invaders = [];
let bullets = [];
let invaderDirection = 1;

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

  let edge = false;

  for (let bullet of bullets) {
    bullet.show();
    bullet.move();
    for (let i = invaders.length - 1; i >= 0; i--) {
      if (bullet.hits(invaders[i])) {
        invaders.splice(i, 1);
        bullets.splice(bullets.indexOf(bullet), 1);
        break; // Exit the loop after hitting an invader
      }
    }
  }

  for (let invader of invaders) {
    invader.show();
    invader.move(invaderDirection);
    if (invader.x > width - invader.r || invader.x < invader.r) {
      edge = true;
    }
  }

  if (edge) {
    invaderDirection *= -1;
    for (let invader of invaders) {
      invader.shiftDown();
    }
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
    this.r = 20; // Radius of the invader for drawing and collision detection
  }

  show() {
    fill(255, 0, 200);
    rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r);
  }

  move(direction) {
    this.x += direction * 1; // Move based on the group's direction
  }

  shiftDown() {
    this.y += 20; // Move down when changing direction
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(50, 0, 200);
    ellipse(this.x, this.y, 4, 10);
  }

  move() {
    this.y -= 5;
  }

  hits(invader) {
    let d = dist(this.x, this.y, invader.x, invader.y);
    return d < 10;
  }
}
