const params = new URLSearchParams(window.location.search);

const newToken = params.get("token");

if (newToken) {
  localStorage.setItem("token", newToken);

  window.history.replaceState({}, document.title, window.location.pathname);
}

let currentPage=1;
const rowsperPage=5;


window.addEventListener("DOMContentLoaded", load);

const descriptionInput = document.getElementById("description");
descriptionInput.addEventListener("blur", getCategoryFromAI);

async function load(page=1) {
  try {
    const token = localStorage.getItem("token");
    currentPage=page

    const response1 = await fetch(
      "http://localhost:4500/expense/premium-status",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const data1 = await response1.json();

    if (data1.isPremiumUser) {
      document.getElementById("paymentGateway").style.display = "none";

      document.getElementById("leaderboardBtn").style.display = "block";
      document.getElementById("downloadBtn").style.display = "block";
    }

    const parentElement = document.getElementById("listofExpenses");
    parentElement.innerHTML = "";

    const response = await fetch("http://localhost:4500/expense/getexpense", {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    data.response.forEach((expense) => {
      addExpensetoUI(expense);
    });
  } catch (err) {
    console.log(err);
  }
}

function addExpensetoUI(detail) {
  const parentElement = document.getElementById("listofExpenses");

  const li = document.createElement("li");

  li.textContent = `${detail.expenseamount} - ${detail.description} - ${detail.category}`;

  const deleted = document.createElement("button");
  deleted.innerHTML = "Delete Expense";

  deleted.addEventListener("click", (event) => deleteExpense(event, detail.id));

  li.appendChild(deleted);

  parentElement.appendChild(li);
}

async function deleteExpense(event, expenseId) {
  try {
    const token = localStorage.getItem("token");

    console.log("Deleting ID:", expenseId);

    const response = await fetch(
      `http://localhost:4500/expense/delete/${expenseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );

    const data = await response.json();

    console.log(data);

    if (response.ok && data.success) {
      event.target.parentElement.remove();
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function handleExpense(event) {
  event.preventDefault();

  const expenseamount = event.target.expenseamount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  if (!expenseamount || !description || !category) {
    console.log("Empty values not allowed");
    return;
  }

  const ExpenseDetails = {
    expenseamount,
    description,
    category,
  };
  console.log(ExpenseDetails);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:4500/expense/addexpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(ExpenseDetails),
    });

    const data = await response.json();

    if (response.ok && data.response) {
      addExpensetoUI(data.response);
      event.target.reset();
    } else {
      console.log("Failed to save expense");
    }
  } catch (err) {
    console.log(err.message);
  }
}

document.getElementById("paymentGateway").addEventListener("click", payment);

function payment() {
  console.log("button clicked");
  // alert("Do you want to be a Premium User")

  const result = confirm("Do you proceed with Payment?");
  if (result) {
    alert("User clicked Yes");
    window.location.href = "../../BackEnd/views/index.html";
  } else {
    alert("User clicked No");
  }
}

document
  .getElementById("leaderboardBtn")
  .addEventListener("click", leaderBoard);

async function leaderBoard() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:4500/expense/showleaderboard",
    {
      headers: {
        Authorization: token,
      },
    },
  );
  const data = await response.json();
  console.log(data);
  const boardLeader = document.getElementById("boardleader");
  boardLeader.style.display = "block";

  boardLeader.innerHTML = "<h3>🏆 Leaderboard</h3>";

  data.forEach((user) => {
    boardLeader.innerHTML += `
    
      <div class="leaderboard-item">
            <span>${user.username}</span>
           <span>₹${user.totalExpense || 0}</span>
      </div>

   `;
  });
}

async function getCategoryFromAI() {
  console.log("AI function started");

  const description = document.getElementById("description").value;

  if (description.trim() == "") {
    console.log("Description is empty");
    return;
  }

  try {
    console.log("Sending request...");
    const response = await fetch("http://localhost:4500/expense/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: description,
      }),
    });
    console.log("Status:", response.status);

    const data = await response.json();
    console.log("AI Response:", data);

    document.getElementById("category").value = data.response.trim();
  } catch (err) {
    console.log("ERROR:", err);
  }
}

document
  .getElementById("downloadBtn")
  .addEventListener("click", downloadExpense);

async function downloadExpense() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:4500/expense/download", {
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();
  // window.location.href=data.fileURL

  console.log(data);

  const csv = ["Amount,Description,Category"];

  data.forEach((expense) => {
    csv.push(
      `${expense.expenseamount},${expense.description},${expense.category}`,
    );
  });

  const csvData = csv.join("\n");

  const blob = new Blob([csvData], {
    type: "text/csv",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "expenses.csv";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}
