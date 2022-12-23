let publishingDate = [];
let insertionDate = [];

const openPopUpButton = document.querySelector('[data-open-button-add]')
const closePopUpButton = document.querySelector('[data-close-button-add]')
const overlay = document.getElementById('overlay')
const form = document.getElementById('addBook');
const cardContainer = document.querySelector('[data-card-container]')
const orderDate = document.getElementById("orderDate")
const filter = document.getElementById("filterBy")
const readButtonOps = {"notRead":"Not Read", "inProg":"In-Progress", "read":"Read"}

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
    orderFilter()
    }
)

orderDate.addEventListener("change", () => orderFilter())
filter.addEventListener("change", () => orderFilter())

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
    const title = book["Title"]
    const author = book["Author"]

    console.log(title)
    console.log(author)
    
    for(i = 0; i < removeFrom.length; i++) {
        console.log(removeFrom[i])
        if (removeFrom[i]["Title"] === title && removeFrom[i]["Author"] === author) {
            removeFrom.splice(i, 1)
            return
        }
    }
}

function addReadStatus(book, card) {
    const readConDiv = document.createElement("div")
    const titleDiv = document.createElement("div")
    const readButtonForm = document.createElement("form")
    
    readConDiv.classList.add("read-status")
    titleDiv.textContent = "Read Status:"
    readButtonForm.classList.add("read-status-button")

    for (ops in readButtonOps) {
        const buttonInput = document.createElement("input")
        const divLabel = document.createElement("div")
        
        buttonInput.type = "radio"
        buttonInput.name = "radStatus"
        buttonInput.value = ops
        if (buttonInput.value === book["Read Status"]) {
            buttonInput.checked = true
        }

        divLabel.textContent = readButtonOps[ops]
        readButtonForm.appendChild(buttonInput)
        readButtonForm.appendChild(divLabel)
    }

    if (book["Read Status"] === "read") card.setAttribute("style", "background-color: black; color: white;")
    else if (book["Read Status"] === "inProg") card.setAttribute("style", "background-color: grey; color: white;")
    else card.setAttribute("style", "background-color: white; color: black;")

    readButtonForm.addEventListener("change", e => {
        if (e.target.value === "read") card.setAttribute("style", "background-color: black; color: white;")
        else if (e.target.value === "inProg") card.setAttribute("style", "background-color: grey; color: white;")
        else card.setAttribute("style", "background-color: white; color: black;")

        if (e.target.value !== filter.value && filter.value !== "all") cardContainer.removeChild(card)
        book["Read Status"] = e.target.value
    })

    readConDiv.appendChild(titleDiv)
    readConDiv.appendChild(readButtonForm)
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
            const status = addReadStatus(book, card)
            card.appendChild(status)
        }
    }
    return card
}

function orderFilter() {
    let newCards = []
    if (orderDate.value === "iDate") {
        if (insertionDate.length === 0) return
        for(i in insertionDate) {
            if (insertionDate[i]["Read Status"] === filter.value || filter.value === "all") newCards.push(newCard(insertionDate[i]))
        }
    } else {
        if (publishingDate.length === 0) return
        for(i in publishingDate) {
            if (publishingDate[i]["Read Status"] === filter.value || filter.value === "all") newCards.push(newCard(publishingDate[i]))
        }
    }
    cardContainer.replaceChildren(...newCards)    
}