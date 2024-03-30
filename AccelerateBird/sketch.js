let imageModelURL = "../Models/AccelerateBird_Model/";

let keyboard_control = false;

let speed = 15;

let confidenceThreshold = 0.7;

let video;
let flipVideo;
let label = "waiting...";

let classifier;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

let bird;
let rez = 20;
let w;
let h;

function setup() {
  createCanvas(720, 480)

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  bird = myGamePiece;

  classifyVideo();
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
  controlBird(confidence);
  classifyVideo();
}

function keyPressed() {
  if (keyboard_control) {
    if (keyCode == UP_ARROW) bird.accelerate(0.05);
    if (keyCode == DOWN_ARROW) bird.accelerate(-0.2);
  }
}

function controlBird() {
  // console.log(label);
  if (!keyboard_control) {
    if (label === "Acelerar") {
      // UP
      bird.accelerate(0.05);
    } else if (label === "Parar") {
      // RIGHT
      snake.accelerate(-0.2);
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
  
  bird.updateGameArea();

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}