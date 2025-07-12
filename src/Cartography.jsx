// import { createFlow, assemble, Territory, Cartography } from './framework/index.js';

// // Create the main territory
// const appTerritory = new Territory();

// // Application Flows - using gerunds to reflect becoming and process
// appTerritory
//   .addFlow('tasking', createFlow([]))  // was taskRhizome - now reflects the process of tasking
//   .addFlow('writing', createFlow(""))  // was writingIntent - now reflects the process of writing
//   .addFlow('filtering', createFlow("all")); // was filterFlow - now reflects the process of filtering

// // Derive visible tasks from task and filter flows
// appTerritory.deal('appearing', ['tasking', 'filtering'], ([tasks, filter]) => {  // was visibleSlice - now reflects the process of appearing
//   if (filter === "done") return tasks.filter(t => t.done);
//   if (filter === "active") return tasks.filter(t => !t.done);
//   return tasks;
// });

// // Register assemblages (components)
// appTerritory.registerAssemblage('expressTask', (task) => {
//   return assemble('div', { className: "task" },
//     assemble('input', {
//       type: "checkbox",
//       checked: task.done,
//       onChange: () => {
//         task.done = !task.done;
//         appTerritory.getFlow('tasking').set([...appTerritory.getFlow('tasking').get()]);
//       }
//     }),
//     assemble('span', null, task.title),
//     assemble('button', {
//       onClick: () => {
//         appTerritory.getFlow('tasking').set(
//           appTerritory.getFlow('tasking').get().filter(t => t !== task)
//         );
//       }
//     }, "🗑")
//   );
// });

// appTerritory.registerAssemblage('intentionField', () => {
//   const writing = appTerritory.getFlow('writing');
//   const tasking = appTerritory.getFlow('tasking');

//   const input = assemble('input', {
//     placeholder: "What to do?",
//     className: "intention-field",
//     value: writing.get(),
//     onInput: e => writing.set(e.target.value),
//     onKeyDown: e => {
//       if (e.key === "Enter" && writing.get().trim()) {
//         const newTask = { title: writing.get().trim(), done: false };
//         tasking.set([...tasking.get(), newTask]);
//         writing.set("");
//       }
//     }
//   });

//   writing.cut(()=>{
//     input.value = writing.get();
//   });

//   return input;
// });

// appTerritory.registerAssemblage('modeSelector', () => {
//   const filtering = appTerritory.getFlow('filtering');

//   return assemble('div', { className: "mode-selector" },
//     ["all", "active", "done"].map(type =>
//       assemble('button', {
//         key: type,
//         onClick: () => filtering.set(type),
//         style: filtering.get() === type ? { fontWeight: "bold" } : {}
//       }, type)
//     )
//   );
// });

// // Main cartography function
// export default function mapTerritory() {
//   const mapper = new Cartography(appTerritory, "root");

//   const intentionField = appTerritory.getAssemblage('intentionField')();
//   const modeSelector = appTerritory.getAssemblage('modeSelector')();
//   const surface = mapper.createSurface("tasks");

//   // Connect the appearing flow to the surface
//   appTerritory.getFlow('appearing').cut(tasks => {
//     surface.innerHTML = "";
//     tasks.forEach(t => surface.append(appTerritory.getAssemblage('expressTask')(t)));
//   });

//   mapper.map(
//     assemble('div', null,
//       intentionField,
//       modeSelector,
//       surface
//     )
//   );
// }
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

// Create another derived flow for display formatting
// Shows how flows can transform and become other flows
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

// Assemblage for the increment button - creates territorial boundaries
appTerritory.registerAssemblage('incrementing', () => {
  const counting = appTerritory.getFlow('counting');

  return assemble('button', {
    onClick: () => counting.set(counting.get() + 1)
  }, 'Increment');
});

// Assemblage for the multiplier control - demonstrates flow manipulation
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