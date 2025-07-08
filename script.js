// Remova ou comente: const expenseForm = document.getElementById("expense-form");

const expenseInput = document.getElementById("expense-description"); // Atualizado para o ID do seu HTML
const amountInput = document.getElementById("expense-amount"); // Atualizado para o ID do seu HTML
const categoryInput = document.getElementById("expense-category"); // Atualizado para o ID do seu HTML

const incomeDescriptionInput = document.getElementById("income-description"); // Novo, para a entrada de renda
const incomeAmountInput = document.getElementById("amount-input"); // Usando o mesmo ID do seu HTML para o campo de valor da renda

const transactionList = document.getElementById("transaction-history"); // Atualizado para o ID do seu HTML
const totalExpense = document.getElementById("total-expenses"); // Atualizado para o ID do seu HTML
const totalIncome = document.getElementById("total-income"); // Já estava correto
const balance = document.getElementById("balance"); // Já estava correto

// Função para adicionar Receita (baseada no seu HTML)
function addIncome() {
  const description = incomeDescriptionInput.value.trim();
  const amount = parseFloat(incomeAmountInput.value.trim());
  const category = "Income"; // Categoria fixa para renda

  if (description === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid income description and amount.");
    return;
  }

  addTransaction(description, amount, category);
  showNotification("Income added successfully!");
  updateSummary();
  clearIncomeInputs(); // Nova função para limpar inputs de renda
}

// Função para adicionar Despesa (baseada no seu HTML)
function addExpense() {
  const description = expenseInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const category = categoryInput.value;

  if (description === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid expense description and amount.");
    return;
  }

  addTransaction(description, amount, category);
  showNotification("Expense added successfully!");
  updateSummary();
  clearExpenseInputs(); // Nova função para limpar inputs de despesa
}

// O restante do seu código (addTransaction, updateSummary, showNotification, removeTransaction, loadTransactions)
// pode permanecer em grande parte o mesmo, mas você precisará ajustar a renderização da tabela
// para incluir a coluna "Type" e a lógica de remoção/filtro se a "Type" for importante.

// Ajuste na função addTransaction para incluir o "Type" (Receita/Despesa) e o botão de exclusão
function addTransaction(description, amount, category) {
  const transaction = {
    description: description,
    amount: amount,
    category: category,
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  const transactionRow = document.createElement("tr");
  // Determina o tipo baseado na categoria
  const type = category === "Income" ? "Income" : "Expense";
  const amountDisplay = amount.toFixed(2); // Formata o valor

  transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amountDisplay}</td>
        <td>${type}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;
  transactionList.appendChild(transactionRow);

  transactionRow
    .querySelector(".delete-btn")
    .addEventListener("click", function () {
      transactionRow.remove();
      removeTransaction(transaction); // Certifique-se de que removeTransaction remove o item correto
      updateSummary();
    });
}

// Nova função para limpar os campos de entrada de renda
function clearIncomeInputs() {
  incomeDescriptionInput.value = "";
  incomeAmountInput.value = "";
}

// Nova função para limpar os campos de entrada de despesa
function clearExpenseInputs() {
  expenseInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Housing"; // Volta para a opção padrão
}

// Ajuste na função updateSummary para pegar os dados do localStorage e não da tabela
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  // Carrega as transações do localStorage para garantir que a soma seja precisa
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions.forEach(function (transaction) {
    if (transaction.category === "Income") {
      totalIncomes += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  totalExpense.textContent = totalExpenses.toFixed(2);
  totalIncome.textContent = totalIncomes.toFixed(2);

  const currentBalance = totalIncomes - totalExpenses;
  balance.textContent = currentBalance.toFixed(2);

  // Apply positive/negative class
  if (currentBalance >= 0) {
    balance.classList.remove("negative");
    balance.classList.add("positive");
  } else {
    balance.classList.remove("positive");
    balance.classList.add("negative");
  }
}

// Certifique-se de que a função removeTransaction está correta para remover do localStorage
function removeTransaction(transactionToRemove) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions = transactions.filter(function (transaction) {
    // Esta comparação precisa ser robusta para encontrar a transação correta.
    // Uma abordagem melhor seria dar a cada transação um ID único.
    // Por enquanto, esta funciona se os dados forem únicos o suficiente.
    return !(
      transaction.description === transactionToRemove.description &&
      transaction.amount === transactionToRemove.amount &&
      transaction.category === transactionToRemove.category
    );
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// A função loadTransactions precisa recarregar tudo para o HTML
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactionList.innerHTML = ""; // Limpa a lista antes de carregar
  transactions.forEach(function (transaction) {
    // Redefine a 'transactionRow' para criar uma nova linha para cada transação carregada
    const transactionRow = document.createElement("tr");
    const type = transaction.category === "Income" ? "Income" : "Expense";
    transactionRow.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${type}</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
    transactionList.appendChild(transactionRow);

    // Adiciona o event listener para o botão de exclusão
    transactionRow
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        transactionRow.remove();
        removeTransaction(transaction);
        updateSummary();
      });
  });

  updateSummary(); // Atualiza o resumo após carregar
}

// Adicione a função clearAll
function clearAll() {
  if (confirm("Are you sure you want to clear all transactions?")) {
    localStorage.removeItem("transactions");
    transactionList.innerHTML = ""; // Limpa a tabela
    updateSummary(); // Reseta os totais para zero
    showNotification("All transactions cleared!");
  }
}

// Chame loadTransactions quando a página carregar
window.addEventListener("load", loadTransactions);

// A linha abaixo não é mais necessária se você tem foco nos inputs específicos
// window.addEventListener("load", function () {
//   expenseInput.focus();
// });

// Funções de notificação, etc., permanecem as mesmas
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");

  setTimeout(function () {
    notification.classList.add("hidden");
  }, 2000); // Notification will disappear after 2 seconds
}
