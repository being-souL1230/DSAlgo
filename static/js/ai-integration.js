// AI Integration for DSA Practice Page

// AI State
let debugSuggestions = null;
let debugLoading = false;
let debugError = null;

// Error detection function
function hasErrorInOutput(output) {
    const errorKeywords = [
        'Error',
        'Exception',
        'Traceback',
        'SyntaxError',
        'TypeError',
        'ReferenceError',
        'RuntimeError',
        'IndexError',
        'KeyError',
        'AttributeError',
        'NameError',
        'ValueError',
        'ZeroDivisionError',
        'SIGSEGV',
        'Segmentation fault',
        'core dumped',
        'Compilation Error'
    ];
    
    return errorKeywords.some(keyword => 
        output.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Get Debug Suggestions (auto-triggered)
async function getDebugSuggestions(errorOutput) {
    const problemStatement = 'Code debugging for DSA practice';
    const userCode = window.editor ? window.editor.getValue() : '';
    const aiDebugPanel = document.getElementById('ai-debug-panel');
    const aiDebugContent = document.getElementById('ai-debug-content');
    
    if (!userCode) {
        return;
    }
    
    debugLoading = true;
    debugError = null;
    
    // Show panel with loading state
    aiDebugPanel.style.display = 'block';
    aiDebugContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="ai-spinner"></div>
            <p style="color: var(--text-light); margin-top: 1rem;">AI is analyzing your error...</p>
        </div>
    `;
    
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'code_reviewer',
                problemStatement: problemStatement,
                userCode: userCode,
                errorOutput: errorOutput,
                language: window.currentLanguage || 'python'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to get debug suggestions');
        }
        
        debugSuggestions = data.response;
        
        // Render markdown-style response
        aiDebugContent.innerHTML = formatMarkdown(debugSuggestions);
        
    } catch (error) {
        debugError = error.message;
        aiDebugContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p><strong>Error:</strong> ${error.message}</p>
                <p style="margin-top: 1rem; color: var(--text-light); font-size: 0.9rem;">The AI debugging service is temporarily unavailable.</p>
            </div>
        `;
    } finally {
        debugLoading = false;
    }
}

// Analyze Code (user-triggered for any code)
async function analyzeCode() {
    const userCode = window.editor ? window.editor.getValue() : '';
    const analyzeBtn = document.getElementById('analyze-code-btn');
    const aiAnalysisPanel = document.getElementById('ai-analysis-panel');
    const aiAnalysisContent = document.getElementById('ai-analysis-content');
    
    if (!userCode || userCode.trim().length === 0) {
        alert('Please write some code first before analyzing!');
        return;
    }
    
    // Update button state
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Show panel with loading state
    if (aiAnalysisPanel && aiAnalysisContent) {
        aiAnalysisPanel.style.display = 'block';
        aiAnalysisContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="ai-spinner"></div>
                <p style="color: var(--text-light); margin-top: 1rem;">AI is analyzing your code...</p>
                <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.9rem;">This may take a few moments</p>
            </div>
        `;
    }
    
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'code_analyzer',
                userCode: userCode,
                language: window.currentLanguage || 'python'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to analyze code');
        }
        
        // Extract rating and update panel title
        const ratingMatch = data.response.match(/\*\*(?:Overall )?Score:\*\*\s*(\d+\/10)/i);
        const panelTitle = document.querySelector('#ai-analysis-panel .ai-panel-title');
        
        if (ratingMatch && panelTitle) {
            const score = ratingMatch[1];
            panelTitle.innerHTML = `
                <i class="fas fa-chart-line"></i>
                AI Code Analysis
                <span style="margin-left: 1rem; background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2)); 
                      padding: 0.35rem 0.75rem; border-radius: 6px; 
                      border: 1px solid rgba(251, 191, 36, 0.4); font-size: 0.95rem; font-weight: 600; color: #fbbf24;">
                    ${score} ⭐
                </span>
            `;
        }
        
        // Render analysis with beautiful formatting
        if (aiAnalysisContent) {
            aiAnalysisContent.innerHTML = formatMarkdown(data.response);
        }
        
    } catch (error) {
        if (aiAnalysisContent) {
            aiAnalysisContent.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <button onclick="analyzeCode()" class="retry-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    } finally {
        // Restore button
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-magic"></i>';
        }
    }
}

// Close AI Analysis Panel
function closeAIAnalysis() {
    const panel = document.getElementById('ai-analysis-panel');
    const panelTitle = document.querySelector('#ai-analysis-panel .ai-panel-title');
    
    if (panel) {
        panel.style.display = 'none';
    }
    
    // Reset title
    if (panelTitle) {
        panelTitle.innerHTML = '<i class="fas fa-chart-line"></i> AI Code Analysis';
    }
}

// Enhanced markdown formatter with table support
function formatMarkdown(text) {
    // Remove rating section from content (it's now in the panel header)
    const ratingMatch = text.match(/## 📊 Code Quality Rating[\s\S]*?(?=##|$)/);
    let contentText = text;
    
    if (ratingMatch) {
        contentText = text.replace(ratingMatch[0], '');
    }
    
    // Process markdown tables first (before line breaks)
    contentText = processMarkdownTables(contentText);
    
    // Convert markdown-style formatting to HTML with reduced spacing
    let html = contentText;
    
    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr style="border: none; border-top: 1px solid rgba(99, 102, 241, 0.3); margin: 1rem 0;">');
    
    // Headers with minimal margins
    html = html.replace(/^### (.*$)/gim, '<h4 style="color: var(--primary-color); margin-top: 0.5rem; margin-bottom: 0.3rem; font-size: 0.95rem; font-weight: 600; border-left: 3px solid var(--primary-color); padding-left: 0.5rem;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="color: var(--primary-color); margin-top: 0.75rem; margin-bottom: 0.4rem; font-size: 1.05rem; font-weight: 700; border-left: 4px solid var(--primary-color); padding-left: 0.65rem;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="color: var(--primary-color); margin-top: 0.75rem; margin-bottom: 0.4rem; font-size: 1.15rem; font-weight: 700;">$1</h2>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #f59e0b; font-weight: 600;">$1</strong>');
    
    // Code blocks with minimal padding
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9)); padding: 0.6rem; border-radius: 6px; overflow-x: auto; margin: 0.5rem 0; border: 1px solid rgba(99, 102, 241, 0.3);"><code style="color: #e0e7ff; font-family: \'Fira Code\', monospace; font-size: 0.85rem; line-height: 1.35;">$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(99, 102, 241, 0.25); padding: 0.15rem 0.35rem; border-radius: 3px; font-family: \'Fira Code\', monospace; color: #c7d2fe; font-size: 0.82em; border: 1px solid rgba(99, 102, 241, 0.4);">$1</code>');
    
    // Lists with minimal spacing
    html = html.replace(/^- (.*$)/gim, '<li style="margin: 0.2rem 0; padding-left: 0.2rem; color: var(--text-light); line-height: 1.35;">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul style="margin: 0.35rem 0; padding-left: 1rem;">$1</ul>');
    
    // Star ratings
    html = html.replace(/⭐/g, '<span style="color: #fbbf24; font-size: 1.1em;">⭐</span>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    // Remove extra breaks
    html = html.replace(/<\/(h[234])><br>/g, '</$1>');
    html = html.replace(/<\/ul><br>/g, '</ul>');
    html = html.replace(/<\/pre><br>/g, '</pre>');
    html = html.replace(/<\/table><br>/g, '</table>');
    html = html.replace(/<hr[^>]*><br>/g, '<hr style="border: none; border-top: 1px solid rgba(99, 102, 241, 0.3); margin: 1rem 0;">');
    html = html.replace(/<br><br><br>/g, '<br>');
    
    return html;
}

// Process markdown tables into HTML tables
function processMarkdownTables(text) {
    const lines = text.split('\n');
    let result = [];
    let inTable = false;
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect table row (contains |)
        if (line.includes('|') && !line.startsWith('```')) {
            // Skip separator rows (|---|---|)
            if (/^\|?\s*[-:]+\s*\|/.test(line)) {
                continue;
            }
            
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            
            tableRows.push(line);
        } else {
            // End of table
            if (inTable) {
                result.push(convertTableToHTML(tableRows));
                tableRows = [];
                inTable = false;
            }
            result.push(line);
        }
    }
    
    // Handle table at end of content
    if (inTable && tableRows.length > 0) {
        result.push(convertTableToHTML(tableRows));
    }
    
    return result.join('\n');
}

// Convert markdown table rows to HTML table
function convertTableToHTML(rows) {
    if (rows.length === 0) return '';
    
    const tableStyle = 'width: 100%; border-collapse: collapse; margin: 1rem 0; background: rgba(30, 41, 59, 0.4); border-radius: 8px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.3);';
    const thStyle = 'background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3)); padding: 0.6rem; text-align: left; color: #c7d2fe; font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid rgba(99, 102, 241, 0.5);';
    const tdStyle = 'padding: 0.5rem 0.6rem; color: var(--text-light); font-size: 0.85rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);';
    
    let html = `<table style="${tableStyle}">`;
    
    // First row is header
    const headerCells = rows[0].split('|').filter(cell => cell.trim() !== '');
    html += '<thead><tr>';
    headerCells.forEach(cell => {
        html += `<th style="${thStyle}">${cell.trim()}</th>`;
    });
    html += '</tr></thead>';
    
    // Remaining rows are body
    if (rows.length > 1) {
        html += '<tbody>';
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split('|').filter(cell => cell.trim() !== '');
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td style="${tdStyle}">${cell.trim()}</td>`;
            });
            html += '</tr>';
        }
        html += '</tbody>';
    }
    
    html += '</table>';
    return html;
}

// Close AI Debug Panel
function closeAIDebug() {
    const panel = document.getElementById('ai-debug-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}
