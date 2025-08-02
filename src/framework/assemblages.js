// Based on Deleuze's concept of assemblages - temporary configurations that unite flows

// Create a DOM assemblage with flow integration
export function createDOMAssemblage(element, flows = {}) {
  const assemblage = {
    element,
    flows,
    update() {
      // Update DOM based on flow values
      Object.entries(this.flows).forEach(([key, flow]) => {
        if (key === 'text') {
          this.element.textContent = flow.get();
        } else if (key === 'html') {
          this.element.innerHTML = flow.get();
        } else if (key === 'className') {
          this.element.className = flow.get();
        } else if (key === 'style') {
          Object.assign(this.element.style, flow.get());
        } else if (key === 'attributes') {
          const attrs = flow.get();
          Object.entries(attrs).forEach(([attr, value]) => {
            this.element.setAttribute(attr, value);
          });
        }
      });
    }
  };
  
  // Connect all flows to assemblage updates
  Object.values(flows).forEach(flow => {
    flow.cut(() => assemblage.update());
  });
  
  return assemblage;
}