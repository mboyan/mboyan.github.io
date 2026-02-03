const backgroundImages = new Map();
backgroundImages.set("home", "./docs/assets/img/patterned/awwp_01.JPG");
backgroundImages.set("bio", "./docs/assets/img/patterned/bio2.JPG");
backgroundImages.set("proj", "./docs/assets/img/patterned/awwp_01.JPG");
backgroundImages.set("sols", "./docs/assets/img/patterned/awwp_01.JPG");
backgroundImages.set("contact", "./docs/assets/img/patterned/awwp_01.JPG");

function loadPage(page, pushState = true) {
  fetch(`./${page}.htm`)
    .then(r => r.text())
    .then(html => {

      // Change inner HTML
      document.getElementById('main-frame').innerHTML = html;

      // Transform header
      window[`headerTransition${page.charAt(0).toUpperCase() + page.slice(1)}`]?.();

      // Change background
      resetImg(backgroundImages.get(page));

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