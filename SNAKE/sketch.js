// Welcome to IMA!!!
// The link for this is: https://tinyurl.com/nyu-snake
// https://teachablemachine.withgoogle.com/
// https://p5js.org/

// *** HERE IS CODE YOU CAN EDIT ******//

// REPLACE THIS WITH YOUR OWN TEACHABLE MACHINE MODEL!!
let imageModelURL = "../Models/Snake_Model/";

// IF YOU WANT TO TRY KEYBOARD CHANGE TO "TRUE";
let keyboard_control = false;

// Higher numbers are slower!!! Try 1 to 60
let speed = 15;

// Confidencee
let confidenceThreshold = 0.7;

// *** THE REST OF THE CODE ******//

let video;
let flipVideo;
let label = "Esperando...";

let classifier;

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

let snake;
let rez = 20;
let food;
let w;
let h;

function setup() {
  createCanvas(720, 480);

  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();

  w = floor(width / rez);
  h = floor(height / rez);
  // frameRate(5);
  snake = new Snake();
  foodLocation();
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  let confidence = results[0].confidence;
  // Classifiy again!
  controlSnake(confidence);
  classifyVideo();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyboard_control) {
    if (keyCode == RIGHT_ARROW) snake.setDir(1, 0);
    if (keyCode == LEFT_ARROW) snake.setDir(-1, 0);
    if (keyCode == UP_ARROW) snake.setDir(0, -1);
    if (keyCode == DOWN_ARROW) snake.setDir(0, 1);
  }
}

function controlSnake() {
  // console.log(label);
  if (!keyboard_control) {
    if (label === "Cima") {
      // UP
      snake.setDir(0, -1);
    } else if (label === "Direita") {
      // RIGHT
      snake.setDir(1, 0);
    } else if (label === "Esquerda") {
      // LEFT
      snake.setDir(-1, 0);
    } else if (label === "Baixo") {
      // DOWN
      snake.setDir(0, 1);
    }
  }
}

function draw() {
  background(220);
  if (!keyboard_control) {
    image(flippedVideo, 0, 0, 160, 120);
    textSize(32);
    fill(255);
    stroke(0);
    text(label, 10, 40);
  }

  scale(rez);
  if (snake.eat(food)) {
    foodLocation();
    snake.update();
  }
  if (frameCount % speed == 0) {
    snake.update();
  }
  snake.show();

  if (snake.endGame()) {
    print("FIM DO JOGO");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}