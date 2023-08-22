const totalBalance = document.getElementById("totalBalance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const historyList = document.getElementById("historyList");

// Get form references
const date = document.getElementById("date");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const transaction = document.getElementById("transaction");
const addBtn = document.getElementById("addBtn");

// Retrieve history from localStorage or initialize it if null
let history = JSON.parse(localStorage.getItem("history")) || [];

// Initial updates
updateHistory();
updateBalance();
createChart();

// Add event listener to the addBtn
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let obj = {
    date: date.value,
    text: text.value,
    amount: amount.value,
    transaction: transaction.value,
  };

  // Validate inputs
  if (obj.date === "" || obj.text === "" || obj.amount === "") {
    alert("Please enter all the fields.");
    return;
  }

  // Add the new entry to history
  history.push(obj);

  // Clear input fields
  date.value = "";
  text.value = "";
  amount.value = "";
  transaction.value = "income";

  // Update history, balance, and localStorage
  updateHistory();
  updateBalance();
  saveHistoryToLocalStorage();
  createChart();
});

// Function to delete an item from history
function deleteItem(index) {
  history.splice(index, 1);
  updateHistory();
  updateBalance();
  saveHistoryToLocalStorage();
  createChart();
}

// Function to edit an item in history
function editItem(index) {
  let obj = history[index];
  let newDate = prompt("Enter new date", obj.date);
  let newText = prompt("Enter new text", obj.text);
  let newAmount = prompt("Enter new amount", obj.amount);

  // Validate inputs
  if (newDate === "" || newText === "" || newAmount === "") {
    alert("Please enter all the fields.");
    return;
  }

  // Update the item with new values
  obj.date = newDate;
  obj.text = newText;
  obj.amount = newAmount;

  // Update history, balance, and localStorage
  updateHistory();
  updateBalance();
  saveHistoryToLocalStorage();
  createChart();
}

// Function to update the history
function updateHistory() {
  historyList.innerHTML = "";

  for (let i = 0; i < history.length; i++) {
    let obj = history[i];

    // Create a new list item
    let li = document.createElement("li");
    li.innerHTML = `<p>${obj.date}</p> <p>${obj.text}</p> <p>${obj.amount}</p> <div><button class="deleteBtn">Delete</button> <button class="editBtn">Edit</button></div>`;

    // Add appropriate class based on transaction type
    li.classList.add(obj.transaction === "income" ? "income" : "expense");

    // Set the border bottom style based on transaction type
  li.style.borderBottom =
  obj.transaction === "income"
    ? "2px solid var(--lightGreenColor)"
    : "2px solid var(--lightRedColor)";

       
    // Add the list item to the historyList
    
    historyList.appendChild(li);

    // Add event listeners to the buttons
    let deleteBtn = li.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", function () {
      deleteItem(i);
    });

    let editBtn = li.querySelector(".editBtn");
    editBtn.addEventListener("click", function () {
      editItem(i);
    });
  }
}

// Function to update the balance
function updateBalance() {
  let total = 0;
  let incomeTotal = 0;
  let expenseTotal = 0;

  for (let i = 0; i < history.length; i++) {
    let obj = history[i];
    let amount = Number(obj.amount);

    if (obj.transaction === "income") {
      incomeTotal += amount;
      total += amount;
    } else {
      expenseTotal += amount;
      total -= amount;
    }
  }

  // Update the balance values
  totalBalance.innerHTML = `₹${total}`;
  income.innerHTML = `₹${incomeTotal}`;
  expense.innerHTML = `₹${expenseTotal}`;

  // Set the color of totalBalance based on the sign of total
  totalBalance.style.color = total < 0 ? "red" : "green";
}

// Function to save history to localStorage
function saveHistoryToLocalStorage() {
  localStorage.setItem("history", JSON.stringify(history));
}

// Function to create the chart
function createChart() {
  const chartData = history.reduce(
    (data, obj) => {
      if (obj.transaction === "income") {
        data.income += Number(obj.amount);
      } else {
        data.expense += Number(obj.amount);
      }
      return data;
    },
    { income: 0, expense: 0 }
  );

  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Income vs Expense",
          data: [chartData.income, chartData.expense],
          backgroundColor: ["#8edfae", "#FF7A7A"],
          borderWidth: 1,
          barThickness: 50,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 50,
          bottom: 0,
        },
      },
    },
  });
}