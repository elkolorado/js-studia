const cardsContainer = document.getElementById("cards");
let cardOrderIncrement = 0
function loadCardsData() {
    let currentState = localStorage.getItem("notepocket")
    if (currentState) {
        currentState = JSON.parse(currentState)
    }
    return currentState || []
}

function saveCardsData(data) {
    localStorage.setItem("notepocket", JSON.stringify(data))
}

function createCard(card, i) {
    console.log(card)
    const { title, body, color, pinned, date } = card
    let cardContainer = document.createElement("div")
    cardContainer.classList.add("card")

    cardContainer.classList.add(`bg-${color}`)
    cardContainer.dataset.id = i
    let cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    // position the card 
    cardContainer.style.left = card.position?.x
    cardContainer.style.top = card.position?.y
    cardContainer.style.zIndex = card?.zIndex

    let cardBodyText = document.createElement("div")
    cardBodyText.contentEditable = true
    cardBodyText.textContent = body
    cardBodyText.classList.add("card-body-text")
    cardBodyText.addEventListener("input", (e) => saveCard(i))
    cardBody.appendChild(cardBodyText)

    let cardHeader = document.createElement("div")
    cardHeader.classList.add("card-header")

    let cardHeaderText = document.createElement("input")
    cardHeaderText.classList.add("card-header-text")
    cardHeaderText.value = title
    cardHeaderText.addEventListener("input", (e) => saveCard(i))
    let cardHeaderOptions = document.createElement("div")
    let cardHeaderDelete = document.createElement("button")
    cardHeaderDelete.textContent = "Delete"
    cardHeaderDelete.addEventListener("click", (e) => deleteCard(i))

    let cardFooter = document.createElement("div")
    cardFooter.classList.add("card-footer")

    let cardDate = document.createElement("p")
    cardDate.textContent = timePassed(date)
    cardDate.classList.add("cardDate")
    cardDate.dataset.date = date

    cardContainer.appendChild(cardHeader)
    cardContainer.appendChild(cardBody)
    cardContainer.appendChild(cardFooter)

    cardHeader.appendChild(cardHeaderText)
    cardHeader.appendChild(cardHeaderOptions)
    cardHeaderOptions.appendChild(cardHeaderDelete)

    cardFooter.appendChild(cardDate)

    cardsContainer.appendChild(cardContainer)

    cardContainer.style.position = 'absolute'; // make the card's position absolute

    let mousePosition;
    let offset = [0, 0];
    let isDown = false;

    cardContainer.addEventListener('mousedown', function(e) {
        isDown = true;
        offset = [
            cardContainer.offsetLeft - e.clientX,
            cardContainer.offsetTop - e.clientY
        ];
        cardOrderIncrement++
        cardContainer.style.zIndex = cardOrderIncrement
    }, true);

    document.addEventListener('mouseup', function() {
        isDown = false;
        saveCard(i)
    }, true);

    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {
                x : event.clientX,
                y : event.clientY
            };
            let newLeft = mousePosition.x + offset[0];
            let newTop = mousePosition.y + offset[1];
    
            // Ensure the card doesn't move outside the viewport
            newLeft = Math.max(0, newLeft); // left edge
            newLeft = Math.min(window.innerWidth - cardContainer.offsetWidth, newLeft); // right edge
            newTop = Math.max(0, newTop); // top edge
            newTop = Math.min(window.innerHeight - cardContainer.offsetHeight, newTop); // bottom edge
    
            cardContainer.style.left = newLeft + 'px';
            cardContainer.style.top  = newTop + 'px';
        }
    }, true);
}

window.addEventListener('resize', function() {
    // Get all cards
    const cards = document.querySelectorAll('.card'); // replace '.card' with the actual class or id of your cards

    cards.forEach(card => {
        let left = parseInt(card.style.left);
        let top = parseInt(card.style.top);

        // Ensure the card doesn't move outside the viewport
        left = Math.max(0, left); // left edge
        left = Math.min(window.innerWidth - card.offsetWidth, left); // right edge
        top = Math.max(0, top); // top edge
        top = Math.min(window.innerHeight - card.offsetHeight, top); // bottom edge

        card.style.left = left + 'px';
        card.style.top  = top + 'px';
    });
});

/**
 * Returns the time passed since the given date.
 * @param {Date} date - The date to compare.
 */
function timePassed(date) {
    let now = new Date()
    let diff = now - new Date(date)
    let seconds = Math.floor(diff / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    let months = Math.floor(days / 30)
    let years = Math.floor(months / 12)
    if (years > 0) return `${years} years ago`
    if (months > 0) return `${months} months ago`
    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    if (seconds > 0) return `${seconds} seconds ago`
    return "just now"
}

// every 1min update the time passed
setInterval(() => {
    document.querySelectorAll(".cardDate").forEach(date => {
        date.textContent = timePassed(date.dataset.date)
    })
}, 60000)

function saveCard(i) {
    let cards = loadCardsData()
    cards[i] = { ...cards[i], body: document.querySelector(`.card[data-id='${i}'] .card-body-text`).textContent, title: document.querySelector(`.card[data-id='${i}'] .card-header-text`).value, position: { x: document.querySelector(`.card[data-id='${i}']`).style.left, y: document.querySelector(`.card[data-id='${i}']`).style.top }, zIndex: document.querySelector(`.card[data-id='${i}']`).style.zIndex}
    saveCardsData(cards)

}

function deleteCard(i) {
    let cards = loadCardsData()
    cards.splice(i, 1)
    saveCardsData(cards)
    loadCards()
}

function loadCards() {
    // clear the container
    cardsContainer.innerHTML = ""
    let cards = loadCardsData()
    if (!cards.length > 0) return
    cards.forEach((card, i) => createCard(card, i))
}

function addCard() {
    let cards = loadCardsData()
    cards.push({ title: "", body: "", color: "red", pinned: false, date: new Date() })
    saveCardsData(cards)
    createCard(cards[cards.length - 1], cards.length - 1)
}

// createCard({
//     title: 'My Note',
//     body: 'This is a note.',
//     color: 'red',
//     pinned: false,
//     date: new Date()
// }, 0);

loadCards()

document.getElementById("addCard").addEventListener("click", addCard)


