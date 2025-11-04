class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
let treeType = 'bst';
const svg = d3.select('#tree-svg');
let width = document.getElementById('tree-svg').clientWidth;
let height = 500;

function setTreeType(type, element) {
    treeType = type;
    document.querySelectorAll('.tree-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
    
    clearTree();
    
    const typeText = type === 'bst' ? 'Binary Search Tree' : 'AVL Tree (Self-Balancing)';
    document.getElementById('tree-type-label').textContent = typeText;
}

function insertNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    if (treeType === 'bst') {
        if (root === null) {
            root = new TreeNode(value);
        } else {
            insertBST(root, value);
        }
    } else {
        root = insertAVL(root, value);
    }

    document.getElementById('nodeValue').value = '';
    visualizeTree();
}

function insertBST(node, value) {
    if (value < node.value) {
        if (node.left === null) {
            node.left = new TreeNode(value);
        } else {
            insertBST(node.left, value);
        }
    } else if (value > node.value) {
        if (node.right === null) {
            node.right = new TreeNode(value);
        } else {
            insertBST(node.right, value);
        }
    }
}

function insertAVL(node, value) {
    if (node === null) {
        return new TreeNode(value);
    }

    if (value < node.value) {
        node.left = insertAVL(node.left, value);
    } else if (value > node.value) {
        node.right = insertAVL(node.right, value);
    } else {
        return node;
    }

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    const balance = getBalance(node);

    if (balance > 1 && value < node.left.value) {
        return rightRotate(node);
    }

    if (balance < -1 && value > node.right.value) {
        return leftRotate(node);
    }

    if (balance > 1 && value > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    if (balance < -1 && value < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

function getHeight(node) {
    if (node === null) return 0;
    return node.height;
}

function getBalance(node) {
    if (node === null) return 0;
    return getHeight(node.left) - getHeight(node.right);
}

function rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    return x;
}

function leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    return y;
}

function deleteNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    if (treeType === 'bst') {
        root = deleteBST(root, value);
    } else {
        root = deleteAVL(root, value);
    }
    
    document.getElementById('nodeValue').value = '';
    visualizeTree();
}

function deleteBST(node, value) {
    if (node === null) return null;

    if (value < node.value) {
        node.left = deleteBST(node.left, value);
    } else if (value > node.value) {
        node.right = deleteBST(node.right, value);
    } else {
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;

        let minRight = node.right;
        while (minRight.left !== null) {
            minRight = minRight.left;
        }
        node.value = minRight.value;
        node.right = deleteBST(node.right, minRight.value);
    }
    return node;
}

function deleteAVL(node, value) {
    if (node === null) return node;

    if (value < node.value) {
        node.left = deleteAVL(node.left, value);
    } else if (value > node.value) {
        node.right = deleteAVL(node.right, value);
    } else {
        if ((node.left === null) || (node.right === null)) {
            let temp = null;
            if (temp === node.left) {
                temp = node.right;
            } else {
                temp = node.left;
            }

            if (temp === null) {
                temp = node;
                node = null;
            } else {
                node = temp;
            }
        } else {
            let temp = minValueNode(node.right);
            node.value = temp.value;
            node.right = deleteAVL(node.right, temp.value);
        }
    }

    if (node === null) return node;

    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;

    const balance = getBalance(node);

    if (balance > 1 && getBalance(node.left) >= 0) {
        return rightRotate(node);
    }

    if (balance > 1 && getBalance(node.left) < 0) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    if (balance < -1 && getBalance(node.right) <= 0) {
        return leftRotate(node);
    }

    if (balance < -1 && getBalance(node.right) > 0) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

function minValueNode(node) {
    let current = node;
    while (current.left !== null) {
        current = current.left;
    }
    return current;
}

function clearTree() {
    root = null;
    visualizeTree();
    document.getElementById('result-display').textContent = 'Result: []';
}

function visualizeTree() {
    svg.selectAll('*').remove();

    if (root === null) return;

    // Update width to match container
    width = document.getElementById('tree-svg').clientWidth;

    const treeData = {
        name: root.value,
        children: getChildren(root)
    };

    // Create tree layout with proper sizing and centering
    const treeLayout = d3.tree()
        .size([Math.max(width - 150, 300), height - 150]);

    const rootNode = d3.hierarchy(treeData);
    treeLayout(rootNode);

    // Center the tree horizontally and add top margin
    const g = svg.append('g')
        .attr('transform', `translate(${width/2}, 80)`);

    const links = g.selectAll('.link')
        .data(rootNode.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x - width/2)
            .y(d => d.y))
        .style('fill', 'none')
        .style('stroke', '#4f46e5')
        .style('stroke-width', 2)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 0.6);

    const nodes = g.selectAll('.node')
        .data(rootNode.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x - width/2},${d.y})`);

    nodes.append('circle')
        .attr('r', 0)
        .style('fill', '#6366f1')
        .style('stroke', '#8b5cf6')
        .style('stroke-width', 3)
        .style('filter', 'drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.4))')
        .transition()
        .duration(500)
        .attr('r', 20);

    nodes.append('text')
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .style('font-size', '12px')
        .style('opacity', 0)
        .text(d => d.data.name)
        .transition()
        .duration(500)
        .delay(200)
        .style('opacity', 1);

    if (treeType === 'avl') {
        nodes.append('text')
            .attr('dy', -30)
            .attr('text-anchor', 'middle')
            .style('fill', '#10b981')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('opacity', 0)
            .text(d => {
                const nodeVal = findNode(root, d.data.name);
                if (nodeVal) {
                    const balance = getBalance(nodeVal);
                    return `h:${nodeVal.height} b:${balance}`;
                }
                return '';
            })
            .transition()
            .duration(500)
            .delay(300)
            .style('opacity', 0.8);
    }
}

function findNode(node, value) {
    if (node === null) return null;
    if (node.value === value) return node;
    
    const left = findNode(node.left, value);
    if (left) return left;
    
    return findNode(node.right, value);
}

function getChildren(node) {
    const children = [];
    if (node.left) children.push({ name: node.left.value, children: getChildren(node.left) });
    if (node.right) children.push({ name: node.right.value, children: getChildren(node.right) });
    return children.length > 0 ? children : undefined;
}

async function traverseInorder() {
    if (root === null) {
        alert('Tree is empty! Insert some nodes first.');
        return;
    }
    const result = [];
    await animateInorder(root, result);
    document.getElementById('result-display').textContent = `In-order Result: [${result.join(', ')}]`;
}

async function animateInorder(node, result) {
    if (node === null) return;
    
    await animateInorder(node.left, result);
    
    highlightNode(node.value);
    result.push(node.value);
    await sleep(500);
    
    await animateInorder(node.right, result);
}

async function traversePreorder() {
    if (root === null) {
        alert('Tree is empty! Insert some nodes first.');
        return;
    }
    const result = [];
    await animatePreorder(root, result);
    document.getElementById('result-display').textContent = `Pre-order Result: [${result.join(', ')}]`;
}

async function animatePreorder(node, result) {
    if (node === null) return;
    
    highlightNode(node.value);
    result.push(node.value);
    await sleep(500);
    
    await animatePreorder(node.left, result);
    await animatePreorder(node.right, result);
}

async function traversePostorder() {
    if (root === null) {
        alert('Tree is empty! Insert some nodes first.');
        return;
    }
    const result = [];
    await animatePostorder(root, result);
    document.getElementById('result-display').textContent = `Post-order Result: [${result.join(', ')}]`;
}

async function animatePostorder(node, result) {
    if (node === null) return;
    
    await animatePostorder(node.left, result);
    await animatePostorder(node.right, result);
    
    highlightNode(node.value);
    result.push(node.value);
    await sleep(500);
}

async function traverseLevelorder() {
    if (root === null) {
        alert('Tree is empty! Insert some nodes first.');
        return;
    }
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        highlightNode(node.value);
        result.push(node.value);
        await sleep(500);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    document.getElementById('result-display').textContent = `Level-order Result: [${result.join(', ')}]`;
}

function highlightNode(value) {
    svg.selectAll('.node').each(function() {
        const node = d3.select(this);
        const text = node.select('text').text();
        if (parseInt(text) === value) {
            node.select('circle')
                .transition()
                .duration(200)
                .attr('r', 30)
                .style('fill', '#10b981')
                .transition()
                .duration(200)
                .attr('r', 25)
                .style('fill', '#6366f1');
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('resize', () => {
    width = document.getElementById('tree-svg').clientWidth;
    if (root !== null) {
        visualizeTree();
    }
});
