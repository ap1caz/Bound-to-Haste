// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game variables
let gravity = 0.8;
let isJumping = false;
let jumpHeight = -15;
let velocityY = 0;
let gameSpeed = 3;
let score = 0;
let spikes = [];
let music = new Audio('music.mp3');
music.loop = true;
music.play();

// Player object
const player = {
  x: 50,
  y: canvas.height - 100,
  width: 40,
  height: 40,
  color: '#00FF00',
  icon: new Image(),
  velocityY: 0,
  jump: function() {
    if (!isJumping) {
      isJumping = true;
      this.velocityY = jumpHeight;
    }
  },
  update: function() {
    this.velocityY += gravity;
    this.y += this.velocityY;

    if (this.y > canvas.height - 100) {
      this.y = canvas.height - 100;
      this.velocityY = 0;
      isJumping = false;
    }

    // Draw player
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

// Spikes (obstacles)
function createSpike() {
  const spike = {
    x: canvas.width,
    y: canvas.height - 100,
    width: 20,
    height: 40,
    image: new Image(),
  };
  spike.image.src = 'spike.png';
  spikes.push(spike);
}

function updateSpikes() {
  for (let i = 0; i < spikes.length; i++) {
    const spike = spikes[i];
    spike.x -= gameSpeed;

    // Draw spike
    ctx.drawImage(spike.image, spike.x, spike.y, spike.width, spike.height);

    // Collision detection
    if (player.x < spike.x + spike.width &&
        player.x + player.width > spike.x &&
        player.y < spike.y + spike.height &&
        player.y + player.height > spike.y) {
      endGame();
    }

    // Remove off-screen spikes
    if (spike.x + spike.width < 0) {
      spikes.splice(i, 1);
      score++;
    }
  }
}

// Game over
function endGame() {
  music.pause();
  alert('Game Over! Your score: ' + score);
  resetGame();
}

// Reset game
function resetGame() {
  isJumping = false;
  player.y = canvas.height - 100;
  player.velocityY = 0;
  spikes = [];
  score = 0;
  gameSpeed = 3;
  music.play();
}

// Event listener for jumping
document.addEventListener('keydown', function(event) {
  if (event.key === ' ') {
    player.jump();
  }
});

// Update the game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  updateSpikes();

  // Spawn new spikes every 100 frames
  if (Math.random() < 0.02) {
    createSpike();
  }

  // Score and game speed adjustments
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 30);

  // Increase game speed as score increases
  if (score % 10 === 0 && score > 0) {
    gameSpeed += 0.5;
  }

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
