export const closeEngraving = () => {
    document
      .getElementById("engravingDrawerOverlay")
      .classList.remove("page-overlay_visible");
    document
      .getElementById("engravingDrawer")
      .classList.remove("aside_visible");
  };