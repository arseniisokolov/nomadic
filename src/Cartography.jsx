import { createFlow, deal, jsx, Fragment, Territory, Cartography } from './framework/index.js';

// Create the main territory
const appTerritory = new Territory();

// Application Flows - using gerunds to reflect becoming and process
appTerritory
  .addFlow('tasking', createFlow([]))  // was taskRhizome - now reflects the process of tasking
  .addFlow('writing', createFlow(""))  // was writingIntent - now reflects the process of writing
  .addFlow('filtering', createFlow("all")); // was filterFlow - now reflects the process of filtering

// Derive visible tasks from task and filter flows
appTerritory.deal('appearing', ['tasking', 'filtering'], ([tasks, filter]) => {  // was visibleSlice - now reflects the process of appearing
  if (filter === "done") return tasks.filter(t => t.done);
  if (filter === "active") return tasks.filter(t => !t.done);
  return tasks;
});

// Register assemblages (components)
appTerritory.registerAssemblage('expressTask', (task) => {
  return jsx('div', { className: "task" },
    jsx('input', {
      type: "checkbox",
      checked: task.done,
      onChange: () => {
        task.done = !task.done;
        appTerritory.getFlow('tasking').set([...appTerritory.getFlow('tasking').get()]);
      }
    }),
    jsx('span', null, task.title),
    jsx('button', {
      onClick: () => {
        appTerritory.getFlow('tasking').set(
          appTerritory.getFlow('tasking').get().filter(t => t !== task)
        );
      }
    }, "🗑")
  );
});

appTerritory.registerAssemblage('intentionField', () => {
  const writing = appTerritory.getFlow('writing');
  const tasking = appTerritory.getFlow('tasking');

  const input = jsx('input', {
    placeholder: "What to do?",
    className: "intention-field",
    value: writing.get(),
    onInput: e => writing.set(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && writing.get().trim()) {
        const newTask = { title: writing.get().trim(), done: false };
        tasking.set([...tasking.get(), newTask]);
        writing.set("");
      }
    }
  });
  
  writing.cut(()=>{
    input.value = writing.get();
  });
  
  return input;
});

appTerritory.registerAssemblage('modeSelector', () => {
  const filtering = appTerritory.getFlow('filtering');

  return jsx('div', { className: "mode-selector" },
    ["all", "active", "done"].map(type =>
      jsx('button', {
        key: type,
        onClick: () => filtering.set(type),
        style: filtering.get() === type ? { fontWeight: "bold" } : {}
      }, type)
    )
  );
});

// Main cartography function
export default function mapTerritory() {
  const mapper = new Cartography(appTerritory, "root");

  const intentionField = appTerritory.getAssemblage('intentionField')();
  const modeSelector = appTerritory.getAssemblage('modeSelector')();
  const surface = mapper.createSurface("tasks");

  // Connect the appearing flow to the surface
  appTerritory.getFlow('appearing').cut(tasks => {
    surface.innerHTML = "";
    tasks.forEach(t => surface.append(appTerritory.getAssemblage('expressTask')(t)));
  });

  mapper.map(
    jsx('div', null,
      intentionField,
      modeSelector,
      surface
    )
  );
}
