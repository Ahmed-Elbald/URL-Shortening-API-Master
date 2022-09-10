
// Getting elements form the document
const mainHeader = document.querySelector(".main-header");
const navToggleBtn = document.querySelector(".nav-toggle-btn");
const mainNav = document.getElementById("main-nav");

const urlFormContainer = document.querySelector(".l-form-container");
const urlForm = urlFormContainer.querySelector(".l-form-container .form");
const urlInputContainer = urlForm.querySelector(".url-input-container");
const urlInput = urlForm.querySelector("#url-input");

const urlsContainer = document.querySelector(".urls");

// Positioning the urlFormContainer
positionFormContainer();
window.addEventListener("resize", () => positionFormContainer());

function positionFormContainer() {
  let urlFormHeight = urlForm.clientHeight;
  urlFormContainer.style.
    setProperty("--url-form-height", urlFormHeight + "px");
}

// The Nav
navToggleBtn.addEventListener("click", () => {

  mainNav.classList.toggle("js-open");
  if (navToggleBtn.getAttribute("aria-expanded") == "true") {
    navToggleBtn.setAttribute("aria-expanded", "false");
    mainHeader.style.position = "absolute";
  } else {
    navToggleBtn.setAttribute("aria-expanded", "true");
    mainHeader.style.position = "fixed";
  }

});

// The URLs Form
urlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let originalUrl = urlInput.value;
  if (originalUrl == "") {
    invalidInput(true);
    return;
  }

  getShortUrl(originalUrl).then(
    (response) => response.json()
  ).then(
    (response) => {
      if (response.ok === true) {
        let generatedUrl = response.result.short_link;
        setNewUrl(originalUrl, generatedUrl);
        invalidInput(false);
      } else {
        invalidInput(true);
      }
    }
  )
});

function invalidInput(state) {
  if (state === true) {
    urlInputContainer.classList.add("js-invalid-input");
  } else {
    urlInputContainer.classList.remove("js-invalid-input");
  }
}

async function getShortUrl(originalUrl) {

  return fetch(`https://api.shrtco.de/v2/shorten?url=${originalUrl}`);

}

function setNewUrl(originalUrl, generatedUrl) {

  let urlMarkup = `
  <p class="original-url">
    ${originalUrl}
  </p>
  <div class="separator">
    <p class="generated-url">
      ${generatedUrl}
    </p>
    <button class="c-main-btn copy-btn">
      Copy
    </button>
  </div>
  `
  let urlContainer = document.createElement("div");
  urlContainer.innerHTML = urlMarkup;
  urlContainer.className = "l-url-container";

  urlContainer.querySelector(".copy-btn")
    .addEventListener("click", (e) => copyToClipboard(e.target));

  urlsContainer.insertAdjacentElement("afterbegin", urlContainer);
  setTimeout(() => urlContainer.classList.add("js-expand"), 100);

}

function copyToClipboard(btn) {

  btn.classList.add("js-copied");
  btn.textContent = "Copied!"
  let url = btn.previousElementSibling.textContent;
  navigator.clipboard.writeText(url);

}