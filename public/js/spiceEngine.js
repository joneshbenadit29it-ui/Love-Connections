class SpiceEngine {
  static generateNetlist(placedComponents, wires) {
    let nodeMap = new Map();
    let nodeCounter = 1;

    // Helper to assign numeric SPICE net numbers to pin coordinates
    function getNetNode(x, y) {
      const key = `${Math.round(x)},${Math.round(y)}`;
      if (!nodeMap.has(key)) {
        nodeMap.set(key, nodeCounter++);
      }
      return nodeMap.get(key);
    }

    // Link connected wire ends to common nodes
    wires.forEach(wire => {
      const nodeA = getNetNode(wire.from.x, wire.from.y);
      nodeMap.set(`${Math.round(wire.to.x)},${Math.round(wire.to.y)}`, nodeA);
    });

    let netlist = ["* Love Connections Live Netlist Engine"];

    placedComponents.forEach((comp, idx) => {
      const id = idx + 1;
      if (comp.component_id === "DC_VOLTAGE") {
        const nPos = getNetNode(comp.x + comp.pins[0].x_rel, comp.y + comp.pins[0].y_rel);
        const nNeg = getNetNode(comp.x + comp.pins[1].x_rel, comp.y + comp.pins[1].y_rel);
        netlist.push(`V${id} ${nPos} ${nNeg} DC 9V`);
      } else if (comp.component_id === "RES_GENERIC") {
        const n1 = getNetNode(comp.x + comp.pins[0].x_rel, comp.y + comp.pins[0].y_rel);
        const n2 = getNetNode(comp.x + comp.pins[1].x_rel, comp.y + comp.pins[1].y_rel);
        netlist.push(`R${id} ${n1} ${n2} 1k`);
      } else if (comp.component_id === "LED_RED") {
        const nA = getNetNode(comp.x + comp.pins[0].x_rel, comp.y + comp.pins[0].y_rel);
        const nK = getNetNode(comp.x + comp.pins[1].x_rel, comp.y + comp.pins[1].y_rel);
        netlist.push(`D${id} ${nA} ${nK} DLED`);
      }
    });

    netlist.push(".MODEL DLED D(Is=1e-14 Rs=10)");
    netlist.push(".OP");
    netlist.push(".END");

    return netlist.join("\n");
  }
}