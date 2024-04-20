const cardsContainer = document.getElementById("cards");

function loadCardsData(){
    let currentState = localStorage.getItem("notepocket")
    if(currentState){
        currentState = JSON.parse(currentState)
    }
    return currentState || []
}

function saveCardsData(data){
    localStorage.setItem("notepocket", JSON.stringify(data))
}

function createCard(card, i){
    console.log(card)
    const {title, body, color, pinned, date} = card
    let cardContainer = document.createElement("div")
    cardContainer.classList.add("card")
    cardContainer.classList.add(`bg-${color}`)
    cardContainer.dataset.id = i
    let cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    let cardBodyText = document.createElement("textarea")
    cardBodyText.textContent = body
    cardBodyText.addEventListener("input", (e) => saveCard(i))
    cardBody.appendChild(cardBodyText)

    let cardHeader = document.createElement("div")
    cardHeader.classList.add("card-header")
    
    let cardHeaderText = document.createElement("input")
    cardHeaderText.value = title
    cardHeaderText.addEventListener("input", (e) => saveCard(i))
    let cardHeaderOptions = document.createElement("div")
    let cardHeaderDelete = document.createElement("button")
    cardHeaderDelete.textContent = "Delete"

    let cardFooter = document.createElement("div")
    cardFooter.classList.add("card-footer")

    let cardDate = document.createElement("p")
    cardDate.textContent = new Date(date).toLocaleString() 

    cardContainer.appendChild(cardHeader)
    cardContainer.appendChild(cardBody)
    cardContainer.appendChild(cardFooter)

    cardHeader.appendChild(cardHeaderText)
    cardHeader.appendChild(cardHeaderOptions)
    cardHeaderOptions.appendChild(cardHeaderDelete)

    cardFooter.appendChild(cardDate)

    cardsContainer.appendChild(cardContainer)


}

function saveCard(i){
    let cards = loadCardsData()
    cards[i] = {...cards[i], body: document.querySelector(`.card[data-id='${i}'] textarea`).value, title: document.querySelector(`.card[data-id='${i}'] input`).value}
    saveCardsData(cards)

}

function deleteCard(i){
    let cards = loadCardsData()
    cards.splice(i, 1)
    saveCardsData(cards)
    // loadCards()
}

function loadCards(){
    let cards = loadCardsData()
    cards.forEach((card, i) => createCard(card, i))
}

loadCards()