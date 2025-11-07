from flask import Flask, render_template, request, jsonify
from algo_logic import process_bot_query
from code_execution import execute_code
from ai_service import get_code_debugging_guidance, get_code_analysis

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/binary-tree')
def binary_tree():
    return render_template('binary_tree.html')

@app.route('/dfs-bfs')
def dfs_bfs():
    return render_template('dfs_bfs.html')

@app.route('/linked-list')
def linked_list():
    return render_template('linked_list.html')

@app.route('/hashing')
def hashing():
    return render_template('hashing.html')

@app.route('/sorting')
def sorting():
    return render_template('sorting.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/api/ask-bot', methods=['POST'])
def ask_bot():
    data = request.get_json()
    user_message = data.get('message', '')
    current_language = data.get('language', 'python')
    
    response = process_bot_query(user_message, current_language)
    
    return jsonify({
        'response': response['text'],
        'code': response.get('code', None)
    })

@app.route('/api/execute', methods=['POST'])
def execute():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'python')
    
    result = execute_code(code, language)
    
    return jsonify(result)

@app.route('/api/ai', methods=['POST'])
def ai_assistant():
    """
    AI endpoint for problem solving guidance and code debugging.
    Supports two types: 'problem_solver' and 'code_reviewer'
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Invalid request body',
                'code': 'INVALID_REQUEST'
            }), 400
        
        request_type = data.get('type')
        
        if request_type == 'code_reviewer':
            problem_statement = data.get('problemStatement', '')
            user_code = data.get('userCode', '')
            error_output = data.get('errorOutput', '')
            language = data.get('language', 'python')
            
            if not all([problem_statement, user_code, error_output]):
                return jsonify({
                    'success': False,
                    'error': 'Problem statement, code, and error output are required',
                    'code': 'INVALID_REQUEST'
                }), 400
            
            result = get_code_debugging_guidance(
                problem_statement, 
                user_code, 
                error_output, 
                language
            )
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
        
        elif request_type == 'code_analyzer':
            user_code = data.get('userCode', '')
            language = data.get('language', 'python')
            
            if not user_code:
                return jsonify({
                    'success': False,
                    'error': 'Code is required for analysis',
                    'code': 'INVALID_REQUEST'
                }), 400
            
            result = get_code_analysis(user_code, language)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
        
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid request type. Must be "problem_solver", "code_reviewer", or "code_analyzer"',
                'code': 'INVALID_REQUEST'
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}',
            'code': 'API_ERROR'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
