let mylibrary = [];
const openPopUpButton = document.querySelector('[data-open-button]')
const closePopUpButton = document.querySelector('[data-close-button]')
const overlay = document.getElementById('overlay')


openPopUpButton.addEventListener("click", () => {
    const popup = document.getElementById("popup")
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
    

}

function addBookToLibrary() {

}