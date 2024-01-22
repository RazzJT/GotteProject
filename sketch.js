function setup() {
  createCanvas(400, 400);

}

function draw() {
  background(220);
}

function RandomCirleShit() {
  x = random(1,10);
  y = random(1,10);
  CreateCircle();
}

function CreateCircle(x,y) {
  fill("red");
  circle(x,y);
}