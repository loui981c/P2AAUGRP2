//These are scripts for the index.ejs file

// makes the input invisible if nothing is done
document.getElementById("create-username").style.display = "none";
document.getElementById("username").style.display = "none";

function show(x) {
    if (x === 1) {
        document.getElementById("create-username").style.display = "inline-block";
        document.getElementById("createBut").style.background = "green";
        document.getElementById("createBut").style.color = "white";

        //make other input invisible
        document.getElementById("username").style.display = "none";

        //make nonactive button transparent
        document.getElementById("loginBut").style.background = "transparent";
        document.getElementById("loginBut").style.color = "green";
    }
    else {
        document.getElementById("username").style.display = "inline-block";
        document.getElementById("loginBut").style.background = "green";
        document.getElementById("loginBut").style.color = "white";

        //make other input invisible
        document.getElementById("create-username").style.display = "none";

        //make nonactive button transparent
        document.getElementById("createBut").style.background = "transparent";
        document.getElementById("createBut").style.color = "green";
    }
} 