# Nomadic Framework

**Nomadic** is a JavaScript framework inspired by postmodern philosophy that uses a rhizomatic approach instead of traditional tree structures.

## Core Concepts

### 🌊 **Flows**
Reactive data streams: data that automatically updates everything connected to it.

### 🔄 **Becomings**
Data transformations: process and transform data as it flows through your app.

### 🧩 **Assemblages**
Temporary UI configurations: can be disassembled and reassembled.

### 🗺️ **Territories**
Organized containers: groups related flows and assemblages together.

### 🗺️ **Cartography**
Rendering: maps your app structure to the actual DOM.

## Agile Advantages

Nomadic's flexible network structure makes it easy to **quickly redesign** (re-assemble) your interface. Unlike rigid tree structures, you can **rapidly iterate** by changing data flows anywhere without breaking the entire system.The framework's flexibility supports **responding to change** rather than following rigid plans.

## Quick Example

```javascript
import { createFlow, Territory, Cartography, assemble } from './framework';

// Create a territory - a domain that organizes flows and assemblages
const appTerritory = new Territory();

// Establish rhizomatic flows using gerunds to reflect processes of becoming
appTerritory.addFlow('counting', createFlow(0));
appTerritory.addFlow('multiplying', createFlow(1));

// Create a derived flow through rhizomatic connections (deal)
// This flow emerges from the interaction of multiple other flows
appTerritory.deal('computing', ['counting', 'multiplying'], ([count, mult]) => {
  return count * mult;
});

// Flows can transform and become other flows
appTerritory.deal('displaying', ['computing'], ([computed]) => {
  return `Result: ${computed}`;
});

// Register an assemblage - a temporary configuration that maps flows to visual elements
// This assemblage becomes-other when the computing flow changes
appTerritory.registerAssemblage('displayingComputed', () => {
  const computing = appTerritory.getFlow('computing');
  const displaying = appTerritory.getFlow('displaying');
  const displayingComputed = assemble('h2', null, displaying.get());

  // Cut into the flow to respond to changes (rhizomatic connection)
  computing.cut(() => {
    displayingComputed.textContent = displaying.get();
  });

  return displayingComputed;
});

// Assemblage for the increment button
appTerritory.registerAssemblage('incrementing', () => {
  const counting = appTerritory.getFlow('counting');

  return assemble('button', {
    onClick: () => counting.set(counting.get() + 1)
  }, 'Increment');
});

// Assemblage for the multiplier control
appTerritory.registerAssemblage('multiplyingControl', () => {
  const multiplying = appTerritory.getFlow('multiplying');

  return assemble('div', null,
    assemble('label', null, 'Multiplier: '),
    assemble('input', {
      type: 'number',
      value: multiplying.get(),
      onChange: (e) => multiplying.set(parseInt(e.target.value) || 1)
    })
  );
});

// Main assemblage that territorializes all controls into a unified configuration
appTerritory.registerAssemblage('advancedCounter', () => {
  return assemble('div', null,
    appTerritory.getAssemblage('displayingComputed')(),
    appTerritory.getAssemblage('incrementing')(),
    appTerritory.getAssemblage('multiplyingControl')()
  );
});

// Cartography function - maps the territory to visual assemblages
export default function mapTerritory() {
  const cartography = new Cartography(appTerritory, 'root');
  cartography.map(appTerritory.getAssemblage('advancedCounter')());
}
```

