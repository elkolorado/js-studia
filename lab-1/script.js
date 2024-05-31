
// the numbers of the fields to be created initially
const INIT_FIELDS = 3;


let bodyElement = document.querySelector("body");
let inputGroup = createElement({ tag: "div", className: "btn-group" });

// create the initial fields
;[...Array(INIT_FIELDS)].forEach(e => createCalculatedField());

// new calculated field button
let addNewElementBtn = createElement({ tag: "button", className: "btn", textContent: "Dodaj pole", id: "addElement", addEventListener: { type: "click", listener: createCalculatedField } });

// calculate button
let calculateBtn = createElement({ tag: "button", className: "btn", textContent: "Przelicz", id: "calculateElements", addEventListener: { type: "click", listener: calculateFields } });

/**
 * Creates a new calculated field.
 */
function createCalculatedField() {
    let container = createElement({ tag: "div", parent: inputGroup });
    let inputElement = createElement({ tag: "input", className: "form-input", parent: container, addEventListener: { type: "input", listener: calculateFields }});
    inputElement.type = "number";
    createElement({ tag: "button", className: "btnDelete", textContent: "usuń", parent: container, addEventListener: { type: "click", listener: () => {
        inputGroup.removeChild(container);
        document.querySelectorAll(".form-input").length == 1 && (document.querySelector(".btnDelete").disabled = true);
        calculateFields();
    } }});
    [...document.querySelectorAll(".btnDelete")].map(x => x.disabled = false);
}

/**
 * Calculates the values of the input fields and displays the results.
 */
function calculateFields() {
    let values = [...document.querySelectorAll(".form-input")].filter(x => x.value).map(e => +e.value);
    let sum = values.reduce((a, b) => a + b);
    let avg = sum / values.length;
    let min = Math.min(...values);
    let max = Math.max(...values);
    document.querySelector(".results") && bodyElement.removeChild(document.querySelector(".results"));
    let resultContainer = createElement({ tag: "div", className: "results" });
    createElement({ tag: "p", textContent: `Suma: ${sum}`, parent: resultContainer });
    createElement({ tag: "p", textContent: `Średnia: ${avg}`, parent: resultContainer });
    createElement({ tag: "p", textContent: `Min: ${min}`, parent: resultContainer });
    createElement({ tag: "p", textContent: `Max: ${max}`, parent: resultContainer });
}


/**
 * Creates a new HTML element and appends it to the specified parent element.
 * @param {Object} options - The options for creating the element.
 * @param {string} [options.tag="p"] - The tag name of the element.
 * @param {string} [options.className=""] - The class name of the element.
 * @param {string} [options.textContent=""] - The text content of the element.
 * @param {string} [options.id=""] - The id of the element.
 * @param {HTMLElement} [options.parent=bodyElement] - The parent element to append the new element to.
 * @returns {HTMLElement} The created element.
 */
function createElement({ tag = "p", className = "", textContent = "", id = "", parent = bodyElement, addEventListener = null }) {
    let element = document.createElement(tag);
    textContent && (element.textContent = textContent);
    className && element.classList.add(className);
    id && (element.id = id);
    parent.appendChild(element);
    addEventListener && element.addEventListener(addEventListener.type, addEventListener.listener);
    return element;
}