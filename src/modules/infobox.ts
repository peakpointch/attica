import { Modal } from "../../node_modules/peakflow/dist/modal/index";
import { createAttribute } from "../../node_modules/peakflow/dist/attributeselector/index";

function getInfobox(): Modal {
  const infoboxElement = Modal.select("component", "infobox");
  const infobox = new Modal(infoboxElement, {
    animation: {
      type: "slideUp",
      duration: 500,
    },
    bodyScroll: {
      lock: true,
      smooth: true,
    },
  });
  return infobox;
}

interface SetCookieOptions {
  name: string;
  value: string;
  days: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

function setCookie(options: SetCookieOptions): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + options.days * 24 * 60 * 60 * 1000);

  let cookie = `${encodeURIComponent(options.name)}=${encodeURIComponent(options.value)};`;
  cookie += `expires=${expires.toUTCString()};`;
  cookie += `path=${options.path || "/"};`;

  if (options.secure) cookie += "secure;";
  if (options.sameSite) cookie += ` SameSite=${options.sameSite};`;

  document.cookie = cookie;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

function getInfoboxWfItem(infobox: Modal): HTMLElement {
  return infobox.component.querySelector("[data-infobox-id]");
}

function getInfoboxSlug(infobox: Modal): string | null {
  const infoboxItem = getInfoboxWfItem(infobox);
  if (!infoboxItem) return null;
  const slug = infoboxItem.getAttribute("data-infobox-id");
  return slug;
}

function getInfoboxDays(infobox: Modal): number | null {
  const infoboxItem = getInfoboxWfItem(infobox);
  if (!infoboxItem) return null;
  const daysString = infoboxItem.getAttribute("data-infobox-days");
  if (!daysString) return null;
  return parseFloat(daysString);
}

function closeInfobox(infobox: Modal): void {
  const infoboxId = getInfoboxSlug(infobox) as string;
  setCookie({
    name: "infobox",
    value: infoboxId,
    days: getInfoboxDays(infobox) ?? 30,
  });
  infobox.close();
}

function attachInfoboxListeners(infobox: Modal): void {
  const closeButtons = infobox.selectAll("close");
  closeButtons.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => closeInfobox(infobox));
  });

  const openButtons = infobox.selectAll("open", false);
  openButtons.forEach((openBtn) => {
    openBtn.addEventListener("click", () => infobox.open());
  });
}

function hideOpenButton(
  button: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!button) throw new Error(`Please pass a navbar to animate.`);
  const buttons = button instanceof HTMLElement ? [button] : Array.from(button);
  buttons.forEach((button) => {
    gsap.to(button, {
      opacity: 0,
      translateY: "5rem",
      ease: "power1.out",
      duration: 0.2,
    });
  });
}

function showOpenButton(
  button: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!button) throw new Error(`Please pass a navbar to animate.`);
  const buttons = button instanceof HTMLElement ? [button] : Array.from(button);
  buttons.forEach((button) => {
    gsap.to(button, {
      opacity: 1,
      translateY: "0rem",
      ease: "power1.out",
      duration: 0.2,
    });
  });
}

export function initInfobox(): void {
  const infobox = getInfobox();
  const currentId = getInfoboxSlug(infobox);
  const openButtons = infobox.selectAll("open", false);
  if (!currentId) {
    // No infobox is published from webflow cms
    hideOpenButton(openButtons);
    return;
  } else {
    showOpenButton(openButtons);
  }

  attachInfoboxListeners(infobox);

  const lastClosedInfobox = getCookie("infobox");
  if (currentId === lastClosedInfobox) return;

  setTimeout(() => {
    infobox.open();
  }, 3000);
}
