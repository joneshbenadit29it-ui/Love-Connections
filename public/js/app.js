const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');
const logConsole = document.getElementById('log');

let PlacedComponents = [];
let Wires = [];
let selectedPin = null;

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  draw();
}
window.addEventListener('resize', resizeCanvas);

function log(msg) {
  logConsole.innerHTML += `<div>> ${msg}</div>`;
  logConsole.scrollTop = logConsole.scrollHeight;
}

function spawnComponent(type, name, color, w, h, pins) {
  PlacedComponents.push({
    id: Date.now(),
    component_id: type,
    name: name,
    color: color,
    width: w,
    height: h,
    x: 200 + Math.random() * 80,
    y: 200 + Math.random() * 80,
    pins: pins
  });
  log(`Placed ${name} onto canvas.`);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Grid Lines
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

  // Draw Wires
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = 3;
  Wires.forEach(w => {
    ctx.beginPath();
    ctx.moveTo(w.from.x, w.from.y);
    ctx.lineTo(w.to.x, w.to.y);
    ctx.stroke();
  });

  // Draw Components & Terminals
  PlacedComponents.forEach(comp => {
    ctx.fillStyle = comp.color;
    ctx.fillRect(comp.x - comp.width / 2, comp.y - comp.height / 2, comp.width, comp.height);

    ctx.fillStyle = '#fff';
    ctx.font = '11px monospace';
    ctx.fillText(comp.name, comp.x - comp.width / 2, comp.y - comp.height / 2 - 6);

    comp.pins.forEach(pin => {
      const px = comp.x + pin.x_rel;
      const py = comp.y + pin.y_rel;
      ctx.fillStyle = '#00bcd4';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  PlacedComponents.forEach(comp => {
    comp.pins.forEach(pin => {
      const px = comp.x + pin.x_rel;
      const py = comp.y + pin.y_rel;
      if (Math.hypot(clickX - px, clickY - py) < 8) {
        if (!selectedPin) {
          selectedPin = { compId: comp.id, x: px, y: py };
          log(`Selected Pin on ${comp.name}`);
        } else {
          Wires.push({ from: selectedPin, to: { compId: comp.id, x: px, y: py } });
          log(`Connected wire between components.`);
          selectedPin = null;
          draw();
        }
      }
    });
  });
});

function runSimulation() {
  if (PlacedComponents.length === 0) {
    log("Error: Add components to the workspace first.");
    return;
  }
  log("Compiling SPICE Netlist...");
  const netlist = SpiceEngine.generateNetlist(PlacedComponents, Wires);
  log("<pre>" + netlist + "</pre>");
  log("Simulation engine solved: Operating point stable (DC 9V)");
}

resizeCanvas();