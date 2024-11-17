const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    },
};

// Aumenta a velocidade do jogo conforme vai passando o tempo
state.values.speedIncreaseInterval = 10;
state.values.minGameVelocity = 400;

function increaseGameSpeed() {
    if(state.values.gameVelocity > state.values.minGameVelocity) {
        state.values.gameVelocity -= 100;
        clearInterval(state.actions.timerId);
        state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    }
}

// Contagem do tempo
function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime % state.values.speedIncreaseInterval === 0) {
        increaseGameSpeed();
    }

    if(state.values.currentTime <= 0){
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        updateHighScore();
        saveGameHistory();
        alert("Game Over! O seu resultado foi:" + state.values.result);
    }
}

// Inicia o áudio toda vez que o Ralph é acertado
function playSound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

// Faz com que Ralph apareça aleatoriamente nas janelas
function randomSquare() {
    state.view.squares.forEach((square)=> {
        const ralph = square.querySelector('.enemy');
        if (ralph) ralph.remove();

        if (square.id === state.values.hitPosition) return;
    });

    let randomNumber = Math.floor(Math.random()* state.view.squares.length);
    let randomSquare = state.view.squares[randomNumber];
    
    let ralph = document.createElement('div');
    ralph.classList.add('enemy');
    randomSquare.appendChild(ralph);
    state.values.hitPosition = randomSquare.id;
}

// Não deixa Ralph aparecer duas vezes seguidas na mesma janela
let lastPosition = null;

function randomSquare() {
    state.view.squares.forEach((square) => {
        const ralph = square.querySelector('.enemy');
        if (ralph) ralph.remove();
    });

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * state.view.squares.length);
    } while (randomNumber === lastPosition);

    lastPosition = randomNumber;

    let randomSquare = state.view.squares[randomNumber];

    let ralph = document.createElement('div');
    ralph.classList.add('enemy');
    randomSquare.appendChild(ralph);
    state.values.hitPosition = randomSquare.id;
}

// Adiciona a interação entre Ralph e mouse
function addListenerHitBox() {
    state.view.squares.forEach((square)=> {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition){
                state.values.result ++
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        })
    });
}

// Adiciona pontuação máxima
function updateHighScore() {
    let highScore = localStorage.getItem("highScore") || 0;
    if(state.values.result > highScore) {
        localStorage.setItem("highScore", state.values.result);
        highScore = state.values.result;
        alert("Novo Recorde! Pontuação Máxima: " + highScore);
    }
    document.querySelector("#high-score").textContent = highScore;
}

// Registra a pontuação máxima
function saveGameHistory() {
    let gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    gameHistory.push({
        score: state.values.result,
        date: new Date().toLocaleString(),
    });
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
}

// Adiciona histórico de pontuações
function showGameHistory() {
    let gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    console.log("Histórico de Jogos:");
    gameHistory.forEach((game, index) => {
        console.log(`${index + 1}. Pontuação: ${game.score} - Data: ${game.date}`);
    });
}

// Reinicia o game sem recarregar a página
function restartGame() {
        // Limpa os intervalos existentes
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);

    // Reinicia os valores do estado
    state.values.gameVelocity = 1000;
    state.values.hitPosition = 0;
    state.values.result = 0;
    state.values.currentTime = 60;

    // Atualiza a interface do usuário
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;

    // Reinicia os intervalos e a lógica do jogo
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    console.log("Jogo reiniciado!");
}
    
function initialize() {
    addListenerHitBox();
    updateHighScore();
}

initialize();

