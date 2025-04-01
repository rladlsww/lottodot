function getBallColor(num) {
  if (num <= 10) return 'yellow';
  if (num <= 20) return 'blue';
  if (num <= 30) return 'red';
  if (num <= 40) return 'black';
  return 'green';
}

let availableBalls = [];
let drawnNumbers = [];

function createBall(num) {
  const ball = document.createElement('div');
  ball.className = `ball ${getBallColor(num)}`;
  ball.textContent = num;

  const radius = 140;
  const cx = 160, cy = 160;

  let angle = Math.random() * 2 * Math.PI;
  let r = Math.random() * (radius - 40);
  let x = cx + r * Math.cos(angle) - 20;
  let y = cy + r * Math.sin(angle) - 20;

  ball.style.left = x + "px";
  ball.style.top = y + "px";

  const baseSpeed = 0.4;
  let dx = Math.cos(Math.random() * 2 * Math.PI) * baseSpeed;
  let dy = Math.sin(Math.random() * 2 * Math.PI) * baseSpeed;

  function move() {
    x += dx;
    y += dy;

    let centerX = x + 20;
    let centerY = y + 20;
    let dist = Math.sqrt((centerX - cx) ** 2 + (centerY - cy) ** 2);

    if (dist > radius - 1) {
      let angleToCenter = Math.atan2(centerY - cy, centerX - cx);
      let bounceAngle = angleToCenter + Math.PI + (Math.random() - 0.5) * 0.3;
      dx = Math.cos(bounceAngle) * baseSpeed;
      dy = Math.sin(bounceAngle) * baseSpeed;
    }

    ball.style.left = x + "px";
    ball.style.top = y + "px";

    if (!ball.classList.contains("drawn")) {
      requestAnimationFrame(move);
    }
  }

  requestAnimationFrame(move);
  return ball;
}

function drawLotto() {
  if (drawnNumbers.length >= 6 || availableBalls.length === 0) return;

  const idx = Math.floor(Math.random() * availableBalls.length);
  const ball = availableBalls.splice(idx, 1)[0];
  const number = parseInt(ball.textContent);
  drawnNumbers.push(number);
  ball.classList.add("drawn");

  const resultArea = document.getElementById("resultArea");
  const drum = document.getElementById("drum");

  const floatingBall = ball.cloneNode(true);
  floatingBall.className = `ball ${getBallColor(number)} floating-big`;
  floatingBall.style.position = "absolute";
  floatingBall.style.left = "0";
  floatingBall.style.top = "0";
  floatingBall.style.transform = "translate(0, 0)";
  floatingBall.style.zIndex = "10";

  drum.appendChild(floatingBall);
  ball.style.display = "none";

  setTimeout(() => {
    floatingBall.remove();
    const clone = document.createElement("div");
    clone.className = `ball ${getBallColor(number)} final`;
    clone.textContent = number;
    resultArea.appendChild(clone);
  }, 1200);
}

function resetLotto() {
  const drum = document.getElementById("drum");
  const resultArea = document.getElementById("resultArea");

  drawnNumbers = [];
  availableBalls = [];

  drum.innerHTML = "";
  resultArea.innerHTML = "";

  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
  shuffle(numbers);

  for (let i = 0; i < 45; i++) {
    const ball = createBall(numbers[i]);
    availableBalls.push(ball);
    drum.appendChild(ball);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

window.onload = () => {
  resetLotto();
  document.getElementById("drawButton").addEventListener("click", drawLotto);
  document.getElementById("resetButton").addEventListener("click", resetLotto);
};
