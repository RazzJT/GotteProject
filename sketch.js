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
let enemyShootInterval = 1000; // interval mellem invaders' skud i millisekunder
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


function draw() { // Styrer spillets hovedlogik baseret på menu tilstand med en switch case
  switch (currentMenu){
    case Menu.game: runGame(); break; // For selve spillets logik
    case Menu.start: displayStartScreen(); break; // For startmenuen
    case Menu.restart: displayGameOverScreen(); break; // For gameover menuen
    case Menu.shop: displayShop(); break; // For shop menuen mellem runderne
  }
}


function runGame() {  
  background(0); // Sætter baggrundsfarven til sort
  player.show(); // Viser spilleren på skærmen
  player.move(); // Opdaterer spillerens position baseret på input

  let edge = false; // En boolsk variabel til at tjekke om en invader rører kanten af skærmen

  enemyShoot(); // Funktion der håndterer når fjender (invaders) skyder

  // Gennemgår hver bullet i spillerens bullets-array
  for (let i=0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.show(); // Viser kuglen
    bullet.move(); // Bevæger kuglen

    // Fjerner kuglen hvis den er uden for skærmens top
    if (bullet.y < -10) {
      bullets.splice(bullets.indexOf(bullet), 1);
      console.log("bullet removed");
    }

    // Tjekker kollision mellem spillerens kugler og invaders
    for (let i = invaders.length - 1; i >= 0; i--) {
      if (bullet.hits(invaders[i])) {
        score += 10; // Tildeler point for at ramme en invader
        invaders.splice(i, 1); // Fjerner den ramte invader fra arrayet
        bullets.splice(bullets.indexOf(bullet), 1); // Fjerner kuglen der ramte invaderen
        // Tildeler spilleren guld med en chance på 1 ud af 4
        if(random([1,2,3,4]) == 1) {
          gold += 10;
        }
      }
    }
  }

  // Gennemgår hver invader i invaders-arrayet
  for (let i=0; i < invaders.length; i++) {
    let invader = invaders[i];

    invader.show(); // Viser invaderen
    invader.move(invaderDirection); // Bevæger invaderen i den aktuelle retning
    // Tjekker om en invader rører kanten og ændrer retning hvis sandt
    if (invader.x > width - invader.w || invader.x < invader.w) {
      edge = true;
    }
    // Tjekker om invaders når bunden af skærmen og slutter spillet hvis sandt
    if (invader.y + invader.w >= height - 30) {
      currentMenu = Menu.restart;
      highScore = max(highScore, score); // Opdaterer highscore hvis nødvendigt
    }
  }

  // Gennemgår hver fjende kugle i enemyBullets-arrayet
  for (let i = enemyBullets.length - 1; i >= 0; i--) {

    enemyBullets[i].show(); // Viser kuglen
    enemyBullets[i].move(); // Bevæger kuglen

    // Tjekker om en kugle rammer spilleren og slutter spillet hvis sandt
    if (enemyBullets[i].hits(player)) {
      console.log('Player hit!');
      currentMenu = Menu.restart;
      highScore = max(highScore, score); // Opdaterer highscore hvis nødvendigt
    }

    // Fjerner kuglen hvis den går uden for bunden af skærmen
    if (enemyBullets[i].y > 510) {
      enemyBullets.splice(i, 1);
    }
  }

  // Ændrer retning af alle invaders og flytter dem nedad hvis en rører kanten
  if (edge) {
    invaderDirection *= -1;
    for (let i=0; i < invaders.length; i++) {
      invaders[i].shiftDown();
    }
  }
  
  // Hvis der ikke er flere invaders, skifter spillet til shop-menuen og starter en ny runde
  if (invaders.length <= 0) {
    currentMenu = Menu.shop;
    roundCount++;
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
  background(50); // Sætter baggrundsfarven til en mørkegrå
  textSize(40); // Sætter størrelsen på teksten til 40
  fill(255); // Sætter tekstfarven til hvid
  textAlign(CENTER); // Centrerer teksten
  text("Highscore " + highScore, 500, 50); // Viser highscore på skærmen
  text("Press Start to Play", 500, 300); // Instruerer spilleren om at starte spillet

  startGameButton.show(); // Viser startknap
}

function displayShop() {
  background(50); // Sætter baggrundsfarven til en mørkegrå
  textSize(20); // Sætter tekststørrelsen til 20
  fill(255); // Sætter tekstfarven til hvid
  textAlign(RIGHT); // Teksten vil blive højrejusteret
  // Viser forskellige spilinformationer på skærmen
  text("Score: " + score, 950, 30);
  text("Highscore: " + highScore, 950, 60);
  text("Round: " + roundCount, 100, 30);
  text("Gold: " + gold, 100, 60);
  text("Upgrade Cost: " + upgradeCost + " Gold", 400, 210);
  
  continueGameButton.show(); // Viser knappen for at fortsætte spillet
  upgradeShootSpeed.show(); // Viser knappen for at opgradere skudhastighed
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

function displayGameOverScreen() {
  background(50); // Sætter baggrundsfarven til en mørkegrå
  textSize(40); // Sætter tekststørrelsen til 40
  fill(255); // Sætter tekstfarven til hvid
  textAlign(CENTER); // Teksten vil blive centreret
  // Viser game over beskeder
  text("Game Over", width / 2, height / 2);
  text("Score: " + score, width / 2, height / 2 + 50);
  text("High Score: " + highScore, width / 2, height / 2 + 100);
  
  restartButton.show(); // Viser genstartsknap
}


function keyPressed() {
  if (currentMenu = Menu.game) { // Tjekker om spillet er i gang
    if (keyCode === RIGHT_ARROW) {
      player.setDirection(1); // Flyt spilleren til højre
    } else if (keyCode === LEFT_ARROW) {
      player.setDirection(-1); // Flyt spilleren til venstre
    } else if (keyCode === 32) { // Spacebar til at skyde
      if (millis() - lastShootTime > shootCooldown) {
        bullets.push(new Bullet(player.x, height - 20)); // Skab en ny kugle
        lastShootTime = millis(); // Opdaterer tidspunktet for sidste skud
      }
    }
  }
}


function enemyShoot() {
  let currentTime = millis(); // Gemmer den aktuelle tid
  if (currentTime - lastEnemyShootTime > enemyShootInterval) { // Tjekker om det er tid til at invaders skal skyde
    if (invaders.length > 0) {
      let shooter = random(invaders); // Vælger en tilfældig invader
      enemyBullets.push(new EnemyBullet(shooter.x + shooter.w / 2, shooter.y + shooter.w)); // Opretter en ny kugle fra invadere

      
      lastEnemyShootTime = currentTime; // Nulstiller tidspunktet for sidste skud
    }
  }
}

function startGame() {
  // Nulstiller spilvariabler
  score = 0;
  roundCount = 1;
  enemyShootInterval = 3000;

  // Rydder arrays for spilobjekter
  invaders = [];
  bullets = [];
  enemyBullets = [];
  currentMenu = Menu.game; // Sætter spilmenuen til aktivt spil
  restartButton.hide(); // Skjuler genstartsknap
  startGameButton.hide(); // Skjuler startknap
  player = new Player(); // Opretter en ny spiller
  // Fylder invaders-array med nye invader objekter
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20, j + 1));
    }
  }
}


function newRound() {
  // Forbereder en ny runde ved at rydde og genopbygge spilarrays
  invaders = [];
  bullets = [];
  enemyBullets = [];
  currentMenu = Menu.game; // Sætter spilmenuen til aktivt spil
  invaderSpeed = invaderSpeed + roundCount * 0.1; // Øger invaders' hastighed baseret på runden nummer
  enemyShootInterval = enemyShootInterval - roundCount * 100; // Reducerer intervallet mellem invaders' skud
  // Genopbygger invaders-array med nye invader objekter
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      invaders.push(new Invader(i * 50 + 50, j * 50 + 20, j + 1));
    }
  }
  continueGameButton.hide(); // Skjuler fortsæt-knappen
  upgradeShootSpeed.hide(); // Skjuler opgraderingsknappen
}




function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player.setDirection(0); // Nulstiller spillerens bevægelsesretning når pilen slippes
  }
}

class Player {
  constructor() {
    this.x = width / 2; // Spillerens startposition i x-aksen (midten af skærmen)
    this.y = 500; // Spillerens startposition i y-aksen
    this.xdir = 0; // Retning af spillerens bevægelse, 0 betyder stillestående
    this.velocity = 0; // Spillerens hastighed, startværdi er 0
    this.speed = 0.7; // Hastighedsfaktor for bevægelse
    this.r = 10; // Radius af spilleren til kollisionsdetektion
  }

  show() {
    fill(255); // Sætter farven på spilleren til hvid
    rectMode(CENTER); // Sætter tegnemode til centeret om koordinater
    rect(this.x, height - 10, 20, 20); // Tegner spilleren som en firkant
  }

  setDirection(dir) {
    this.xdir = dir; // Ændrer retning baseret på input (dir)
  }

  move() {
    this.velocity += this.xdir * this.speed; // Opdaterer hastighed baseret på retning og hastighedsfaktor
    this.x += this.velocity; // Flytter spilleren langs x-aksen
    this.velocity *= 0.9; // Anvender en dæmpning på hastigheden for at simulere friktion

    // Begrænser spillerens bevægelse til inden for canvas-rammerne
    this.x = constrain(this.x, this.r, width - this.r);
  }
}


class Invader {
  constructor(x, y, row) {
    this.x = x; // Start x-position for invaderen
    this.y = y; // Start y-position for invaderen
    this.w = 20; // Størrelse af invaderen (bredde og højde)
    this.row = row; // Rækken hvor invaderen er placeret
  }

  show() {
    fill("red"); // Farver invaderen rød
    rect(this.x, this.y, this.w, this.w); // Tegner invaderen som en firkant
    fill("white");
    rect(this.x - 5, this.y - 2, 5, 5); // Tegner det venstre øje
    rect(this.x + 5, this.y - 2, 5, 5); // Tegner det højre øje
    fill("white");
    ellipse(this.x, this.y + 6, 15, 5); // Tegner invaderens mund
  }

  move(direction) {
    this.x += direction * invaderSpeed; // Flytter invaderen langs x-aksen baseret på retning og hastighed
  }

  shiftDown() {
    this.y += 40; // Flytter invaderen nedad ved kanten af skærmen
  }
}



class Bullet {
  constructor(x, y) {
    this.x = x; // Start x-position for kuglen
    this.y = y; // Start y-position for kuglen
  }

  show() {
    fill(50, 0, 200); // Farver kuglen blå
    ellipse(this.x, this.y, 4, 10); // Tegner kuglen som en ellipse
  }

  move() {
    this.y -= 5; // Bevæger kuglen opad
  }

  hits(invader) {
    let d = dist(this.x, this.y, invader.x, invader.y); // Beregner afstanden til invaderen
    return d < 20; // Returnerer true hvis kuglen rammer invaderen
  }
}



// Invader kugleklasse
class EnemyBullet {
  constructor(x, y) {
    this.x = x; // Start x-position for fjendens kugle
    this.y = y; // Start y-position for fjendens kugle
    this.r = 5; // Radius af fjendens kugle
  }

  show() {
    fill(255, 0, 0); // Farver fjendens kugle rød
    ellipse(this.x, this.y, this.r * 2, this.r * 2); // Tegner kuglen som en ellipse
  }

  move() {
    this.y += 3; // Bevæger kuglen nedad
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y); // Beregner afstanden til spilleren
    return d < 20; // Returnerer true hvis kuglen rammer spilleren
  }
}
