let nodes = [];
let edges = [];
let treeMode = false;
let parentNode = null;
let selectedNode = null;
let startNode = null;
let goalNode = null;
let nodeCounter = 0;

const graphSvg = d3.select('#graph-svg');
const width = document.getElementById('graph-svg').clientWidth;
const height = 500;

graphSvg.on('click', function(event) {
    if (treeMode || event.target.tagName === 'circle' || event.target.tagName === 'text') return;
});

function addRoot() {
    nodes = [];
    edges = [];
    startNode = null;
    goalNode = null;
    nodeCounter = 0;
    const root = { id: nodeCounter++, x: width/2, y: 50, label: nodeCounter };
    nodes.push(root);
    updateGraph();
    document.getElementById('result-display').textContent = 'Root node added. Now click "Add Child" to add children.';
}

function addChild() {
    treeMode = true;
    parentNode = null;
    document.getElementById('result-display').textContent = 'Tree Mode: Click a node to add a child to it';
}

function cancelChildMode() {
    treeMode = false;
    parentNode = null;
    document.getElementById('result-display').textContent = 'Tree Mode cancelled';
}

function setStart() {
    document.getElementById('result-display').textContent = 'Click a node to set it as the start node';
    const clickHandler = function(event, d) {
        startNode = d.id;
        updateGraph();
        graphSvg.selectAll('.node').on('click', null);
        document.getElementById('result-display').textContent = `Node ${d.label} set as START`;
    };
    graphSvg.selectAll('.node').on('click', clickHandler);
}

function setGoal() {
    document.getElementById('result-display').textContent = 'Click a node to set it as the goal node';
    const clickHandler = function(event, d) {
        goalNode = d.id;
        updateGraph();
        graphSvg.selectAll('.node').on('click', null);
        document.getElementById('result-display').textContent = `Node ${d.label} set as GOAL`;
    };
    graphSvg.selectAll('.node').on('click', clickHandler);
}

function clearGraph() {
    nodes = [];
    edges = [];
    startNode = null;
    goalNode = null;
    nodeCounter = 0;
    selectedNode = null;
    edgeMode = false;
    treeMode = false;
    parentNode = null;
    updateGraph();
    document.getElementById('result-display').textContent = 'Graph cleared! Click "Add Node" to start building.';
    document.getElementById('dataStructureDisplay').style.display = 'none';
}

function updateGraph() {
    // Calculate required SVG dimensions based on tree size with proper padding
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodes.forEach(node => {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    });

    // If no nodes, use default dimensions
    if (nodes.length === 0) {
        minX = minY = 0;
        maxX = width;
        maxY = height;
    }

    // Add padding around all nodes (60px for node radius + 40px margin + extra for scrolling)
    const padding = 120;
    const requiredWidth = Math.max(width, maxX + padding);
    const requiredHeight = Math.max(height, maxY + padding);

    // Set SVG to exact size needed
    graphSvg.attr('width', requiredWidth)
             .attr('height', requiredHeight)
             .style('width', requiredWidth + 'px')
             .style('height', requiredHeight + 'px');

    // Clear and redraw
    graphSvg.selectAll('*').remove();

    const edgeGroup = graphSvg.append('g').attr('class', 'edges');
    edgeGroup.selectAll('.link')
        .data(edges)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 3);

    const nodeGroup = graphSvg.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .on('click', handleNodeClick);

    nodeElements.append('circle')
        .attr('r', 25)
        .attr('fill', d => {
            if (d.id === startNode) return '#22c55e';
            if (d.id === goalNode) return '#ef4444';
            return '#6366f1';
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 3);

    nodeElements.append('text')
        .text(d => d.label)
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .style('pointer-events', 'none');
}

let treeLevels = {}; // Track nodes at each level

function handleNodeClick(event, d) {
    if (treeMode) {
        // Add child node with proper tree positioning
        const parentLevel = getNodeLevel(d.id);
        const childLevel = parentLevel + 1;
        
        // Initialize level if not exists
        if (!treeLevels[childLevel]) {
            treeLevels[childLevel] = [];
        }
        
        // Calculate position for new child with better spacing
        const levelNodes = treeLevels[childLevel];
        const containerWidth = Math.max(800, width); // Minimum width for proper spacing
        const nodeSpacing = Math.max(120, containerWidth / Math.max(2, levelNodes.length + 1));
        const startX = 80; // Left margin
        const childX = startX + (levelNodes.length + 0.5) * nodeSpacing;
        const childY = 80 + childLevel * 120; // 120px vertical spacing between levels
        
        const newNode = { id: nodeCounter++, x: childX, y: childY, label: nodeCounter };
        nodes.push(newNode);
        treeLevels[childLevel].push(newNode.id);
        edges.push({ source: d.id, target: newNode.id });
        
        updateGraph();
        document.getElementById('result-display').textContent = `Child node ${newNode.label} added to parent ${d.label}`;
    }
}

function getNodeLevel(nodeId) {
    if (nodeId === 0) return 0; // Root is level 0
    
    // Find parent and get their level + 1
    for (let edge of edges) {
        if (edge.target === nodeId) {
            const parentId = edge.source;
            return getNodeLevel(parentId) + 1;
        }
    }
    return 0;
}

function addRoot() {
    nodes = [];
    edges = [];
    treeLevels = {};
    startNode = null;
    goalNode = null;
    nodeCounter = 0;
    // Position root node with proper padding from container edges
    const root = { id: nodeCounter++, x: 100, y: 80, label: nodeCounter };
    nodes.push(root);
    treeLevels[0] = [root.id];
    updateGraph();
    document.getElementById('result-display').textContent = 'Root node added. Now click "Add Child" to add children.';
}

function clearGraph() {
    nodes = [];
    edges = [];
    treeLevels = {};
    startNode = null;
    goalNode = null;
    nodeCounter = 0;
    selectedNode = null;
    treeMode = false;
    parentNode = null;
    updateGraph();
    document.getElementById('result-display').textContent = 'Tree cleared! Click "Add Root" to start building a tree.';
    document.getElementById('dataStructureDisplay').style.display = 'none';
}

async function runBFS() {
    if (startNode === null || goalNode === null) {
        alert('Please set both start and goal nodes!');
        return;
    }

    const adjacency = buildAdjacencyList();
    const visited = new Set();
    const queue = [[startNode]];
    const display = document.getElementById('dataStructureDisplay');
    const dsTitle = document.getElementById('dsTitle');
    const dsItems = document.getElementById('dsItems');
    
    display.style.display = 'block';
    dsTitle.textContent = 'BFS Queue:';

    while (queue.length > 0) {
        dsItems.innerHTML = queue.map(path => 
            `<div class="queue-stack-item">${path[path.length - 1]}</div>`
        ).join('');

        const path = queue.shift();
        const node = path[path.length - 1];

        highlightGraphNode(node, 'current');
        await sleep(800);

        if (node === goalNode) {
            document.getElementById('result-display').textContent = 
                `BFS Found Path: ${path.map(id => nodes.find(n => n.id === id).label).join(' → ')}`;
            highlightPath(path);
            return;
        }

        if (!visited.has(node)) {
            visited.add(node);
            highlightGraphNode(node, 'visited');

            for (const neighbor of adjacency[node] || []) {
                if (!visited.has(neighbor)) {
                    queue.push([...path, neighbor]);
                }
            }
        }
    }

    document.getElementById('result-display').textContent = 'No path found!';
}

async function runDFS() {
    if (startNode === null || goalNode === null) {
        alert('Please set both start and goal nodes!');
        return;
    }

    const adjacency = buildAdjacencyList();
    const visited = new Set();
    const stack = [[startNode]];
    const display = document.getElementById('dataStructureDisplay');
    const dsTitle = document.getElementById('dsTitle');
    const dsItems = document.getElementById('dsItems');
    
    display.style.display = 'block';
    dsTitle.textContent = 'DFS Stack:';

    while (stack.length > 0) {
        dsItems.innerHTML = stack.map(path => 
            `<div class="queue-stack-item">${path[path.length - 1]}</div>`
        ).join('');

        const path = stack.pop();
        const node = path[path.length - 1];

        highlightGraphNode(node, 'current');
        await sleep(800);

        if (node === goalNode) {
            document.getElementById('result-display').textContent = 
                `DFS Found Path: ${path.map(id => nodes.find(n => n.id === id).label).join(' → ')}`;
            highlightPath(path);
            return;
        }

        if (!visited.has(node)) {
            visited.add(node);
            highlightGraphNode(node, 'visited');

            const neighbors = adjacency[node] || [];
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const neighbor = neighbors[i];
                if (!visited.has(neighbor)) {
                    stack.push([...path, neighbor]);
                }
            }
        }
    }

    document.getElementById('result-display').textContent = 'No path found!';
}

function buildAdjacencyList() {
    const adjacency = {};
    edges.forEach(edge => {
        if (!adjacency[edge.source]) adjacency[edge.source] = [];
        if (!adjacency[edge.target]) adjacency[edge.target] = [];
        adjacency[edge.source].push(edge.target);
        adjacency[edge.target].push(edge.source);
    });
    return adjacency;
}

function highlightGraphNode(nodeId, type) {
    graphSvg.selectAll('.node').each(function() {
        const node = d3.select(this);
        const data = node.datum();
        if (data.id === nodeId) {
            const color = type === 'current' ? '#f59e0b' : '#22c55e';
            node.select('circle')
                .transition()
                .duration(300)
                .attr('fill', color);
        }
    });
}

function highlightPath(path) {
    for (let i = 0; i < path.length - 1; i++) {
        const source = path[i];
        const target = path[i + 1];
        
        graphSvg.selectAll('.link').each(function() {
            const link = d3.select(this);
            const data = link.datum();
            if ((data.source === source && data.target === target) ||
                (data.source === target && data.target === source)) {
                link.attr('stroke', '#22c55e')
                    .attr('stroke-width', 5);
            }
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
