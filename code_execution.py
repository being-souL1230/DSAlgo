import subprocess
import tempfile
import os
import sys
from pathlib import Path

def execute_code(code, language):
    """
    Execute code in the specified language and return output.
    Supports: python, c, cpp, java
    """
    
    try:
        # Security check for dangerous patterns
        security_check = check_code_security(code, language)
        if not security_check['allowed']:
            return {'success': False, 'output': '', 'error': f'Security violation: {security_check["reason"]}'}
        
        if language == 'python':
            return execute_python(code)
        elif language == 'c':
            return execute_c(code)
        elif language == 'cpp':
            return execute_cpp(code)
        elif language == 'java':
            return execute_java(code)
        else:
            return {'success': False, 'output': '', 'error': f'Unsupported language: {language}'}
    except Exception as e:
        return {'success': False, 'output': '', 'error': f'System error: {str(e)}'}

def check_code_security(code, language):
    """Check code for potentially dangerous operations"""
    
    # Common dangerous patterns across languages
    dangerous_patterns = [
        ('__import__', 'dynamic imports'),
        ('eval(', 'eval function'),
        ('exec(', 'exec function'),
        ('compile(', 'compile function'),
        ('open(', 'file operations'),
        ('import os', 'OS module'),
        ('import sys', 'sys module'),
        ('import subprocess', 'subprocess module'),
        ('import shutil', 'shutil module'),
        ('import socket', 'socket module'),
        ('system(', 'system calls'),
        ('popen(', 'process operations'),
        ('fork(', 'process forking'),
        ('execve(', 'execve calls'),
        ('chmod(', 'permission changes'),
        ('rm -', 'file deletion'),
        ('del ', 'delete operations'),
        ('kill', 'process killing'),
        ('shutdown', 'system shutdown'),
    ]
    
    for pattern, reason in dangerous_patterns:
        if pattern in code.lower():
            return {'allowed': False, 'reason': reason}
    
    # Language-specific checks
    if language == 'python':
        python_dangerous = [
            'os.', 'sys.', 'subprocess.', 'shutil.', 'socket.', 'ctypes.',
            'mmap.', 'resource.', 'signal.', 'fcntl.', 'pty.', 'pwd.', 'grp.'
        ]
        for pattern in python_dangerous:
            if pattern in code:
                return {'allowed': False, 'reason': f'Restricted module: {pattern[:-1]}'}
    
    elif language in ['c', 'cpp']:
        c_dangerous = [
            'system(', 'exec', 'fork', 'popen', 'unlink', 'remove',
            'fopen', 'fwrite', 'fread', 'socket', 'connect', 'bind'
        ]
        for pattern in c_dangerous:
            if pattern in code:
                return {'allowed': False, 'reason': f'Dangerous function: {pattern}'}
    
    return {'allowed': True, 'reason': ''}

def execute_python(code):
    """Execute Python code with enhanced security"""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            code_file = os.path.join(tmpdir, 'code.py')
            with open(code_file, 'w') as f:
                f.write(code)
            
            try:
                # Set environment without PYTHONPATH to prevent import issues
                env = os.environ.copy()
                env['PYTHONPATH'] = ''
                
                run_result = subprocess.run(
                    [sys.executable, code_file],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=tmpdir,
                    env=env
                )
                output = run_result.stdout
                error = run_result.stderr
                
            except subprocess.TimeoutExpired:
                return {'success': False, 'output': '', 'error': 'Execution timed out'}
            
            # Limit output size
            if len(output) > 10000:
                output = output[:10000] + "\n...[Output truncated due to size limits]..."
            
            if run_result.returncode == 0:
                return {'success': True, 'output': output, 'error': error}
            else:
                return {'success': False, 'output': output, 'error': error}
                
    except Exception as e:
        return {'success': False, 'output': '', 'error': f'Execution failed: {str(e)}'}

def execute_c(code):
    """Compile and execute C code with security flags"""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            source_file = os.path.join(tmpdir, 'code.c')
            exec_file = os.path.join(tmpdir, 'program.exe')  # .exe for Windows
            
            with open(source_file, 'w') as f:
                f.write(code)
            
            # Windows-compatible compilation flags
            compile_args = [
                'gcc', source_file, '-o', exec_file,
                '-Wall', '-Werror'
            ]
            
            compile_result = subprocess.run(
                compile_args,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if compile_result.returncode != 0:
                return {'success': False, 'output': '', 'error': f'Compilation Error:\n{compile_result.stderr}'}
            
            try:
                run_result = subprocess.run(
                    [exec_file],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=tmpdir
                )
                output = run_result.stdout
                error = run_result.stderr
                
                # Limit output size
                if len(output) > 10000:
                    output = output[:10000] + "\n...[Output truncated due to size limits]..."
                    
            except subprocess.TimeoutExpired:
                return {'success': False, 'output': '', 'error': 'Execution timed out'}
            
            if run_result.returncode == 0:
                return {'success': True, 'output': output, 'error': error}
            else:
                return {'success': False, 'output': output, 'error': error}
                
    except Exception as e:
        return {'success': False, 'output': '', 'error': f'Execution failed: {str(e)}'}

def execute_cpp(code):
    """Compile and execute C++ code with security flags"""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            source_file = os.path.join(tmpdir, 'code.cpp')
            exec_file = os.path.join(tmpdir, 'program.exe')  # .exe for Windows
            
            with open(source_file, 'w') as f:
                f.write(code)
            
            # Windows-compatible compilation flags
            compile_args = [
                'g++', source_file, '-o', exec_file,
                '-Wall', '-Werror', '-std=c++17'
            ]
            
            compile_result = subprocess.run(
                compile_args,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if compile_result.returncode != 0:
                return {'success': False, 'output': '', 'error': f'Compilation Error:\n{compile_result.stderr}'}
            
            try:
                run_result = subprocess.run(
                    [exec_file],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=tmpdir
                )
                output = run_result.stdout
                error = run_result.stderr
                
                # Limit output size
                if len(output) > 10000:
                    output = output[:10000] + "\n...[Output truncated due to size limits]..."
                    
            except subprocess.TimeoutExpired:
                return {'success': False, 'output': '', 'error': 'Execution timed out'}
            
            if run_result.returncode == 0:
                return {'success': True, 'output': output, 'error': error}
            else:
                return {'success': False, 'output': output, 'error': error}
                
    except Exception as e:
        return {'success': False, 'output': '', 'error': f'Execution failed: {str(e)}'}

def execute_java(code):
    """Compile and execute Java code with security manager"""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            class_name = extract_java_class_name(code)
            if not class_name:
                return {'success': False, 'output': '', 'error': 'Could not find public class name. Make sure your code has a public class.'}
            
            source_file = os.path.join(tmpdir, f'{class_name}.java')
            
            with open(source_file, 'w') as f:
                f.write(code)
            
            compile_result = subprocess.run(
                ['javac', source_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=tmpdir
            )
            
            if compile_result.returncode != 0:
                return {'success': False, 'output': '', 'error': f'Compilation Error:\n{compile_result.stderr}'}
            
            try:
                # Run Java with security manager
                run_result = subprocess.run(
                    ['java', '-Djava.security.manager', class_name],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=tmpdir
                )
                output = run_result.stdout
                error = run_result.stderr
                
                # Limit output size
                if len(output) > 10000:
                    output = output[:10000] + "\n...[Output truncated due to size limits]..."
                    
            except subprocess.TimeoutExpired:
                return {'success': False, 'output': '', 'error': 'Execution timed out'}
            
            if run_result.returncode == 0:
                return {'success': True, 'output': output, 'error': error}
            else:
                return {'success': False, 'output': output, 'error': error}
                
    except Exception as e:
        return {'success': False, 'output': '', 'error': f'Execution failed: {str(e)}'}

def extract_java_class_name(code):
    """Extract the public class name from Java code"""
    import re
    pattern = r'public\s+class\s+(\w+)'
    match = re.search(pattern, code)
    if match:
        return match.group(1)
    
    pattern = r'class\s+(\w+)'
    match = re.search(pattern, code)
    if match:
        return match.group(1)
    
    return None