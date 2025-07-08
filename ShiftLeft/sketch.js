// Shift Left Security Demo - Interactive Dependency Visualizer
// This sketch visualizes software dependencies and security vulnerabilities

let dependencies = [];
let vulnerabilities = [];
let scanComplete = false;
let animationTime = 0;
let showVulnerabilities = false;

// Dependency data representing our package.json
const depData = [
  { name: "p5", version: "1.4.0", type: "direct", vulnerable: false, x: 0, y: 0 },
  { name: "lodash", version: "4.17.20", type: "direct", vulnerable: true, severity: "high", x: 0, y: 0 },
  { name: "moment", version: "2.29.1", type: "direct", vulnerable: true, severity: "high", x: 0, y: 0 },
  { name: "axios", version: "0.21.1", type: "direct", vulnerable: true, severity: "critical", x: 0, y: 0 },
  { name: "express", version: "4.17.1", type: "direct", vulnerable: true, severity: "moderate", x: 0, y: 0 },
  { name: "socket.io", version: "3.1.0", type: "direct", vulnerable: false, x: 0, y: 0 },
  { name: "jquery", version: "3.5.1", type: "direct", vulnerable: true, severity: "moderate", x: 0, y: 0 },
  { name: "bootstrap", version: "4.6.0", type: "direct", vulnerable: false, x: 0, y: 0 },
  
  // Transitive dependencies (examples)
  { name: "follow-redirects", version: "1.13.1", type: "transitive", vulnerable: true, severity: "critical", parent: "axios", x: 0, y: 0 },
  { name: "path-parse", version: "1.0.6", type: "transitive", vulnerable: true, severity: "high", parent: "express", x: 0, y: 0 },
  { name: "trim-newlines", version: "3.0.0", type: "transitive", vulnerable: true, severity: "high", parent: "lodash", x: 0, y: 0 },
  { name: "normalize-url", version: "4.5.0", type: "transitive", vulnerable: true, severity: "moderate", parent: "axios", x: 0, y: 0 }
];

let scanButton, toggleButton;
let vulnerabilityCount = 0;
let totalDependencies = 0;

function setup() {
  createCanvas(1000, 700);
  
  // Initialize dependency positions
  initializeDependencies();
  
  // Create UI elements
  scanButton = createButton('Run Security Scan');
  scanButton.position(20, 20);
  scanButton.mousePressed(runSecurityScan);
  scanButton.style('padding', '10px 20px');
  scanButton.style('font-size', '16px');
  scanButton.style('background-color', '#007bff');
  scanButton.style('color', 'white');
  scanButton.style('border', 'none');
  scanButton.style('border-radius', '5px');
  
  toggleButton = createButton('Toggle Vulnerabilities');
  toggleButton.position(200, 20);
  toggleButton.mousePressed(toggleVulnerabilities);
  toggleButton.style('padding', '10px 20px');
  toggleButton.style('font-size', '16px');
  toggleButton.style('background-color', '#dc3545');
  toggleButton.style('color', 'white');
  toggleButton.style('border', 'none');
  toggleButton.style('border-radius', '5px');
  
  // Count initial stats
  totalDependencies = depData.length;
  vulnerabilityCount = depData.filter(dep => dep.vulnerable).length;
}

function draw() {
  background(240, 245, 250);
  animationTime += 0.02;
  
  // Draw title
  fill(50);
  textAlign(CENTER);
  textSize(24);
  text("Software Supply Chain Security Visualization", width/2, 100);
  
  // Draw stats panel
  drawStatsPanel();
  
  // Draw dependency network
  drawDependencyNetwork();
  
  // Draw legend
  drawLegend();
  
  // Draw security warnings if scan is complete
  if (scanComplete) {
    drawSecurityWarnings();
  }
}

function initializeDependencies() {
  let directDeps = depData.filter(dep => dep.type === "direct");
  let transitiveDeps = depData.filter(dep => dep.type === "transitive");
  
  // Position direct dependencies in a circle
  for (let i = 0; i < directDeps.length; i++) {
    let angle = (TWO_PI / directDeps.length) * i;
    directDeps[i].x = width/2 + cos(angle) * 150;
    directDeps[i].y = height/2 + sin(angle) * 150;
  }
  
  // Position transitive dependencies around their parents
  for (let dep of transitiveDeps) {
    let parent = directDeps.find(d => d.name === dep.parent);
    if (parent) {
      let angle = random(TWO_PI);
      dep.x = parent.x + cos(angle) * 80;
      dep.y = parent.y + sin(angle) * 80;
    }
  }
  
  dependencies = [...directDeps, ...transitiveDeps];
}

function drawStatsPanel() {
  // Background panel
  fill(255, 255, 255, 200);
  stroke(200);
  rect(20, 130, 250, 120, 5);
  
  fill(50);
  textAlign(LEFT);
  textSize(14);
  text("Dependency Statistics:", 30, 155);
  text(`Total Dependencies: ${totalDependencies}`, 30, 175);
  text(`Vulnerabilities Found: ${vulnerabilityCount}`, 30, 195);
  
  if (scanComplete) {
    let critical = depData.filter(d => d.severity === "critical").length;
    let high = depData.filter(d => d.severity === "high").length;
    let moderate = depData.filter(d => d.severity === "moderate").length;
    
    fill(220, 53, 69);
    text(`Critical: ${critical}`, 30, 215);
    fill(255, 133, 27);
    text(`High: ${high}`, 120, 215);
    fill(255, 193, 7);
    text(`Moderate: ${moderate}`, 30, 235);
  }
}

function drawDependencyNetwork() {
  // Draw connections first
  stroke(100, 100, 100, 100);
  strokeWeight(1);
  
  for (let dep of dependencies) {
    if (dep.type === "transitive" && dep.parent) {
      let parent = dependencies.find(d => d.name === dep.parent);
      if (parent) {
        line(dep.x, dep.y, parent.x, parent.y);
      }
    }
  }
  
  // Draw dependency nodes
  for (let dep of dependencies) {
    push();
    translate(dep.x, dep.y);
    
    // Determine color based on vulnerability status
    let nodeColor;
    if (!scanComplete || !showVulnerabilities) {
      nodeColor = dep.type === "direct" ? color(70, 130, 180) : color(100, 149, 237);
    } else if (dep.vulnerable) {
      switch(dep.severity) {
        case "critical":
          nodeColor = color(220, 53, 69);
          break;
        case "high":
          nodeColor = color(255, 133, 27);
          break;
        case "moderate":
          nodeColor = color(255, 193, 7);
          break;
        default:
          nodeColor = color(108, 117, 125);
      }
    } else {
      nodeColor = color(40, 167, 69);
    }
    
    // Add pulsing effect for vulnerable packages
    let pulseSize = 1;
    if (scanComplete && showVulnerabilities && dep.vulnerable) {
      pulseSize = 1 + sin(animationTime * 3) * 0.2;
    }
    
    // Draw node
    fill(nodeColor);
    stroke(255);
    strokeWeight(2);
    
    let nodeSize = dep.type === "direct" ? 25 : 18;
    ellipse(0, 0, nodeSize * pulseSize, nodeSize * pulseSize);
    
    // Draw package name
    fill(50);
    noStroke();
    textAlign(CENTER);
    textSize(10);
    text(dep.name, 0, 35);
    
    // Draw version
    textSize(8);
    fill(100);
    text(`v${dep.version}`, 0, 45);
    
    pop();
  }
}

function drawLegend() {
  // Legend background
  fill(255, 255, 255, 200);
  stroke(200);
  rect(width - 220, 130, 200, scanComplete ? 160 : 100, 5);
  
  fill(50);
  textAlign(LEFT);
  textSize(14);
  text("Legend:", width - 210, 155);
  
  // Direct dependency
  fill(70, 130, 180);
  noStroke();
  ellipse(width - 190, 175, 15, 15);
  fill(50);
  text("Direct Dependency", width - 175, 180);
  
  // Transitive dependency
  fill(100, 149, 237);
  ellipse(width - 190, 195, 12, 12);
  fill(50);
  text("Transitive Dependency", width - 175, 200);
  
  if (scanComplete) {
    text("Vulnerability Severity:", width - 210, 225);
    
    // Critical
    fill(220, 53, 69);
    ellipse(width - 190, 245, 15, 15);
    fill(50);
    text("Critical", width - 175, 250);
    
    // High
    fill(255, 133, 27);
    ellipse(width - 190, 265, 15, 15);
    fill(50);
    text("High", width - 175, 270);
    
    // Moderate
    fill(255, 193, 7);
    ellipse(width - 190, 285, 15, 15);
    fill(50);
    text("Moderate", width - 175, 290);
  }
}

function drawSecurityWarnings() {
  if (!showVulnerabilities) return;
  
  // Warning banner
  fill(220, 53, 69, 200);
  noStroke();
  rect(0, height - 80, width, 80);
  
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text("⚠️ SECURITY VULNERABILITIES DETECTED ⚠️", width/2, height - 50);
  
  textSize(14);
  text(`${vulnerabilityCount} vulnerable packages found. Run 'npm audit fix' to resolve.`, width/2, height - 25);
}

function runSecurityScan() {
  scanComplete = true;
  showVulnerabilities = true;
  
  // Simulate scanning animation
  for (let i = 0; i < dependencies.length; i++) {
    setTimeout(() => {
      if (dependencies[i] && dependencies[i].vulnerable) {
        // Add visual feedback for found vulnerabilities
        console.log(`Vulnerability found in ${dependencies[i].name}: ${dependencies[i].severity}`);
      }
    }, i * 200);
  }
  
  scanButton.html('Scan Complete ✓');
  scanButton.style('background-color', '#28a745');
}

function toggleVulnerabilities() {
  if (scanComplete) {
    showVulnerabilities = !showVulnerabilities;
    toggleButton.html(showVulnerabilities ? 'Hide Vulnerabilities' : 'Show Vulnerabilities');
  }
}

// Educational functions to demonstrate security concepts
function demonstrateSupplyChainRisk() {
  // This function could be called to show how one compromised package affects many
  console.log("Supply Chain Risk Demo:");
  console.log("If 'axios' is compromised, it could affect:");
  
  let affectedProjects = [
    "React applications using HTTP requests",
    "Node.js backend services", 
    "Mobile apps with API integration",
    "IoT devices with cloud connectivity"
  ];
  
  affectedProjects.forEach(project => console.log(`- ${project}`));
}