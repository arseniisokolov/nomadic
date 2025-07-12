// DOM Assemblage Constructor with Flow Integration
// Based on Deleuze's concept of assemblages - temporary configurations that unite flows

import { createDOMFlow, createEventFlow } from './flows.js';

export function dom(type, props, ...children) {
  // Handle function components (assemblages)
  if (typeof type === 'function') {
    return type(props);
  }

  // Handle string elements (DOM nodes)
  if (typeof type === 'string') {
    const node = document.createElement(type);
    
    // Handle props
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key.startsWith("on") && typeof value === "function") {
          // Handle event listeners
          const eventName = key.slice(2).toLowerCase();
          node.addEventListener(eventName, value);
        } else if (key === "checked" && typeof value === "boolean") {
          // Handle boolean attributes
          if (value) {
            node.setAttribute(key, "");
          }
        } else if (key === "className") {
          // Handle className (JSX standard)
          node.setAttribute("class", value);
        } else if (key === "style" && typeof value === "object") {
          // Handle style object
          Object.entries(value).forEach(([styleKey, styleValue]) => {
            node.style[styleKey] = styleValue;
          });
        } else if (value !== undefined && value !== null) {
          node.setAttribute(key, value);
        }
      });
    }
    
    // Handle children
    children.forEach(child => {
      if (Array.isArray(child)) {
        // If child is an array, append each element
        child.forEach(c => {
          if (typeof c === "string") {
            node.append(document.createTextNode(c));
          } else if (c) {
            node.append(c);
          }
        });
      } else if (typeof child === "string") {
        node.append(document.createTextNode(child));
      } else if (child) {
        node.append(child);
      }
    });
    
    return node;
  }
  
  return null;
}

// Create an assemblage that unites flows
export function createFlowAssemblage(flows, assemblageFn) {
  const assemblage = assemblageFn(flows);
  
  // Connect flows to assemblage updates
  flows.forEach(flow => {
    flow.cut(() => {
      if (assemblage && assemblage.update) {
        assemblage.update();
      }
    });
  });
  
  return assemblage;
}

// Create a DOM assemblage with flow integration
export function createDOMAssemblage(element, flows = {}) {
  const assemblage = {
    element,
    flows,
    update() {
      // Update DOM based on flow values
      Object.entries(this.flows).forEach(([key, flow]) => {
        if (key === 'text') {
          this.element.textContent = flow.get();
        } else if (key === 'html') {
          this.element.innerHTML = flow.get();
        } else if (key === 'className') {
          this.element.className = flow.get();
        } else if (key === 'style') {
          Object.assign(this.element.style, flow.get());
        } else if (key === 'attributes') {
          const attrs = flow.get();
          Object.entries(attrs).forEach(([attr, value]) => {
            this.element.setAttribute(attr, value);
          });
        }
      });
    }
  };
  
  // Connect all flows to assemblage updates
  Object.values(flows).forEach(flow => {
    flow.cut(() => assemblage.update());
  });
  
  return assemblage;
}

// Fragment support
export function Fragment(props) {
  const fragment = document.createDocumentFragment();
  
  if (props.children) {
    if (Array.isArray(props.children)) {
      props.children.forEach(child => {
        if (typeof child === "string") {
          fragment.append(document.createTextNode(child));
        } else if (child) {
          fragment.append(child);
        }
      });
    } else if (typeof props.children === "string") {
      fragment.append(document.createTextNode(props.children));
    } else if (props.children) {
      fragment.append(props.children);
    }
  }
  
  return fragment;
}