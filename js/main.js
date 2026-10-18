// Open4D site — shared behaviors

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  const closeMenu = (restoreFocus = false) => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    const open = links.classList.contains("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("open")) closeMenu(true);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav") && links.classList.contains("open")) closeMenu();
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", () => closeMenu());
}

// Copy buttons on code blocks
const copyStatus = document.createElement("span");
copyStatus.className = "sr-only";
copyStatus.setAttribute("role", "status");
copyStatus.setAttribute("aria-live", "polite");
document.body.append(copyStatus);
document.querySelectorAll(".code-block").forEach((block) => {
  const btn = block.querySelector(".copy-btn");
  const pre = block.querySelector("pre");
  if (!btn || !pre) return;
  const label = block.querySelector(".code-head > span")?.textContent || "code";
  btn.type = "button";
  btn.setAttribute("aria-label", `Copy ${label}`);
  pre.tabIndex = 0;
  pre.setAttribute("role", "region");
  pre.setAttribute("aria-label", label);
  let timer;
  btn.addEventListener("click", async () => {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(pre.innerText);
      btn.textContent = "Copied!";
      copyStatus.textContent = `${label} copied.`;
      btn.classList.add("copied");
      timer = setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(pre);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      pre.focus();
      btn.textContent = "Code selected";
      copyStatus.textContent = "Automatic copy was unavailable. Code is selected; use your device's copy command.";
      timer = setTimeout(() => { btn.textContent = "Copy"; }, 4000);
    }
  });
});

// Scroll-reveal animation
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Docs sidebar: highlight the section currently in view
const sidebarLinks = document.querySelectorAll(".docs-sidebar a[href^='#']");
if (sidebarLinks.length && "IntersectionObserver" in window) {
  const map = new Map();
  sidebarLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) map.set(target, a);
  });
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sidebarLinks.forEach((a) => a.classList.remove("active"));
          sidebarLinks.forEach((a) => a.removeAttribute("aria-current"));
          const link = map.get(entry.target);
          if (link) {
            link.classList.add("active");
            link.setAttribute("aria-current", "location");
          }
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  map.forEach((_, target) => spy.observe(target));
}
