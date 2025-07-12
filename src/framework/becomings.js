// Becomings - transformations and mutations
// Based on Deleuze's concept of becoming

import { createFlow } from './flows.js';

export function becoming(flow, transformer) {
  const result = createFlow(transformer(flow.get()));
  
  flow.cut(() => {
    result.set(transformer(flow.get()));
  });
  
  return result;
}

// Becoming-other (transformation with side effects)
export function becomingOther(flow, transformer, sideEffect) {
  const result = createFlow(transformer(flow.get()));
  
  flow.cut(() => {
    const transformed = transformer(flow.get());
    result.set(transformed);
    sideEffect(transformed);
  });
  
  return result;
} 