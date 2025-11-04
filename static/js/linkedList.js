class LLNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

let head = null;

function visualizeList() {
    const display = document.getElementById('linkedListDisplay');
    display.innerHTML = '';

    if (head === null) {
        display.innerHTML = '<p style="color: #64748b;">List is empty</p>';
        return;
    }

    let current = head;
    while (current !== null) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'll-node';
        
        const box = document.createElement('div');
        box.className = 'll-node-box';
        box.textContent = current.data;
        box.dataset.value = current.data;
        
        nodeDiv.appendChild(box);
        
        if (current.next !== null) {
            const arrow = document.createElement('div');
            arrow.className = 'll-arrow';
            arrow.textContent = '→';
            nodeDiv.appendChild(arrow);
        } else {
            const arrow = document.createElement('div');
            arrow.className = 'll-arrow';
            arrow.textContent = '⊗';
            arrow.style.color = '#ef4444';
            nodeDiv.appendChild(arrow);
        }
        
        display.appendChild(nodeDiv);
        current = current.next;
    }

    updateResultDisplay();
}

function updateResultDisplay() {
    const values = [];
    let current = head;
    while (current !== null) {
        values.push(current.data);
        current = current.next;
    }
    document.getElementById('result-display').textContent = 
        `List: [${values.join(' → ')}] (Length: ${values.length})`;
}

function insertAtBeginning() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    const newNode = new LLNode(value);
    newNode.next = head;
    head = newNode;

    document.getElementById('nodeValue').value = '';
    visualizeList();
    highlightNode(value);
}

function insertAtEnd() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    const newNode = new LLNode(value);
    
    if (head === null) {
        head = newNode;
    } else {
        let current = head;
        while (current.next !== null) {
            current = current.next;
        }
        current.next = newNode;
    }

    document.getElementById('nodeValue').value = '';
    visualizeList();
    highlightNode(value);
}

function deleteFromBeginning() {
    if (head === null) {
        alert('List is empty!');
        return;
    }

    const deleted = head.data;
    head = head.next;
    visualizeList();
    document.getElementById('result-display').textContent = 
        `Deleted ${deleted} from beginning. ` + document.getElementById('result-display').textContent;
}

function deleteFromEnd() {
    if (head === null) {
        alert('List is empty!');
        return;
    }

    if (head.next === null) {
        const deleted = head.data;
        head = null;
        visualizeList();
        document.getElementById('result-display').textContent = 
            `Deleted ${deleted} from end. List is now empty.`;
        return;
    }

    let current = head;
    while (current.next.next !== null) {
        current = current.next;
    }
    const deleted = current.next.data;
    current.next = null;
    visualizeList();
    document.getElementById('result-display').textContent = 
        `Deleted ${deleted} from end. ` + document.getElementById('result-display').textContent;
}

function deleteByValue() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number to delete');
        return;
    }

    if (head === null) {
        alert('List is empty!');
        return;
    }

    if (head.data === value) {
        head = head.next;
        document.getElementById('nodeValue').value = '';
        visualizeList();
        document.getElementById('result-display').textContent = `Deleted ${value}. ` + document.getElementById('result-display').textContent;
        return;
    }

    let current = head;
    while (current.next !== null) {
        if (current.next.data === value) {
            current.next = current.next.next;
            document.getElementById('nodeValue').value = '';
            visualizeList();
            document.getElementById('result-display').textContent = `Deleted ${value}. ` + document.getElementById('result-display').textContent;
            return;
        }
        current = current.next;
    }

    alert(`Value ${value} not found in the list!`);
}

async function searchValue() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number to search');
        return;
    }

    let current = head;
    let position = 0;

    while (current !== null) {
        highlightNode(current.data);
        await sleep(500);

        if (current.data === value) {
            document.getElementById('result-display').textContent = 
                `✓ Found ${value} at position ${position}!`;
            return;
        }

        current = current.next;
        position++;
    }

    document.getElementById('result-display').textContent = 
        `✗ Value ${value} not found in the list!`;
}

async function reverseList() {
    if (head === null) {
        alert('List is empty!');
        return;
    }

    let prev = null;
    let current = head;

    while (current !== null) {
        const nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;

        await sleep(500);
        head = prev;
        visualizeList();
    }

    document.getElementById('result-display').textContent = 'List reversed! ' + document.getElementById('result-display').textContent;
}

function clearList() {
    head = null;
    visualizeList();
    document.getElementById('result-display').textContent = 'List cleared!';
}

function highlightNode(value) {
    setTimeout(() => {
        const boxes = document.querySelectorAll('.ll-node-box');
        boxes.forEach(box => {
            if (parseInt(box.dataset.value) === value) {
                box.classList.add('highlighted');
                setTimeout(() => box.classList.remove('highlighted'), 1000);
            }
        });
    }, 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

visualizeList();
