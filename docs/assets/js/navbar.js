const backgroundImages = new Map();
backgroundImages.set("home", "./assets/img/patterned/home.JPG");
backgroundImages.set("bio", "./assets/img/patterned/bio.png");
backgroundImages.set("proj", "./assets/img/patterned/proj.JPG");
backgroundImages.set("sols", "./assets/img/patterned/sols.png");
backgroundImages.set("contact", "./assets/img/patterned/contact.JPG");

backgroundImages.set("proj_tree", "./assets/img/patterned/home.JPG");
backgroundImages.set("proj_diplo", "./assets/img/patterned/proj.JPG");
backgroundImages.set("proj_thesis", "./assets/img/patterned/proj_thesis.png");
backgroundImages.set("proj_waam", "./assets/img/patterned/proj_waam.jpg");
backgroundImages.set("proj_furniture", "./assets/img/patterned/sols.png");
backgroundImages.set("proj_hygroscope", "./assets/img/patterned/proj_hygroscope.jpg");
backgroundImages.set("proj_hygroskin", "./assets/img/patterned/proj_hygroskin.jpg");
backgroundImages.set("proj_eyesing", "./assets/img/patterned/proj_eyesing.png");
backgroundImages.set("proj_wpf", "./assets/img/patterned/proj_wpf.JPG");
backgroundImages.set("proj_aef", "./assets/img/patterned/proj_aef.png");
backgroundImages.set("proj_hydra", "./assets/img/patterned/proj_hydra.jpg");
backgroundImages.set("proj_website", "./assets/img/patterned/proj_website.JPG");

var user = ["b", "o", "y", "a", "n"];
var domain = ["t", "h", "e", "k", "n", "o", "w", "d", "o", "u", "g", "h", ".", "c", "o", "m"];

var hydras = [];

function cleanupHydra() {
    // Remove all canvases
    var canvases = document.getElementsByClassName('hydra-canvas');
    while (canvases.length > 0) {
        const canvas = canvases[0];
        const gl = canvas.getContext('webgl');
        if (gl) {
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        }
        canvas.remove();
    }
    // Clear the hydras array
    while (hydras.length > 0) {
        hydras.pop();
    }
}

function loadPage(page, pushState = true) {
  cleanupHydra();
  fetch(`/pages/${page}.html`)
    .then(r => r.text())
    .then(html => {

      // Change inner HTML
      mainFrame = document.getElementById('main-frame')
      mainFrame.innerHTML = html;

      // Transform header
      window[`headerTransition${page.charAt(0).toUpperCase() + page.slice(1)}`]?.();

      // Change background
      resetImg(backgroundImages.get(page));

      // Initialize project filters
      requestAnimationFrame(() => {
        if (page == "proj"){
          initFilters();
        } else if (page == "contact"){
          document.getElementById("email").innerHTML = user.join("") + "@" + domain.join("");
        }
      });
      if (pushState) {
        history.pushState({ page }, "", `${page}`);
      }
    });
}

function loadProject(proj, pushState = true) {
  cleanupHydra();
  fetch(`/pages/${proj}.html`)
    .then(r => r.text())
    .then(html => {

      // Change inner HTML
      document.getElementById('project-frame').innerHTML = html;

      // Change background
      resetImg(backgroundImages.get(proj));

      // Initialize hydra visuals
      requestAnimationFrame(() => {
        if (proj == "proj_hydra"){
          loadHydraScripts();
        }
      });

      if (pushState) {
        history.pushState({ proj }, "", `${proj}`);
        addImgClickListeners(); // Add listener for image maximisation
      }
    });
}

window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    loadPage(e.state.page, false);
  }
  else if (e.state?.proj) {
    loadPage("proj", false);
    loadPage(e.state.proj, false);
  }
});

function getCurrentPage() {
  const path = window.location.pathname;
  if (path === "/" || path === "") return "home";
  return path.replace("/", "").replace(".html", "");
}

function initSPA() {

  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get("p");

  let page;

  if (redirectedPath) {
    page = redirectedPath.replace("/", "");
    history.replaceState({}, "", page);
  } else {
    page = getCurrentPage();
  }

  if (page.startsWith("proj_")) {
    loadPage("proj");
    loadProject(page);
  } else {
    loadPage(page);
  }
}

(function restoreRedirect() {
  const redirect = sessionStorage.getItem("redirect");

  if (redirect && redirect !== "/" && redirect !== window.location.pathname) {
    sessionStorage.removeItem("redirect");
    history.replaceState(null, "", redirect);
  }
})();

if (location.hostname !== "localhost") {
  const redirect = sessionStorage.getItem("redirect");
  if (redirect) {
    sessionStorage.removeItem("redirect");
    history.replaceState(null, "", redirect);
  }
}

initSPA();