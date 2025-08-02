// Rhizomatic Flow System with Multiple Flow Types
// Based on Deleuze's concept of flows and intensities

// Base Flow Class
class BaseFlow {
  constructor(initial) {
    this.value = initial;
    this.cuts = new Set();
  }

  get() {
    return this.value;
  }

  set(next) {
    this.value = next;
    this.cuts.forEach(fn => fn(this.value));
  }

  cut(fn) {
    this.cuts.add(fn);
    fn(this.value);
    return () => this.cuts.delete(fn);
  }
}

// Data Flow - for reactive data streams
export function createFlow(initial) {
  return new BaseFlow(initial);
}

// DOM Flow - for DOM manipulation
export function createDOMFlow(element, property = 'textContent') {
  const flow = new BaseFlow(element[property] || '');

  flow.set = function (next) {
    this.value = next;
    if (element && element[property] !== undefined) {
      element[property] = next;
    }
    this.cuts.forEach(fn => fn(this.value));
  };

  return flow;
}

// Event Flow - for event handling
export function createEventFlow() {
  const flow = new BaseFlow(null);

  // Add trigger method for events
  flow.trigger = function (event) {
    this.set(event);
  };

  return flow;
}

// Computed Flow - for derived values
export function createComputedFlow(dependencies, computeFn) {
  const flow = new BaseFlow(computeFn(dependencies.map(d => d.get())));

  dependencies.forEach(dep => {
    dep.cut(() => {
      flow.set(computeFn(dependencies.map(d => d.get())));
    });
  });

  return flow;
}

// Deal between flows (rhizomatic connections)
export function createDeal(flows, assembler) {
  const result = createFlow(assembler(flows.map(f => f.get())));

  flows.forEach(flow => {
    flow.cut(() => {
      result.set(assembler(flows.map(f => f.get())));
    });
  });

  return result;
}