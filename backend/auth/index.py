'''
Business: User authentication and registration with database persistence
Args: event with httpMethod, body (email, username, password)
Returns: HTTP response with user data or error
'''
import json
import os
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            import psycopg2
            
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            email = body.get('email', '').strip()
            password = body.get('password', '')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email and password required'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            db_url = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            
            if action == 'register':
                username = body.get('username', email.split('@')[0])
                
                cur.execute(
                    "INSERT INTO users (email, username, password_hash, balance) VALUES (%s, %s, %s, %s) RETURNING id, email, username, balance",
                    (email, username, password_hash, 15000.00)
                )
                user_data = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user_data[0],
                        'email': user_data[1],
                        'username': user_data[2],
                        'balance': float(user_data[3])
                    })
                }
            
            elif action == 'login':
                cur.execute(
                    "SELECT id, email, username, balance FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user_data = cur.fetchone()
                
                if not user_data:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user_data[0],
                        'email': user_data[1],
                        'username': user_data[2],
                        'balance': float(user_data[3])
                    })
                }
                
        except psycopg2.IntegrityError:
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User already exists'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
