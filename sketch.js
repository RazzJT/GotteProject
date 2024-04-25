// Globale variabler
let player;
let invaders = [];
let bullets = [];
let invaderDirection = 1;
let score = 0;

const shootCooldown = 300;
let lastShootTime = 0;

function setup() {
  createCanvas(1000, 500);
  player = new Player();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20, j + 1));
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

    // More efficient collision check and bullet removal
    for (let i = invaders.length - 1; i >= 0; i--) {
      if (bullet.hits(invaders[i])) {
        score += 10;
        invaders.splice(i, 1);
        bullets.splice(bullets.indexOf(bullet), 1);
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
  
  // Viser scoren
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text("Score: " + score, width - 20, 30);
}


function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.setDirection(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDirection(-1);
  } else if (keyCode === 32) { // Mellemrumstasten for at skyde
    // Tjekker om der er gået tilstrækkelig lang tid siden sidste skud
    if (millis() - lastShootTime > shootCooldown) {
      bullets.push(new Bullet(player.x, height - 20));
      lastShootTime = millis(); // Opdaterer sidste skydetidspunkt
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
    this.velocity = 0; 
    this.speed = 1; 
    this.r = 10;
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
    this.velocity += this.xdir * this.speed;
    this.x += this.velocity; 
    this.velocity *= 0.9; 

    // Constrain player within the canvas
    this.x = constrain(this.x, this.r, width - this.r);
  }
}


class Invader {
  constructor(x, y, row) {
    this.x = x;
    this.y = y;
    this.r = 20; // Radius for invaderen
    this.row = row; // Række for invaderen
  }

  show() {
    fill("red");
    rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r);
  }

  move(direction) {
    this.x += direction * 1; // Bevægelse baseret på retning
  }

  shiftDown() {
    this.y += 20; // Bevægelse nedad
  }
}

// Kugleklasse
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
    return d < 20;
  }
}
