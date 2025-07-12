// Rhizomatic Flow System
// Based on Deleuze's concept of flows and intensities

export function createFlow(initial) {
  let value = initial;
  const cuts = new Set();

  function get() {
    console.log("get", value);
    return value;
  }

  function set(next) {
    console.log("set",value, next);
    value = next;
    cuts.forEach(fn => fn(value));
  }

  function cut(fn) {
    cuts.add(fn);
    fn(value);
    return () => cuts.delete(fn);
  }

  return { get, set, cut };
}

// Deal between flows (rhizomatic connections)
export function deal(flows, assembler) {
  const result = createFlow(assembler(flows.map(f => f.get())));

  flows.forEach(flow => {
    flow.cut(() => {
      result.set(assembler(flows.map(f => f.get())));
    });
  });

  return result;
} 