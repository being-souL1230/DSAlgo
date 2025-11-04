let data = [];
let sorting = false;
let animationSpeed = 50;

const svg = d3.select('#sort-svg');
const width = document.getElementById('sort-svg').clientWidth;
const height = 400;
const margin = 50;

const codeExamples = {
    bubble: {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
        cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
        c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
    },
    selection: {
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
        cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
        c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`
    },
    insertion: {
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
        java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    },
    merge: {
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
        java: `void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,
        cpp: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < L.size() && j < R.size()) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
        c: `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`
    },
    quick: {
        python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
        java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
        cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
    },
    heap: {
        python: `def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr`,
        java: `void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
        cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
        c: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
    }
};

document.getElementById('speedSlider').addEventListener('input', (e) => {
    animationSpeed = parseInt(e.target.value);
    document.getElementById('speedValue').textContent = animationSpeed;
});

document.getElementById('algorithmSelect').addEventListener('change', updateCodeDisplay);

function generateRandomData() {
    data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
    visualizeBars();
}

function visualizeBars() {
    svg.selectAll('*').remove();

    const barWidth = (width - 2 * margin) / data.length;
    const maxValue = Math.max(...data, 100);

    svg.selectAll('.sort-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'sort-bar')
        .attr('x', (d, i) => margin + i * barWidth)
        .attr('y', d => height - margin - (d / maxValue) * (height - 2 * margin))
        .attr('width', barWidth - 2)
        .attr('height', d => (d / maxValue) * (height - 2 * margin))
        .attr('fill', '#06b6d4')
        .attr('rx', 4);

    svg.selectAll('.bar-text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-text')
        .attr('x', (d, i) => margin + i * barWidth + barWidth / 2)
        .attr('y', d => height - margin - (d / maxValue) * (height - 2 * margin) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f1f5f9')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(d => d);
}

async function startSort() {
    if (sorting) return;
    sorting = true;

    const algorithm = document.getElementById('algorithmSelect').value;
    document.getElementById('result-display').textContent = `Running ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort...`;

    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSortWrapper();
            break;
        case 'quick':
            await quickSortWrapper();
            break;
        case 'heap':
            await heapSortWrapper();
            break;
    }

    document.getElementById('result-display').textContent = `✓ ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort completed!`;
    sorting = false;
}

function stopSort() {
    sorting = false;
    document.getElementById('result-display').textContent = 'Sorting stopped.';
}

async function bubbleSort() {
    const n = data.length;
    for (let i = 0; i < n && sorting; i++) {
        for (let j = 0; j < n - i - 1 && sorting; j++) {
            highlightBars([j, j + 1], 'comparing');
            await sleep(101 - animationSpeed);
            
            if (data[j] > data[j + 1]) {
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                highlightBars([j, j + 1], 'swapping');
                visualizeBars();
                await sleep(101 - animationSpeed);
            }
        }
    }
}

async function selectionSort() {
    const n = data.length;
    for (let i = 0; i < n && sorting; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n && sorting; j++) {
            highlightBars([j, minIdx], 'comparing');
            await sleep(101 - animationSpeed);
            if (data[j] < data[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [data[i], data[minIdx]] = [data[minIdx], data[i]];
            highlightBars([i, minIdx], 'swapping');
            visualizeBars();
            await sleep(101 - animationSpeed);
        }
    }
}

async function insertionSort() {
    for (let i = 1; i < data.length && sorting; i++) {
        const key = data[i];
        let j = i - 1;
        while (j >= 0 && data[j] > key && sorting) {
            data[j + 1] = data[j];
            highlightBars([j, j + 1], 'swapping');
            visualizeBars();
            await sleep(101 - animationSpeed);
            j--;
        }
        data[j + 1] = key;
        visualizeBars();
    }
}

async function mergeSortWrapper() {
    await mergeSort(0, data.length - 1);
}

async function mergeSort(left, right) {
    if (left < right && sorting) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    const leftArr = data.slice(left, mid + 1);
    const rightArr = data.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length && sorting) {
        highlightBars([k], 'comparing');
        await sleep(101 - animationSpeed);
        
        if (leftArr[i] <= rightArr[j]) {
            data[k++] = leftArr[i++];
        } else {
            data[k++] = rightArr[j++];
        }
        visualizeBars();
    }

    while (i < leftArr.length && sorting) {
        data[k++] = leftArr[i++];
        visualizeBars();
        await sleep(101 - animationSpeed);
    }

    while (j < rightArr.length && sorting) {
        data[k++] = rightArr[j++];
        visualizeBars();
        await sleep(101 - animationSpeed);
    }
}

async function quickSortWrapper() {
    await quickSort(0, data.length - 1);
}

async function quickSort(low, high) {
    if (low < high && sorting) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = data[high];
    let i = low - 1;

    for (let j = low; j < high && sorting; j++) {
        highlightBars([j, high], 'comparing');
        await sleep(101 - animationSpeed);
        
        if (data[j] < pivot) {
            i++;
            [data[i], data[j]] = [data[j], data[i]];
            highlightBars([i, j], 'swapping');
            visualizeBars();
            await sleep(101 - animationSpeed);
        }
    }
    
    [data[i + 1], data[high]] = [data[high], data[i + 1]];
    visualizeBars();
    return i + 1;
}

async function heapSortWrapper() {
    const n = data.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0 && sorting; i--) {
        await heapify(n, i);
    }
    
    for (let i = n - 1; i > 0 && sorting; i--) {
        [data[0], data[i]] = [data[i], data[0]];
        highlightBars([0, i], 'swapping');
        visualizeBars();
        await sleep(101 - animationSpeed);
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && data[left] > data[largest]) {
        largest = left;
    }

    if (right < n && data[right] > data[largest]) {
        largest = right;
    }

    if (largest !== i && sorting) {
        [data[i], data[largest]] = [data[largest], data[i]];
        highlightBars([i, largest], 'swapping');
        visualizeBars();
        await sleep(101 - animationSpeed);
        await heapify(n, largest);
    }
}

function highlightBars(indices, type) {
    svg.selectAll('.sort-bar').each(function(d, i) {
        const bar = d3.select(this);
        if (indices.includes(i)) {
            bar.attr('class', `sort-bar ${type}`);
        } else {
            bar.attr('class', 'sort-bar');
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateCodeDisplay() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const algorithmName = algorithm.charAt(0).toUpperCase() + algorithm.slice(1) + ' Sort';
    
    ['python', 'java', 'cpp', 'c'].forEach(lang => {
        const titleEl = document.getElementById(`${lang === 'cpp' ? 'cpp' : lang}-title`);
        const codeEl = document.getElementById(`${lang === 'cpp' ? 'cpp' : lang}-code`);
        if (titleEl) titleEl.textContent = algorithmName;
        if (codeEl) codeEl.textContent = codeExamples[algorithm][lang];
    });
}

generateRandomData();
updateCodeDisplay();
