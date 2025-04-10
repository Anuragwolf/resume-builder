document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded");
    setupEventListeners();
    checkForAuthRedirect();
    setupDropdownToggle();
    updateUIFromStoredAuth();
});

function setupDropdownToggle() {
    const userProfile = document.getElementById("userProfile");
    const dropdown = document.getElementById("accountDropdown");
    
    if (userProfile && dropdown) {
        userProfile.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });
    }
    
    // Close dropdown when clicking anywhere else
    document.addEventListener("click", function() {
        if (dropdown) {
            dropdown.style.display = "none";
        }
    });
}

function setupEventListeners() {
    // Tab switching
    document.getElementById("loginTab")?.addEventListener("click", showLoginTab);
    document.getElementById("signupTab")?.addEventListener("click", showSignupTab);
    
    // Form submissions
    document.getElementById("loginForm")?.addEventListener("submit", function(e) {
        e.preventDefault();
        login();
    });
    document.getElementById("signupForm")?.addEventListener("submit", function(e) {
        e.preventDefault();
        signup();
    });
    
    // Logout button
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

// Check URL for auth redirect flag
function checkForAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth')) {
        // Remove the parameter from URL
        history.replaceState(null, '', window.location.pathname);
        
        // Check auth status from cookies/local storage
        updateUIFromStoredAuth();
    }
}

// Update UI based on stored auth data
function updateUIFromStoredAuth() {
    // Check if we have user data in sessionStorage
    const userData = sessionStorage.getItem('authUser');
    if (userData) {
        const user = JSON.parse(userData);
        updateUIForAuthState(true, user);
    } else {
        updateUIForAuthState(false);
    }
}

// Simplified login function
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    // Clear previous messages
    message.textContent = "";
    message.className = "auth-message";

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            message.textContent = "Login successful!";
            message.className = "auth-message success";
            
            // Store user data in sessionStorage
            sessionStorage.setItem('authUser', JSON.stringify(data.user));
            
            // Update UI directly from response
            updateUIForAuthState(true, data.user);
            
            // Redirect to index.html with auth flag
            window.location.href = "index.html?auth=true";
        } else {
            throw new Error(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        message.textContent = error.message || "Login failed. Please try again.";
        message.className = "auth-message error";
    }
}

// Consolidated UI update function
function updateUIForAuthState(isLoggedIn, user = null) {
    const elements = {
        userProfile: document.getElementById("userProfile"),
        loginNavBtn: document.getElementById("loginNavBtn"),
        authContainer: document.getElementById("authContainer"),
        welcomeMessage: document.getElementById("welcomeMessage"),
        accountDropdown: document.getElementById("accountDropdown"),
        logoutBtn: document.getElementById("logoutBtn")
    };

    if (isLoggedIn && user) {
        console.log("✅ User logged in:", user);
        updateUserUI(user);
        if (elements.accountDropdown) elements.accountDropdown.style.display = "block";
        if (elements.userProfile) elements.userProfile.style.display = "flex";
        if (elements.loginNavBtn) elements.loginNavBtn.style.display = "none";
        if (elements.authContainer) elements.authContainer.style.display = "none";
        if (elements.logoutBtn) elements.logoutBtn.style.display = "block";
    } else {
        console.log("❌ User not logged in.");
        if (elements.accountDropdown) elements.accountDropdown.style.display = "none";
        if (elements.userProfile) elements.userProfile.style.display = "none";
        if (elements.loginNavBtn) elements.loginNavBtn.style.display = "flex";
        if (elements.authContainer) elements.authContainer.style.display = "block";
        if (elements.logoutBtn) elements.logoutBtn.style.display = "none";
    }
}

// Enhanced user UI update
function updateUserUI(user) {
    const elements = {
        username: document.getElementById("username"),
        welcomeMessage: document.getElementById("welcomeMessage"),
        userAvatar: document.getElementById("userAvatar"),
        userNameDropdown: document.getElementById("userNameDropdown"),
        userEmailDropdown: document.getElementById("userEmailDropdown"),
        userAvatarDropdown: document.getElementById("userAvatarDropdown")
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&length=1`;
    
    if (elements.welcomeMessage) elements.welcomeMessage.textContent = `Welcome, ${user.name}!`;
    if (elements.username) elements.username.textContent = user.name;
    if (elements.userNameDropdown) elements.userNameDropdown.textContent = user.name;
    if (elements.userEmailDropdown) elements.userEmailDropdown.textContent = user.email;
    if (elements.userAvatar) elements.userAvatar.src = avatarUrl;
    if (elements.userAvatarDropdown) elements.userAvatarDropdown.src = avatarUrl;
}

// Enhanced signup function
async function signup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const message = document.getElementById("signupMessage");

    if (!name || !email || !password) {
        message.textContent = "Please fill in all fields";
        message.className = "auth-message error";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include"
        });

        const data = await response.json();
        
        message.textContent = data.message;
        message.className = data.success ? "auth-message success" : "auth-message error";

        if (data.success) {
            // Auto-login after successful signup
            await loginAfterSignup(email, password);
        }
    } catch (error) {
        console.error("Signup error:", error);
        message.textContent = "Signup failed. Please try again.";
        message.className = "auth-message error";
    }
}

// Auto-login after signup
async function loginAfterSignup(email, password) {
    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            // Store user data in sessionStorage
            sessionStorage.setItem('authUser', JSON.stringify(data.user));
            
            updateUIForAuthState(true, data.user);
            // Redirect to index.html with auth flag
            window.location.href = "index.html?auth=true";
        }
    } catch (error) {
        console.error("Auto-login failed:", error);
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();
        
        if (data.success) {
            // Clear client-side state
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, 
                    "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            
            // Remove user data from sessionStorage
            sessionStorage.removeItem('authUser');
            
            updateUIForAuthState(false);
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// Tab management and other helper functions remain the same
function showLoginTab() {
    // Set active tab
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    
    // Show login form, hide signup form
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
}

function showSignupTab() {
    // Set active tab
    document.getElementById('signupTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    
    // Show signup form, hide login form
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

// Initialize with login tab active by default
document.addEventListener('DOMContentLoaded', function() {
    showLoginTab();
});