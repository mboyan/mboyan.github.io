// let engagementFilter = "all";
// let realisationFilter = "all";
// let disciplineFilter = "all";
let categoryFilters = ["all", "all", "all", "all"];
let categoryMapper = {"engagement": 0, "realisation": 1, "discipline": 2, "year": 3};

filterSelection(categoryFilters);

function changeFilter(filter, val) {
    if (filter == "engagement") {
        categoryFilters[0] = val;
    }
    else if (filter == "realisation") {
        categoryFilters[1] = val;
    }
    else if (filter == "discipline") {
        categoryFilters[2] = val;
    }
    else if (filter == "year") {
        categoryFilters[3] = val;
    }
    filterSelection(categoryFilters);
}

function filterSelection(catFilters) {
    var x, i;
    x = document.getElementsByClassName("filterDiv");
    console.log("===");

    let catFilterCodes = [];
    for (i = 0; i < catFilters.length; i++) {
        if (catFilters[i].indexOf("all") > -1) {
            catFilterCodes[i] = "";
        }
        else {
            catFilterCodes[i] = catFilters[i];
        }
    }

    console.log(catFilters);
    console.log(catFilterCodes);

    for (i = 0; i < x.length; i++) {
        removeClass(x[i], "show");
        if (catFilterCodes.every(code => x[i].className.includes(code))) {
            addClass(x[i], "show");
        }
        console.log(x[i].textContent + ": " + x[i].className);
    }
}

function addClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
}

function removeClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);     
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainers = document.getElementsByClassName("dropdown-filters");
for (var i = 0; i < btnContainers.length; i++) {
    var btns = btnContainers[i].getElementsByClassName("filter-btn");
    for (var j = 0; j < btns.length; j++) {
        // Add listener
        btns[j].addEventListener("click", function(){

            if (this.className.indexOf("active") > -1) {
                this.className = this.className.replace(" active", "");
            }
            else {
                this.className += " active";
            }

            // Deactivate other buttons in the same category
            var btnCategory = this.className.split(' ')[1];
            var others = document.getElementsByClassName(btnCategory);
            // console.log(others);
            for (const element of others) {
                if (element != this) {
                    element.className = element.className.replace(" active", "");
                }
            }
        });
    }
}

// Add listeners for filter resetting buttons
var dropContainers = document.getElementsByClassName("dropbtn");
for (var i = 0; i < dropContainers.length; i++) {
    dropContainers[i].addEventListener("click", function(){
        var btnCategory = this.className.split(' ')[1];

        btnCatAppend = " " + btnCategory;
        categoryFilters[categoryMapper[btnCategory]] = "all";

        var current = document.getElementsByClassName("active" + btnCatAppend);
        while (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
            changeFilter(btnCategory, "all");
        }
    });
}

var showallContainer = document.getElementById("showall");
showallContainer.addEventListener("click", function(){
    categoryFilters = ["all", "all", "all", "all"];
    var current = document.getElementsByClassName("active");
    console.log(current);
    while (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
    }
});