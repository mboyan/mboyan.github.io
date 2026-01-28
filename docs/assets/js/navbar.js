function loadPage(page, pushState = true) {
  fetch(`./${page}.htm`)
    .then(r => r.text())
    .then(html => {
      document.getElementById('main-frame').innerHTML = html;
      // Transform header
      window[`headerTransition${page.charAt(0).toUpperCase() + page.slice(1)}`]?.();
      // Initialize project filters
      requestAnimationFrame(() => {
        if (page == "proj"){
          initFilters();
        }
      });
      if (pushState) {
        history.pushState({ page }, "", `${page}`);
      // } else {
      //   console.log("foo");
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