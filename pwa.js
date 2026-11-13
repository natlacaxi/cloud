/* Installation de l'appli + service worker */
let deferred = null;
const root = document.documentElement;
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone;
if (standalone()) root.dataset.standalone = "1";

addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
addEventListener("appinstalled", () => { root.dataset.standalone = "1"; deferred = null; });

document.addEventListener("click", async (e) => {
  if (!e.target.closest("[data-install]")) return;
  if (deferred) {
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
  } else {
    alert("Pour installer TalcoCloud : ouvre le menu de ton navigateur (ou le bouton Partager sur iPhone), puis choisis « Ajouter à l’écran d’accueil » ou « Installer l’application ».");
  }
});

if ("serviceWorker" in navigator) {
  const reg = () => navigator.serviceWorker.register("sw.js").catch(() => {});
  document.readyState === "complete" ? reg() : addEventListener("load", reg);
}
