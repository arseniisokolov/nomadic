// Plateau - organizing flows into domains and mapping them to visual assemblages
// Based on Deleuze's concept of plateaus - smooth spaces of becoming

import { createDeal } from './flows.js';

export class Plateau {
  constructor(flows = {}, rootElement = null) {
    this.flows = flows;
    this.assemblages = new Map();
    this.root = rootElement ? 
      (typeof rootElement === 'string' ? document.getElementById(rootElement) : rootElement) : 
      null;
    
    if (this.root) {
      this.root.innerHTML = "";
    }
  }

  // Add a flow to this plateau
  addFlow(name, flow) {
    this.flows[name] = flow;
    return this;
  }

  // Create a derived flow from existing flows
  deal(name, flowNames, assembler) {
    const selectedFlows = flowNames.map(name => this.flows[name]);
    this.flows[name] = createDeal(selectedFlows, assembler);
    return this;
  }

  // Register an assemblage (component) in this plateau
  registerAssemblage(name, assemblage) {
    this.assemblages.set(name, assemblage);
    return this;
  }

  // Get a flow from this plateau
  getFlow(name) {
    return this.flows[name];
  }

  // Get an assemblage from this plateau
  getAssemblage(name) {
    return this.assemblages.get(name);
  }

  // Map the plateau to the DOM
  map(assemblage) {
    if (this.root) {
      this.root.append(assemblage);
    }
  }

  // Update the map when flows change
  update(flow, assemblage) {
    flow.cut(() => {
      if (this.root) {
        this.root.append(assemblage);
      }
    });
  }

  // Create a surface (container) for dynamic content
  createSurface(className = "") {
    const surface = document.createElement("div");
    surface.className = className;
    return surface;
  }

  // Set the root element for mapping
  setRoot(rootElement) {
    this.root = typeof rootElement === 'string' ? 
      document.getElementById(rootElement) : 
      rootElement;
    
    if (this.root) {
      this.root.innerHTML = "";
    }
    return this;
  }
} 