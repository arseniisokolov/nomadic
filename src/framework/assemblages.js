// DOM Assemblage Constructor with JSX support
// Based on Deleuze's concept of assemblages - temporary configurations

export function assemble(type, props, ...children) {
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