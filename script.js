const API_URL = 'http://localhost:5000';

// Authentication API functions
const api = {
    // Login function
    async login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('token', data.token); // Store token in localStorage
        }
        return data;
    },

    // Signup function
    async signup(userData) {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    // Logout function
    async logout() {
        localStorage.removeItem('token'); // Remove token from localStorage
        // No server-side logout needed
        return { success: true }; // Simulate successful logout
    },

    // Get current user profile
    async getCurrentUser() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/current-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    },

    // (No more checkAuth needed - rely on getCurrentUser)
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded");
    setupEventListeners();
    setupDropdownToggle();
    checkAuthStatus();
    checkForAuthRedirect(); // Keep this for potential future use of redirects
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
    }
}

// Check authentication status using getCurrentUser
async function checkAuthStatus() {
    try {
        const response = await api.getCurrentUser();
        if (response.success) {
            updateUIForAuthState(true, response.user);
        } else {
            updateUIForAuthState(false);
        }
    } catch (error) {
        console.error("Auth check error:", error);
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
        const data = await api.login(email, password);

        if (data.success) {
            message.textContent = "Login successful!";
            message.className = "auth-message success";
            checkAuthStatus(); // Update UI after login
            window.location.replace("index.html?auth=true"); // Keep redirect

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
        if (elements.accountDropdown) elements.accountDropdown.style.display = "none"; // Hide by default, show on click
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
    if (elements.userAvatar && elements.userAvatar.tagName === 'IMG') elements.userAvatar.src = avatarUrl;
    if (elements.userAvatarDropdown && elements.userAvatarDropdown.tagName === 'IMG') elements.userAvatarDropdown.src = avatarUrl;
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
        const data = await api.signup({ name, email, password });

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
        const data = await api.login(email, password);

        if (data.success) {
            checkAuthStatus(); // Update UI after login
            window.location.replace("index.html?auth=true"); // Keep redirect
        }
    } catch (error) {
        console.error("Auto-login failed:", error);
    }
}

// Enhanced logout function with better error handling
async function logout() {
    try {
        const response = await api.logout(); // Clears token from localStorage

        if (!response.success) {
            console.error("Logout failed");
        }
        // Clear client-side auth state
        clearClientAuthState();
    } catch (error) {
        console.error("Logout error:", error);
        // Ensure client state is cleared even on error
        clearClientAuthState();
    }
}

// Helper function to clear client auth state
function clearClientAuthState() {
    localStorage.removeItem('token'); // Remove token
    updateUIForAuthState(false);
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

// Protected page navigation
function checkAndProtectPage() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not authenticated
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.pathname);
        return false;
    }
    return true;
}

// Initialize with login tab active by default if on login page
if (document.getElementById('loginTab') && document.getElementById('signupTab')) {
    showLoginTab();
}
