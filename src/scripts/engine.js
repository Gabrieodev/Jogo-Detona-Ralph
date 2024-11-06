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

// Contagem do tempo
function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0){
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
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
function addListenerHitBox(){
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

function initialize() {
    addListenerHitBox();
}

initialize();

