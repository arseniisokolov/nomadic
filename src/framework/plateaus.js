// Plateau - organizing flows into domains and mapping them to visual assemblages
// Based on Deleuze's concept of plateaus - smooth spaces of becoming

import { createDeal } from './flows.js';
import { PlateauLogger } from './logger.js';

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

    // Initialize logger
    this.logger = new PlateauLogger(this);
    
    // Log initial state
    this.logger.logState();
  }

  // Add a flow to this plateau
  addFlow(name, flow) {
    this.flows[name] = flow;
    
    // Add logging to the flow
    this.logger.wrapFlowWithLogging(flow, name);
    
    this.logger.logFlowAdded(name);
    return this;
  }

  // Create a derived flow from existing flows
  deal(name, flowNames, assembler) {
    const selectedFlows = flowNames.map(name => this.flows[name]);
    this.flows[name] = createDeal(selectedFlows, assembler);
    
    // Add logging to the deal flow
    this.logger.wrapFlowWithLogging(this.flows[name], name);
    
    this.logger.logDealCreated(name);
    return this;
  }

  // Register an assemblage (component) in this plateau
  registerAssemblage(name, assemblage) {
    this.assemblages.set(name, assemblage);
    this.logger.logAssemblageRegistered(name);
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
  cartography(assemblage) {
    if (this.root) {
      this.root.append(assemblage);
    }
    this.logger.logCartography();
  }

  // Update the map when flows change
  update(flow, assemblage) {
    flow.cut(() => {
      if (this.root) {
        this.root.append(assemblage);
      }
      this.logger.logFlowChange('update');
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
    
    this.logger.logRootSet();
    return this;
  }

  // Enable/disable logging
  enableLogging(enabled = true) {
    this.logger.enable(enabled);
  }

  // Get current state snapshot
  getStateSnapshot() {
    return this.logger.getStateSnapshot();
  }
} 