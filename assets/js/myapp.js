document.addEventListener('DOMContentLoaded', function () {
  const totalBudget = 3300000000;
  const expenseList = document.getElementById('expense-list');
  const totalExpenses = document.getElementById('total-expenses');
  const totalIncome = document.getElementById('total-income');
  const addExpenseBtn = document.getElementById('add-expense');

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach((expense, index) => {
      total += expense.amount;
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${expense.category} - ${expense.name}</span>
        <span class="total">${formatCurrency(expense.amount)}</span>
        <button class="delete-btn" data-index="${index}">&times;</button>
      `;
      expenseList.appendChild(li);
    });

    totalExpenses.innerHTML = `<span>Total Spent:</span> <span>${formatCurrency(total)}</span>`;
    totalIncome.innerHTML = `<span>Total Remaining:</span> <span>${formatCurrency(totalBudget - total)}</span>`;
  }

  function addExpense() {
    const name = document.getElementById('expense-name').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    if (!name || isNaN(amount) || amount <= 0) {
      alert('Vui lòng nhập thông tin hợp lệ!');
      return;
    }

    const date = getCurrentDate();
    expenses.push({ name, amount, category, date });
    saveToLocalStorage();
    renderExpenses();

    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
  }

  function deleteExpense(index) {
    expenses.splice(index, 1);
    saveToLocalStorage();
    renderExpenses();
  }

  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', addExpense);
  }

  expenseList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.getAttribute('data-index');
      deleteExpense(index);
    }
  });

  renderExpenses();
});
