import { onReady } from "@xatom/core";
import { initNavAnimation } from "./modules/navbar";
import { makeDocumentLinksExternal } from "./modules/documents";
import { initInfobox } from "./modules/infobox";

onReady(() => {
  initNavAnimation();
  makeDocumentLinksExternal();
  initInfobox();
});
