const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
const birdWidth = 40;
const birdHeight = 40;
const birdX = 50;
let birdY = 200;
let birdSpeed = 0;
let gravity = 0.5;
let jumpStrength = -10;
let isJumping = false;
let score = 0;

// Pipe Variables
const pipeWidth = 60;
const pipeGap = 150;
let pipes = [];

// Game settings
const pipeInterval = 1500; // Milliseconds between pipe creation
let lastPipeTime = Date.now();
let gameOver = false;

// Event Listener for jumping
document.addEventListener('keydown', () => {
  if (!gameOver) {
    birdSpeed = jumpStrength; // Make the bird jump
  }
});

// Function to draw the bird
function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Function to create pipes
function createPipe() {
  const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    top: pipeHeight,
    bottom: pipeHeight + pipeGap
  });
}

// Function to draw the pipes
function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    // Top Pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // Bottom Pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

// Function to move pipes
function movePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });
  // Remove pipes that are out of screen
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Function to check for collisions
function checkCollisions() {
  // Collision with ground
  if (birdY + birdHeight >= canvas.height) {
    gameOver = true;
  }

  // Collision with pipes
  pipes.forEach(pipe => {
    if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
      if (birdY < pipe.top || birdY + birdHeight > pipe.bottom) {
        gameOver = true;
      }
    }
  });
}

// Function to update the score
function updateScore() {
  pipes.forEach(pipe => {
    if (pipe.x + pipeWidth === birdX) {
      score++;
    }
  });
}

// Function to draw score
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Function to update bird's position
function updateBird() {
  birdSpeed += gravity;
  birdY += birdSpeed;
}

// Main game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  updateBird(); // Update bird's position
  drawBird(); // Draw the bird

  if (Date.now() - lastPipeTime > pipeInterval) {
    createPipe();
    lastPipeTime = Date.now();
  }

  drawPipes(); // Draw the pipes
  movePipes(); // Move the pipes
  checkCollisions(); // Check for collisions
  updateScore(); // Update the score
  drawScore(); // Draw the score

  requestAnimationFrame(gameLoop); // Call the game loop again
}

// Start the game
gameLoop();
