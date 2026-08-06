/* Get Out Now — GDPR consent-gated analytics + advertising (Consent Mode v2).
   Nothing tracking loads until the visitor explicitly accepts.
   Gates: GA4 (G-YGWQ56V91M) + Reddit Pixel (a2_esuiumc3gyib). */
(function () {
  var GA_ID = "G-YGWQ56V91M";
  var REDDIT_ID = "a2_esuiumc3gyib";
  var KEY = "gon-consent";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function loadGA() {
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function loadReddit() {
    if (window.__rdt_loaded) return;
    window.__rdt_loaded = true;
    (function (w, d) {
      if (!w.rdt) {
        var p = w.rdt = function () { p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments); };
        p.callQueue = [];
        var t = d.createElement("script");
        t.src = "https://www.redditstatic.com/ads/pixel.js"; t.async = true;
        var s = d.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(t, s);
      }
    })(window, document);
    window.rdt("init", REDDIT_ID);
    window.rdt("track", "PageVisit");
    (window.__rdt_extra || []).forEach(function (ev) { window.rdt("track", ev); });
  }

  function grant() {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
    loadGA();
    loadReddit();
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === "granted") { grant(); return; }
  if (choice === "denied") { return; }

  var L = {
    en: { m: "We use analytics and advertising cookies to understand traffic. They load only if you accept.", a: "Accept", d: "Decline" },
    es: { m: "Usamos cookies de análisis y publicidad para entender el tráfico. Solo se cargan si aceptas.", a: "Aceptar", d: "Rechazar" },
    fr: { m: "Nous utilisons des cookies d’analyse et de publicité pour comprendre le trafic. Ils ne se chargent qu’avec votre accord.", a: "Accepter", d: "Refuser" },
    pt: { m: "Usamos cookies de análise e publicidade para entender o tráfego. Só carregam se você aceitar.", a: "Aceitar", d: "Recusar" },
    ru: { m: "Мы используем аналитические и рекламные cookie, чтобы понимать трафик. Они загружаются только с вашего согласия.", a: "Принять", d: "Отклонить" },
    uk: { m: "Ми використовуємо аналітичні та рекламні файли cookie, щоб розуміти трафік. Вони завантажуються лише за вашої згоди.", a: "Прийняти", d: "Відхилити" },
    he: { m: "אנו משתמשים בעוגיות אנליטיקה ופרסום כדי להבין את התנועה. הן נטענות רק אם תאשרו.", a: "אישור", d: "דחייה" }
  };
  var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var t = L[lang] || L.en;

  var css = document.createElement("style");
  css.textContent =
    ".gon-cb{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#16304f;border-top:1px solid rgba(203,169,78,.5);" +
    "transform:translateY(110%);transition:transform .35s ease;box-shadow:0 -10px 30px rgba(0,0,0,.35)}" +
    ".gon-cb.show{transform:translateY(0)}" +
    ".gon-cb .in{max-width:1000px;margin:0 auto;padding:.95rem 1.1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:space-between}" +
    ".gon-cb p{margin:0;color:#F5F0E4;font-family:'Rubik',system-ui,sans-serif;font-size:.9rem;line-height:1.45;flex:1 1 320px}" +
    ".gon-cb .btns{display:flex;gap:.55rem;flex:0 0 auto}" +
    ".gon-cb button{font-family:'Rubik',system-ui,sans-serif;font-size:.85rem;font-weight:700;border-radius:8px;padding:.6rem 1.15rem;cursor:pointer;border:1px solid transparent}" +
    ".gon-cb .dec{background:transparent;color:#CBA94E;border-color:rgba(203,169,78,.55)}" +
    ".gon-cb .acc{background:#CBA94E;color:#0B1A2E}" +
    "[dir=rtl] .gon-cb .in{flex-direction:row-reverse}";
  document.head.appendChild(css);

  function build() {
    var b = document.createElement("div");
    b.className = "gon-cb";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Cookie notice");
    b.innerHTML = '<div class="in"><p>' + t.m + '</p><div class="btns">' +
      '<button class="dec" type="button">' + t.d + '</button>' +
      '<button class="acc" type="button">' + t.a + '</button></div></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add("show"); });
    function close() { b.classList.remove("show"); setTimeout(function () { b.remove(); }, 350); }
    b.querySelector(".acc").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "granted"); } catch (e) {}
      grant(); close();
    });
    b.querySelector(".dec").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "denied"); } catch (e) {}
      close();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
