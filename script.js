const JSON_FILE_PATH = 'data/inventory.json';

document.addEventListener("DOMContentLoaded", () => {
    fetchInventory();
    fetchStatistics();
});

async function fetchInventory() {
    try {
        const response = await fetch(JSON_FILE_PATH);
        const data = await response.json();
        displayInventory(data.inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
}

async function saveInventory(inventoryData) {
    try {
        const response = await fetch(JSON_FILE_PATH, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inventory: inventoryData })
        });
        if (response.ok) {
            console.log("Inventory saved successfully.");
        } else {
            console.error("Failed to save inventory.");
        }
    } catch (error) {
        console.error("Error saving inventory:", error);
    }
}

function addBook() {
    const bookName = document.getElementById("bookName").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (bookName && quantity) {
        let inventoryData = getInventoryData();
        if (inventoryData[bookName]) {
            inventoryData[bookName] += quantity;
        } else {
            inventoryData[bookName] = quantity;
        }
        saveInventory(inventoryData);
        recordStatistic('add', bookName, quantity);
        displayInventory(inventoryData);
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
        let inventoryData = getInventoryData();
        if (inventoryData[bookName] && inventoryData[bookName] >= quantity) {
            inventoryData[bookName] -= quantity;
            if (inventoryData[bookName] === 0) {
                delete inventoryData[bookName];
            }
            saveInventory(inventoryData);
            recordStatistic('sell', bookName, quantity);
            displayInventory(inventoryData);
            displayStatistics();
            clearForm();
        } else {
            alert("Not enough copies in inventory or book does not exist.");
        }
    } else {
        alert("Please select a book level and enter quantity.");
    }
}

function getInventoryData() {
    return fetch(JSON_FILE_PATH)
        .then(response => response.json())
        .then(data => data.inventory)
        .catch(error => {
            console.error("Error fetching inventory data:", error);
            return {};
        });
}

function displayInventory(inventory) {
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";

    if (inventory) {
        const list = document.createElement("ul");
        for (const [book, quantity] of Object.entries(inventory)) {
            const listItem = document.createElement("li");
            listItem.textContent = `${book}: ${quantity}`;
            list.appendChild(listItem);
        }
        inventoryList.appendChild(list);
    } else {
        inventoryList.innerHTML = "<p>Inventory is empty.</p>";
    }
}

function recordStatistic(action, bookName, quantity) {
    // Implement recording statistics if needed
}

function fetchStatistics() {
    // Implement fetching statistics if needed
}

function displayStatistics() {
    // Implement displaying statistics if needed
}

function clearForm() {
    document.getElementById("bookName").value = "";
    document.getElementById("quantity").value = "";
}
