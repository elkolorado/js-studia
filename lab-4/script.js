const cardsContainer = document.getElementById("cards");

document.getElementById("toggleGrid").addEventListener("click", () => {
    cardsContainer.classList.toggle("cards-grid")
})

document.getElementById("addCard").addEventListener("click", addCard)

document.getElementById("search").addEventListener("keyup", (e) => {
    let cards = document.querySelectorAll(".card")
    cards.forEach(card => {
        card.classList.remove("d-none")
        // if the card's title, body, tags doesn't contain the search query, hide the card (get it by the data-id)
        let dataId = card.dataset.id
        let cardData = loadCardsData()[dataId]
        let searchQuery = e.target.value
        if (!cardData.title.toLowerCase().includes(searchQuery.toLowerCase()) && !cardData.body.toLowerCase().includes(searchQuery.toLowerCase()) && !cardData.tags.toLowerCase().includes(searchQuery.toLowerCase())) {
            card.classList.add("d-none")
        }

    })
})

let cardOrderIncrement = 0
let notificationTimeouts = [];

checkNotification();

window.addEventListener('resize', function () {
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
        card.style.top = top + 'px';
    });
});

// every 1min update the time passed
setInterval(() => {
    document.querySelectorAll(".cardDate").forEach(date => {
        date.textContent = timePassed(date.dataset.date)
    })
}, 60000)

loadCards()





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

//ask for permission to send notifications



function checkNotification() {
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            console.log("Notifications allowed");
            notify();
        } else {
            console.log("Notifications denied");
        }
    });
}

function notify() {
    clearNotifications();

    let cards = loadCardsData();
    cards.forEach((card, i) => {
        if (card.notificationDate) {
            let notificationDate = new Date(card.notificationDate);
            let currentDate = new Date();
            if (notificationDate > currentDate) {
                let timeToNotification = notificationDate - currentDate;
                let timeoutId = setTimeout(() => {
                    let notification = new Notification(card.title, {
                        body: card.body,
                        icon: 'https://via.placeholder.com/150',
                    });
                    notification.onclick = function () {
                        window.focus();
                        this.close();
                    }
                }, timeToNotification);
                notificationTimeouts.push(timeoutId);
            }
        }
    });
}

function clearNotifications() {
    notificationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    notificationTimeouts = [];
}

function createCard(card, i) {
    console.log(card)
    const { title, body, color, pinned, date, tags, notificationDate } = card
    let cardContainer = document.createElement("div")
    cardContainer.classList.add("card")

    // cardContainer.classList.add(`bg-${color}`)
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
    cardHeaderOptions.classList.add("card-header-options")
    let cardHeaderDelete = document.createElement("button")

    let cardNotificationDate = document.createElement("input")
    cardNotificationDate.type = "datetime-local"
    cardNotificationDate.value = notificationDate
    cardNotificationDate.classList.add("card-notification-date")
    cardNotificationDate.addEventListener("input", (e) => {
        saveCard(i)
        checkNotification();
    })
    cardHeaderOptions.appendChild(cardNotificationDate)
    let cardHeaderPin = document.createElement("button")

    cardHeaderPin.textContent = pinned ? "unpin" : "pin"
    cardHeaderPin.addEventListener("click", (e) => {
        card.pinned = !card.pinned
        cardHeaderPin.textContent = card.pinned ? "unpin" : "pin"
        saveCard(i)
        sortCards()
    })

    cardHeaderOptions.appendChild(cardHeaderPin)

    let cardHeaderColor = document.createElement("input")
    // cardHeaderColor.textContent = "color"
    cardHeaderColor.type = "color"
    cardHeaderColor.list = "presetColors"
    cardHeaderColor.value = // default color change from rgb(r, g, b) to #rrggbb
        color.match(/\d+/g).reduce((acc, val) => acc + (parseInt(val) < 16 ? "0" + parseInt(val).toString(16) : parseInt(val).toString(16)), "#")
    cardHeaderColor.classList.add("card-header-color")
    cardHeaderColor.addEventListener("input", (e) => {
        // let hsl = rgbToHsl(...e.target.value.match(/\d+/g))
        cardContainer.style.backgroundColor = `hsl(${hexToHSL(e.target.value).h}, 100%, 90%)`
        cardContainer.style.border = "5px solid " + e.target.value


        saveCard(i)
    })
    cardHeaderColor.select()
    cardContainer.style.backgroundColor = `hsl(${hexToHSL(cardHeaderColor.value).h}, 100%, 90%)`
    cardContainer.style.border = "5px solid " + cardHeaderColor.value



    cardHeaderOptions.appendChild(cardHeaderColor)
    cardHeaderDelete.textContent = "del"
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
    cardContainer.appendChild(cardHeaderOptions)
    cardHeaderOptions.appendChild(cardHeaderDelete)

    cardFooter.appendChild(cardDate)

    let cardTagsContainer = document.createElement("input")
    cardTagsContainer.type = "text"
    cardTagsContainer.value = tags
    cardTagsContainer.addEventListener("input", (e) => saveCard(i))
    cardTagsContainer.classList.add("card-tags")
    cardFooter.appendChild(cardTagsContainer)


    cardsContainer.appendChild(cardContainer)

    cardContainer.style.position = 'absolute'; // make the card's position absolute

    let mousePosition;
    let offset = [0, 0];
    let isDown = false;

    cardContainer.addEventListener('mousedown', function (e) {
        //if the card is pinned, don't allow it to be moved
        if (card.pinned) return
        isDown = true;
        offset = [
            cardContainer.offsetLeft - e.clientX,
            cardContainer.offsetTop - e.clientY
        ];
        cardOrderIncrement++
        cardContainer.style.zIndex = cardOrderIncrement
    }, true);

    document.addEventListener('mouseup', function () {
        if (card.pinned) return

        isDown = false;
        saveCard(i)
    }, true);

    document.addEventListener('mousemove', function (event) {
        if (card.pinned) return

        event.preventDefault();
        if (isDown) {
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            let newLeft = mousePosition.x + offset[0];
            let newTop = mousePosition.y + offset[1];

            // Ensure the card doesn't move outside the viewport
            newLeft = Math.max(0, newLeft); // left edge
            newLeft = Math.min(window.innerWidth - cardContainer.offsetWidth, newLeft); // right edge
            newTop = Math.max(0, newTop); // top edge
            newTop = Math.min(window.innerHeight - cardContainer.offsetHeight, newTop); // bottom edge

            cardContainer.style.left = newLeft + 'px';
            cardContainer.style.top = newTop + 'px';
        }
    }, true);
}
// Convert RGB to HSL
function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
}

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

function saveCard(i) {
    let cards = loadCardsData()
    cards[i] = {
        ...cards[i],
        color: document.querySelector(`.card[data-id='${i}']`).style.borderColor,
        body: document.querySelector(`.card[data-id='${i}'] .card-body-text`).textContent,
        title: document.querySelector(`.card[data-id='${i}'] .card-header-text`).value,
        position: { x: document.querySelector(`.card[data-id='${i}']`).style.left, y: document.querySelector(`.card[data-id='${i}']`).style.top },
        zIndex: document.querySelector(`.card[data-id='${i}']`).style.zIndex,
        pinned: document.querySelector(`.card[data-id='${i}'] .card-header-options button`).textContent == "unpin" ? true : false,
        tags: document.querySelector(`.card[data-id='${i}'] .card-tags`).value,
        notificationDate: document.querySelector(`.card[data-id='${i}'] .card-notification-date`).value
    }
    console.log(cards)
    saveCardsData(cards)

}

function deleteCard(i) {
    let cards = loadCardsData()
    cards.splice(i, 1)
    saveCardsData(cards)
    loadCards()
    //clear the notifications
    checkNotification();
}

function loadCards() {
    // clear the container
    cardsContainer.innerHTML = ""
    let cards = loadCardsData()
    if (!cards.length > 0) return


    cards.forEach((card, i) => createCard(card, i))
    sortCards()
}

function addCard() {
    let cards = loadCardsData()
    cards.push({ title: "", body: "", color: "rgb(39, 196, 86)", pinned: false, date: new Date(), tags: "", notificationDate: "", position: { x: "0px", y: "70px" }, zIndex: 0 })
    saveCardsData(cards)
    createCard(cards[cards.length - 1], cards.length - 1)
}
//function to sort the cards by getting the data-id and sorting them by the pinned and then by date 
function sortCards() {
    let cards = document.querySelectorAll(".card")
    let sortedCards = Array.from(cards).sort((a, b) => {
        let cardA = loadCardsData()[a.dataset.id]
        let cardB = loadCardsData()[b.dataset.id]
        if (cardA.pinned && !cardB.pinned) return -1
        if (cardB.pinned && !cardA.pinned) return 1
        return new Date(cardB.date) - new Date(cardA.date)
    })
    cardsContainer.innerHTML = ""
    sortedCards.forEach(card => {
        cardsContainer.appendChild(card)
    })
}



