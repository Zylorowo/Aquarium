
"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 500;

let punkte = 0;
let timer = 30;
let gameOver = false;

function loadImage(filename) {
    const img = new Image();
    img.src = "images/" + filename + ".png";
    return img;
}

const images = {
    fish: loadImage("fish"),
    fishLeft: loadImage("fish_left"),
    blowfish: loadImage("blowfish"),
    blowfishLeft: loadImage("blowfish_left"),
    shark: loadImage("shark"),
    sharkLeft: loadImage("shark_left"),
    bubble: loadImage("bubble"),
    trash: loadImage("mullsack"),
    game: loadImage("game")
};

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createFish(x, y, width, height, direction, image) {
    return { x, y, width, height, direction, image };
}

let fish;
let blowfish;
let shark;

let bubbles = [];
let trashBags = [];

function initializeGame() {

    punkte = 0;
    timer = 30;
    gameOver = false;

    fish = createFish(
        109, 100, 80, 80, 1, images.fish
    );

    blowfish = createFish(
        232, 305, 80, 80, 1, images.blowfish
    );

    shark = createFish(
        502, 268, 130, 80, 1, images.shark
    );

    bubbles = [];

    for (let i = 0; i < 60; i++) {
        bubbles.push({
            x: randint(1, WIDTH),
            y: randint(1, HEIGHT)
        });
    }

    trashBags = [];

    for (let i = 0; i < 6; i++) {
        trashBags.push({
            x: randint(100, WIDTH),
            y: randint(100, HEIGHT),
            width: 100,
            height: 120
        });
    }

    accumulator = 0;
    lastFrame = 0;

    draw();
}

// ==========================================
// FISCHE BEWEGEN
// ==========================================

function moveFish() {

    fish.x += 3 * fish.direction;

    if (fish.x > WIDTH - 20) {
        fish.direction = -2;
        fish.image = images.fishLeft;
    }

    if (fish.x < 20) {
        fish.direction = 2;
        fish.image = images.fish;
    }

    blowfish.x += 4 * blowfish.direction;

    if (blowfish.x > WIDTH - 20) {
        blowfish.direction = -2;
        blowfish.image = images.blowfishLeft;
    }

    if (blowfish.x < 20) {
        blowfish.direction = 2;
        blowfish.image = images.blowfish;
    }

    shark.x += 5 * shark.direction;

    if (shark.x > WIDTH - 20) {
        shark.direction = -5;
        shark.image = images.sharkLeft;
    }

    if (shark.x < 20) {
        shark.direction = 5;
        shark.image = images.shark;
    }
}

// ==========================================
// BLASEN BEWEGEN
// ==========================================

function moveBubbles() {

    for (const bubble of bubbles) {

        bubble.y -= 2;

        if (bubble.y <= -20) {
            bubble.y = HEIGHT;
            bubble.x = randint(1, WIDTH);
        }
    }
}

// ==========================================
// MÜLLSÄCKE BEWEGEN
// ==========================================

function moveTrash() {

    for (const sack of trashBags) {

        sack.y += 2;

        if (sack.y > HEIGHT + sack.height / 2) {
            sack.y = -sack.height / 2;
            sack.x = randint(50, WIDTH - 50);
        }
    }
}

// ==========================================
// SPIEL AKTUALISIEREN
// ==========================================

function update() {

    if (gameOver) return;

    timer -= 1 / 60;

    if (timer <= 0) {
        timer = 0;
        gameOver = true;
        return;
    }

    moveFish();
    moveBubbles();
    moveTrash();
}

// ==========================================
// BILDER ZEICHNEN
// ==========================================

function drawObject(img, x, y, width, height) {

    if (!img.complete || img.naturalWidth === 0) return;

    ctx.drawImage(
        img,
        x - width / 2,
        y - height / 2,
        width,
        height
    );
}

// ==========================================
// GAME OVER BILDSCHIRM
// ==========================================

function drawGameOver() {

    // Schwarzer Hintergrund über die gesamte Fläche

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Originalbild vollständig anzeigen

    if (images.game.complete && images.game.naturalWidth > 0) {

        ctx.drawImage(
            images.game,
            0,
            0,
            WIDTH,
            HEIGHT
        );

    } else {

        ctx.fillStyle = "white";
        ctx.font = "90px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "Game over",
            WIDTH / 2,
            HEIGHT / 2 + 30
        );

        ctx.textAlign = "left";
    }
}

// ==========================================
// SPIEL ZEICHNEN
// ==========================================

function draw() {

    // Bei Game Over nur noch das Endbild zeigen

    if (gameOver) {
        drawGameOver();
        return;
    }

    // Wasser

    ctx.fillStyle = "rgb(10, 70, 120)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Fische

    drawObject(
        shark.image,
        shark.x,
        shark.y,
        shark.width,
        shark.height
    );

    drawObject(
        blowfish.image,
        blowfish.x,
        blowfish.y,
        blowfish.width,
        blowfish.height
    );

    drawObject(
        fish.image,
        fish.x,
        fish.y,
        fish.width,
        fish.height
    );

    // Blasen

    for (const bubble of bubbles) {
        drawObject(
            images.bubble,
            bubble.x,
            bubble.y,
            20,
            20
        );
    }

    // VERGRÖSSERTE MÜLLSÄCKE

    for (const sack of trashBags) {
        drawObject(
            images.trash,
            sack.x,
            sack.y,
            sack.width,
            sack.height
        );
    }

    // Punkte

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    ctx.fillText(
        "Punkte: " + punkte,
        10,
        35
    );

    // Timer

    ctx.fillText(
        "Time: " + Math.ceil(timer),
        10,
        70
    );
}

// ==========================================
// KOLLISIONEN
// ==========================================

function hit(object, mouseX, mouseY) {

    return (
        mouseX >= object.x - object.width / 2 &&
        mouseX <= object.x + object.width / 2 &&
        mouseY >= object.y - object.height / 2 &&
        mouseY <= object.y + object.height / 2
    );
}

// ==========================================
// MAUSKLICKS
// ==========================================

canvas.addEventListener("click", function(event) {

    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) * WIDTH / rect.width;

    const mouseY =
        (event.clientY - rect.top) * HEIGHT / rect.height;

    if (hit(fish, mouseX, mouseY)) {
        punkte += 0.5;
        return;
    }

    if (hit(blowfish, mouseX, mouseY)) {
        punkte += 1;
        return;
    }

    if (hit(shark, mouseX, mouseY)) {
        punkte += 5;
        return;
    }

    for (const sack of trashBags) {

        if (hit(sack, mouseX, mouseY)) {

            punkte -= 10;

            sack.y = -1000;
            sack.x = randint(50, WIDTH - 50);

            return;
        }
    }

    // Wasser angeklickt

    punkte -= 1;
});

// ==========================================
// SPIELSCHLEIFE
// ==========================================

let lastFrame = 0;
let accumulator = 0;

const FRAME_TIME = 1000 / 60;

function gameLoop(timestamp) {

    if (!lastFrame) {
        lastFrame = timestamp;
    }

    const delta = Math.min(timestamp - lastFrame, 100);

    lastFrame = timestamp;
    accumulator += delta;

    while (accumulator >= FRAME_TIME) {

        update();
        accumulator -= FRAME_TIME;
    }

    draw();

    requestAnimationFrame(gameLoop);
}

// ==========================================
// NEUSTART
// ==========================================

document.getElementById("restart").addEventListener("click", function() {
    initializeGame();
});

// ==========================================
// START
// ==========================================

initializeGame();
requestAnimationFrame(gameLoop);
