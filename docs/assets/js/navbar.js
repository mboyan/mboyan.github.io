// Navigation bar URL changes
function navigate(target){
    history.pushState(null, '', target);
    document.getElementById('main-iframe').src = target;
}

// if (window.self === window.top) {
//     // Not in an iframe, redirect or show the iframe version
//     window.location.href = 'index.htm';
// }

history.replaceState("stateObj", "", "./home.htm");