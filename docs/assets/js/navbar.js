const backgroundImages = new Map();
backgroundImages.set("home", "./docs/assets/img/patterned/home.JPG");
backgroundImages.set("bio", "./docs/assets/img/patterned/bio6.jpg");
backgroundImages.set("proj", "./docs/assets/img/patterned/proj.JPG");
backgroundImages.set("sols", "./docs/assets/img/patterned/sols.jpg");
backgroundImages.set("contact", "./docs/assets/img/patterned/contact.JPG");

backgroundImages.set("proj_tree", "./docs/assets/img/patterned/home.JPG");
backgroundImages.set("proj_diplo", "./docs/assets/img/patterned/proj.JPG");
backgroundImages.set("proj_thesis", "./docs/assets/img/patterned/proj_thesis.png");
backgroundImages.set("proj_waam", "./docs/assets/img/patterned/proj_waam.jpg");
backgroundImages.set("proj_furniture", "./docs/assets/img/patterned/sols.jpg");

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

function loadProject(proj, pushState = true) {
  fetch(`./${proj}.htm`)
    .then(r => r.text())
    .then(html => {

      // Change inner HTML
      document.getElementById('project-frame').innerHTML = html;

      // Change background
      resetImg(backgroundImages.get(proj));

      if (pushState) {
        history.pushState("/proj/", { proj }, "", `${proj}`);
        addImgClickListeners(); // Add listener for image maximisation
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