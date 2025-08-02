import * as framework from '../../framework';
import { dom } from '../../dom';

// Create a plateau - a domain that organizes flows and assemblages
const appPlateau = new framework.Plateau();

// Establish rhizomatic flows using different flow types
appPlateau.addFlow('counting', framework.createFlow(0));
appPlateau.addFlow('multiplying', framework.createFlow(1));

// Create a computed flow that derives from other flows
appPlateau.deal('computing', ['counting', 'multiplying'], ([count, mult]) => {
  return count * mult;
});


// Create a derived flow through rhizomatic connections (deal)
// This flow emerges from the interaction of multiple other flows
appPlateau.deal('displaying', ['computing'], ([computed]) => {
  return `Result: ${computed}`;
});

// Create an event flow for user interactions
const clickEvent = framework.createEventFlow();
appPlateau.addFlow('clicking', clickEvent);

// Register an assemblage that unites flows - demonstrates flow assemblage
appPlateau.registerAssemblage('displayingComputed', () => {
  const computing = appPlateau.getFlow('computing');
  const displaying = appPlateau.getFlow('displaying');

  // Create a DOM assemblage that unites the display flow with a DOM element
  const displayElement = dom('h2', null, displaying.get());

  return framework.createDOMAssemblage(displayElement, {
    text: displaying
  }).element;

  // Cut into the flow to respond to changes (rhizomatic connection)
  // computing.cut(() => {
  //   displayAssemblage.update();
  // });
});

// Assemblage for the increment button - creates plateau boundaries
appPlateau.registerAssemblage('incrementing', () => {
  const counting = appPlateau.getFlow('counting');

  return dom('button', {
    onClick: () => counting.set(counting.get() + 1)
  }, 'Increment');
});

// Assemblage for the multiplier control - demonstrates flow manipulation
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

// Assemblage that demonstrates DOM flow integration
appPlateau.registerAssemblage('domFlowExample', () => {
  // Create a DOM element
  const counterElement = dom('div', { className: 'counter-display' }, '0');

  return framework.createDOMAssemblage(counterElement, {
    text: appPlateau.getFlow('counting')
  }).element;
});

// Assemblage that demonstrates event flow integration
appPlateau.registerAssemblage('eventFlowExample', () => {
  const clicking = appPlateau.getFlow('clicking');

  const eventButton = dom('button', {
    onClick: (e) => clicking.trigger(e)
  }, 'Trigger Event');

  const eventDisplay = dom('div', { className: 'event-display' }, 'No events yet');

  appPlateau.deal('eventText', ['clicking'], ([clicking]) =>
    clicking ? `Last event: ${clicking.type}` : 'No events yet'
  )

  // Create a DOM assemblage for the event display
  const eventAssemblage = framework.createDOMAssemblage(eventDisplay, {
    text: appPlateau.getFlow('eventText')
  });

  return dom('div', null, eventButton, eventAssemblage.element);
});

// Main assemblage that territorializes all controls into a unified configuration
appPlateau.registerAssemblage('advancedCounter', () => {
  return dom('div', null,
    appPlateau.getAssemblage('displayingComputed')(),
    appPlateau.getAssemblage('incrementing')(),
    appPlateau.getAssemblage('multiplyingControl')(),
    appPlateau.getAssemblage('domFlowExample')(),
    appPlateau.getAssemblage('eventFlowExample')()
  );
});

// Plateau mapping function - maps the plateau to visual assemblages
export default function mapPlateau() {
  appPlateau.setRoot('root');
  appPlateau.cartography(appPlateau.getAssemblage('advancedCounter')());
}