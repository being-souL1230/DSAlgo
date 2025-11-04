# DSA Learning Platform

A comprehensive educational platform designed to make learning Data Structures and Algorithms interactive, engaging, and effective. The platform combines theoretical knowledge with practical implementation through visualizations and an integrated coding environment.

## Project Goals

- Provide an interactive learning experience for DSA concepts
- Enable hands-on coding practice with instant feedback
- Visualize algorithm execution step-by-step
- Support multiple programming languages
- Ensure a secure code execution environment
- Offer comprehensive learning resources

## Features

### Interactive Algorithm Visualizations

#### Sorting Algorithms
- **Bubble Sort**: Step-by-step visualization of the simplest sorting algorithm
- **Selection Sort**: Visual demonstration of minimum element selection
- **Insertion Sort**: Interactive visualization of the insertion process
- **Merge Sort**: Divide and conquer visualization with merging steps
- **Quick Sort**: Pivot selection and partitioning visualization
- **Heap Sort**: Binary heap operations visualization

#### Graph Algorithms
- **Depth-First Search (DFS)**: Recursive and iterative approaches
- **Breadth-First Search (BFS)**: Level-order traversal visualization
- **Shortest Path**: Dijkstra's algorithm visualization
- **Minimum Spanning Tree**: Kruskal's and Prim's algorithms

#### Data Structures
- **Binary Trees**: Various traversal methods (Inorder, Preorder, Postorder)
- **Binary Search Trees**: Insertion, deletion, and search operations
- **AVL Trees**: Self-balancing operations
- **Heaps**: Min-heap and max-heap operations
- **Hash Tables**: Collision handling techniques
- **Linked Lists**: Singly, Doubly, and Circular implementations

- **Code Practice Environment**
  - Multi-language support (Python, Java, C, C++)
  - Real-time code execution
  - Syntax highlighting and code completion
  - Output visualization

- **Learning Resources**
  - Detailed algorithm explanations
  - Step-by-step walkthroughs
  - Complexity analysis
  - Common use cases and patterns

## Tech Stack

### Frontend (Developed by Anshi Dixit)
- **HTML5, CSS3, JavaScript** - Core web technologies
- **Monaco Editor** - Feature-rich code editor (powers VS Code)
- **D3.js** - Data visualization library for interactive algorithm animations
- **Font Awesome** - Icons and UI elements
- **Responsive Design** - Works on desktop and tablet devices

### Backend (Developed by Rishab Dixit)
- **Python 3.8+** - Core backend language
- **Flask 2.0+** - Lightweight WSGI web application framework
  - Blueprint-based routing
  - RESTful API endpoints
  - Request/response handling
- **Jinja2** - Templating engine for server-side rendering
- **Subprocess** - Secure code execution with resource limits
- **Temporary Files** - Safe handling of user code
- **Security Modules**:
  - Input validation and sanitization
  - Code execution sandboxing
  - Resource usage monitoring
  - Process isolation

## System Architecture

### Frontend Architecture
1. **Component-Based Structure**
   - Modular components for each algorithm visualization
   - Reusable UI components (buttons, modals, sliders)
   - State management for interactive elements

2. **User Interface**
   - Clean, modern UI with dark/light theme support
   - Responsive design using CSS Grid and Flexbox
   - Smooth animations with CSS transitions
   - Mobile-first approach with media queries
   - Accessibility features (keyboard navigation, ARIA labels)

3. **State Management**
   - Local component state
   - Global state for application-wide data
   - Event-driven architecture for component communication

2. **Code Editor**
   - Monaco Editor integration for a VS Code-like experience
   - Syntax highlighting for multiple languages
   - Code completion and IntelliSense
   - Custom keybindings (e.g., Ctrl+Enter to run code)

3. **Visualization Engine**
   - D3.js for dynamic, data-driven visualizations
   - Step-by-step algorithm visualization
   - Interactive controls for algorithm execution

### Backend Architecture
1. **API Endpoints**
   - `POST /api/execute` - Handles code execution requests
     - Input: `{ code: string, language: string }`
     - Output: `{ success: boolean, output: string, error: string, executionTime: number }`
   - `POST /api/ask-bot` - Processes algorithm-related queries
     - Input: `{ message: string, language: string }`
     - Output: `{ response: string, code?: string }`
   - `GET /` - Serves the main application
   - `GET /sorting` - Sorting algorithms visualization
   - `GET /graph` - Graph algorithms visualization
   - `GET /tree` - Tree data structure visualization
   - `GET /hashing` - Hashing techniques visualization
   - `GET /practice` - Interactive coding environment

2. **Code Execution Service**
   - Secure sandboxed environment
   - Support for multiple programming languages
   - Timeout and resource limitations
   - Security checks to prevent malicious code execution

3. **Security Measures**
   - Input sanitization
   - Restricted system calls
   - Resource usage limits
   - Process isolation

## Real-time Code Execution Flow

### 1. User Interaction
   - User writes/edits code in the Monaco editor
   - Selects programming language from the dropdown
   - Clicks "Run" button or uses keyboard shortcut (Ctrl+Enter)
   - Optional: Provides custom input if required

### 2. Frontend Processing
   - Captures editor content and language selection
   - Validates code for basic syntax (client-side)
   - Shows loading state in the UI
   - Prepares API request with:
     ```json
     {
       "code": "user_code_here",
       "language": "python",
       "_csrf_token": "security_token"
     }
     ```
   - Makes asynchronous POST request to `/api/execute`

### 3. Backend Processing
   - **Request Validation**
     - Verifies CSRF token
     - Validates input parameters
     - Checks rate limiting (if enabled)
   
   - **Security Checks**
     - Scans code for blacklisted patterns
     - Validates language support
     - Implements time and memory limits
     - Sets up resource constraints
   
   - **Code Execution**
     - Creates temporary directory with random name
     - Writes user code to a temporary file
     - Sets up execution environment
     - Spawns isolated subprocess
     - Applies resource limits
     - Monitors execution time
     
   - **Result Processing**
     - Captures stdout and stderr
     - Measures execution time
     - Handles timeouts and errors
     - Cleans up temporary files
     - Formats response

### 4. Response Handling
   - Frontend receives JSON response:
     ```json
     {
       "success": true,
       "output": "Hello, World!\n",
       "error": "",
       "executionTime": 0.123
     }
     ```
   - Updates UI with results
   - Displays output or error messages
   - Shows execution metrics
   - Enables re-run option

### 5. Error Handling
   - Syntax errors with line numbers
   - Runtime exceptions
   - Timeout handling
   - Memory limit exceeded
   - Security violations
   - Network issues
   - Server errors

2. **Request Handling**
   - Frontend sends code and language to `/api/execute`
   - Request includes CSRF token for security
   - Payload is sent as JSON

3. **Code Execution**
   - Backend validates the request
   - Creates a temporary file with the code
   - Executes the code in a secure environment
   - Applies language-specific security restrictions
   - Captures stdout, stderr, and execution time

4. **Response**
   - Returns JSON with execution results
   - Includes output, errors (if any), and execution time
   - Frontend displays the results in the output panel

## Security Implementation

### 1. Code Execution Security
- **Process Isolation**
  - Each execution runs in a separate process
  - Uses operating system-level isolation
  - Implements resource limits (CPU, memory, execution time)

- **Input Validation**
  - Strict type checking
  - Size limitations on input
  - Pattern matching for dangerous constructs
  - Language-specific syntax validation

- **Sandboxing**
  - Restricted filesystem access
  - Network access disabled
  - System call filtering
  - Environment variable sanitization

### 2. Web Security
- **Authentication & Authorization**
  - CSRF protection
  - Secure session management
  - Role-based access control (if applicable)

- **Data Protection**
  - Input sanitization
  - Output encoding
  - Secure headers (CSP, XSS-Protection, etc.)
  - HTTPS enforcement

- **Rate Limiting**
  - API request throttling
  - Concurrent execution limits
  - IP-based restrictions

### 3. Secure Code Execution by Language

#### Python
- Restricted `__builtins__`
- Blocked modules: `os`, `sys`, `subprocess`, etc.
- Limited execution time
- Memory constraints

#### C/C++
- Compilation with security flags:
  ```
  -fstack-protector-strong -D_FORTIFY_SOURCE=2 -fPIE -pie -Wl,-z,now,-z,relro
  ```
- System call filtering
- Memory usage limits

#### Java
- Security Manager configuration
- Policy file restrictions
- Bytecode verification
- Reflection limitations

### 4. Monitoring & Logging
- Execution logs (without sensitive data)
- Error tracking
- Performance metrics
- Security event monitoring

### 5. Regular Security Audits
- Dependency updates
- Vulnerability scanning
- Penetration testing
- Code reviews

### Web Security
- CSRF protection
- Secure headers
- Input sanitization
- Rate limiting (recommended for production)

## Getting Started

### Prerequisites

#### Core Dependencies
- **Python 3.8+**
  - Flask 2.0+
  - python-dotenv
  - gunicorn (for production)

#### Frontend Development
- **Node.js 14+**
  - npm or yarn
  - Webpack/Bundler (if using)
  - ESLint/Prettier (for code quality)

#### Language Runtimes
- **C/C++**
  - GCC/G++ 9.0+
  - Make
  - CMake (optional)

- **Java**
  - OpenJDK 11+
  - JRE (Java Runtime Environment)

#### Development Tools
- Git
- Virtual Environment (venv/conda)
- IDE/Text Editor (VS Code, PyCharm, etc.)
- Browser with DevTools (Chrome, Firefox)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/dsa-learning-platform.git
   cd dsa-learning-platform
   ```

2. Create a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application
   ```bash
   python app.py
   ```

5. Open in browser
   ```
   http://localhost:5000
   ```

## License

[![License: Custom](https://img.shields.io/badge/License-Custom-blue.svg)](https://github.com/being-souL1230/DSAlgo/blob/main/LICENSE)  
*Custom Open Source Attribution License (Rishab Dixit & Anshi Dixit)*

## Future Enhancements

### Planned Features
- User authentication and progress tracking
- Custom test cases and problem sets
- Collaborative coding environment
- Mobile application version
- More algorithm visualizations
- Gamification elements

### Performance Optimizations
- Caching of common operations
- Lazy loading of resources
- WebAssembly for compute-intensive tasks
- Improved algorithm visualization performance

### Educational Content
- Interactive tutorials
- Video explanations
- Coding challenges
- Interview preparation guides

## Contributors

- **Anshi Dixit** - Frontend Development & UI/UX Design
- **Rishab Dixit** - Backend Development & Algorithm Implementation

## Acknowledgments

- Inspired by various algorithm visualization tools and coding platforms
- Built with the help of open-source libraries and frameworks
- Special thanks to all contributors and testers

---

<div align="center">
  Made by Anshi Dixit & Rishab Dixit
</div>
