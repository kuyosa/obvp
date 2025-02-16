from fastapi.testclient import TestClient


from main import app
# экспортируем из нашего главного файла экземпляр
client = TestClient(app)
def test_read_main():
    response = client.get("/")
    assert response.status_code == 200

# def test_get_users():
#     response = client.get("/users/")
#     assert response.status_code == 200
#     data = response.json()
#     assert len(data) > 0
#     assert data[0]["username"] == "string"
user_id = ''
def set_user_id(id):
    global user_id
    user_id = id
def get_user_id():
    global user_id
    return user_id


def test_create_user():
    response = client.post(
        "/register/",
        json={"username": "testuser", "email": "testuser@example.com", "full_name": "Test User", "password": "password123"},
    )
    response2 = client.post(
        "/register/",
        json={"username": "testuser", "email": "testuser@example.com", "full_name": "Test User", "password": "password123"},
    )
    assert response2.status_code == 400
    assert response.status_code == 200
    
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com" 
    set_user_id(data['id'])

def test_auth_user():
    response = client.post(
        "/token/",
        data={"username":"testuser", "password":"password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data['access_token'] != None
    response = client.post(
        "/token/",
        data={"username":"123", "password":"123"}
    )
    assert response.status_code == 401
    response = client.get(
        '/users/me',
        headers={'Authorization': '123'}
    )
    assert response.status_code == 401

def test_get_users():
    response = client.get(
        "/users/"
    )
    assert response.status_code == 200
    data = response.json()
    for elem in data:
        assert elem['username'] != None
        assert elem['email'] != None

def test_get_current_user():
    response = client.post(
        "/token/",
        data={"username":"testuser", "password":"password123"}
    )
    data = response.json()
    response2 = client.get(
        '/users/me',
        headers={'Authorization': f'Bearer {data['access_token']}'}
    )
    data2 = response2.json()
    assert response2.status_code == 200
    assert data2['username'] == 'testuser'

def test_change_user():
    response = client.post(
        "/token/",
        data={"username":"testuser", "password":"password123"}
    )
    data = response.json()
    response = client.put(
        f'/users/{get_user_id()}',
        json={'username': 'testuser1', "email": "testuser123@mail.ru"},
        headers={'Authorization': f'Bearer {data['access_token']}'}
    )
    assert response.status_code == 200
    data = response.json()
    assert data['username'] == 'testuser1'
    assert data['email'] == 'testuser123@mail.ru'
    response = client.put(
        f'/users/{get_user_id()}',
        json={'username': 'testuser1', "email": "testuser123@mail.ru"},
        headers={'Authorization': f'Bearer 123'}
    )
    assert response.status_code == 401

def test_delete_user():
    response = client.post(
        "/token/",
        data={"username":"testuser1", "password":"password123"}
    )
    data = response.json()
    response = client.delete(
        f'users/{get_user_id()}',
        headers={'Authorization': f'Bearer {data['access_token']}'}
    )
    assert response.status_code == 200
    response = client.delete(
        f'users/{get_user_id()}',
        headers={'Authorization': f'Bearer {data['access_token']}'}
    )
    assert response.status_code == 401
    