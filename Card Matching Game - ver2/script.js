async function fetchCards() {
  const uniqueCardIds = new Set();
  while (uniqueCardIds.size < 6) {
    try {
      const response = await fetch("https://api.magicthegathering.io/v1/cards?pageSize=8&random=true");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      data.cards.forEach(card => {
        if (card.imageUrl && uniqueCardIds.size < 6) {
          uniqueCardIds.add(card);
        }
      });
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }
  const cards = Array.from(uniqueCardIds);
  return cards.concat(cards); 
}

  document.addEventListener("DOMContentLoaded", async () => {
    const gameContainer = document.querySelector(".game-container");
    const cards = await fetchCards();
    const shuffledCards = cards.sort(() => 0.5 - Math.random());
  
    let cardFlips = [];
    let matchedCards = 0;
  
    shuffledCards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.id = card.id;
      cardElement.innerHTML = `<img src="${card.imageUrl}" alt="${card.name}">`;
      cardElement.addEventListener("click", handleCardFlip);
      gameContainer.appendChild(cardElement);
    });
  
    function handleCardFlip(e) {
      const cardElement = e.target.parentElement;
  
      if (cardFlips.length < 2 && !cardElement.classList.contains("flip")) {
        cardElement.classList.add("flip");
        cardFlips.push(cardElement);
  
        if (cardFlips.length === 2) {
          setTimeout(checkForMatch, 1000);
        }
      }
    }
  
    function checkForMatch() {
      const [card1, card2] = cardFlips;
  
      if (card1.dataset.id === card2.dataset.id) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedCards += 2;
  
        if (matchedCards === shuffledCards.length) {
          setTimeout(() => {
            alert("Congratulations! You've matched all the cards!");
          }, 500);
        }
      } else {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
      }
  
      cardFlips = [];
    }

    if (matchedCards === shuffledCards.length) {
  setTimeout(() => {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerText = "Congratulations! You've matched all the cards!";
  }, 500);
}


  });
  