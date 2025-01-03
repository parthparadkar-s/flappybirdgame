// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

// Bird settings
let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.6,
    lift: -15,
    jump: function() {
        this.velocity = this.lift;
        flapSound.play();
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    draw: function() {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Pipe settings
let pipes = [];
let pipeWidth = 60;
let pipeGap = 100;
let pipeSpeed = 2;
let pipeFrequency = 90;
let frameCount = 0;

// Game settings
let gameSpeed = 1;
let score = 0;
let isGameOver = false;

// Sounds
const flapSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const hitSound = new Audio('https://www.soundjay.com/button/button-16.wav');
const scoreSound = new Audio('https://www.soundjay.com/button/button-09.wav');

// Function to generate new pipes
function generatePipes() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    let topPipe = { x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight };
    let bottomPipe = { x: canvas.width, y: pipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipeHeight - pipeGap };
    pipes.push(topPipe, bottomPipe);
}

// Function to update pipes position
function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed * gameSpeed;

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 2); // Remove passed pipes
            score++;
            scoreSound.play();
            i -= 2;
        }
    }
}

// Function to detect collision with pipes
function detectCollisions() {
    for (let i = 0; i < pipes.length; i++) {
        if (
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + pipes[i].width &&
            bird.y + bird.height > pipes[i].y &&
            bird.y < pipes[i].y + pipes[i].height
        ) {
            hitSound.play();
            isGameOver = true;
        }
    }
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    updatePipes();
    generatePipes();

    pipes.forEach(pipe => {
        ctx.fillStyle = '#008000';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });

    detectCollisions();

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    frameCount++;
    if (frameCount % pipeFrequency === 0) {
        generatePipes();
    }

    requestAnimationFrame(gameLoop);
}

// Handle player input
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isGameOver) {
        bird.jump();
    } else if (event.code === 'Space' && isGameOver) {
        // Restart game
        pipes = [];
        score = 0;
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        isGameOver = false;
        gameLoop();
    }
});

// Start the game
gameLoop();
