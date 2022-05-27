// Carregamento de Audios
var somDisparo = document.getElementById("somDisparo");
var somExplosao = document.getElementById("somExplosao");
var somMusicaFundo = document.getElementById("somFundoMusica");
var somGameover = document.getElementById("somGameover");

// Carrega Blocos
const heroi = document.getElementById("heroi");
const placar = document.getElementById("placar");

// Carrega Objetos
const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['monster-1.png', 'monster-2.png', 'monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
var ponto = 0;
let alienInterval;

// Diretorios
var setImg = 'assets/img/'

//movimento e tiro da nave
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// Função = Movimento de subir
function moveUp() {
    // Recupera posição do Heroi 
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if( parseInt(topPosition) <= 10 ) {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 10;
        yourShip.style.top = `${position}px`;
    }
}

// Função = Movimento de descer
function moveDown() {
    // Recupera posição do Heroi 
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if( parseInt(topPosition) >= 530 ) {
        return
    } else {
        let position = parseInt(topPosition);
        position += 10;
        yourShip.style.top = `${position}px`;
    }
}

// Funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    // Recupera posição de Heroi
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));

    // Cria elemento de laser
    let newLaser = document.createElement('img');
    newLaser.src = setImg + 'shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition + 5}px`;
    
    // Controle Som de Disparo
    somDisparo.play();
    somDisparo.currentTime = 0;
    
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, alien)) {
                // Controle Som Explosão
                somExplosao.play();
                somExplosao.currentTime = 0;
                
                // Conta Pontos
                ponto++;
                placar.innerHTML = 'Placar: ' + ponto;

                alien.src = setImg + 'explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition > 500) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

// Função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = setImg + alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '500px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// Função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

// Função para colisão
function checkLaserCollision(laser, alien) {
    // Posição de Objeto 01
    let laserTop = parseInt(laser.style.top) + 15;
    let laserLeft = parseInt(laser.style.left) + 20;
    let laserBottom = laserTop + 20;

    // Posição de Objeto 02
    let alienTop = parseInt(alien.style.top) - 20;
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop + 40;
    
    if( laserLeft < 500 && laserLeft >= alienLeft ) {
        if( laserTop >= alienTop && laserTop <= alienBottom ) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// Início do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    // Controle som
    somGameover.pause();
    somGameover.currentTime = 0;        
    somMusicaFundo.play();
    somMusicaFundo.currentTime = 0;    

    // Zera Pontuação
    ponto = 0;

    placar.innerHTML = 'Placar: ' + ponto;
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

// Função de game over
function gameOver() {
    // Gerencia Som
    somMusicaFundo.pause();
    somMusicaFundo.currentTime = 0;    
    somGameover.play()
    somGameover.currentTime = 0;        

    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);

    // Remove todos os aliens
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());

    // Remove todos os Lasers
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    // Retornar a tela
    setTimeout(() => {
        alert('game over!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}