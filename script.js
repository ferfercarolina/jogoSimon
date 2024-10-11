// Simulando um banco de dados local
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let gameSequence = [];
let userSequence = [];
let score = 0;

// Mostrar login e esconder outras áreas
function showLogin() {
    document.getElementById('login-area').style.display = 'block';
    document.getElementById('register-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('ranking-area').style.display = 'none';
}

// Mostrar registro de usuário
function showRegister() {
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('register-area').style.display = 'block';
}

// Validação de login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    currentUser = users.find(user => user.username === username && user.password === password);

    if (currentUser) {
        startGame();
    } else {
        alert('Usuário ou senha incorretos');
    }
});

// Registro de novo usuário
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    users.push({ username: newUsername, password: newPassword, score: 0 });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registrado com sucesso!');
    showLogin();
});

// Iniciar Jogo
document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    score = 0;
    document.getElementById('score').innerText = score;
    gameSequence = [];
    userSequence = [];
    nextLevel();
}

function nextLevel() {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    userSequence = [];
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        highlightTile(gameSequence[i]);
        i++;
        if (i >= gameSequence.length) {
            clearInterval(interval);
        }
    }, 1000);
}

function highlightTile(color) {
    const tile = document.getElementById(color);
    tile.classList.add('active');
    setTimeout(() => {
        tile.classList.remove('active');
    }, 500);
}

// Registrar o clique do usuário
document.querySelectorAll('.game-tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
        userSequence.push(e.target.id);
        checkSequence();
    });
});

function checkSequence() {
    if (userSequence.length === gameSequence.length) {
        if (JSON.stringify(userSequence) === JSON.stringify(gameSequence)) {
            score++;
            document.getElementById('score').innerText = score;
            userSequence = [];
            nextLevel();
        } else {
            alert('Você errou!');
            currentUser.score = score;
            localStorage.setItem('users', JSON.stringify(users));
            showRanking();
        }
    }
}

// Mostrar Ranking
document.getElementById('view-ranking').addEventListener('click', showRanking);
document.getElementById('back-to-game').addEventListener('click', showGameArea);

function showRanking() {
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('ranking-area').style.display = 'block';
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    users.sort((a, b) => b.score - a.score).forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username}: ${user.score} pontos`;
        rankingList.appendChild(li);
    });
}

function showGameArea() {
    document.getElementById('ranking-area').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
}

// Adicionar funcionalidade de Logout
document.getElementById('logout').addEventListener('click', function() {
    currentUser = null;
    showLogin();
});
