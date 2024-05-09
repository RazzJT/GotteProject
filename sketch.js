// Globale variabler
let player; // spillerobjekt
let invaders = []; // liste af invader objekter
let bullets = []; // liste af spillerens skud
let enemyBullets = []; // liste af invaders' skud
let invaderDirection = 1; // retningen invaders bevæger sig, 1 for højre, -1 for venstre
let score = 0; // spillerens score
let highScore = 0; // den højeste score opnået
let invaderSpeed = 1; // hastigheden af invaders
let lastEnemyShootTime = 0; // tidspunkt for sidste invaders skud
let enemyShootInterval = 3000; // interval mellem invaders' skud i millisekunder
let roundCount = 1; // nuværende runde nummer
let gold = 0; // spillerens guld
let shootCooldown = 500; // nedkølingstid mellem skud
let lastShootTime = 0; // tidspunkt for sidste skud
let restartButton; // genstart knap
let startGameButton; // startspil knap
let continueGameButton; // fortsæt spil knap
let upgradeShootSpeed; // opgradering for skydehastighed
let shootSpeedLevel = 0; // niveau af skydehastighedsopgradering
let upgradeCost = 50; // omkostning ved opgradering
const Menu = { // menu tilstande
  restart: "restart",
  start: "start",
  game: "game",
  shop: "shop"
}
let currentMenu = Menu.start; // nuværende menu

function setup() { // Opsætning af knapper og canvas
  restartButton = createButton("Restart Game");
  restartButton.position(430,120);
  restartButton.size(150,50)
  restartButton.mouseClicked(startGame);
  restartButton.hide();
  
  startGameButton = createButton("Start Game");
  startGameButton.position(430,120);
  startGameButton.size(150,50)
  startGameButton.mouseClicked(startGame);
  startGameButton.hide();

  continueGameButton = createButton("Continue?")
  continueGameButton.position(430,120);
  continueGameButton.size(150,50);
  continueGameButton.mouseClicked(newRound);
  continueGameButton.hide()

  upgradeShootSpeed = createButton("Upgrade Shoot Speed: " + shootSpeedLevel);
  upgradeShootSpeed.position(430,180);
  upgradeShootSpeed.size(150,50);
  upgradeShootSpeed.mouseClicked(upgrade);
  upgradeShootSpeed.hide()

  createCanvas(1000, 500);
}

function upgrade() { // Funktion til at opgradere skydehastighed
  if (gold >= upgradeCost && shootSpeedLevel <= 20) { // Chekker om spilleren har nok guld
    shootSpeedLevel++; // Øger shoot level variablen med 1
    shootCooldown = 500 - shootSpeedLevel * 25; // Shoot cooldownen mindskes med 25 pr upgrade
    upgradeShootSpeed.html("Upgrade Shoot Speed: " + shootSpeedLevel);
    gold -= upgradeCost; // Fjerner guldet fra player
    upgradeCost += 25; // Øger prisen på næste opgradering
  }
}


function draw() { // Styrer spillets hovedlogik baseret på menu tilstand med en switch case
  switch (currentMenu){
    case Menu.game: runGame(); break; // For selve spillets logik
    case Menu.start: displayStartScreen(); break; // For startmenuen
    case Menu.restart: displayGameOverScreen(); break; // For gameover menuen
    case Menu.shop: displayShop(); break; // For shop menuen mellem runderne
  }
}


function runGame() {  
  background(0);
  player.show();
  player.move();

  let edge = false;

  enemyShoot();

   for (let bullet of bullets) {
    bullet.show();
    bullet.move();

    if (bullet.y < -10) {
      bullets.splice(bullets.indexOf(bullet), 1);
      console.log("bullet removed");
    }
    for (let i = invaders.length - 1; i >= 0; i--) {
      if (bullet.hits(invaders[i])) {
        score += 10;
        invaders.splice(i, 1);
        bullets.splice(bullets.indexOf(bullet), 1);
        if(random([1,2,3,4]) == 1) {
          gold += 10;
        }
      }
    }
  }

  for (let invader of invaders) {
    invader.show();
    invader.move(invaderDirection);
    if (invader.x > width - invader.w || invader.x < invader.w) {
      edge = true;
    }
    if (invader.y + invader.w >= height - 30) { // `30` can be adjusted based on where you want the threshold
      currentMenu = Menu.restart 
      highScore = max(highScore, score);
    }
  }

  
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].show();
    enemyBullets[i].move();
  
    if (enemyBullets[i].hits(player)) {
      console.log('Player hit!');
      currentMenu = Menu.restart; 
    }
  
    if (enemyBullets[i].y > 510) {
      console.log(enemyBullets);
      enemyBullets.splice(i, 1);
      console.log("Enemy bullets removed");
      console.log(player);
    }
  }

  if (edge) {
    invaderDirection *= -1;
    for (let invader of invaders) {
      invader.shiftDown();
    }
  }
  
  if (invaders.length <= 0) {
    currentMenu = Menu.shop;
    roundCount++
  }


  // Viser text pg score
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text("Score: " + score, 950, 30);
  text("Highscore: "  + highScore, 950, 60);
  text("Round: " + roundCount, 100, 30 )
  text ("Gold: " + gold, 100, 60)
}



function displayStartScreen() {
  background(50);
  textSize(40);
  fill(255);
  textAlign(CENTER);
  text("Highscore " + highScore, 500, 50)
  text("Press Start to Play", 500, 300)


  startGameButton.show();
}

function displayShop() {
  background(50);
  textSize(20);
  fill(255);
  textAlign(RIGHT);
  text("Score: " + score, 950, 30);
  text("Highscore: "  + highScore, 950, 60);
  text("Round: " + roundCount, 100, 30 )
  text("Gold: " + gold, 100, 60)
  text("Upgrade Cost: " + upgradeCost + " Gold", 400, 210); // Display upgrade cost
  continueGameButton.show();
  upgradeShootSpeed.show();
}

function displayGameOverScreen() {
  background(50);
  textSize(40);
  fill(255);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2);
  text("Score: " + score, width / 2, height / 2 + 50);
  text("High Score: " + highScore, width / 2, height / 2 + 100);
  restartButton.show();
}

function keyPressed() {
  if (currentMenu = Menu.game) {
    if (keyCode === RIGHT_ARROW) {
      player.setDirection(1);
    } else if (keyCode === LEFT_ARROW) {
      player.setDirection(-1);
    } else if (keyCode === 32) { // Spacebar to shoot
      if (millis() - lastShootTime > shootCooldown) {
        bullets.push(new Bullet(player.x, height - 20));
        lastShootTime = millis();
      }
    }
  }
}

function enemyShoot() {
  let currentTime = millis();
  if (currentTime - lastEnemyShootTime > enemyShootInterval) {
    if (invaders.length > 0) {
      let shooter = random(invaders); // select a random invader to shoot
      enemyBullets.push(new EnemyBullet(shooter.x + shooter.w / 2, shooter.y + shooter.w));
      lastEnemyShootTime = currentTime; // reset the last shoot time
    }
  }
}

function startGame() {
  // Reset all variables
  score = 0;
  roundCount = 1;
  enemyShootInterval = 3000;

  invaders = [];
  bullets = [];
  enemyBullets = [];
  currentMenu = Menu.game
  restartButton.hide();
  startGameButton.hide();
  player = new Player();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20, j + 1));
    }
  }
}

function newRound() {
  invaders = [];
  bullets = [];
  currentMenu = Menu.game
  invaderSpeed = invaderSpeed + roundCount * 0.2
  enemyShootInterval = enemyShootInterval - roundCount * 100
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20, j + 1));
    }
  }
  continueGameButton.hide()
  upgradeShootSpeed.hide()
}



function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player.setDirection(0);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = 500;
    this.xdir = 0;
    this.velocity = 0; 
    this.speed = 0.7; 
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
    this.w = 20; // Radius for invaderen
    this.row = row; // Række for invaderen
  }

  show() {
    fill("red");
    rect(this.x, this.y, this.w, this.w);
    fill("white")
     rect(this.x+-5, this.y+-2,5,5)
    rect(this.x+5, this.y+-2,5,5)
    fill("white")
    ellipse(this.x, this.y + 6,15,5)
  }

  move(direction) {
    this.x += direction * invaderSpeed; // Bevægelse baseret på retning
  }

  shiftDown() {
    this.y += 40; // Bevægelse nedad
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

// Invader kugleklasse
class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5; // radius of the projectile
  }

  show() {
    fill(255, 0, 0); // red color for enemy bullet
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  move() {
    this.y += 3; // adjust speed as necessary
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 20;  
  }
}