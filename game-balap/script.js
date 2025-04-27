const gameArea = document.getElementById('gameArea');
const playerCar = document.getElementById('playerCar');
const scoreDisplay = document.getElementById('score');
const road = document.getElementById('road');
const crashSound = document.getElementById('crashSound');

let player = { speed: 5, x: 175 };
let score = 0;
let gameSpeed = 3;
let isGameOver = false;
let selectedCar = '';

let keys = {
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function selectCar(carPath) {
    selectedCar = carPath;
    playerCar.src = selectedCar;
}

function startGame() {
    if (!selectedCar) {
        alert('Pilih mobil dulu!');
        return;
    }
    document.getElementById('menu').classList.add('hidden');
    gameArea.classList.remove('hidden');
    playerCar.style.left = player.x + 'px';
    requestAnimationFrame(gameLoop);
}

function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < (gameArea.offsetWidth - playerCar.offsetWidth)) {
        player.x += player.speed;
    }
    playerCar.style.left = player.x + 'px';
}

function moveRoad() {
    let top = parseInt(road.style.top.replace('px', ''));
    if (top >= 0) {
        top = -600;
    }
    road.style.top = (top + gameSpeed) + 'px';
}

function createEnemyCar() {
    const enemy = document.createElement('img');
    enemy.classList.add('enemyCar');
    enemy.src = 'img/enemy.png';
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = '-100px';
    gameArea.appendChild(enemy);
}

function moveEnemyCars() {
    let enemies = document.querySelectorAll('.enemyCar');
    enemies.forEach(function(enemy) {
        let top = parseInt(enemy.style.top.replace('px', ''));
        if (top > gameArea.offsetHeight) {
            enemy.remove();
        } else {
            enemy.style.top = (top + gameSpeed) + 'px';
            checkCollision(enemy);
        }
    });
}

function checkCollision(enemy) {
    let playerRect = playerCar.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (!(playerRect.bottom < enemyRect.top ||
        playerRect.top > enemyRect.bottom ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right)) {
        crashSound.play();
        alert('Game Over! Skor kamu: ' + score);
        window.location.reload();
    }
}

function changeBackground() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
        gameArea.style.background = 'linear-gradient(#87CEEB, #555)';
    } else {
        gameArea.style.background = 'linear-gradient(#222, #111)';
    }
}

function gameLoop() {
    if (isGameOver) return;

    movePlayer();
    moveRoad();
    moveEnemyCars();

    score++;
    scoreDisplay.innerText = "Score: " + score;

    if (score % 500 === 0) {
        gameSpeed += 0.5;
    }

    if (Math.random() < 0.02) {
        createEnemyCar();
    }

    changeBackground();
    requestAnimationFrame(gameLoop);
}