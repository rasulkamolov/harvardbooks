document.addEventListener("DOMContentLoaded", () => {
    displayInventory();
    displayStatistics();
});

function addBook() {
    const bookName = document.getElementById("bookName").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (bookName && quantity) {
        let inventory = getInventory();
        if (inventory[bookName]) {
            inventory[bookName] += quantity;
        } else {
            inventory[bookName] = quantity;
        }
        saveInventory(inventory);
        recordStatistic('add', bookName, quantity);
        displayInventory();
        displayStatistics();
        clearForm();
    } else {
        alert("Please select a book level and enter quantity.");
    }
}

function sellBook() {
    const bookName = document.getElementById("bookName").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (bookName && quantity) {
        let inventory = getInventory();
        if (inventory[bookName] && inventory[bookName] >= quantity) {
            inventory[bookName] -= quantity;
            if (inventory[bookName] === 0) {
                delete inventory[bookName];
            }
            saveInventory(inventory);
            recordStatistic('sell', bookName, quantity);
            displayInventory();
            displayStatistics();
            clearForm();
        } else {
            alert("Not enough copies in inventory or book does not exist.");
        }
    } else {
        alert("Please select a book level and enter quantity.");
    }
}

function getInventory() {
    return JSON.parse(localStorage.getItem("inventory")) || {};
}

function saveInventory(inventory) {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function displayInventory() {
    const inventory = getInventory();
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";

    if (Object.keys(inventory).length === 0) {
        inventoryList.innerHTML = "<p>Inventory is empty.</p>";
    } else {
        const list = document.createElement("ul");
        for (const [book, quantity] of Object.entries(inventory)) {
            const listItem = document.createElement("li");
            listItem.textContent = `${book}: ${quantity}`;
            list.appendChild(listItem);
        }
        inventoryList.appendChild(list);
    }
}

function clearForm() {
    document.getElementById("bookName").value = "";
    document.getElementById("quantity").value = "";
}

function recordStatistic(action, bookName, quantity) {
    const statistics = getStatistics();
    const timestamp = new Date().toLocaleString();
    statistics.push({ action, bookName, quantity, timestamp });
    localStorage.setItem("statistics", JSON.stringify(statistics));
}

function getStatistics() {
    return JSON.parse(localStorage.getItem("statistics")) || [];
}

function displayStatistics() {
    const statistics = getStatistics();
    const statisticsList = document.getElementById("statisticsList");
    statisticsList.innerHTML = "";

    if (statistics.length === 0) {
        statisticsList.innerHTML = "<p>No statistics available.</p>";
    } else {
        const list = document.createElement("ul");
        statistics.forEach(stat => {
            const listItem = document.createElement("li");
            listItem.textContent = `${stat.timestamp} - ${stat.action === 'add' ? 'Added' : 'Sold'} ${stat.quantity} copies of "${stat.bookName}"`;
            list.appendChild(listItem);
        });
        statisticsList.appendChild(list);
    }
}
