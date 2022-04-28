//These are scripts for the budget.ejs file

// set variables
document.getElementById("expense").style.display = 'none';
document.getElementById("income").style.display = 'none';

function show(x) {
    if (x == 1) {
        expense.style.display = "none";
        income.style.display = "block";
    }
    else {
        income.style.display = "none";
        expense.style.display = "block";
    }
} 