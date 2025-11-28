export const openEngraving = () => {
  document
    .getElementById("engravingDrawerOverlay")
    .classList.add("page-overlay_visible");
  document.getElementById("engravingDrawer").classList.add("aside_visible");
};
