let counter = 0;
let lastTime = Date.now();
let ball = document.getElementById('ball');
let hole = document.getElementById('hole');
let holeCount = 0;
let startTime = 0;
let records = [];

//randomize hole position
hole.style.left = `${Math.floor(Math.random() * (window.innerWidth - hole.offsetWidth))}px`;

window.addEventListener('deviceorientation', onDeviceMove);

function onDeviceMove(event) {
    const { beta, gamma } = event;
    const maxX = window.innerWidth - ball.offsetWidth;
    const maxY = window.innerHeight - ball.offsetHeight;
    const ballX = (gamma / 90) * maxX;
    const ballY = (beta / 90) * maxY;
    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;

    if (isBallInHole()) {
        holeCount++;
        if (holeCount === 1) {
            startTime = Date.now();
        }
        if (holeCount === 3) {
            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000;
            records.push(timeTaken);
            alert(`Time taken to complete 3 holes: ${timeTaken} seconds. Records: ${records}`);
            holeCount = 0;
        }
        resetBallPosition();
    }
}

function isBallInHole() {
    const ballRect = ball.getBoundingClientRect();
    const holeRect = hole.getBoundingClientRect();
    return (
        ballRect.left >= holeRect.left &&
        ballRect.right <= holeRect.right &&
        ballRect.top >= holeRect.top &&
        ballRect.bottom <= holeRect.bottom
    );
}

function resetBallPosition() {
    const maxX = window.innerWidth - ball.offsetWidth;
    const maxY = window.innerHeight - ball.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    ball.style.transform = `translate(${randomX}px, ${randomY}px)`;
    hole.style.left = `${Math.floor(Math.random() * (window.innerWidth - hole.offsetWidth))}px`;
}

function animate() {
    counter++;
    if (counter % 100 === 0) {
        const time = Date.now();
        const interval = time - lastTime;
        console.log(`Rendered 100 frames in: ${interval}ms [${1000 / (interval / 100)}fps]`);
        lastTime = time;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);