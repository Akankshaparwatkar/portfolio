/**
 * Akanksha Parwatkar — Portfolio
 * Minimal shared script for case-study pages (mobile menu only).
 * Deliberately decoupled from script.js, which assumes index.html's exact
 * section structure (hero/work/about/contact) and would throw on pages
 * that don't have it.
 */
(() => {
  "use strict";

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }
})();
