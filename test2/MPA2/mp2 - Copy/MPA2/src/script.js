$(document).ready(function() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (expenses.length === 0) {
        console.log("Empty expenses array");
    } else {
        console.log("Loaded expenses:", expenses);
    }
    
    // Expose expenses to other scripts
    window.expenses = expenses;

    // Save to local storage function
    window.saveExpenses = function() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };
});
