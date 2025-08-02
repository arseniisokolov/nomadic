// Plateau Logger - handles logging for plateau state changes
// Based on Deleuze's concept of tracing and mapping

export class PlateauLogger {
  constructor(plateau) {
    this.plateau = plateau;
    this.enabled = true;
  }

  // Log the current state of the plateau
  logState(triggerFlow = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString();
    const state = {};
    
    // Collect all flow states
    Object.entries(this.plateau.flows).forEach(([name, flow]) => {
      try {
        state[name] = flow.get();
      } catch (error) {
        state[name] = `[Error: ${error.message}]`;
      }
    });
    
    // Create log message
    const logData = {
      timestamp,
      triggerFlow,
      plateauState: state,
      assemblageCount: this.plateau.assemblages.size,
      rootElement: this.plateau.root ? this.plateau.root.id || 'anonymous' : null
    };
    
    // Console output with styling
    console.group(`🔄 Plateau State Update ${triggerFlow ? `(triggered by: ${triggerFlow})` : ''}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log(`🎯 Trigger Flow: ${triggerFlow || 'initialization'}`);
    console.log(`📊 Assemblage Count: ${this.plateau.assemblages.size}`);
    console.log(`🌍 Root Element: ${logData.rootElement}`);
    console.group('📈 Flow States:');
    Object.entries(state).forEach(([name, value]) => {
      const valueStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      console.log(`  ${name}: ${valueStr}`);
    });
    console.groupEnd();
    console.groupEnd();
  }

  // Enable/disable logging
  enable(enabled = true) {
    this.enabled = enabled;
    console.log(`📝 Plateau logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get current state snapshot
  getStateSnapshot() {
    const state = {};
    Object.entries(this.plateau.flows).forEach(([name, flow]) => {
      try {
        state[name] = flow.get();
      } catch (error) {
        state[name] = `[Error: ${error.message}]`;
      }
    });
    return {
      flows: state,
      assemblageCount: this.plateau.assemblages.size,
      rootElement: this.plateau.root ? this.plateau.root.id || 'anonymous' : null
    };
  }

  // Log flow addition
  logFlowAdded(name) {
    this.logState(`addFlow:${name}`);
  }

  // Log deal creation
  logDealCreated(name) {
    this.logState(`deal:${name}`);
  }

  // Log assemblage registration
  logAssemblageRegistered(name) {
    this.logState(`registerAssemblage:${name}`);
  }

  // Log cartography mapping
  logCartography() {
    this.logState('cartography');
  }

  // Log root element change
  logRootSet() {
    this.logState('setRoot');
  }

  // Log flow change
  logFlowChange(flowName) {
    this.logState(flowName);
  }

  // Wrap a flow's cut method to add logging
  wrapFlowWithLogging(flow, flowName) {
    const originalCut = flow.cut;
    flow.cut = (callback) => {
      const wrappedCallback = (...args) => {
        this.logFlowChange(flowName);
        if (callback) callback(...args);
      };
      return originalCut.call(flow, wrappedCallback);
    };
    return flow;
  }
} 