import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { $ } from "./util.js";
import { bindCloud, unbindCloud } from "./settings.js";
import { initProfile, clearProfile, me, paintAvatar } from "./profile.js";
import "./pwa.js";

const TABS = ["personal", "community", "settings"];
const loaders = {
  community: () => import("./community.js"),
  settings: () => import("./settingsui.js")
};
const mods = {};
const load = (n) => mods[n] || (mods[n] = loaders[n]());

/* Œil du mot de passe */
$("eye").onclick = () => {
  const p = $("authPass"), show = p.type === "password";
  p.type = show ? "text" : "password";
  $("eye").textContent = show ? "🙈" : "👁";
  $("eye").setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe");
};

/* Onglets */
function show(tab) {
  if (!TABS.includes(tab)) tab = "personal";
  document.body.dataset.tab = tab;
  $("community").hidden = tab !== "community";
  $("settingsView").hidden = tab !== "settings";
  for (const b of $("dock").querySelectorAll("[data-tab]")) b.setAttribute("aria-selected", String(b.dataset.tab === tab));
  $("dock").style.setProperty("--i", TABS.indexOf(tab));
  try { localStorage.setItem("tc-tab", tab); } catch {}
  if (tab === "community") load("community").then((m) => m.start());
  if (tab === "settings") load("settings").then((m) => m.render());
}
$("dock").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tab]");
  if (b) show(b.dataset.tab);
});
$("dock").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const i = TABS.indexOf(document.body.dataset.tab) + (e.key === "ArrowRight" ? 1 : -1);
  show(TABS[(i + TABS.length) % TABS.length]);
  $("dock").querySelector('[aria-selected="true"]').focus();
});

/* Photo de profil sur l'icône Settings */
function dockAvatar() {
  const i = $("tabSettings").querySelector(".dav");
  i.hidden = !me.photo;
  $("tabSettings").classList.toggle("has-photo", !!me.photo);
  if (me.photo) paintAvatar(i, { photo: me.photo });
}
addEventListener("tc:profile", dockAvatar);

onAuthStateChanged(auth, async (user) => {
  $("dock").hidden = !user;
  if (user) {
    let tab = "personal";
    try { tab = localStorage.getItem("tc-tab") || "personal"; } catch {}
    show(tab);
    await Promise.all([bindCloud(user.uid), initProfile(user)]);
    (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => { load("community"); load("settings"); });
  } else {
    unbindCloud(); clearProfile();
    if (mods.community) mods.community.then((m) => m.stop());
    $("community").hidden = true; $("settingsView").hidden = true;
    document.body.dataset.tab = "personal";
  }
});
