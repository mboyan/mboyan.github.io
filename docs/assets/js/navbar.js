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
backgroundImages.set("proj_hygroscope", "./docs/assets/img/patterned/proj_hygroscope.jpg");
backgroundImages.set("proj_hygroskin", "./docs/assets/img/patterned/proj_hygroskin.jpg");
backgroundImages.set("proj_eyesing", "./docs/assets/img/patterned/proj_eyesing.png");
backgroundImages.set("proj_wpf", "./docs/assets/img/patterned/proj_wpf.JPG");
backgroundImages.set("proj_aef", "./docs/assets/img/patterned/proj_aef.jpg");
backgroundImages.set("proj_hydra", "./docs/assets/img/patterned/proj_hydra.jpg");
backgroundImages.set("proj_website", "./docs/assets/img/patterned/proj_website.JPG");

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
  // var canvases = document.getElementsByClassName('hydra-canvas');
  // console.log(canvases.length);
  // while (canvases.length > 0) {
  //     canvases[0].remove();
  // }
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
        } else if (page == "contact"){
          document.getElementById("email").innerHTML = user.join("") + "@" + domain.join("");
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
  cleanupHydra();
  // var canvases = document.getElementsByClassName('hydra-canvas');
  // console.log(canvases.length);
  // while (canvases.length > 0) {
  //     canvases[0].remove();
  // }
  fetch(`./${proj}.htm`)
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
  if (page.startsWith("proj_")) {
    loadPage("proj");
    loadProject(page);
  } else {
    loadPage(page);
  }
}

initSPA();