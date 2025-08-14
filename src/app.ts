import { onReady } from "@xatom/core";
import { initNavAnimation } from "./modules/navbar";
import { makeDocumentLinksExternal } from "./modules/documents";

onReady(() => {
  initNavAnimation();
  makeDocumentLinksExternal();
});
