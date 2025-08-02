import * as framework from '../../framework';
import { dom } from '../../dom';

// Create a plateau - a domain that organizes flows and assemblages
const appPlateau = new framework.Plateau();

// Establish rhizomatic flows as processes (verbs, not nouns)
appPlateau.addFlow('storing', framework.createFlow([])); // storing todos
appPlateau.addFlow('filtering', framework.createFlow('all')); // filtering mode

// Create a computed flow for filtered items through rhizomatic connections
appPlateau.deal('showing', ['storing', 'filtering'], ([storing, filtering]) => {
  switch (filtering) {
    case 'active':
      return storing.filter(todo => !todo.completed);
    case 'completed':
      return storing.filter(todo => todo.completed);
    default:
      return storing;
  }
});

// Create a computed flow for counting items
appPlateau.deal('counting', ['storing'], ([storing]) => {
  const total = storing.length;
  const completed = storing.filter(todo => todo.completed).length;
  const active = total - completed;
  return { total, active, completed };
});

// Assemblage for the input field using DOM flow
appPlateau.registerAssemblage('inputting', () => {
  const storing = appPlateau.getFlow('storing');

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = e.target.querySelector('input');
    const text = inputElement.value.trim();
    if (text) {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false
      };
      storing.set([...storing.get(), newTodo]);
      // Clear the input by setting its value directly
      inputElement.value = '';
    }
  };

  const inputElement = dom('input', {
    type: 'text',
    placeholder: 'What needs to be done?',
    value: ''
  });

  // Create a DOM flow for the input element
  const inputFlow = framework.createDOMFlow(inputElement, 'value');
  
  // Add the input flow to the plateau
  appPlateau.addFlow('typing', inputFlow);

  return dom('form', { onSubmit: handleSubmit }, inputElement);
});

// Assemblage for individual todo items
appPlateau.registerAssemblage('displaying', (todo) => {
  const storing = appPlateau.getFlow('storing');

  const toggleComplete = () => {
    const updatedTodos = storing.get().map(t => 
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    storing.set(updatedTodos);
  };

  const deleteTodo = () => {
    const updatedTodos = storing.get().filter(t => t.id !== todo.id);
    storing.set(updatedTodos);
  };

  const taskElement = dom('div', { 
    className: `task ${todo.completed ? 'completed' : ''}` 
  },
    dom('input', {
      type: 'checkbox',
      checked: todo.completed,
      onChange: toggleComplete
    }),
    dom('span', null, todo.text),
    dom('button', { onClick: deleteTodo }, 'Delete')
  );

  return taskElement;
});

// Assemblage for the todo list
appPlateau.registerAssemblage('listing', () => {
  const showing = appPlateau.getFlow('showing');
  
  const listContainer = dom('div', { className: 'tasks' });
  
  // Function to rebuild the list
  const rebuildList = () => {
    listContainer.innerHTML = '';
    showing.get().forEach(todo => {
      const todoElement = appPlateau.getAssemblage('displaying')(todo);
      listContainer.appendChild(todoElement);
    });
  };
  
  // Connect the showing flow to rebuild the list
  showing.cut(rebuildList);
  
  // Initial build
  rebuildList();
  
  return listContainer;
});

// Assemblage for filter controls
appPlateau.registerAssemblage('controlling', () => {
  const filtering = appPlateau.getFlow('filtering');
  const counting = appPlateau.getFlow('counting');

  const setFilter = (mode) => {
    filtering.set(mode);
  };

  const controlsContainer = dom('div', { className: 'mode-selector' });
  
  // Function to rebuild the controls
  const rebuildControls = () => {
    const counts = counting.get();
    const currentFilter = filtering.get();
    
    controlsContainer.innerHTML = '';
    
    const buttons = [
      { mode: 'all', label: `All (${counts.total})` },
      { mode: 'active', label: `Active (${counts.active})` },
      { mode: 'completed', label: `Completed (${counts.completed})` }
    ];
    
    buttons.forEach(({ mode, label }) => {
      const button = dom('button', {
        onClick: () => setFilter(mode),
        style: currentFilter === mode ? 'font-weight:bold' : ''
      }, label);
      controlsContainer.appendChild(button);
    });
  };
  
  // Connect flows to rebuild controls
  filtering.cut(rebuildControls);
  counting.cut(rebuildControls);
  
  // Initial build
  rebuildControls();
  
  return controlsContainer;
});

// Assemblage for clear completed button
appPlateau.registerAssemblage('clearing', () => {
  const storing = appPlateau.getFlow('storing');
  const counting = appPlateau.getFlow('counting');

  const clearCompleted = () => {
    const activeTodos = storing.get().filter(todo => !todo.completed);
    storing.set(activeTodos);
  };

  const clearContainer = dom('div', { style: 'text-align: center; margin-top: 20px;' });
  
  // Function to rebuild the clear button
  const rebuildClearButton = () => {
    const counts = counting.get();
    
    clearContainer.innerHTML = '';
    
    if (counts.completed > 0) {
      const clearButton = dom('button', { onClick: clearCompleted }, 'Clear completed');
      clearContainer.appendChild(clearButton);
    }
  };
  
  // Connect the counting flow to rebuild the clear button
  counting.cut(rebuildClearButton);
  
  // Initial build
  rebuildClearButton();
  
  return clearContainer;
});

// Main assemblage that territorializes all controls into a unified configuration
appPlateau.registerAssemblage('todoApp', () => {
  return dom('div', { id: 'app' },
    dom('h1', null, 'Rhizomatic ToDo'),
    appPlateau.getAssemblage('inputting')(),
    appPlateau.getAssemblage('controlling')(),
    appPlateau.getAssemblage('listing')(),
    appPlateau.getAssemblage('clearing')(),
    dom('div', { className: 'philosophy-note' },
      'In the rhizome, every task is a node, every completion a line of flight.'
    )
  );
});

// Plateau mapping function - maps the plateau to visual assemblages
export default function mapPlateau() {
  appPlateau.setRoot('root');
  appPlateau.cartography(appPlateau.getAssemblage('todoApp')());
} 