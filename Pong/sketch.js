/** CRÉDITOS
 * Todos os créditos: Wesley Emberlin
 * YouTube: <https://youtu.be/pMDZFuUcFeo?si=lteeli73TwJhlAfe>.
 */

let xBall = 50;
let yBall = 50;
let xSpeed = (4, 9);
let ySpeed = (-9, -4);
let score = 0;
let life = 1;
let moveX = 200;
let paddleWidth = 220;

let video;
let flippedVideo;
let label = "Esperando...";

let classifier;
let imageModelURL = "../Models/Pong/";

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
    createCanvas(800, 800);

    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    classifyVideo();
}

function classifyVideo() {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    label = results[0].label;
    classifyVideo();
}

function draw() {
    background(0);

    image(flippedVideo, 295, 0, 200, 160);

    //Label text size and display
    textSize(32);
    textAlign(CENTER);
    fill("#ffffff");
    text(label, width / 2 - 10, 40);

    //Paddle creation and set to start at moveX (200)
    fill("#FFFFFF");
    rect(moveX, height - 25, paddleWidth, 15);

    //Functions
    move();
    display();
    bounce();
    paddle();
    movePaddle();
    lifeCounter();

    //Score and life counter
    fill("#FFFFFF");
    textSize(32);
    textAlign(LEFT);
    text("Score: " + score, width * 0.8 - 15, 40);
    text("Vida: " + life, width * 0.08 - 25, 40);
}

//Ball Functions
function move() {
    xBall += xSpeed;
    yBall += ySpeed;
}

function bounce() {
    if (xBall < 10 || xBall > width - 10) {
        xSpeed *= -1;
    }
    if (yBall < 10 || yBall > height - 10) {
        ySpeed *= -1;
    }
}

function display() {
    fill("#FFFFFF");
    ellipse(xBall, yBall, 20, 20);
}

//Bounce ball off Paddle
function paddle() {
    if (xBall > moveX && xBall < moveX + paddleWidth && yBall + 10 >= height - 25) {
        xSpeed *= -1;
        ySpeed *= -1;
        score++;
    }
    if (moveX <= 1) {
        moveX = 1;
    }
    if (moveX >= width - paddleWidth) {
        moveX = width - paddleWidth - 1;
    }
}

//Move the paddle based on labels from the model created in teachable machine
function movePaddle() {
    if (label === "Esquerda") {
        moveX = moveX - 5;
    } else if (label === "Direita") {
        moveX = moveX + 5;
    }
}

//Subtracts one life each time the ball misses the paddle and hits the bottom of the canvas
function lifeCounter() {
    if (yBall > height - 10) {
        life = life - 1;
    }
    //Once life hits zero then the game is over and final score is shown
    if (life == 0) {
        background("red");
        textAlign(CENTER);
        text("FIM DO JOGO", width / 2, height / 2);
        text("Pontuação final: " + score, width / 2, height / 2 + 40);
        xBall = width / 2;
        yBall = width / 2;
        xSpeed = 0;
        ySpeed = 0;
    }
}