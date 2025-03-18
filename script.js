  // Check if user is logged in on page load
  window.onload = function() {
    checkLoginStatus();
};

function checkLoginStatus() {
    const userData = localStorage.getItem('naukriUser');
    if (userData) {
        // User is logged in
        const user = JSON.parse(userData);
        document.getElementById('username').textContent = user.name;
        document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        document.getElementById('userNameDropdown').textContent = user.name;
        document.getElementById('userEmailDropdown').textContent = user.email;
        document.getElementById('userAvatarDropdown').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('loginNavBtn').style.display = 'none';
        document.getElementById('authContainer').style.display = 'none';
    } else {
        // User is not logged in
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('loginNavBtn').style.display = 'flex';
        document.getElementById('authContainer').style.display = 'block';
    }
}

function showLoginTab() {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
}

function showSignupTab() {
    document.getElementById('signupTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');
    
    // Simple validation
    if (!email || !password) {
        message.textContent = 'Please enter both email and password';
        message.className = 'auth-message error';
        return;
    }

    // Check if user exists in localStorage (simulating backend)
    const usersJSON = localStorage.getItem('naukriUsers');
    if (usersJSON) {
        const users = JSON.parse(usersJSON);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            message.textContent = 'Login successful! Redirecting...';
            message.className = 'auth-message success';
            
            // Store logged in user
            localStorage.setItem('naukriUser', JSON.stringify({
                name: user.name,
                email: user.email
            }));
            
            // Update UI and redirect to index page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            message.textContent = 'Invalid email or password';
            message.className = 'auth-message error';
        }
    } else {
        message.textContent = 'No accounts found. Please sign up first';
        message.className = 'auth-message error';
    }
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const message = document.getElementById('signupMessage');
    
    // Simple validation
    if (!name || !email || !password) {
        message.textContent = 'Please fill in all fields';
        message.className = 'auth-message error';
        return;
    }
    
    // Get existing users or create new array
    let users = [];
    const usersJSON = localStorage.getItem('naukriUsers');
    if (usersJSON) {
        users = JSON.parse(usersJSON);
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            message.textContent = 'Email already registered';
            message.className = 'auth-message error';
            return;
        }
    }
    
    // Add new user
    users.push({ name, email, password });
    localStorage.setItem('naukriUsers', JSON.stringify(users));
    
    // Store logged in user
    localStorage.setItem('naukriUser', JSON.stringify({
        name: name,
        email: email
    }));
    
    // Show success message
    message.textContent = 'Account created successfully!';
    message.className = 'auth-message success';
    
    // Update UI
    setTimeout(() => {
        checkLoginStatus();
    }, 1000);
}

function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('naukriUser');
    checkLoginStatus();
    const dropdown = document.getElementById('accountDropdown');
    dropdown.classList.remove('active');
}

function toggleAccountDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('accountDropdown');
    const userProfile = document.getElementById('userProfile');
    
    dropdown.classList.toggle('active');
    userProfile.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('accountDropdown');
    const userProfile = document.getElementById('userProfile');
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        userProfile.classList.remove('active');
    }
});