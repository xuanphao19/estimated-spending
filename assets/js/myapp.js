document.addEventListener("DOMContentLoaded", function () {
  const totalBudget = 3300000000;
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const expenseList = $("#expense-list");
  const totalExpenses = $("#total-expenses");
  const totalIncome = $("#total-income");
  const addExpenseBtn = $("#add-expense");
  const expId = {
    "Giáo dục": "edu",
    "Xây dựng": "build",
    "Ăn uống": "eatdrink",
    "Đi lại": "travel",
    "Giải trí": "entertain",
    "Chi Khác": "other",
  };

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (!Array.isArray(expenses)) expenses = [];

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear() % 100;
    return `${day}/${month}/${year}`;
  }

  function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function renderExpenses() {
    let total = 0;
    Object.values(expId).forEach((id) => {
      $(`#${id}`).innerHTML = "";
    });
    expenses.forEach((expense, index) => {
      total += expense.amount;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.category} - ${expense.name}</span>
        <span class="total">
        <span class="money">${formatCurrency(expense.amount)}</span>
        <span class="date">Ngày: ${expense.date}</span>
        <button class="delete-btn" data-index="${index}">&times;</button></span>
      `;
      const expEl = $(`#${expId[expense.category]}`);
      if (expEl) expEl.appendChild(li);
    });

    totalExpenses.innerHTML = `
      <span>Total Spent:</span>
      <span>${formatCurrency(total)}</span>`;
    totalIncome.innerHTML = `
      <span>Total Remaining:</span>
      <span>${formatCurrency(totalBudget - total)}</span>`;
  }

  function addExpense() {
    const name = $("#expense-name").value.trim();
    const amount = parseFloat($("#expense-amount").value);
    const category = $("#expense-category").value;
    const existingError = $(".error-message");
    if (existingError) existingError.remove();

    if (!name || isNaN(amount) || amount <= 0) {
      const error = document.createElement("span");
      error.classList.add("error-message");
      error.innerHTML = `
          <span>Vui lòng nhập thông tin hợp lệ!</span>
          <span class="delete-error">&times;</span>`;
      $(".about").appendChild(error);

      const deleteErrorBtn = error.querySelector(".delete-error");
      deleteErrorBtn.addEventListener("click", () => {
        error.remove();
        if (!name) {
          $("#expense-name").focus();
        } else if (isNaN(amount) || amount <= 0) {
          $("#expense-amount").innerText = "";
          $("#expense-amount").focus();
        }
      });
      return;
    }

    const date = getCurrentDate();
    expenses.push({ name, amount, category, date });
    saveToLocalStorage();
    renderExpenses();
    $("#expense-name").value = "";
    $("#expense-amount").value = "";
  }

  function deleteExpense(index) {
    expenses.splice(index, 1);
    saveToLocalStorage();
    renderExpenses();
  }

  if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", addExpense);
  }

  expenseList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      deleteExpense(index);
    }
  });

  renderExpenses();
});
