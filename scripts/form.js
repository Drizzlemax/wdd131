new Date().getFullYear()
const currentyear = document.getElementById("currentyear").innerHTML = new Date().getFullYear();

let oLastModif = document.getElementById("lastModified").innerHTML = new Date(document.lastModified);

//////// form stuff. cooments to help recall in the future

let select = document.querySelector('#product');

const products = [
    {
        id: "fc-1888",
        name: "flux capacitor",
        averagerating: 4.5
    },
    {
        id: "fc-2050",
        name: "power laces",
        averagerating: 4.7
    },
    {
        id: "fs-1987",
        name: "time circuits",
        averagerating: 3.5
    },
    {
        id: "ac-2000",
        name: "low voltage reactor",
        averagerating: 3.9
    },
    {
        id: "jj-1969",
        name: "warp equalizer",
        averagerating: 5.0
    }
];

function addProduct() {
    // the page does not like when i remove i++
    for (let i = 0; i < products.length; i++) {
        let optnElem = document.createElement('option'); // create the new element
        // the option's textContent is the name key's value
        optnElem.textContent = products[i].name;
        optnElem.value = products[i].id; // 
        select.appendChild(optnElem); // add it to the parent which was given the variable name 'select' up there
    }
};

addProduct(); // give the function life

