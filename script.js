let selectedCard = null;
let cardContainer = document.getElementById("card-container");
let cardImage = document.getElementById("card-image");
let predictionText = document.getElementById("prediction");
let scratchOverlay = document.getElementById("scratch-overlay");
let loadingText = document.getElementById("loading");

async function loadPredictionData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const random = Math.floor(Math.random() * data.length);
    selectedCard = data[random];

    // Show scratch overlay after animation
    setTimeout(() => {
      cardImage.src = selectedCard.image;
      cardImage.style.display = "block";
      scratchOverlay.style.display = "block";
      loadingText.style.display = "none";
    }, 3000); // Adjust timing to match animation
  } catch (error) {
    console.error("Failed to load prediction data:", error);
  }
}

function startCardAnimation() {
  let count = 0;
  const animationInterval = setInterval(() => {
    cardContainer.innerText = `🃏 Card ${count + 1} rejected`;
    count++;
    if (count === 5) {
      clearInterval(animationInterval);
      cardContainer.innerText = "🦜 Parrot selected your card!";
      loadPredictionData();
    }
  }, 500);
}

function simulateScratch() {
  // Simulate scratch by clicking overlay
  scratchOverlay.addEventListener("click", () => {
    scratchOverlay.style.display = "none";
    predictionText.innerText = selectedCard.prediction;
    predictionText.style.display = "block";
  });
}

// Run everything after page loads
window.onload = () => {
  startCardAnimation();
  simulateScratch();
};
