import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const REALTIME_DB = 'https://pwa-shopping-list-app-default-rtdb.europe-west1.firebasedatabase.app/'

const appSettings = {
    databaseURL: REALTIME_DB
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInRef = ref(database, "shopping-list")

const inputText = document.querySelector("#input-text")
const addBtn = document.querySelector("#add-btn")
const shoppingList = document.querySelector("#shopping-list")

// Function to append item to shopping list
const appendToShoppingList = (id, text) => {
    // shoppingList.innerHTML += `<li>${text}</li>`

    const li = document.createElement("li")
    li.textContent = text

    li.addEventListener("dblclick", function() {
        let locationInDb = ref(database, `shopping-list/${id}`)
        remove(locationInDb)
        console.log(id);
    })

    shoppingList.append(li)
}

// Function to reset input field
const reset = (text = false, list = false) => {
    if (text) {
        inputText.value = ""; // Reset the input field
    }

    if (list) {
        shoppingList.innerHTML = ""; // Reset content of ul
    }
}
// Attach event listener to add button
addBtn.addEventListener("click", (event) => {
    event.preventDefault()
    const text = inputText.value
    if (text.length > 0) {
        push(shoppingListInRef, text) // Upload data to database
        reset(true) // Reset input field
        console.log(text + " added to Database")
    }
})

// Attach event listener when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve data once when the page loads
    onValue(
        shoppingListInRef,
        (snapshot) => {
            if (snapshot.exists()) {
                reset(false, true); // Clear the shopping list before adding retrieved items
                snapshot.forEach((snap) => {
                    const text = snap.val(); // Retrieve the value from the snapshot
                    const id = snap.key;
                    appendToShoppingList(id, text);
                })
            } else {
                shoppingList.innerHTML = "No more items";
            }
        },
        (error) => {
            console.error("Error retrieving data:", error);
        }
    );
});
