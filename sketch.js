function setup() {
  createCanvas(400, 400);
  RandomCirleShit()
}

function RandomCirleShit() {
  x = random(1,10);
  y = random(1,10);
  CreateCircle(x,y);
  console.log(x)
}

function CreateCircle(x,y) {
  fill("red");
  circle(x,y,100);
}