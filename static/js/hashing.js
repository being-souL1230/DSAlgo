const TABLE_SIZE = 10;
const hashTable = Array.from({ length: TABLE_SIZE }, () => []);

function hashFunction(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
}

function visualizeHashTable() {
    const display = document.getElementById('hashTableDisplay');
    display.innerHTML = '';

    for (let i = 0; i < TABLE_SIZE; i++) {
        const bucketDiv = document.createElement('div');
        bucketDiv.className = 'hash-bucket';
        
        const indexDiv = document.createElement('div');
        indexDiv.className = 'bucket-index';
        indexDiv.textContent = i;
        bucketDiv.appendChild(indexDiv);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'bucket-items';

        if (hashTable[i].length === 0) {
            itemsDiv.innerHTML = '<span style="color: #cbd5e1;">empty</span>';
        } else {
            hashTable[i].forEach(([key, value]) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'bucket-item';
                itemDiv.textContent = `${key}: ${value}`;
                itemsDiv.appendChild(itemDiv);
            });
        }

        bucketDiv.appendChild(itemsDiv);
        display.appendChild(bucketDiv);
    }
}

async function insertHash() {
    const key = document.getElementById('hashKey').value.trim();
    const value = document.getElementById('hashValue').value.trim();

    if (!key || !value) {
        alert('Please enter both key and value');
        return;
    }

    const index = hashFunction(key);
    
    document.getElementById('result-display').textContent = 
        `Computing hash for "${key}"... hash("${key}") = ${index}`;

    await sleep(800);

    const existingIndex = hashTable[index].findIndex(([k]) => k === key);
    if (existingIndex !== -1) {
        hashTable[index][existingIndex] = [key, value];
        document.getElementById('result-display').textContent = 
            `Updated: "${key}" → "${value}" at index ${index}`;
    } else {
        hashTable[index].push([key, value]);
        if (hashTable[index].length > 1) {
            document.getElementById('result-display').textContent = 
                `Collision! Inserted "${key}" → "${value}" at index ${index} using chaining (${hashTable[index].length} items in bucket)`;
        } else {
            document.getElementById('result-display').textContent = 
                `Inserted: "${key}" → "${value}" at index ${index}`;
        }
    }

    document.getElementById('hashKey').value = '';
    document.getElementById('hashValue').value = '';
    
    visualizeHashTable();
    highlightBucket(index);
}

async function lookupHash() {
    const key = document.getElementById('hashKey').value.trim();

    if (!key) {
        alert('Please enter a key to lookup');
        return;
    }

    const index = hashFunction(key);
    
    document.getElementById('result-display').textContent = 
        `Looking up "${key}"... computed index: ${index}`;

    highlightBucket(index);
    await sleep(800);

    const entry = hashTable[index].find(([k]) => k === key);

    if (entry) {
        document.getElementById('result-display').textContent = 
            `✓ Found: "${key}" → "${entry[1]}" at index ${index}`;
    } else {
        document.getElementById('result-display').textContent = 
            `✗ Key "${key}" not found (checked index ${index})`;
    }

    document.getElementById('hashKey').value = '';
}

function clearHash() {
    for (let i = 0; i < TABLE_SIZE; i++) {
        hashTable[i] = [];
    }
    visualizeHashTable();
    document.getElementById('result-display').textContent = 
        'Hash Table cleared! Insert key-value pairs to see hashing in action!';
}

function highlightBucket(index) {
    setTimeout(() => {
        const buckets = document.querySelectorAll('.hash-bucket');
        if (buckets[index]) {
            buckets[index].style.border = '2px solid #f59e0b';
            buckets[index].style.background = 'rgba(245, 158, 11, 0.2)';
            setTimeout(() => {
                buckets[index].style.border = '2px solid var(--border-color)';
                buckets[index].style.background = 'rgba(30, 41, 59, 0.9)';
            }, 1500);
        }
    }, 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

visualizeHashTable();
