document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');
  
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
  
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
  
      const username = usernameInput.value;
      const password = passwordInput.value;
  
      // Perform login authentication (replace with your own logic)
      if (username === 'admin' && password === 'password') {
        // Successful login
        loginStatus.textContent = 'Login successful!';
        loginStatus.style.color = 'green';
        // You can redirect the user to another page or perform other actions here
      } else {
        // Failed login
        loginStatus.textContent = 'Invalid username or password';
        loginStatus.style.color = 'red';
      }
  
      // Clear input fields
      usernameInput.value = '';
      passwordInput.value = '';
    });
  });
  