function setup() {
  createCanvas(400, 400);
  RandomCirleShit()
}

function RandomCirleShit() {
  x = random(100,400);
  y = random(100,400);
  CreateCircle(x,y);
  console.log(x)
}

function CreateCircle(x,y) {
  fill("red");
  circle(x,y,100);
}