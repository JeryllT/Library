let publishingDate = [];
let insertionDate = [];
const openPopUpButton = document.querySelector('[data-open-button-add]')
const closePopUpButton = document.querySelector('[data-close-button-add]')
const overlay = document.getElementById('overlay')
const form = document.getElementById('addBook');
const cardContainer = document.querySelector('[data-card-container]')
const orderDate = document.getElementById("orderDate")

openPopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    console.log(popup)
    openPopUp(popup)
})

closePopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    closePopUp(popup)
})

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
    if (orderDate.value === "iDate") orderBy("iDate")
    else orderBy("pDate")
    }
)

orderDate.addEventListener("change", e => orderBy(e.target.value))

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

function Book(title, author, pages, publishDate, status) {

    return {
        "Title": title,
        "Author": author,
        "Total Pages": pages,
        "Published Date": publishDate,
        "Read Status": status
    }
}

function addByPublishing(book) {
    const bookDate = new Date(book["Published Date"])
    console.log(publishingDate.length)

    if (publishingDate.length === 0 || bookDate >= new Date(publishingDate[publishingDate.length-1]["Published Date"])) {
        publishingDate.push(book)
    } 
    else if (publishingDate.length === 1) {
        if (bookDate <= new Date(publishingDate[0]["Published Date"])) publishingDate.splice(0, 0, book)
    }
    else {
        let i = 1;
        while (i < publishingDate.length) {
            if(bookDate >= new Date(publishingDate[i-1]["Published Date"]) 
            && bookDate <= new Date(publishingDate[i]["Published Date"])) {
                publishingDate.splice(i, 0, book)
                break
            }
            i++
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

function removeCard(book) {
    const closeButton = document.createElement("button")
    closeButton.classList.add("remove-card")
    closeButton.textContent = "x"

    closeButton.addEventListener("click", (e) => {
        const card = e.target.closest("[data-card-target]")
        console.log(card)
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
    
    card.classList.add("card")
    card.dataset.cardTarget = ""
    const removeButton = removeCard(book)
    
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

function orderBy(orderDateVal) {
    let newCards = []
    if (orderDateVal === "iDate") {
        if (insertionDate.length === 0) return
        for(i in insertionDate) {
            newCards.push(newCard(insertionDate[i]))
        }
    } else {
        if (publishingDate.length === 0) return
        for(i in publishingDate) {
            newCards.push(newCard(publishingDate[i]))
        }
    }
    cardContainer.replaceChildren(...newCards)    
}