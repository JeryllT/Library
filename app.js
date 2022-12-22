let publishingDate = [];
let insertionDate = [];
const openPopUpButton = document.querySelector('[data-open-button-add]')
const closePopUpButton = document.querySelector('[data-close-button-add]')
const overlay = document.getElementById('overlay')
const form = document.getElementById('addBook');
const cardContainer = document.querySelector('[data-card-container]')
const orderDate = document.getElementById("orderDate")
let cardCounter = 0;

openPopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    console.log(popup)
    openPopUp(popup)
})

closePopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    closePopUp(popup)
})

function addByPublishing(book) {
    const bookDate = new Date(book["Published Date"])

    if (publishingDate.length === 0 || bookDate >= publishingDate[publishingDate.length-1]) {
        publishingDate.push(book)
    } 
    else if (publishingDate.length === 1) {
        if (bookDate <= new Date(publishingDate[0]["Published Date"])) publishingDate.splice(0, 0, book)
    }
    else {
        let i = 0;
        while (i < publishingDate.length-1) {
            if(bookDate >= new Date(publishingDate[i]["Published Date"]) 
            && bookDate <= new Date(publishingDate[i+1]["Published Date"])) {
                publishingDate.splice(i, 0, book)
                break
            }
        }
    }
}

function removeInsertion(book, removeFrom) {
    const title = book.title
    const author = book.author
    
    for(i = 0; i < removeFrom.length; i++) {
        if (i.title === title && i.author === author) {
            removeFrom.splice(i, 1)
            return
        }
    }
}

function Book(title, author, pages, publishDate, status) {

    return {
        "Title": title,
        "Author": author,
        "Total Pages": pages,
        "Published Date": publishDate,
        "Read Status": status
    }
}

function addReadStatus(status) {
    const readConDiv = document.createElement("div")
    const titleDiv = document.createElement("div")
    const readButtonDiv = document.createElement("div")
    const readButtonOps = {"read":"Read", "inProg":"In-Progress", "notRead":"Not Read"}
    
    readConDiv.classList.add("read-status")
    titleDiv.textContent = "Read Status:"
    readButtonDiv.classList.add("read-status-button")

    for (ops in readButtonOps) {
        const buttonInput = document.createElement("input")
        const divLabel = document.createElement("div")
        
        buttonInput.type = "radio"
        buttonInput.name = "radStatus"
        buttonInput.value = ops
        if (buttonInput.value === status) {
            buttonInput.checked = true
        }
        divLabel.textContent = readButtonOps[ops]
        readButtonDiv.appendChild(buttonInput)
        readButtonDiv.appendChild(divLabel)
    }

    readConDiv.appendChild(titleDiv)
    readConDiv.appendChild(readButtonDiv)
    return readConDiv
}

function removeCard(cardId, book) {
    const closeButton = document.createElement("button")
    closeButton.classList.add("remove-card")
    closeButton.textContent = "x"

    closeButton.addEventListener("click", () => {
        const card = document.getElementById(`card-${cardId}`)
        cardContainer.removeChild(card)
        removeInsertion(book, insertionDate)
        removeInsertion(book, publishingDate)
    })
    return closeButton
}

function clearForm(form) {
    Array.from(form.elements).forEach(e => {
        if (e.type !== "submit") {
            e.value = ""
        }
    })
}

function newCard(book) {
    const card = document.createElement("div")
    
    card.id = "card-" + cardCounter
    card.classList.add("card")

    const removeButton = removeCard(cardCounter, book)
    
    cardCounter++
    card.appendChild(removeButton)

    for (const info in book) {
        if (info !== "Read Status") {
            const para = document.createElement("p")
            para.textContent = `${info}: ${book[info]}`
            card.appendChild(para)
        } else {
            const status = addReadStatus(book[info])
            card.appendChild(status)
        }
    }
    return card
}

form.addEventListener("submit", e =>{
    e.preventDefault()
    const form = document.forms.addBook
    console.log(form.elements)
    const book = new Book(
        form.elements[0].value,
        form.elements[1].value,
        form.elements[2].value,
        form.elements[3].value,
        form.elements[4].value, 
        )
    clearForm(form)
    insertionDate.push(book)
    addByPublishing(book)
    const card = newCard(book)
    cardContainer.appendChild(card)
    }
)

orderDate.addEventListener("change", e => {
    let newCards = []
    if (e.target.value === "iDate") {
        if (insertionDate.length === 0) return
        for(i in insertionDate) {
            newCards.push(newCard(i))
        }
    } else {
        if (publishingDate.length === 0) return
        for(i in publishingDate) {
            newCards.push(newCard(i))
        }
    }
    cardContainer.replaceChildren(...newCards)
})

function openPopUp(popup) {
    if (popup == null) return
    popup.classList.add("active")
    overlay.classList.add("active")
}

function closePopUp(popup) {
    if (popup == null) return
    popup.classList.remove("active")
    overlay.classList.remove("active")
}