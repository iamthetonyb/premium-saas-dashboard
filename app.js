// ============================================
// SEMANTIC KNOWLEDGE DASHBOARD - APP LOGIC
// Premium SaaS Interactive Engine
// ============================================

// ============================================
// CONFIGURATION & STATE
// ============================================
const CONFIG = {
    nodeCount: 150,
    connectionProbability: 0.15,
    nodeTypes: ['core', 'entity', 'relationship', 'attribute', 'event'],
    nodeColors: {
        core: '#6366f1',
        entity: '#8b5cf6',
        relationship: '#ec4899',
        attribute: '#10b981',
        event: '#f59e0b'
    },
    nodeLabels: {
        core: 'Core Concepts',
        entity: 'Entities',
        relationship: 'Relationships',
        attribute: 'Attributes',
        event: 'Events'
    },
    physics: {
        repulsion: 800,
        attraction: 0.05,
        damping: 0.9,
        timestep: 0.5
    }
};

const state = {
    nodes: [],
    edges: [],
    selectedNode: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    forceLayoutEnabled: true,
    edgesVisible: true,
    animationId: null
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

// ============================================
// NODE GENERATION
// ============================================
const nodeNames = [
    'Machine Learning', 'Neural Network', 'Deep Learning', 'AI', 'Data Science',
    'Algorithm', 'Training', 'Model', 'Dataset', 'Feature',
    'Classification', 'Regression', 'Clustering', 'NLP', 'Computer Vision',
    'Reinforcement Learning', 'Supervised', 'Unsupervised', 'Transformer', 'CNN',
    'RNN', 'LSTM', 'GAN', 'Autoencoder', 'Embedding',
    'Vector Space', 'Similarity', 'Cosine', 'Euclidean', 'Manifold',
    'Optimization', 'Gradient', 'Backpropagation', 'Loss Function', 'Accuracy',
    'Precision', 'Recall', 'F1 Score', 'ROC Curve', 'AUC',
    'Cross Validation', 'Overfitting', 'Regularization', 'Dropout', 'Batch Norm',
    'Learning Rate', 'Epoch', 'Batch Size', 'Optimizer', 'Adam',
    'PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'Pandas',
    'NumPy', 'Matplotlib', 'Jupyter', 'GPU', 'TPU',
    'Cloud', 'Distributed', 'Parallel', 'Pipeline', 'Deployment',
    'Inference', 'Production', 'Monitoring', 'Logging', 'Debugging',
    'Version Control', 'Git', 'CI/CD', 'Docker', 'Kubernetes',
    'API', 'REST', 'GraphQL', 'Microservices', 'Serverless',
    'Database', 'SQL', 'NoSQL', 'Redis', 'MongoDB',
    'Cache', 'Queue', 'Stream', 'Kafka', 'Spark',
    'Hadoop', 'MapReduce', 'ETL', 'Data Warehouse', 'Data Lake',
    'Analytics', 'Visualization', 'Dashboard', 'Report', 'Insight',
    'Prediction', 'Forecast', 'Trend', 'Pattern', 'Anomaly',
    'Outlier', 'Noise', 'Signal', 'Filter', 'Transform',
    'Normalize', 'Standardize', 'Encode', 'Decode', 'Compress',
    'Encrypt', 'Security', 'Privacy', 'Authentication', 'Authorization',
    'Token', 'Session', 'Cookie', 'JWT', 'OAuth',
    'Blockchain', 'Smart Contract', 'DeFi', 'NFT', 'Web3',
    'IoT', 'Edge Computing', '5G', 'Quantum', 'Neuromorphic'
];

function generateNodes() {
    const nodes = [];
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < CONFIG.nodeCount; i++) {
        const type = CONFIG.nodeTypes[randomInt(0, CONFIG.nodeTypes.length - 1)];
        const node = {
            id: i,
            label: nodeNames[i % nodeNames.length] + (i >= nodeNames.length ? ` ${Math.floor(i / nodeNames.length)}` : ''),
            type: type,
            x: randomRange(100, width - 100),
            y: randomRange(100, height - 100),
            vx: 0,
            vy: 0,
            radius: type === 'core' ? 12 : randomRange(6, 10),
            color: CONFIG.nodeColors[type],
            connections: 0,
            createdAt: new Date(Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000)).toISOString(),
            vector: Array.from({ length: 8 }, () => randomRange(0, 1))
        };
        nodes.push(node);
    }

    return nodes;
}

function generateEdges(nodes) {
    const edges = [];
    const edgeSet = new Set();

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() < CONFIG.connectionProbability) {
                const edgeKey = `${i}-${j}`;
                if (!edgeSet.has(edgeKey)) {
                    edges.push({
                        source: i,
                        target: j,
                        weight: randomRange(0.3, 1),
                        type: ['semantic', 'logical', 'hierarchical', 'associative'][randomInt(0, 3)]
                    });
                    edgeSet.add(edgeKey);
                    nodes[i].connections++;
                    nodes[j].connections++;
                }
            }
        }
    }

    // Ensure core nodes are well-connected
    nodes.filter(n => n.type === 'core').forEach(coreNode => {
        const connectionCount = randomInt(3, 8);
        for (let i = 0; i < connectionCount; i++) {
            const targetId = randomInt(0, nodes.length - 1);
            if (targetId !== coreNode.id) {
                const edgeKey = `${Math.min(coreNode.id, targetId)}-${Math.max(coreNode.id, targetId)}`;
                if (!edgeSet.has(edgeKey)) {
                    edges.push({
                        source: coreNode.id,
                        target: targetId,
                        weight: randomRange(0.5, 1),
                        type: 'semantic'
                    });
                    edgeSet.add(edgeKey);
                    nodes[coreNode.id].connections++;
                    nodes[targetId].connections++;
                }
            }
        }
    });

    return edges;
}

// ============================================
// FORCE-DIRECTED LAYOUT
// ============================================
function applyForces(nodes, edges) {
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.width;
    const height = canvas.height;
    const center = { x: width / 2, y: height / 2 };

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = CONFIG.physics.repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            nodes[i].vx -= fx;
            nodes[i].vy -= fy;
            nodes[j].vx += fx;
            nodes[j].vy += fy;
        }
    }

    // Attraction along edges
    edges.forEach(edge => {
        const source = nodes[edge.source];
        const target = nodes[edge.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * CONFIG.physics.attraction * edge.weight;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
    });

    // Center gravity
    nodes.forEach(node => {
        const dx = center.x - node.x;
        const dy = center.y - node.y;
        node.vx += dx * 0.001;
        node.vy += dy * 0.001;
    });

    // Apply velocity and damping
    nodes.forEach(node => {
        node.vx *= CONFIG.physics.damping;
        node.vy *= CONFIG.physics.damping;
        node.x += node.vx * CONFIG.physics.timestep;
        node.y += node.vy * CONFIG.physics.timestep;

        // Boundary constraints
        const margin = 50;
        node.x = Math.max(margin, Math.min(width - margin, node.x));
        node.y = Math.max(margin, Math.min(height - margin, node.y));
    });
}

// ============================================
// CANVAS RENDERING
// ============================================
function renderGraph() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const { nodes, edges, zoom, panX, panY, edgesVisible } = state;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan and zoom
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Draw edges
    if (edgesVisible) {
        edges.forEach(edge => {
            const source = nodes[edge.source];
            const target = nodes[edge.target];

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);

            let edgeColor;
            switch (edge.type) {
                case 'semantic': edgeColor = 'rgba(99, 102, 241, 0.4)'; break;
                case 'logical': edgeColor = 'rgba(16, 185, 129, 0.4)'; break;
                case 'hierarchical': edgeColor = 'rgba(245, 158, 11, 0.4)'; break;
                case 'associative': edgeColor = 'rgba(236, 72, 153, 0.4)'; break;
                default: edgeColor = 'rgba(148, 163, 184, 0.3)';
            }

            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = edge.weight * 2;
            ctx.stroke();
        });
    }

    // Draw nodes
    nodes.forEach((node, index) => {
        // Glow effect for selected node
        if (state.selectedNode === index) {
            const gradient = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius * 3);
            gradient.addColorStop(0, node.color + '60');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
            node.x - node.radius * 0.3,
            node.y - node.radius * 0.3,
            0,
            node.x,
            node.y,
            node.radius
        );
        gradient.addColorStop(0, lightenColor(node.color, 30));
        gradient.addColorStop(1, node.color);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label (only for larger nodes or when zoomed in)
        if (zoom > 0.8 || node.radius > 8) {
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.font = `${Math.max(10, 12 * zoom)}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(node.label, node.x, node.y - node.radius - 4);
        }
    });

    ctx.restore();
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ============================================
// VECTOR VISUALIZATION
// ============================================
function renderVectorVisualization() {
    const canvas = document.getElementById('vector-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#1e293b');
    bgGradient.addColorStop(1, '#334155');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw vector bars
    const selectedNode = state.selectedNode !== null ? state.nodes[state.selectedNode] : null;
    const vectorData = selectedNode ? selectedNode.vector : Array.from({ length: 32 }, () => Math.random());

    const barWidth = (width - 40) / vectorData.length;
    const barSpacing = 2;

    vectorData.forEach((value, index) => {
        const barHeight = value * (height - 40);
        const x = 20 + index * (barWidth + barSpacing);
        const y = height - 20 - barHeight;

        // Bar gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - 20);
        gradient.addColorStop(0, '#818cf8');
        gradient.addColorStop(1, '#4f46e5');

        ctx.fillStyle = gradient;

        // Rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // Highlight top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, 4, [4, 4, 0, 0]);
        ctx.fill();
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
    }
}

// ============================================
// INTERACTION HANDLERS
// ============================================
function handleCanvasClick(event) {
    const canvas = document.getElementById('graph-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - state.panX) / state.zoom;
    const y = (event.clientY - rect.top - state.panY) / state.zoom;

    // Check if clicked on a node
    let clickedNode = null;
    state.nodes.forEach((node, index) => {
        const dist = distance(x, y, node.x, node.y);
        if (dist < node.radius + 5) {
            clickedNode = index;
        }
    });

    if (clickedNode !== null) {
        state.selectedNode = clickedNode;
        showNodeModal(state.nodes[clickedNode]);
        updateVectorVisualization();
    } else {
        state.selectedNode = null;
        hideNodeModal();
    }

    renderGraph();
}

function handleCanvasMouseDown(event) {
    if (event.button === 0) {
        state.isDragging = true;
        state.dragStart = { x: event.clientX - state.panX, y: event.clientY - state.panY };
    }
}

function handleCanvasMouseMove(event) {
    if (state.isDragging) {
        state.panX = event.clientX - state.dragStart.x;
        state.panY = event.clientY - state.dragStart.y;
        renderGraph();
    }
}

function handleCanvasMouseUp() {
    state.isDragging = false;
}

function handleCanvasWheel(event) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    state.zoom = Math.max(0.3, Math.min(3, state.zoom * delta));
    renderGraph();
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function showNodeModal(node) {
    const modal = document.getElementById('node-modal');
    document.getElementById('modal-node-title').textContent = node.label;
    document.getElementById('modal-node-id').textContent = `#${node.id.toString().padStart(4, '0')}`;
    document.getElementById('modal-node-type').textContent = CONFIG.nodeLabels[node.type];
    document.getElementById('modal-node-created').textContent = new Date(node.createdAt).toLocaleDateString();
    document.getElementById('modal-node-connections').textContent = node.connections;

    // Update vector preview
    const vectorPreview = document.getElementById('modal-vector-preview');
    vectorPreview.innerHTML = '';
    node.vector.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'vector-bar';
        bar.style.height = `${value * 100}%`;
        vectorPreview.appendChild(bar);
    });

    // Generate connected nodes
    const connectedContainer = document.getElementById('modal-connected-nodes');
    connectedContainer.innerHTML = '';
    const connectedEdges = state.edges.filter(e => e.source === node.id || e.target === node.id);
    connectedEdges.slice(0, 8).forEach(edge => {
        const connectedNodeId = edge.source === node.id ? edge.target : edge.source;
        const connectedNode = state.nodes[connectedNodeId];
        const tag = document.createElement('div');
        tag.className = 'connected-node-tag';
        tag.textContent = connectedNode.label;
        tag.onclick = () => {
            state.selectedNode = connectedNodeId;
            showNodeModal(connectedNode);
            renderGraph();
        };
        connectedContainer.appendChild(tag);
    });

    modal.classList.add('active');
}

function hideNodeModal() {
    const modal = document.getElementById('node-modal');
    modal.classList.remove('active');
}

// ============================================
// TAB SWITCHING
// ============================================
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.panel-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// ============================================
// CONTROL BUTTONS
// ============================================
function setupControls() {
    document.getElementById('zoom-in').addEventListener('click', () => {
        state.zoom = Math.min(3, state.zoom * 1.2);
        renderGraph();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        state.zoom = Math.max(0.3, state.zoom / 1.2);
        renderGraph();
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        state.zoom = 1;
        state.panX = 0;
        state.panY = 0;
        renderGraph();
    });

    document.getElementById('toggle-force').addEventListener('click', (e) => {
        state.forceLayoutEnabled = !state.forceLayoutEnabled;
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-edges').addEventListener('click', (e) => {
        state.edgesVisible = !state.edgesVisible;
        e.target.classList.toggle('active');
        renderGraph();
    });

    document.getElementById('modal-close').addEventListener('click', hideNodeModal);
    document.getElementById('node-modal').addEventListener('click', (e) => {
        if (e.target.id === 'node-modal') hideNodeModal();
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search focus
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search').focus();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            hideNodeModal();
        }

        // Arrow keys for pan (when not in input)
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            const panSpeed = 50;
            switch (e.key) {
                case 'ArrowUp': state.panY += panSpeed; break;
                case 'ArrowDown': state.panY -= panSpeed; break;
                case 'ArrowLeft': state.panX += panSpeed; break;
                case 'ArrowRight': state.panX -= panSpeed; break;
            }
            renderGraph();
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            state.selectedNode = null;
            renderGraph();
            return;
        }

        // Find matching nodes
        const matchIndex = state.nodes.findIndex(node =>
            node.label.toLowerCase().includes(query)
        );

        if (matchIndex !== -1) {
            state.selectedNode = matchIndex;
            const node = state.nodes[matchIndex];
            // Center view on node
            const canvas = document.getElementById('graph-canvas');
            state.panX = canvas.width / 2 - node.x * state.zoom;
            state.panY = canvas.height / 2 - node.y * state.zoom;
            showNodeModal(node);
            renderGraph();
        }
    });
}

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    if (state.forceLayoutEnabled) {
        applyForces(state.nodes, state.edges);
    }
    renderGraph();
    state.animationId = requestAnimationFrame(animate);
}

function updateVectorVisualization() {
    renderVectorVisualization();
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Setup canvas sizes
    const graphCanvas = document.getElementById('graph-canvas');
    const vectorCanvas = document.getElementById('vector-canvas');

    function resizeCanvases() {
        const graphContainer = graphCanvas.parentElement;
        graphCanvas.width = graphContainer.clientWidth;
        graphCanvas.height = graphContainer.clientHeight;

        vectorCanvas.width = vectorCanvas.parentElement.clientWidth;
        vectorCanvas.height = vectorCanvas.parentElement.clientHeight;
    }

    resizeCanvases();
    window.addEventListener('resize', () => {
        resizeCanvases();
        renderGraph();
        renderVectorVisualization();
    });

    // Generate graph data
    state.nodes = generateNodes();
    state.edges = generateEdges(state.nodes);

    // Setup event listeners
    graphCanvas.addEventListener('click', handleCanvasClick);
    graphCanvas.addEventListener('mousedown', handleCanvasMouseDown);
    graphCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    graphCanvas.addEventListener('mouseup', handleCanvasMouseUp);
    graphCanvas.addEventListener('mouseleave', handleCanvasMouseUp);
    graphCanvas.addEventListener('wheel', handleCanvasWheel, { passive: false });

    setupTabSwitching();
    setupControls();
    setupKeyboardShortcuts();
    setupSearch();

    // Initial render
    renderGraph();
    renderVectorVisualization();

    // Start animation loop
    animate();

    console.log('Semantic Knowledge Dashboard initialized');
    console.log(`Loaded ${state.nodes.length} nodes and ${state.edges.length} edges`);
}

// Start the application
init();