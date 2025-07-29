let selectedCard = null;
let data = [];

// Load data.json
fetch('data.json')
  .then(response => response.json())
  .then(json => data = json)
  .catch(err => alert("Failed to load data.json"));

// Handle form
document.getElementById('astro-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;

  if (!name || !dob) {
    alert('Please enter name and date of birth');
    return;
  }

  showParrotAnimation();
});

// Show parrot picking animation
function showParrotAnimation() {
  const container = document.getElementById('card-container');
  container.innerHTML = '<img id="parrot" src="https://i.imgur.com/NPKM0V4.png" alt="Parrot">';

  setTimeout(() => {
    selectRandomCard();
  }, 3000); // delay
}

// Select a random card and show it
function selectRandomCard() {
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  const index = Math.floor(Math.random() * data.length);
  selectedCard = data[index];

  const card = document.createElement('div');
  card.className = 'card zoomed';
  card.style.backgroundImage = `url(${selectedCard.image})`;

  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 300;
  card.appendChild(canvas);
  container.appendChild(card);

  setupScratch(canvas, () => {
    showPrediction();
  });
}

// Scratch canvas setup
function setupScratch(canvas, onReveal) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#999';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousemove', e => {
    if (e.buttons !== 1) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check if most of the canvas is scratched
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3] < 128) cleared++;
    }
    if (cleared / (canvas.width * canvas.height) > 0.5) {
      canvas.remove();
      onReveal();
    }
  });
}

// Show prediction and share
function showPrediction() {
  const pred = document.getElementById('prediction');
  pred.textContent = selectedCard.prediction;
  pred.style.display = 'block';

  const share = document.getElementById('share-buttons');
  share.innerHTML = `
    <a class="share-link" href="https://api.whatsapp.com/send?text=${encodeURIComponent(selectedCard.prediction)}" target="_blank">WhatsApp</a>
    <a class="share-link" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank">Facebook</a>
    <a class="share-link" href="https://www.instagram.com/" target="_blank">Instagram</a>
  `;
}
