function loadPage(page, pushState = true) {
  fetch(`./${page}.htm`)
    .then(r => r.text())
    .then(html => {
      document.getElementById('main-frame').innerHTML = html;
      if (pushState) {
        history.pushState({ page }, "", `${page}`);
      } else {
        console.log("foo");
      }
    });
}

window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    loadPage(e.state.page, false);
  }
});

function getCurrentPage() {
  const path = window.location.pathname;
  if (path === "/" || path === "") return "home";
  return path.replace("/", "").replace(".htm", "");
}

function initSPA() {
  const page = getCurrentPage();
  loadPage(page);
}

initSPA();

// window.onload = () => {
//     console.log("bonk");
//     loadPage("home", true)
// };

// Navigation bar URL changes
// function navigate(target){
//     history.pushState(null, '', target);
//     document.getElementById('main-frame').src = target;
// }

// // if (window.self === window.top) {
// //     // Not in an iframe, redirect or show the iframe version
// //     window.location.href = 'index.htm';
// // }

// history.replaceState("stateObj", "", "./home.htm");