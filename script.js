// script.js

let selectedCardIndex = -1;
const predictionText = "You are blessed with confidence and positive energy today. Stay focused!"; // Dummy for now

function startCardSelection() {
  const cards = document.querySelectorAll('.card');
  let current = 0;

  const interval = setInterval(() => {
    cards.forEach(card => card.style.border = "2px solid #ef6c00"); // Reset

    if (current < cards.length) {
      cards[current].style.border = "4px solid green";
      current++;
    } else {
      clearInterval(interval);
      selectedCardIndex = Math.floor(Math.random() * cards.length);
      const chosenCard = cards[selectedCardIndex];
      chosenCard.style.transform = "scale(1.5)";
      chosenCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        document.getElementById("scratchArea").style.display = "block";
        document.getElementById("scratchArea").innerHTML = `
          <img src="images/sample-revealed.jpg" style="width: 100%; border-radius: 10px;" />
        `;
        document.getElementById("prediction").style.display = "block";
        document.getElementById("prediction").innerText = predictionText;
      }, 2000);
    }
  }, 400);
}
