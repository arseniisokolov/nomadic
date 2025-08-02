# Nomadic Framework

**Nomadic** is a JavaScript framework inspired by postmodern philosophy that uses a rhizomatic approach instead of traditional tree structures.

## Core Concepts

### 🌊 **Flows**
Reactive data streams with multiple specialized types:
- **Data Flows**: Basic reactive data streams
- **DOM Flows**: Direct DOM element manipulation
- **Event Flows**: Event-driven reactive streams
- **Deals**: Rhizomatic connections between flows

### 🧩 **Assemblages**
Temporary UI configurations that unite flows with DOM elements. Can be disassembled and reassembled.

### 🗺️ **Plateaus**
Organized domains that group related flows and assemblages together. Each plateau is a smooth space where connections can be made and unmade freely.

## Agile Advantages

Nomadic's flexible network structure makes it easy to **quickly redesign** (re-assemble) your interface. Unlike rigid tree structures, you can **rapidly iterate** by changing data flows anywhere without breaking the entire system. The framework's flexibility supports **responding to change** rather than following rigid plans.

## Quick Example

```javascript
import { createFlow, createDOMFlow, createEventFlow, createComputedFlow, createDeal, Plateau } from './framework';
import { dom } from './dom';

// Create a plateau - a domain that organizes flows and assemblages
const appPlateau = new Plateau();

// Establish rhizomatic flows using different flow types
appPlateau.addFlow('counting', createFlow(0));
appPlateau.addFlow('multiplying', createFlow(1));

// Create a computed flow that derives from other flows
appPlateau.deal('computing', ['counting', 'multiplying'], ([count, mult]) => {
  return count * mult;
});

// Create a derived flow through rhizomatic connections (deal)
appPlateau.deal('displaying', ['computing'], ([computed]) => {
  return `Result: ${computed}`;
});

// Create an event flow for user interactions
const clickEvent = createEventFlow();
appPlateau.addFlow('clicking', clickEvent);

// Register an assemblage that unites flows with DOM elements
appPlateau.registerAssemblage('displayingComputed', () => {
  const displaying = appPlateau.getFlow('displaying');
  const displayElement = dom('h2', null, displaying.get());

  return createDOMAssemblage(displayElement, {
    text: displaying
  }).element;
});

// Assemblage for the increment button
appPlateau.registerAssemblage('incrementing', () => {
  const counting = appPlateau.getFlow('counting');

  return dom('button', {
    onClick: () => counting.set(counting.get() + 1)
  }, 'Increment');
});

// Assemblage for the multiplier control
appPlateau.registerAssemblage('multiplyingControl', () => {
  const multiplying = appPlateau.getFlow('multiplying');

  return dom('div', null,
    dom('label', null, 'Multiplier: '),
    dom('input', {
      type: 'number',
      value: multiplying.get(),
      onChange: (e) => multiplying.set(parseInt(e.target.value) || 1)
    })
  );
});

// Main assemblage that territorializes all controls
appPlateau.registerAssemblage('advancedCounter', () => {
  return dom('div', null,
    appPlateau.getAssemblage('displayingComputed')(),
    appPlateau.getAssemblage('incrementing')(),
    appPlateau.getAssemblage('multiplyingControl')()
  );
});

// Plateau mapping function - maps the plateau to visual assemblages
export default function mapPlateau() {
  appPlateau.setRoot('root');
  appPlateau.cartography(appPlateau.getAssemblage('advancedCounter')());
}
```

## Getting Started

### Installation

```bash
npm install
```

### Running Apps

The framework supports multiple apps that can be run individually:

```bash
# List available apps
npm run list-apps

# Start a specific app
npm run start-app <AppName>

# Examples:
npm run start-app CounterApp
npm run start-app TodoList
```

## Philosophy

Nomadic embraces the rhizomatic philosophy of Gilles Deleuze and Félix Guattari:

- **No hierarchical structures**: Everything is connected in a network
- **Becoming over being**: Focus on processes and transformations
- **Smooth spaces**: Plateaus allow free movement and connection
- **Assemblages**: Temporary configurations that can be disassembled and reassembled

This approach makes the framework particularly well-suited for rapid prototyping, iterative development, and applications that need to adapt quickly to changing requirements.

