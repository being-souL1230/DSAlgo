from flask import Flask, render_template, request, jsonify
from algo_logic import process_bot_query
from code_execution import execute_code

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
