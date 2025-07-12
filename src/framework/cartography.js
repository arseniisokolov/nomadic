// Cartography - mapping territories to visual assemblages
// Based on Deleuze's concept of cartography as mapping

export class Cartography {
  constructor(territory, rootElement) {
    this.territory = territory;
    this.root = typeof rootElement === 'string'
      ? document.getElementById(rootElement)
      : rootElement;

    this.root.innerHTML = "";
  }

  // Map a territory to the DOM
  map(assemblage) {
    this.root.append(assemblage);
  }
  // Update the map when flows change
  update(flow, assemblage) {
    flow.cut(() => {
      this.root.append(assemblage);
    });
  }

  // Create a surface (container) for dynamic content
  createSurface(className = "") {
    const surface = document.createElement("div");
    surface.className = className;
    return surface;
  }
}