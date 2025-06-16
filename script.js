let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

let selectedDate = null;

const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const balanceEl = document.getElementById('balance');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  if (!description || isNaN(amount) || !date) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    date
  };

  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  form.reset();
  populateDateDropdown();
  renderExpenses();
});

function renderExpenses() {
  list.innerHTML = '';
  let total = 0;

  const filteredExpenses = selectedDate
    ? expenses.filter(e => e.date === selectedDate)
    : expenses;

  filteredExpenses.forEach(exp => {
    total += exp.amount;

    const li = document.createElement('li');
    li.className = `expense-item ${exp.amount >= 0 ? 'income' : 'expense'}`;

    const type = exp.amount >= 0 ? 'Income' : 'Expense';
    const symbol = exp.amount >= 0 ? '➕' : '➖';

    li.innerHTML = `
      <div>
        <strong>${symbol} ${type}</strong>: ${exp.description} - ${Math.abs(exp.amount)} RWF on ${exp.date}
      </div>
      <div>
        <button onclick="editExpense(${exp.id})">Edit</button>
        <button onclick="deleteExpense(${exp.id})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  balanceEl.textContent = total.toFixed(2);
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  populateDateDropdown();
}

function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;

  document.getElementById('description').value = exp.description;
  document.getElementById('amount').value = exp.amount;
  document.getElementById('date').value = exp.date;

  deleteExpense(id);
}

function populateDateDropdown() {
  const dropdown = document.getElementById('date-dropdown');
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">-- Show All --</option>';

  const uniqueDates = [...new Set(expenses.map(e => e.date))].sort();

  uniqueDates.forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    dropdown.appendChild(option);
  });
}

document.getElementById('filter-by-date').addEventListener('click', () => {
  selectedDate = document.getElementById('date-dropdown').value || null;
  renderExpenses();
});

document.getElementById('reset-filter').addEventListener('click', () => {
  selectedDate = null;
  document.getElementById('date-dropdown').value = '';
  renderExpenses();
});

// Initial render
populateDateDropdown();
renderExpenses();
