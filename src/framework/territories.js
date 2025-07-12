// Territorialization - organizing flows into domains
// Based on Deleuze's concept of territories

import { deal } from './flows.js';

export class Territory {
  constructor(flows = {}) {
    this.flows = flows;
    this.assemblages = new Map();
  }

  // Add a flow to this territory
  addFlow(name, flow) {
    this.flows[name] = flow;
    return this;
  }

  // Create a derived flow from existing flows
  deal(name, flowNames, assembler) {
    const selectedFlows = flowNames.map(name => this.flows[name]);
    this.flows[name] = deal(selectedFlows, assembler);
    return this;
  }

  // Register an assemblage (component) in this territory
  registerAssemblage(name, assemblage) {
    this.assemblages.set(name, assemblage);
    return this;
  }

  // Get a flow from this territory
  getFlow(name) {
    return this.flows[name];
  }

  // Get an assemblage from this territory
  getAssemblage(name) {
    return this.assemblages.get(name);
  }
} 