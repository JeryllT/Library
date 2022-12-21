let mylibrary = [];
const openPopUpButton = document.querySelector('[data-open-button]')
const closePopUpButton = document.querySelector('[data-close-button]')
const overlay = document.getElementById('overlay')
const form = document.getElementById('addBook');
const cardContainer = document.querySelector('[data-card-container]')

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

function newCard(book) {
    const card = document.createElement("div")
    card.classList.add("card")
    for (const info in book) {
        if (info !== "Read Status") {
            const para = document.createElement("p")
            para.textContent = `${info}: ${book[info]}`
            card.appendChild(para)
        } else {
            console.log("hi")
            const status = addReadStatus(book[info])
            card.appendChild(status)
        }
    }
    return card
}

form.addEventListener("submit", e =>{
    e.preventDefault()
    const form = document.forms.addBook
    const book = new Book(
        form.elements[0].value,
        form.elements[1].value,
        form.elements[2].value,
        form.elements[3].value,
        form.elements[4].value, 
        )
    mylibrary.push(book)
    const card = newCard(book)
    cardContainer.appendChild(card)
    console.log(mylibrary)
    }
)

openPopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    console.log(popup)
    openPopUp(popup)
})

closePopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
    closePopUp(popup)
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

function Book(title, author, pages, publishDate, status) {
    return {
        "Title": title,
        "Author": author,
        "Total Pages": pages,
        "Published Date": publishDate,
        "Read Status": status
    }
}

function addBookToLibrary() {

}