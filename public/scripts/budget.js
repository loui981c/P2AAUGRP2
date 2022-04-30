//These are scripts for the budget.ejs file

let toggle = false;
document.getElementById("expense").style.display = "block";
document.getElementById("income").style.display = "none";

let tempIncomeValue = document.getElementById("incomeTemp").value;

function sliderToggle() {

    toggle = !toggle;

    if (!toggle) {
        document.getElementById("toggleValue").value = "false";
        document.getElementById("expense").style.display = "block";
        document.getElementById("income").style.display = "none";

    } else {

        document.getElementById("toggleValue").value = "true";
        document.getElementById("expense").style.display = "none";
        document.getElementById("income").style.display = "block";

    }
    console.log(tempIncomeValue);
    console.log(toggle);

} 