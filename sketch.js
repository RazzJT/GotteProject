function setup() {
  createCanvas(400, 400);
  RandomCirleShit()
}

function RandomCirleShit() {
  x = random(10,100);
  y = random(10,100);
  CreateCircle(x,y);
  console.log(x)
}

function CreateCircle(x,y) {
  fill("red");
  circle(x,y,100);
}