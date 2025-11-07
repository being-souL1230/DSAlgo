import os
import requests
from datetime import datetime

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

CODE_REVIEWER_SYSTEM_PROMPT = """You are an advanced code debugging assistant and technical mentor specializing in Data Structures & Algorithms. 

Your expertise:
- Deep analysis of logical errors in code
- Debugging runtime errors and exceptions with detailed explanations
- Identifying edge cases and boundary conditions
- Time/space complexity analysis
- Clear, educational explanations

Your goal: Provide COMPREHENSIVE debugging guidance. Explain thoroughly - users need detailed, step-by-step help to understand and fix their code."""

CODE_REVIEWER_USER_TEMPLATE = """USER'S CODE ({language}):
```{language}
{user_code}
```

ERROR:
```
{error_output}
```

Provide COMPREHENSIVE debugging help with detailed explanations:

## 🔍 Error Analysis
Explain what this error means in simple, clear language. Include:
- What the error message is telling us (3-4 sentences)
- What typically causes this type of error
- The context of where this error occurred in the code

## 🎯 Root Cause
Identify the EXACT problem:
- Which specific line(s) or logic block is causing this
- Why this particular code triggers this error
- What the code is trying to do vs. what's actually happening
- Any assumptions in the code that are incorrect

## 💡 How to Fix
Provide detailed, step-by-step guidance:
1. First step: [Explain what to change and exactly where]
2. Second step: [Explain why this change fixes the problem]
3. Third step: [Any additional changes needed]
4. Important considerations while fixing
5. Alternative approaches if applicable

Include small code snippets to illustrate the fix if helpful.

## 🧪 Testing Strategy
Suggest comprehensive testing approach:
- Test case 1: [Input and expected output]
- Test case 2: [Edge case to verify]
- Test case 3: [Boundary condition]
- What behavior confirms the fix works

## ⚠️ Common Mistakes
List 4-5 related pitfalls:
- Common mistake 1 and why to avoid it
- Common mistake 2 and its consequences
- Best practices to prevent similar errors
- Related edge cases to watch for

IMPORTANT: Be thorough, educational, and detailed. Explain WHY things work, not just WHAT to do. Help the user truly understand the problem."""

CODE_ANALYZER_SYSTEM_PROMPT = """You are an expert Code Analyst and Mentor specializing in Data Structures, Algorithms, and code quality.

Your mission: Provide COMPREHENSIVE, DETAILED code analysis that truly helps developers improve.

You provide:
- Deep, thorough code analysis with extensive explanations
- Performance optimization with reasoning and examples
- Best practices with detailed justifications
- Code rating with comprehensive breakdown
- Educational feedback that explains the "why" behind everything

Your analysis should be thorough, detailed, educational, and encouraging. Don't hold back on helpful information."""

CODE_ANALYZER_USER_TEMPLATE = """Analyze the following code comprehensively:

**LANGUAGE:** {language}

**CODE:**
```{language}
{user_code}
```

Provide detailed analysis in this format:

## 📊 Code Quality Rating
**Score:** [X/10] ⭐  
[Brief 2-3 sentence assessment of overall quality]

## 🎯 What This Code Does
[Clear explanation of functionality - 2-3 sentences]

## ✅ Strengths
[What's done well:]
- Good practices used
- Efficient approaches
- Clean code aspects

## ⚠️ Issues Found
[Problems that need attention:]
- Bugs or logical errors
- Potential runtime issues
- Edge cases not handled
- Code quality issues

## 🚀 Optimization Ideas  
[Specific suggestions to improve:]
- Performance optimizations
- Code readability improvements
- Better data structures or algorithms
- Design pattern recommendations

## ⚡ Performance Analysis
**Time Complexity:** O(?)  
**Space Complexity:** O(?)  
[Explain the complexity and whether it's optimal for this problem. Suggest better approaches if applicable.]

## 💡 Best Practices
[Language-specific recommendations:]
- Naming conventions
- Error handling
- Code organization
- Modern language features to use

RULES: Be thorough and educational. Provide actionable insights. Be constructive and encouraging."""


def call_groq_api(messages, model="openai/gpt-oss-20b", temperature=0.5, max_tokens=3500):
    """
    Call Groq API with the specified messages and configuration.
    
    Args:
        messages: List of message objects with 'role' and 'content'
        model: Groq model to use
        temperature: Response randomness (0.0-1.0)
        max_tokens: Maximum tokens in response
    
    Returns:
        dict: Response with 'success', 'response', 'tokensUsed', and 'timestamp'
    """
    if not GROQ_API_KEY:
        return {
            'success': False,
            'error': 'API key not configured',
            'code': 'API_ERROR'
        }
    
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': model,
        'messages': messages,
        'temperature': temperature,
        'max_tokens': max_tokens,
        'top_p': 0.9
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 401:
            return {
                'success': False,
                'error': 'Invalid API key',
                'code': 'API_ERROR'
            }
        elif response.status_code == 429:
            return {
                'success': False,
                'error': 'Rate limit exceeded. Please try again in a few minutes.',
                'code': 'RATE_LIMIT'
            }
        elif response.status_code != 200:
            return {
                'success': False,
                'error': f'API error: {response.status_code}',
                'code': 'API_ERROR'
            }
        
        data = response.json()
        ai_response = data['choices'][0]['message']['content']
        tokens_used = data.get('usage', {}).get('total_tokens', 0)
        
        return {
            'success': True,
            'response': ai_response,
            'tokensUsed': tokens_used,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error': 'Request timed out. Please try again.',
            'code': 'API_ERROR'
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f'Network error: {str(e)}',
            'code': 'API_ERROR'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}',
            'code': 'API_ERROR'
        }


def get_code_debugging_guidance(problem_statement, user_code, error_output, language='python'):
    """
    Get AI-generated debugging suggestions for failed code.
    
    Args:
        problem_statement: The problem description
        user_code: The user's code that failed
        error_output: The error message/output
        language: Programming language (python, java, c, cpp)
    
    Returns:
        dict: Response with debugging guidance
    """
    user_prompt = CODE_REVIEWER_USER_TEMPLATE.format(
        problem_statement=problem_statement,
        user_code=user_code,
        error_output=error_output,
        language=language
    )
    
    messages = [
        {'role': 'system', 'content': CODE_REVIEWER_SYSTEM_PROMPT},
        {'role': 'user', 'content': user_prompt}
    ]
    
    return call_groq_api(messages)


def get_code_analysis(user_code, language='python'):
    """
    Get comprehensive AI-generated code analysis with rating and optimization suggestions.
    
    Args:
        user_code: The code to analyze
        language: Programming language (python, java, c, cpp)
    
    Returns:
        dict: Response with code analysis, rating, and suggestions
    """
    user_prompt = CODE_ANALYZER_USER_TEMPLATE.format(
        user_code=user_code,
        language=language
    )
    
    messages = [
        {'role': 'system', 'content': CODE_ANALYZER_SYSTEM_PROMPT},
        {'role': 'user', 'content': user_prompt}
    ]
    
    return call_groq_api(messages, max_tokens=2000)
