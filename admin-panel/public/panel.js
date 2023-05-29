// panel.js
async function getUsers() {
  try {
    const response = await fetch('/users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error(error);
  }
}

function displayUsers(users) {
  const userTableBody = document.querySelector('#userTableBody');
  userTableBody.innerHTML = '';

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>
        ${
          user.blocked
            ? `<button onclick="unblockUser(${user.id})">Unblock</button>`
            : `<button onclick="blockUser(${user.id})">Block</button>`
        }
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

// Add event listeners and initial setup
document.addEventListener('DOMContentLoaded', () => {
  getUsers();
});
