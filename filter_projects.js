// let engagementFilter = "all";
// let realisationFilter = "all";
// let disciplineFilter = "all";
let categoryFilters = ["all", "all", "all"];
let categoryMapper = {"engagement": 0, "realisation": 1, "discipline": 2};

filterSelection("all", "all", "all");

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
    
    // if (engagF.indexOf("all") > -1) engagF = "";
    // if (realF.indexOf("all") > -1) realF = "";
    // if (discipF.indexOf("all") > -1) discipF = "";

    console.log(catFilters);

    for (i = 0; i < x.length; i++) {
        removeClass(x[i], "show");
        if (x[i].className.indexOf(catFilterCodes[0]) > -1 && x[i].className.indexOf(catFilterCodes[1]) > -1 && x[i].className.indexOf(catFilterCodes[2]) > -1) {
            addClass(x[i], "show");
        }
        console.log(x[i].className);
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

            // Get button category
            // var btnCategory = this.className.split(' ')[1];
            
            // var current = document.getElementsByClassName("active");// + btnCategory);
            // console.log(current);
            
            // Reset active filters if "All" is clicked for respective category
            // if (this.className.indexOf("resetter") > -1) {
            //     while (current.length > 0) {
            //         current[0].className = current[0].className.replace(" active", "");
            //     }
            // }
            // else {
            //     var resetter = document.getElementsByClassName("resetter " + btnCategory);
            //     console.log(resetter);
            //     resetter[0].className = resetter[0].className.replace(" active", "");
            // }
            if (this.className.indexOf("active") > -1) {
                this.className.replace(" active", "");
            }
            else {
                this.className += " active";
            }
            
        });
    }
}

// Add listeners for filter resetting buttons
var dropContainers = document.getElementsByClassName("dropbtn");
for (var i = 0; i < dropContainers.length; i++) {
    dropContainers[i].addEventListener("click", function(){
        var btnCategory = this.className.split(' ')[1];

        if (btnCategory == "all") { // Show all
            btnCatAppend = "";
            categoryFilters = ["all", "all", "all"];
        }
        else {
            btnCatAppend = " " + btnCategory;
            categoryFilters[categoryMapper[btnCategory]] = "all";
        }

        var current = document.getElementsByClassName("active" + btnCatAppend);
        while (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
            if (btnCategory != "all") changeFilter(btnCategory, "all");
        }
    });
}