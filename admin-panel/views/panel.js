async function unblockUser(id) {
  try {
    const response = await fetch(`/users/${id}/blocked`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ blocked: false }),
    });

    if (!response.ok) {
      throw new Error('Failed to unblock user');
    }

    getUsers();
  } catch (error) {
    console.error(error);
  }
}

async function blockUser(id) {
  try {
    const response = await fetch(`/users/${id}/blocked`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ blocked: true }),
    });

    if (!response.ok) {
      throw new Error('Failed to block user');
    }

    getUsers();
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    getUsers();
  } catch (error) {
    console.error(error);
  }
}

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
  const userTableBody = document.querySelector('.employees-table-body');
  userTableBody.innerHTML = '';

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>
        ${
          user.blocked
            ? `<button class="unblock-btn"><i class='material-icons'>Block</i></button>`
            : `<button class="block-btn"><i class='material-icons'>Unblock</i></button>`
        }
        <button class="delete-btn"><i class='material-icons'>delete</i></button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
  attachEventListeners();
}

// Attach event listeners to dynamically created buttons
function attachEventListeners() {
  const unblockButtons = document.querySelectorAll('.unblock-btn');
  const blockButtons = document.querySelectorAll('.block-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  unblockButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id =
        button.parentNode.parentNode.querySelector(
          'td:first-child',
        ).textContent;
      unblockUser(id);
    });
  });

  blockButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id =
        button.parentNode.parentNode.querySelector(
          'td:first-child',
        ).textContent;
      blockUser(id);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id =
        button.parentNode.parentNode.querySelector(
          'td:first-child',
        ).textContent;
      deleteUser(id);
    });
  });
}
// Call getUsers initially to populate the table
getUsers();
attachEventListeners();
