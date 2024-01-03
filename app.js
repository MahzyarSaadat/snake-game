//Define html element
const board = document.getElementById("game-board");
const instuction = document.getElementById("introduction");
const score = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

// game variables
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "";
let gameStarter = false;
let gameInterval;
let gameSpeedDelay = 200;

// draw snake , map , food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updatedScore();
}

// draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// create food & div/cube & food
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set position of food and cube and snake
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// draw food element
function drawFood() {
  if (gameStarter) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * 20) + 1;
  const y = Math.floor(Math.random() * 20) + 1;
  return { x, y };
}

// move snake
function move() {
  let head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval);
    increaseSpeed();

    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// startGame
function startGame() {
  gameStarter = true;
  instuction.style.display = "none";

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}
// handle keyDown
function handleKeyPress(event) {
  if (
    (!gameStarter && event.code === "space") ||
    (!gameStarter && event.key == " ")
  ) {
    startGame();
  } else {
    switch (event.code) {
      case "ArrowUp":
        direction = "up";
        console.log(event.code, direction);
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowDown":
        direction = "down";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
  console.log(gameSpeedDelay);
}

// check the snake collision
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > 20 || head.y < 1 || head.y > 20) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// reset the game
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updatedScore();
}

function updatedScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarter = false;
  instuction.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreElement.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreElement.style.display = "block";
}
