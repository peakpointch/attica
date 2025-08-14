export function makeDocumentLinksExternal(): void {
  const documentLinks = document.querySelectorAll(`[data-link="external"] a`);
  documentLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
  });
}
