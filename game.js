const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 500;

let punkte = 0;
let timer = 30;

function load(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const fishImg = load("images/fish.png");
const fishLeftImg = load("images/fish_left.png");

const blowfishImg = load("images/blowfish.png");
const blowfishLeftImg = load("images/blowfish_left.png");

const sharkImg = load("images/shark.png");
const sharkLeftImg = load("images/shark_left.png");

const bubbleImg = load("images/bubble.png");
const trashImg = load("images/mullsack.png");

const gameOverImg = load("images/game.png");

const fish = {
    x: 109,
    y: 100,
    w: 80,
    h: 80,
    dir: 2,
    img: fishImg
};

const blowfish = {
    x: 232,
    y: 305,
    w: 80,
    h: 80,
    dir: 2,
    img: blowfishImg
};

const shark = {
    x: 502,
    y: 268,
    w: 130,
    h: 80,
    dir: 5,
    img: sharkImg
};

const bubbles = [];
for (let i = 0; i < 60; i++) {
    bubbles.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT
    });
}

const trashBags = [];

for (let i = 0; i < 6; i++) {
    trashBags.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        w: 50,
        h: 50
    });
}

function update() {

    if (timer > 0) {
        timer -= 1 / 60;
    }

    fish.x += 3 * fish.dir;

    if (fish.x > WIDTH - 80) {
        fish.dir = -1;
        fish.img = fishLeftImg;
    }

    if (fish.x < 20) {
        fish.dir = 1;
        fish.img = fishImg;
    }

    blowfish.x += 4 * blowfish.dir;

    if (blowfish.x > WIDTH - 80) {
        blowfish.dir = -1;
        blowfish.img = blowfishLeftImg;
    }

    if (blowfish.x < 20) {
        blowfish.dir = 1;
        blowfish.img = blowfishImg;
    }

    shark.x += 5 * shark.dir;

    if (shark.x > WIDTH - 130) {
        shark.dir = -1;
        shark.img = sharkLeftImg;
    }

    if (shark.x < 20) {
        shark.dir = 1;
        shark.img = sharkImg;
    }

    bubbles.forEach(b => {
        b.y -= 2;

        if (b.y < -20) {
            b.y = HEIGHT;
            b.x = Math.random() * WIDTH;
        }
    });

    trashBags.forEach(t => {
        t.y += 2;

        if (t.y > HEIGHT + 20) {
            t.y = -20;
            t.x = Math.random() * WIDTH;
        }
    });
}

function draw() {

    ctx.fillStyle = "#0a4678";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    bubbles.forEach(b => {
        ctx.drawImage(bubbleImg, b.x, b.y, 20, 20);
    });

    trashBags.forEach(t => {
        ctx.drawImage(trashImg, t.x, t.y, t.w, t.h);
    });

    ctx.drawImage(fish.img, fish.x, fish.y, fish.w, fish.h);
    ctx.drawImage(blowfish.img, blowfish.x, blowfish.y, blowfish.w, blowfish.h);
    ctx.drawImage(shark.img, shark.x, shark.y, shark.w, shark.h);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    ctx.fillText("Punkte: " + punkte, 10, 35);
    ctx.fillText("Zeit: " + Math.ceil(timer), 10, 70);

    if (timer <= 0) {
        ctx.drawImage(gameOverImg, 150, 100, 500, 250);
    }
}

function hit(obj, x, y) {
    return (
        x >= obj.x &&
        x <= obj.x + obj.w &&
        y >= obj.y &&
        y <= obj.y + obj.h
    );
}

canvas.addEventListener("click", e => {

    if (timer <= 0) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (hit(fish, x, y)) {
        punkte += 0.5;
        return;
    }

    if (hit(blowfish, x, y)) {
        punkte += 1;
        return;
    }

    if (hit(shark, x, y)) {
        punkte += 5;
        return;
    }

    for (const sack of trashBags) {
        if (hit(sack, x, y)) {
            punkte -= 10;
            return;
        }
    }

    punkte -= 1;
});

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();