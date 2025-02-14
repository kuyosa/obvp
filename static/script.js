let requestStatusSucces = document.querySelector("#request-status-success")
let statusText = document.querySelector("#status-text")
let errorStatusText = document.querySelector("#error-status-text")
let requestStatusError = document.querySelector('#request-status-error')
function showRequestStatusSucces(text){
    statusText.textContent = text
    requestStatusSucces.style.display = 'flex'
    setTimeout(() => {
        requestStatusSucces.style.display = 'none'
        statusText.textContent = ""
    }, 3000)
}
function showRequestStatusError(text){
    errorStatusText.textContent = text
    requestStatusError.style.display = 'flex'
    setTimeout(() => {
        requestStatusError.style.display = 'none'
        errorStatusText.textContent = ""
    }, 3000)}

const apiBaseUrl = "http://localhost:8000";
async function fetchUsers() {
const response = await fetch(`${apiBaseUrl}/users/`);
const users = await response.json();
const userList = document.getElementById("user-list");
userList.innerHTML = "";
users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.id}: ${user.username} (${user.email})`;
    userList.appendChild(li);
});
}

      document.querySelector("#login-user-form").addEventListener('submit', login)
        async function login(event) {
            event.preventDefault()
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const response = await fetch('http://localhost:8000/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'username': username,
                    'password': password
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.access_token)
                showRequestStatusSucces('Успешный вход!')
                // document.getElementById('status').textContent = "Успешный вход!";
            } else {
                showRequestStatusError('Ошибка входа!')
                // document.getElementById('status').textContent = "Ошибка входа!";
            }
        }


      document.getElementById("create-user-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const full_name = document.getElementById("full_name").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${apiBaseUrl}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, full_name, password }),
        });
        if (response.ok) {
            showRequestStatusSucces('Пользователь создан!')
        //   alert("User created successfully");
          fetchUsers();
        } else {
            showRequestStatusError('Ошибка регистрации!')
        //   alert("Error creating user", response.error);
        }
      });

      document.getElementById("update-user-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('accessToken')) {
            showRequestStatusError('Сначала войдите в систему')
            return;
        }
        const userId = document.getElementById("update-user-id").value;
        const username = document.getElementById("update-username").value;
        const email = document.getElementById("update-email").value;
        const full_name = document.getElementById("update-full_name").value;
        const password = document.getElementById("update-password").value;
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ username, email, full_name, password }),
        });
        if (response.ok) {
            showRequestStatusSucces('Пользователь обновлён!')
        //   alert("User updated successfully");
          fetchUsers();
        } else {
            showRequestStatusError("Ошибка обновления!")
        //   alert("Error updating user");
        }
      });

      document.getElementById("delete-user-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('accessToken')) {
            showRequestStatusError('Сначала войдите в систему')
            return;
        }
        const userId = document.getElementById("delete-user-id").value;
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            method: "DELETE",
        });
        if (response.ok) {
            showRequestStatusSucces('Пользователь удалён!')
        //   alert("User deleted successfully");
          fetchUsers();
        } else {
            showRequestStatusError('Ошибка удаления!')
        //   alert("Error deleting user");
        }
      });
      document.getElementById('user-me').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('accessToken')) {
            showRequestStatusError('Сначала войдите в систему')
            return;
        }
        const response = await fetch(`${apiBaseUrl}/users/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            let userDataList = document.querySelector('#user-data')
            userDataList.innerHTML = ''
            const li = document.createElement("li");
            li.textContent = `${data.id}: ${data.username} (${data.email}) ${data.full_name} ${data.disabled}`;
            userDataList.appendChild(li)
            showRequestStatusSucces('Успешно!')
          fetchUsers();
        } else {
            showRequestStatusError('Ошибка!')
        }
      })
      fetchUsers();