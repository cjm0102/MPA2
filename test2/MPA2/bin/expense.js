$(document).ready(function() {
    // Initialize expenses array and check local storage
    window.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (expenses.length === 0) {
        console.log("Empty expenses array");
    } else {
        console.log("Loaded expenses:", expenses);
    }

    // Save to local storage function
    window.saveExpenses = function() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };

    // Add expense functionality
    $('#add-expense-form').on('submit', function(e) {
        e.preventDefault();

        let amount = $('#amount').val();
        let date = $('#date').val();
        let category = $('#category').val();
        let description = $('#description').val();

        let newExpense = { amount, date, category, description };

        expenses.push(newExpense);
        saveExpenses();
        
        alert('Expense added successfully!');
        this.reset();

        if (window.location.pathname.includes('index.html')) {
            renderExpenses();
        }
    });

    // Render all expenses grouped by date
    const renderExpenses = () => {
        let groupedExpenses = {};

        // Group expenses by date
        expenses.forEach(expense => {
            if (!groupedExpenses[expense.date]) {
                groupedExpenses[expense.date] = [];
            }
            groupedExpenses[expense.date].push(expense);
        });

        let $expenseRecords = $('#expense-records');
        $expenseRecords.empty();

        for (let date in groupedExpenses) {
            let $dateSection = $(`
                <div class="card mt-3">
                    <div class="card-header">
                        ${date}
                    </div>
                    <ul class="list-group list-group-flush"></ul>
                </div>
            `);

            groupedExpenses[date].forEach(expense => {
                $dateSection.find('.list-group').append(`
                    <li class="list-group-item">
                        ${expense.description}: $${expense.amount} - ${expense.category}
                    </li>
                `);
            });

            $expenseRecords.append($dateSection);
        }
    };

    // Render edit list
    const renderEditList = () => {
        $('#expense-list').empty();
        expenses.forEach((expense, index) => {
            $('#expense-list').append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <h5 class="card-title">${expense.description}</h5>
                        <p class="card-text">$${expense.amount} on ${expense.date} - ${expense.category}</p>
                        <button class="btn btn-primary edit-btn" data-index="${index}">Edit</button>
                    </div>
                </div>
            `);
        });

        $('.edit-btn').on('click', function() {
            let index = $(this).data('index');
            let expense = expenses[index];
            
            let newAmount = prompt("Enter new amount:", expense.amount);
            let newDate = prompt("Enter new date:", expense.date);
            let newCategory = prompt("Enter new category:", expense.category);
            let newDescription = prompt("Enter new description:", expense.description);

            if (newAmount && newDate && newCategory && newDescription) {
                expenses[index] = { amount: newAmount, date: newDate, category: newCategory, description: newDescription };
                saveExpenses();
                alert("Expense updated successfully!");
                renderEditList();
            }
        });
    };

    // Render delete list
    const renderDeleteList = () => {
        $('#delete-expense-list').empty();
        expenses.forEach((expense, index) => {
            $('#delete-expense-list').append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <h5 class="card-title">${expense.description}</h5>
                        <p class="card-text">$${expense.amount} on ${expense.date} - ${expense.category}</p>
                        <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `);
        });

        $('.delete-btn').on('click', function() {
            let index = $(this).data('index');
            expenses.splice(index, 1);
            saveExpenses();
            alert("Expense deleted successfully!");
            renderDeleteList();
        });
    };

    // Render summary
    const renderSummary = () => {
        let total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        $('#expense-summary').html(`<p>Total Expenses: $${total.toFixed(2)}</p>`);
    };

    // Run functions based on the current page
    if (window.location.pathname.includes('index.html')) {
        renderExpenses();
    }

    if (window.location.pathname.includes('edit.html')) {
        renderEditList();
    }

    if (window.location.pathname.includes('delete.html')) {
        renderDeleteList();
    }

    if (window.location.pathname.includes('summary.html')) {
        renderSummary();
    }
});
