import { loadState, saveState } from "./core/store.js";
import { moduleContent } from "./modules/content.js";

const state = loadState();
const panel = document.querySelector("#panel");
const panelTitle = document.querySelector("#panelTitle");
const panelBody = document.querySelector("#panelBody");
const statusText = document.querySelector("#statusText");
const installBtn = document.querySelector("#installBtn");
let deferredPrompt = null;

function openModule(name) {
  const item = moduleContent[name] || moduleContent.home;
  state.activeModule = name;
  state.firstRun = false;
  saveState(state);

  panelTitle.textContent = item.title;
  panelBody.innerHTML = `<p>${item.body}</p>`;
  panel.classList.add("open");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.module === name);
  });

  statusText.textContent = `${item.title} فعال شد`;
}

document.querySelectorAll("[data-module]").forEach(el => {
  el.addEventListener("click", () => openModule(el.dataset.module));
});

document.querySelector("#closePanel").addEventListener("click", () => {
  panel.classList.remove("open");
});

document.querySelector("#enterBtn").addEventListener("click", () => {
  openModule(state.activeModule || "home");
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => statusText.textContent = "PWA آماده است")
      .catch(() => statusText.textContent = "حالت مرورگر فعال است");
  });
}
