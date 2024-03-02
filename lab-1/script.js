
const INIT_FIELDS = 3;

let bodyElement = document.querySelector("body")
let inputGroup = createElement("div", "btn-group");
[...Array(INIT_FIELDS)].forEach(e => createCalculatedField())

let addNewElementBtn = createElement("button", "btn", "Dodaj pole", "addElement")
addNewElementBtn.addEventListener("click", () => createCalculatedField())

let calculateBtn = createElement("button", "btn", "Przelicz", "calculateElements")
calculateBtn.addEventListener("click", () => calculateFields())


function createElement(tag = "p", className = "", textContent = "", id = "", parent = bodyElement) {
    let element = document.createElement(tag);
    textContent && (element.textContent = textContent);
    className && element.classList.add(className);
    id && (element.id = id);
    parent.appendChild(element);
    return element
}

function createCalculatedField() {
    let container = createElement("div", "", "", "", inputGroup)
    console.log(container);
    let inputElement = createElement("input", "form-input", "", "", container)
    inputElement.type = "number"
    let deleteBtn = createElement("button", "btnDelete", "usuń", "", container)
    ;[...document.querySelectorAll(".btnDelete")].map(x => x.disabled = false)

    deleteBtn.addEventListener("click", () => {
        inputGroup.removeChild(container);
        document.querySelectorAll(".form-input").length == 1 && (document.querySelector(".btnDelete").disabled = true)
    })
    inputElement.addEventListener("input", () => calculateFields())
}

function calculateFields() {
    let values = [...document.querySelectorAll(".form-input")].map(e => +e.value)
    let sum = values.reduce((a, b) => a + b);
    let avg = sum / values.length;
    let min = Math.min(...values)
    let max = Math.max(...values)
    document.querySelector(".results") && bodyElement.removeChild(document.querySelector(".results"))
    let resultContainer = createElement("div", "results")
    createElement("p", "", `Suma: ${sum}`, "", resultContainer)
    createElement("p", "", `Średnia: ${avg}`, "", resultContainer)
    createElement("p", "", `Min: ${min}`, "", resultContainer)
    createElement("p", "", `Max: ${max}`, "", resultContainer)

}
