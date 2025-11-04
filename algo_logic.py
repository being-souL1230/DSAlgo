CODE_SNIPPETS = {
    'binary_tree_inorder': {
        'python': '''def inorder_traversal(root):
    if root is None:
        return []
    result = []
    result.extend(inorder_traversal(root.left))
    result.append(root.value)
    result.extend(inorder_traversal(root.right))
    return result''',
        'java': '''public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    result.addAll(inorderTraversal(root.left));
    result.add(root.val);
    result.addAll(inorderTraversal(root.right));
    return result;
}''',
        'cpp': '''vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    if (root == nullptr) return result;
    auto left = inorderTraversal(root->left);
    result.insert(result.end(), left.begin(), left.end());
    result.push_back(root->val);
    auto right = inorderTraversal(root->right);
    result.insert(result.end(), right.begin(), right.end());
    return result;
}''',
        'c': '''void inorderTraversal(struct TreeNode* root, int* result, int* index) {
    if (root == NULL) return;
    inorderTraversal(root->left, result, index);
    result[(*index)++] = root->val;
    inorderTraversal(root->right, result, index);
}'''
    },
    'binary_tree_preorder': {
        'python': '''def preorder_traversal(root):
    if root is None:
        return []
    result = [root.value]
    result.extend(preorder_traversal(root.left))
    result.extend(preorder_traversal(root.right))
    return result''',
        'java': '''public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    result.add(root.val);
    result.addAll(preorderTraversal(root.left));
    result.addAll(preorderTraversal(root.right));
    return result;
}''',
        'cpp': '''vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    if (root == nullptr) return result;
    result.push_back(root->val);
    auto left = preorderTraversal(root->left);
    result.insert(result.end(), left.begin(), left.end());
    auto right = preorderTraversal(root->right);
    result.insert(result.end(), right.begin(), right.end());
    return result;
}''',
        'c': '''void preorderTraversal(struct TreeNode* root, int* result, int* index) {
    if (root == NULL) return;
    result[(*index)++] = root->val;
    preorderTraversal(root->left, result, index);
    preorderTraversal(root->right, result, index);
}'''
    },
    'binary_tree_postorder': {
        'python': '''def postorder_traversal(root):
    if root is None:
        return []
    result = []
    result.extend(postorder_traversal(root.left))
    result.extend(postorder_traversal(root.right))
    result.append(root.value)
    return result''',
        'java': '''public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    result.addAll(postorderTraversal(root.left));
    result.addAll(postorderTraversal(root.right));
    result.add(root.val);
    return result;
}''',
        'cpp': '''vector<int> postorderTraversal(TreeNode* root) {
    vector<int> result;
    if (root == nullptr) return result;
    auto left = postorderTraversal(root->left);
    result.insert(result.end(), left.begin(), left.end());
    auto right = postorderTraversal(root->right);
    result.insert(result.end(), right.begin(), right.end());
    result.push_back(root->val);
    return result;
}''',
        'c': '''void postorderTraversal(struct TreeNode* root, int* result, int* index) {
    if (root == NULL) return;
    postorderTraversal(root->left, result, index);
    postorderTraversal(root->right, result, index);
    result[(*index)++] = root->val;
}'''
    },
    'binary_tree_levelorder': {
        'python': '''def levelorder_traversal(root):
    if root is None:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        result.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result''',
        'java': '''public List<Integer> levelorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        result.add(node.val);
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
    return result;
}''',
        'cpp': '''vector<int> levelorderTraversal(TreeNode* root) {
    vector<int> result;
    if (root == nullptr) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        result.push_back(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return result;
}''',
        'c': '''void levelorderTraversal(struct TreeNode* root, int* result, int* size) {
    if (root == NULL) return;
    struct TreeNode** queue = malloc(1000 * sizeof(struct TreeNode*));
    int front = 0, rear = 0;
    queue[rear++] = root;
    while (front < rear) {
        struct TreeNode* node = queue[front++];
        result[(*size)++] = node->val;
        if (node->left) queue[rear++] = node->left;
        if (node->right) queue[rear++] = node->right;
    }
    free(queue);
}'''
    },
    'bfs': {
        'python': '''def bfs(graph, start, goal):
    visited = set()
    queue = [[start]]
    while queue:
        path = queue.pop(0)
        node = path[-1]
        if node == goal:
            return path
        if node not in visited:
            visited.add(node)
            for neighbor in graph.get(node, []):
                new_path = list(path)
                new_path.append(neighbor)
                queue.append(new_path)
    return None''',
        'java': '''public List<Integer> bfs(Map<Integer, List<Integer>> graph, int start, int goal) {
    Set<Integer> visited = new HashSet<>();
    Queue<List<Integer>> queue = new LinkedList<>();
    queue.offer(Arrays.asList(start));
    while (!queue.isEmpty()) {
        List<Integer> path = queue.poll();
        int node = path.get(path.size() - 1);
        if (node == goal) return path;
        if (!visited.contains(node)) {
            visited.add(node);
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                List<Integer> newPath = new ArrayList<>(path);
                newPath.add(neighbor);
                queue.offer(newPath);
            }
        }
    }
    return null;
}''',
        'cpp': '''vector<int> bfs(unordered_map<int, vector<int>>& graph, int start, int goal) {
    unordered_set<int> visited;
    queue<vector<int>> q;
    q.push({start});
    while (!q.empty()) {
        vector<int> path = q.front();
        q.pop();
        int node = path.back();
        if (node == goal) return path;
        if (visited.find(node) == visited.end()) {
            visited.insert(node);
            for (int neighbor : graph[node]) {
                vector<int> newPath = path;
                newPath.push_back(neighbor);
                q.push(newPath);
            }
        }
    }
    return {};
}''',
        'c': '''int* bfs(int graph[][MAX], int n, int start, int goal, int* pathLen) {
    int visited[MAX] = {0};
    int queue[MAX], front = 0, rear = 0;
    int parent[MAX];
    for (int i = 0; i < MAX; i++) parent[i] = -1;
    queue[rear++] = start;
    visited[start] = 1;
    while (front < rear) {
        int node = queue[front++];
        if (node == goal) {
            int* path = malloc(MAX * sizeof(int));
            int idx = 0, curr = goal;
            while (curr != -1) {
                path[idx++] = curr;
                curr = parent[curr];
            }
            *pathLen = idx;
            return path;
        }
        for (int i = 0; i < n; i++) {
            if (graph[node][i] && !visited[i]) {
                visited[i] = 1;
                parent[i] = node;
                queue[rear++] = i;
            }
        }
    }
    return NULL;
}'''
    },
    'dfs': {
        'python': '''def dfs(graph, start, goal):
    visited = set()
    stack = [[start]]
    while stack:
        path = stack.pop()
        node = path[-1]
        if node == goal:
            return path
        if node not in visited:
            visited.add(node)
            for neighbor in graph.get(node, []):
                new_path = list(path)
                new_path.append(neighbor)
                stack.append(new_path)
    return None''',
        'java': '''public List<Integer> dfs(Map<Integer, List<Integer>> graph, int start, int goal) {
    Set<Integer> visited = new HashSet<>();
    Stack<List<Integer>> stack = new Stack<>();
    stack.push(Arrays.asList(start));
    while (!stack.isEmpty()) {
        List<Integer> path = stack.pop();
        int node = path.get(path.size() - 1);
        if (node == goal) return path;
        if (!visited.contains(node)) {
            visited.add(node);
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                List<Integer> newPath = new ArrayList<>(path);
                newPath.add(neighbor);
                stack.push(newPath);
            }
        }
    }
    return null;
}''',
        'cpp': '''vector<int> dfs(unordered_map<int, vector<int>>& graph, int start, int goal) {
    unordered_set<int> visited;
    stack<vector<int>> s;
    s.push({start});
    while (!s.empty()) {
        vector<int> path = s.top();
        s.pop();
        int node = path.back();
        if (node == goal) return path;
        if (visited.find(node) == visited.end()) {
            visited.insert(node);
            for (int neighbor : graph[node]) {
                vector<int> newPath = path;
                newPath.push_back(neighbor);
                s.push(newPath);
            }
        }
    }
    return {};
}''',
        'c': '''int* dfs(int graph[][MAX], int n, int start, int goal, int* pathLen) {
    int visited[MAX] = {0};
    int stack[MAX], top = -1;
    int parent[MAX];
    for (int i = 0; i < MAX; i++) parent[i] = -1;
    stack[++top] = start;
    while (top >= 0) {
        int node = stack[top--];
        if (node == goal) {
            int* path = malloc(MAX * sizeof(int));
            int idx = 0, curr = goal;
            while (curr != -1) {
                path[idx++] = curr;
                curr = parent[curr];
            }
            *pathLen = idx;
            return path;
        }
        if (!visited[node]) {
            visited[node] = 1;
            for (int i = n - 1; i >= 0; i--) {
                if (graph[node][i] && !visited[i]) {
                    parent[i] = node;
                    stack[++top] = i;
                }
            }
        }
    }
    return NULL;
}'''
    },
    'linked_list_insert': {
        'python': '''class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def insert_at_end(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node''',
        'java': '''class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class LinkedList {
    Node head;
    
    void insertAtBeginning(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    
    void insertAtEnd(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
}''',
        'cpp': '''struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
    Node* head;
public:
    void insertAtBeginning(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
    }
    
    void insertAtEnd(int data) {
        Node* newNode = new Node(data);
        if (!head) {
            head = newNode;
            return;
        }
        Node* current = head;
        while (current->next) {
            current = current->next;
        }
        current->next = newNode;
    }
};''',
        'c': '''struct Node {
    int data;
    struct Node* next;
};

void insertAtBeginning(struct Node** head, int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = *head;
    *head = newNode;
}

void insertAtEnd(struct Node** head, int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    if (*head == NULL) {
        *head = newNode;
        return;
    }
    struct Node* current = *head;
    while (current->next) {
        current = current->next;
    }
    current->next = newNode;
}'''
    },
    'linked_list_delete': {
        'python': '''def delete_node(self, value):
    if not self.head:
        return
    if self.head.data == value:
        self.head = self.head.next
        return
    current = self.head
    while current.next:
        if current.next.data == value:
            current.next = current.next.next
            return
        current = current.next''',
        'java': '''void deleteNode(int value) {
    if (head == null) return;
    if (head.data == value) {
        head = head.next;
        return;
    }
    Node current = head;
    while (current.next != null) {
        if (current.next.data == value) {
            current.next = current.next.next;
            return;
        }
        current = current.next;
    }
}''',
        'cpp': '''void deleteNode(int value) {
    if (!head) return;
    if (head->data == value) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    Node* current = head;
    while (current->next) {
        if (current->next->data == value) {
            Node* temp = current->next;
            current->next = current->next->next;
            delete temp;
            return;
        }
        current = current->next;
    }
}''',
        'c': '''void deleteNode(struct Node** head, int value) {
    if (*head == NULL) return;
    if ((*head)->data == value) {
        struct Node* temp = *head;
        *head = (*head)->next;
        free(temp);
        return;
    }
    struct Node* current = *head;
    while (current->next) {
        if (current->next->data == value) {
            struct Node* temp = current->next;
            current->next = current->next->next;
            free(temp);
            return;
        }
        current = current->next;
    }
}'''
    },
    'linked_list_reverse': {
        'python': '''def reverse(self):
    prev = None
    current = self.head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    self.head = prev''',
        'java': '''void reverse() {
    Node prev = null;
    Node current = head;
    while (current != null) {
        Node nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    head = prev;
}''',
        'cpp': '''void reverse() {
    Node* prev = nullptr;
    Node* current = head;
    while (current) {
        Node* nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    head = prev;
}''',
        'c': '''void reverse(struct Node** head) {
    struct Node* prev = NULL;
    struct Node* current = *head;
    while (current) {
        struct Node* nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    *head = prev;
}'''
    },
    'hashing_insert': {
        'python': '''class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def hash_function(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        index = self.hash_function(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        self.table[index].append((key, value))
    
    def lookup(self, key):
        index = self.hash_function(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        return None''',
        'java': '''class HashTable {
    private List<List<Entry>> table;
    private int size;
    
    class Entry {
        String key;
        int value;
        Entry(String k, int v) { key = k; value = v; }
    }
    
    HashTable(int size) {
        this.size = size;
        table = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            table.add(new ArrayList<>());
        }
    }
    
    int hashFunction(String key) {
        return Math.abs(key.hashCode()) % size;
    }
    
    void insert(String key, int value) {
        int index = hashFunction(key);
        for (Entry e : table.get(index)) {
            if (e.key.equals(key)) {
                e.value = value;
                return;
            }
        }
        table.get(index).add(new Entry(key, value));
    }
    
    Integer lookup(String key) {
        int index = hashFunction(key);
        for (Entry e : table.get(index)) {
            if (e.key.equals(key)) return e.value;
        }
        return null;
    }
}''',
        'cpp': '''class HashTable {
    vector<vector<pair<string, int>>> table;
    int size;
    
    int hashFunction(const string& key) {
        hash<string> hasher;
        return hasher(key) % size;
    }
    
public:
    HashTable(int s) : size(s) {
        table.resize(size);
    }
    
    void insert(const string& key, int value) {
        int index = hashFunction(key);
        for (auto& p : table[index]) {
            if (p.first == key) {
                p.second = value;
                return;
            }
        }
        table[index].push_back({key, value});
    }
    
    int* lookup(const string& key) {
        int index = hashFunction(key);
        for (auto& p : table[index]) {
            if (p.first == key) {
                return &p.second;
            }
        }
        return nullptr;
    }
};''',
        'c': '''#define TABLE_SIZE 10

typedef struct Entry {
    char* key;
    int value;
    struct Entry* next;
} Entry;

typedef struct HashTable {
    Entry* table[TABLE_SIZE];
} HashTable;

unsigned int hashFunction(const char* key) {
    unsigned int hash = 0;
    while (*key) {
        hash = (hash * 31) + *key;
        key++;
    }
    return hash % TABLE_SIZE;
}

void insert(HashTable* ht, const char* key, int value) {
    unsigned int index = hashFunction(key);
    Entry* current = ht->table[index];
    while (current) {
        if (strcmp(current->key, key) == 0) {
            current->value = value;
            return;
        }
        current = current->next;
    }
    Entry* newEntry = malloc(sizeof(Entry));
    newEntry->key = strdup(key);
    newEntry->value = value;
    newEntry->next = ht->table[index];
    ht->table[index] = newEntry;
}'''
    },
    'bubble_sort': {
        'python': '''def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr''',
        'java': '''void bubbleSort(int[] arr) {
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
}''',
        'cpp': '''void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}''',
        'c': '''void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}'''
    },
    'selection_sort': {
        'python': '''def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr''',
        'java': '''void selectionSort(int[] arr) {
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
}''',
        'cpp': '''void selectionSort(vector<int>& arr) {
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
}''',
        'c': '''void selectionSort(int arr[], int n) {
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
}'''
    },
    'insertion_sort': {
        'python': '''def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr''',
        'java': '''void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}''',
        'cpp': '''void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}''',
        'c': '''void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}'''
    },
    'merge_sort': {
        'python': '''def merge_sort(arr):
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
    return result''',
        'java': '''void mergeSort(int[] arr, int left, int right) {
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
}''',
        'cpp': '''void merge(vector<int>& arr, int left, int mid, int right) {
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
}''',
        'c': '''void merge(int arr[], int left, int mid, int right) {
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
}'''
    },
    'quick_sort': {
        'python': '''def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)''',
        'java': '''void quickSort(int[] arr, int low, int high) {
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
}''',
        'cpp': '''int partition(vector<int>& arr, int low, int high) {
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
}''',
        'c': '''int partition(int arr[], int low, int high) {
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
}'''
    },
    'heap_sort': {
        'python': '''def heapify(arr, n, i):
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
    return arr''',
        'java': '''void heapify(int[] arr, int n, int i) {
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
}''',
        'cpp': '''void heapify(vector<int>& arr, int n, int i) {
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
}''',
        'c': '''void heapify(int arr[], int n, int i) {
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
}'''
    }
}

CONCEPTS = {
    'binary_tree': {
        'explanation': "A Binary Tree is a hierarchical data structure where each node has at most two children (left and right). It's widely used for searching, sorting, and organizing data efficiently.",
        'time_complexity': "Traversal operations take O(n) time where n is the number of nodes. Search in a balanced binary search tree takes O(log n).",
        'space_complexity': "O(n) for storing n nodes. Recursive traversals use O(h) stack space where h is the height.",
        'use_cases': "Binary trees are used in: expression parsing, file systems, database indexing (B-trees), and decision-making algorithms."
    },
    'bfs': {
        'explanation': "Breadth-First Search (BFS) explores a graph level by level using a queue. It visits all neighbors at the current depth before moving to nodes at the next depth level.",
        'time_complexity': "O(V + E) where V is vertices and E is edges. Each vertex and edge is processed once.",
        'space_complexity': "O(V) for the queue and visited set in the worst case.",
        'use_cases': "BFS is perfect for: finding shortest paths in unweighted graphs, web crawling, social network analysis (friends at distance k), and level-order traversal."
    },
    'dfs': {
        'explanation': "Depth-First Search (DFS) explores as deep as possible along each branch using a stack (or recursion). It backtracks when it reaches a dead end.",
        'time_complexity': "O(V + E) where V is vertices and E is edges. Each vertex and edge is processed once.",
        'space_complexity': "O(V) for the stack and visited set. Recursive DFS uses O(h) call stack where h is depth.",
        'use_cases': "DFS is used for: detecting cycles, topological sorting, maze solving, and finding connected components in a graph."
    },
    'linked_list': {
        'explanation': "A Linked List is a linear data structure where elements (nodes) are connected via pointers. Each node contains data and a reference to the next node.",
        'time_complexity': "Access: O(n), Search: O(n), Insertion at head: O(1), Insertion at tail: O(n) without tail pointer, Deletion: O(n)",
        'space_complexity': "O(n) for n nodes. Extra space is needed for pointers compared to arrays.",
        'use_cases': "Linked lists are ideal for: dynamic memory allocation, implementing stacks/queues, browser history (back/forward), and undo functionality."
    },
    'hashing': {
        'explanation': "Hashing maps keys to values using a hash function that computes an index into an array of buckets. Collision handling techniques include chaining (linked lists) and open addressing.",
        'time_complexity': "Average case: Insert, Delete, Search all O(1). Worst case (many collisions): O(n).",
        'space_complexity': "O(n) for storing n key-value pairs plus overhead for the hash table structure.",
        'use_cases': "Hash tables are essential for: databases, caches, symbol tables in compilers, duplicate detection, and implementing sets/maps."
    },
    'sorting': {
        'explanation': "Sorting arranges data in a specific order. Different algorithms have different trade-offs between time complexity, space usage, and stability.",
        'algorithms': {
            'bubble_sort': "Time: O(n²), Space: O(1), Stable. Simple but inefficient.",
            'selection_sort': "Time: O(n²), Space: O(1), Unstable. Minimizes swaps.",
            'insertion_sort': "Time: O(n²), Space: O(1), Stable. Efficient for small/nearly sorted data.",
            'merge_sort': "Time: O(n log n), Space: O(n), Stable. Consistent performance.",
            'quick_sort': "Time: O(n log n) average, O(n²) worst, Space: O(log n), Unstable. Very fast in practice.",
            'heap_sort': "Time: O(n log n), Space: O(1), Unstable. Good for memory-constrained systems."
        },
        'use_cases': "Sorting is fundamental for: database queries, search algorithms, data analysis, and as a preprocessing step for many algorithms."
    }
}

def process_bot_query(message, language):
    message_lower = message.lower()
    
    if ('binary tree' in message_lower and ('tell me about' in message_lower or 'about' in message_lower)):
        return {
            'text': CONCEPTS['binary_tree']['explanation'] + f"\n\n**Time Complexity**: {CONCEPTS['binary_tree']['time_complexity']}\n**Space Complexity**: {CONCEPTS['binary_tree']['space_complexity']}\n\n**Use Cases**: {CONCEPTS['binary_tree']['use_cases']}\n\nWant to see code examples? Just ask!"
        }
    
    if (('dfs & bfs' in message_lower or 'dfs and bfs' in message_lower) and ('tell me about' in message_lower or 'about' in message_lower)):
        return {
            'text': f"**DFS (Depth-First Search)**: {CONCEPTS['dfs']['explanation']}\n\n**Time Complexity**: {CONCEPTS['dfs']['time_complexity']}\n**Space Complexity**: {CONCEPTS['dfs']['space_complexity']}\n\n**BFS (Breadth-First Search)**: {CONCEPTS['bfs']['explanation']}\n\n**Time Complexity**: {CONCEPTS['bfs']['time_complexity']}\n**Space Complexity**: {CONCEPTS['bfs']['space_complexity']}\n\n**Use Cases**: {CONCEPTS['dfs']['use_cases']}\n\nWant to see code? Ask for 'DFS code' or 'BFS code'!"
        }
    
    if ('linked list' in message_lower and ('tell me about' in message_lower or 'about' in message_lower)):
        return {
            'text': CONCEPTS['linked_list']['explanation'] + f"\n\n**Time Complexity**: {CONCEPTS['linked_list']['time_complexity']}\n**Space Complexity**: {CONCEPTS['linked_list']['space_complexity']}\n\n**Use Cases**: {CONCEPTS['linked_list']['use_cases']}\n\nWant code examples? Ask for 'linked list insert code' or 'linked list reverse code'!"
        }
    
    if 'tell me about hashing' in message_lower or 'about hashing' in message_lower:
        return {
            'text': CONCEPTS['hashing']['explanation'] + f"\n\n**Time Complexity**: {CONCEPTS['hashing']['time_complexity']}\n**Space Complexity**: {CONCEPTS['hashing']['space_complexity']}\n\n**Use Cases**: {CONCEPTS['hashing']['use_cases']}\n\nWant to see implementation? Ask for 'hash table code'!"
        }
    
    if 'tell me about sorting' in message_lower or 'about sorting' in message_lower:
        algos_text = "\n".join([f"• **{name.replace('_', ' ').title()}**: {info}" 
                               for name, info in CONCEPTS['sorting']['algorithms'].items()])
        return {
            'text': f"{CONCEPTS['sorting']['explanation']}\n\n**Available Algorithms:**\n{algos_text}\n\n**Use Cases**: {CONCEPTS['sorting']['use_cases']}\n\nWant to see code? Ask for any specific algorithm like 'merge sort code'!"
        }
    
    if 'tell me about time complexity' in message_lower or 'about time complexity' in message_lower:
        return {
            'text': "**Time Complexity (Big-O)** measures how an algorithm's runtime grows with input size.\n\n**Common complexities** (fastest to slowest):\n• **O(1)** - Constant: Array access\n• **O(log n)** - Logarithmic: Binary search\n• **O(n)** - Linear: Simple loop\n• **O(n log n)** - Linearithmic: Merge/Quick sort\n• **O(n²)** - Quadratic: Bubble sort\n• **O(2ⁿ)** - Exponential: Recursive Fibonacci\n\n**Space Complexity** measures memory usage. Lower is better for both!\n\nWant examples? Ask about any specific algorithm!"
        }
    
    if 'bfs' in message_lower and 'dfs' in message_lower and ('difference' in message_lower or 'compare' in message_lower or 'vs' in message_lower):
        return {
            'text': "Great question! Here are the key differences between BFS and DFS:\n\n🔹 **BFS (Breadth-First Search)**:\n- Uses a Queue (FIFO)\n- Explores level by level\n- Finds shortest path in unweighted graphs\n- Better for finding nodes close to the start\n\n🔹 **DFS (Depth-First Search)**:\n- Uses a Stack (LIFO) or recursion\n- Explores as deep as possible first\n- Uses less memory for sparse graphs\n- Better for finding if a path exists\n\nBoth have O(V+E) time complexity!"
        }
    
    if 'bfs' in message_lower:
        if 'code' in message_lower or 'show' in message_lower or 'implement' in message_lower:
            return {
                'text': f"Here's BFS implemented in {language.upper()}:",
                'code': CODE_SNIPPETS['bfs'][language]
            }
        if 'explain' in message_lower or 'how' in message_lower or 'work' in message_lower:
            return {
                'text': CONCEPTS['bfs']['explanation'] + f"\n\n⏱️ **Time Complexity**: {CONCEPTS['bfs']['time_complexity']}\n💾 **Space Complexity**: {CONCEPTS['bfs']['space_complexity']}\n\n📌 **When to use**: {CONCEPTS['bfs']['use_cases']}"
            }
    
    if 'dfs' in message_lower:
        if 'code' in message_lower or 'show' in message_lower or 'implement' in message_lower:
            return {
                'text': f"Here's DFS implemented in {language.upper()}:",
                'code': CODE_SNIPPETS['dfs'][language]
            }
        if 'explain' in message_lower or 'how' in message_lower or 'work' in message_lower:
            return {
                'text': CONCEPTS['dfs']['explanation'] + f"\n\n⏱️ **Time Complexity**: {CONCEPTS['dfs']['time_complexity']}\n💾 **Space Complexity**: {CONCEPTS['dfs']['space_complexity']}\n\n📌 **When to use**: {CONCEPTS['dfs']['use_cases']}"
            }
    
    if 'shortest path' in message_lower or 'shortest-path' in message_lower:
        return {
            'text': "For finding the shortest path, use **BFS** (Breadth-First Search)! 🎯\n\nBFS explores nodes level by level, guaranteeing that when you reach the goal, you've found the shortest path in an unweighted graph.\n\nWould you like to see the BFS code?"
        }
    
    if ('binary tree' in message_lower or 'tree' in message_lower) and not 'linked' in message_lower:
        if 'inorder' in message_lower or 'in-order' in message_lower:
            return {
                'text': f"In-order traversal visits nodes in this order: Left → Root → Right. For a BST, this gives sorted values! Here's the code in {language.upper()}:",
                'code': CODE_SNIPPETS['binary_tree_inorder'][language]
            }
        if 'preorder' in message_lower or 'pre-order' in message_lower:
            return {
                'text': f"Pre-order traversal visits: Root → Left → Right. Great for copying trees! Here's the code in {language.upper()}:",
                'code': CODE_SNIPPETS['binary_tree_preorder'][language]
            }
        if 'postorder' in message_lower or 'post-order' in message_lower:
            return {
                'text': f"Post-order traversal visits: Left → Right → Root. Perfect for deleting trees! Here's the code in {language.upper()}:",
                'code': CODE_SNIPPETS['binary_tree_postorder'][language]
            }
        if 'levelorder' in message_lower or 'level-order' in message_lower or 'level order' in message_lower:
            return {
                'text': f"Level-order traversal uses BFS to visit nodes level by level! Here's the code in {language.upper()}:",
                'code': CODE_SNIPPETS['binary_tree_levelorder'][language]
            }
        if 'code' in message_lower:
            return {
                'text': f"Here's in-order traversal code in {language.upper()} (Left → Root → Right):",
                'code': CODE_SNIPPETS['binary_tree_inorder'][language]
            }
        if 'explain' in message_lower or 'what' in message_lower:
            return {
                'text': CONCEPTS['binary_tree']['explanation'] + f"\n\n⏱️ **Time Complexity**: {CONCEPTS['binary_tree']['time_complexity']}\n💾 **Space Complexity**: {CONCEPTS['binary_tree']['space_complexity']}\n\n📌 **Use Cases**: {CONCEPTS['binary_tree']['use_cases']}"
            }
    
    if 'linked list' in message_lower or 'linkedlist' in message_lower:
        if 'insert' in message_lower:
            return {
                'text': f"Here's how to insert nodes in a linked list ({language.upper()}):",
                'code': CODE_SNIPPETS['linked_list_insert'][language]
            }
        if 'delete' in message_lower or 'remove' in message_lower:
            return {
                'text': f"Here's how to delete nodes from a linked list ({language.upper()}):",
                'code': CODE_SNIPPETS['linked_list_delete'][language]
            }
        if 'reverse' in message_lower:
            return {
                'text': f"Here's how to reverse a linked list ({language.upper()}):",
                'code': CODE_SNIPPETS['linked_list_reverse'][language]
            }
        if 'explain' in message_lower or 'what' in message_lower:
            return {
                'text': CONCEPTS['linked_list']['explanation'] + f"\n\n⏱️ **Time Complexity**: {CONCEPTS['linked_list']['time_complexity']}\n💾 **Space Complexity**: {CONCEPTS['linked_list']['space_complexity']}\n\n📌 **Use Cases**: {CONCEPTS['linked_list']['use_cases']}"
            }
        if 'code' in message_lower:
            return {
                'text': f"Here's linked list insertion code in {language.upper()}:",
                'code': CODE_SNIPPETS['linked_list_insert'][language]
            }
    
    if 'hash' in message_lower:
        if 'code' in message_lower or 'implement' in message_lower:
            return {
                'text': f"Here's a hash table implementation with chaining in {language.upper()}:",
                'code': CODE_SNIPPETS['hashing_insert'][language]
            }
        if 'collision' in message_lower:
            return {
                'text': "Hash collisions occur when two keys map to the same index. Two main solutions:\n\n**1. Chaining**: Store multiple values at the same index using a linked list\n**2. Open Addressing**: Find another empty slot using probing (linear, quadratic, or double hashing)\n\nChaining is simpler and handles high load factors better!"
            }
        if 'explain' in message_lower or 'what' in message_lower or 'how' in message_lower:
            return {
                'text': CONCEPTS['hashing']['explanation'] + f"\n\n⏱️ **Time Complexity**: {CONCEPTS['hashing']['time_complexity']}\n💾 **Space Complexity**: {CONCEPTS['hashing']['space_complexity']}\n\n📌 **Use Cases**: {CONCEPTS['hashing']['use_cases']}"
            }
    
    for sort_algo in ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap']:
        if sort_algo in message_lower and 'sort' in message_lower:
            snippet_key = f'{sort_algo}_sort'
            if snippet_key in CODE_SNIPPETS:
                algo_info = CONCEPTS['sorting']['algorithms'][snippet_key]
                return {
                    'text': f"**{sort_algo.title()} Sort**: {algo_info}\n\nHere's the code in {language.upper()}:",
                    'code': CODE_SNIPPETS[snippet_key][language]
                }
    
    if 'sort' in message_lower:
        if 'explain' in message_lower or 'what' in message_lower or 'compare' in message_lower:
            algos_text = "\n".join([f"• **{name.replace('_', ' ').title()}**: {info}" 
                                   for name, info in CONCEPTS['sorting']['algorithms'].items()])
            return {
                'text': f"{CONCEPTS['sorting']['explanation']}\n\n**Available Algorithms:**\n{algos_text}\n\n📌 **Use Cases**: {CONCEPTS['sorting']['use_cases']}"
            }
        if 'code' in message_lower:
            return {
                'text': f"Here's Quick Sort in {language.upper()} (one of the fastest in practice!):",
                'code': CODE_SNIPPETS['quick_sort'][language]
            }
    
    if 'help' in message_lower or 'hello' in message_lower or 'hi' in message_lower:
        return {
            'text': "Hi! I'm AlgoBuddy, your DSA tutor! I can help you with:\n\n• Binary Trees (traversals)\n• BFS and DFS (graph algorithms)\n• Linked Lists (insert, delete, reverse)\n• Hashing (collision handling)\n• Sorting (all 6 major algorithms)\n• Time Complexity (Big-O)\n\nJust ask me to explain a concept, show code, or compare algorithms! Try:\n• 'Explain BFS'\n• 'Show me Quick Sort code in Python'\n• 'Difference between BFS and DFS'"
        }
    
    return {
        'text': "I'm not sure about that yet!\n\nTry asking me about:\n• Binary Trees, BFS, DFS, Linked Lists, Hashing, or Sorting\n• Request code in C, C++, Java, or Python\n• Compare algorithms or ask for explanations\n\nExample: 'Explain how BFS works' or 'Show me merge sort code'"
    }
