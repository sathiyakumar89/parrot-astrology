let data = [];
let selected = null;

async function loadData() {
  const response = await fetch('data.json');
  data = await response.json();
}

function getRandomCard() {
  const index = Math.floor(Math.random() * data.length);
  selected = data[index];
  return selected;
}

function revealCard() {
  const cardImage = document.querySelector('.card-image');
  const scratchArea = document.querySelector('.scratch-area');
  const predictionText = document.querySelector('.prediction-text');

  cardImage.src = selected.image;
  cardImage.style.display = 'block';
  scratchArea.style.display = 'block';

  // Setup canvas scratch
  setupScratchCanvas();

  predictionText.textContent = selected.prediction;
}

function setupScratchCanvas() {
  const scratchArea = document.querySelector('.scratch-area');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = scratchArea.offsetWidth;
  const height = scratchArea.offsetHeight;

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.borderRadius = '12px';

  scratchArea.innerHTML = '';
  scratchArea.appendChild(canvas);

  // Gray overlay
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;

  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchstart', () => isDrawing = true);
  canvas.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchmove', scratch);

  function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Auto-reveal after 50% scratched
  let revealCheck = setInterval(() => {
    const pixels = ctx.getImageData(0, 0, width, height);
    let cleared = 0;
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i + 3] === 0) cleared++;
    }
    if ((cleared / (width * height)) > 0.5) {
      clearInterval(revealCheck);
      scratchArea.style.display = 'none';
      document.querySelector('.prediction-text').style.display = 'block';
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();

  document.querySelector('#startButton').addEventListener('click', () => {
    document.querySelector('.card-area').textContent = "Parrot is selecting a card...";
    setTimeout(() => {
      getRandomCard();
      document.querySelector('.card-area').textContent = "Scratch to reveal your prediction!";
      revealCard();
    }, 1500);
  });
});
