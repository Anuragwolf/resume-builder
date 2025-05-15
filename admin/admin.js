// DOM Elements
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const logoutBtn = document.getElementById('logout-btn');
const adminEmailSpan = document.getElementById('admin-email');
const pageTitle = document.getElementById('page-title');
const pageContent = document.getElementById('page-content');

// Sidebar elements
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const logo = document.getElementById('logo');
const navLinks = document.querySelectorAll('.nav-link');
const navTexts = document.querySelectorAll('.nav-text');

// Page content sections
const dashboardContent = document.getElementById('dashboard-content');
const usersContent = document.getElementById('users-content');
const jobsContent = document.getElementById('jobs-content');
const statsContent = document.getElementById('stats-content');

// Jobs management elements
const showUserJobsBtn = document.getElementById('show-user-jobs');
const showDummyJobsBtn = document.getElementById('show-dummy-jobs');
const userJobsContent = document.getElementById('user-jobs-content');
const dummyJobsContent = document.getElementById('dummy-jobs-content');

// Modal elements
const confirmModal = document.getElementById('confirm-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

// State
let currentAdmin = null;
let currentPage = 'dashboard';
let isSidebarCollapsed = false;
let currentAction = null;
let currentItemId = null;

// Initialize the admin panel
function initAdminPanel() {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (token && adminData) {
        currentAdmin = JSON.parse(adminData);
        showAdminPanel();
    } else {
        showLoginForm();
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Sidebar toggle
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
    
    // Jobs management tabs
    showUserJobsBtn.addEventListener('click', () => showJobsTab('user'));
    showDummyJobsBtn.addEventListener('click', () => showJobsTab('dummy'));
    
    // Modal buttons
    modalCancel.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', confirmAction);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    try {
        // Update to use the full server URL
        const response = await fetch('http://localhost:5000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        // Rest of your function remains the same
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    currentAdmin = null;
    showLoginForm();
}

// Show login form
function showLoginForm() {
    loginContainer.classList.remove('hidden');
    dashboardContent.classList.add('hidden');
    usersContent.classList.add('hidden');
    jobsContent.classList.add('hidden');
    statsContent.classList.add('hidden');
    
    // Reset form
    loginForm.reset();
}

// Show admin panel
function showAdminPanel() {
    loginContainer.classList.add('hidden');
    adminEmailSpan.textContent = currentAdmin.email;
    
    const welcomePanel = `
    <div class="welcome-panel bg-white p-6 rounded-lg shadow mb-6">
        <div class="flex items-center">
            <div class="mr-4">
                <span class="text-blue-500 text-4xl">👋</span>
            </div>
            <div>
                <h2 class="text-xl font-bold text-gray-800">Welcome back, ${currentAdmin.name}!</h2>
                <p class="text-gray-600">Here's what's happening today</p>
            </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex space-x-4">
                <div class="flex-1 bg-blue-50 p-3 rounded-lg">
                    <h3 class="text-sm font-medium text-blue-800">Last Login</h3>
                    <p class="text-blue-600" id="last-login">Just now</p>
                </div>
                <div class="flex-1 bg-green-50 p-3 rounded-lg">
                    <h3 class="text-sm font-medium text-green-800">Your Role</h3>
                    <p class="text-green-600">${currentAdmin.role}</p>
                </div>
            </div>
        </div>
    </div>
`;

// Insert at the top of dashboard content
const dashboardContent = document.getElementById('dashboard-content');
dashboardContent.insertAdjacentHTML('afterbegin', welcomePanel);
    // Load the current page
    navigateTo(currentPage);
}

// Toggle sidebar collapse/expand
function toggleSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
    
    if (isSidebarCollapsed) {
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
        logo.classList.add('hidden');
        navTexts.forEach(text => text.classList.add('hidden'));
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
        logo.classList.remove('hidden');
        navTexts.forEach(text => text.classList.remove('hidden'));
    }
}

// Navigate to different pages
function navigateTo(page) {
    // Hide all content sections
    dashboardContent.classList.add('hidden');
    usersContent.classList.add('hidden');
    jobsContent.classList.add('hidden');
    statsContent.classList.add('hidden');
    
    // Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active-nav'));
    
    // Update current page
    currentPage = page;
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
    
    // Show the selected page and set active nav link
    switch (page) {
        case 'dashboard':
            dashboardContent.classList.remove('hidden');
            document.querySelector('[data-page="dashboard"]').classList.add('active-nav');
            loadDashboardData();
            break;
        case 'users':
            usersContent.classList.remove('hidden');
            document.querySelector('[data-page="users"]').classList.add('active-nav');
            loadUsersData();
            break;
        case 'jobs':
            jobsContent.classList.remove('hidden');
            document.querySelector('[data-page="jobs"]').classList.add('active-nav');
            showJobsTab('user');
            loadJobsData();
            break;
        case 'stats':
            statsContent.classList.remove('hidden');
            document.querySelector('[data-page="stats"]').classList.add('active-nav');
            loadStatsData();
            break;
    }
}

// Show either user jobs or dummy jobs
function showJobsTab(type) {
    if (type === 'user') {
        userJobsContent.classList.remove('hidden');
        dummyJobsContent.classList.add('hidden');
        showUserJobsBtn.classList.remove('bg-gray-300');
        showUserJobsBtn.classList.add('bg-blue-600', 'text-white');
        showDummyJobsBtn.classList.remove('bg-blue-600', 'text-white');
        showDummyJobsBtn.classList.add('bg-gray-300');
    } else {
        userJobsContent.classList.add('hidden');
        dummyJobsContent.classList.remove('hidden');
        showDummyJobsBtn.classList.remove('bg-gray-300');
        showDummyJobsBtn.classList.add('bg-blue-600', 'text-white');
        showUserJobsBtn.classList.remove('bg-blue-600', 'text-white');
        showUserJobsBtn.classList.add('bg-gray-300');
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load dashboard data');
        }
        
        // Update stats
        document.getElementById('total-users').textContent = data.stats.totalUsers;
        document.getElementById('total-jobs').textContent = data.stats.totalJobs;
        document.getElementById('user-jobs').textContent = data.stats.totalUserJobs;
        
        // Update recent users table
        const recentUsersTable = document.getElementById('recent-users-table').querySelector('tbody');
        recentUsersTable.innerHTML = '';
        
        data.stats.recentUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border">${user.name}</td>
                <td class="py-2 px-4 border">${user.email}</td>
                <td class="py-2 px-4 border">${new Date(user.createdAt).toLocaleDateString()}</td>
            `;
            recentUsersTable.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Load users data
async function loadUsersData() {
    try {
        const response = await fetch('/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load users');
        }
        
        // Update users table
        const usersTable = document.getElementById('users-table').querySelector('tbody');
        usersTable.innerHTML = '';
        
        data.users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border">${user.name}</td>
                <td class="py-2 px-4 border">${user.email}</td>
                <td class="py-2 px-4 border">${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="py-2 px-4 border">
                    <button class="delete-user-btn px-3 py-1 bg-red-600 text-white rounded-lg text-sm" data-id="${user._id}">
                        Delete
                    </button>
                </td>
            `;
            usersTable.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmModal(
                    'Delete User',
                    'Are you sure you want to delete this user? This action cannot be undone.',
                    'deleteUser',
                    btn.dataset.id
                );
            });
        });
    } catch (error) {
        alert(error.message);
    }
}

// Load jobs data
async function loadJobsData() {
    try {
        const response = await fetch('/admin/jobs', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load jobs');
        }
        
        // Update user jobs table
        const userJobsTable = document.getElementById('user-jobs-table').querySelector('tbody');
        userJobsTable.innerHTML = '';
        
        data.userJobs.forEach(job => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border">${job.title}</td>
                <td class="py-2 px-4 border">${job.company}</td>
                <td class="py-2 px-4 border">${job.postedBy?.name || 'Unknown'}</td>
                <td class="py-2 px-4 border">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${job.type}</span>
                </td>
                <td class="py-2 px-4 border">
                    <button class="delete-job-btn px-3 py-1 bg-red-600 text-white rounded-lg text-sm" data-id="${job._id}" data-type="user">
                        Delete
                    </button>
                </td>
            `;
            userJobsTable.appendChild(row);
        });
        
        // Update dummy jobs table
        const dummyJobsTable = document.getElementById('dummy-jobs-table').querySelector('tbody');
        dummyJobsTable.innerHTML = '';
        
        data.dummyJobs.forEach(job => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border">${job.title}</td>
                <td class="py-2 px-4 border">${job.company}</td>
                <td class="py-2 px-4 border">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">${job.type}</span>
                </td>
                <td class="py-2 px-4 border">
                    <button class="delete-job-btn px-3 py-1 bg-red-600 text-white rounded-lg text-sm" data-id="${job._id}" data-type="dummy">
                        Delete
                    </button>
                </td>
            `;
            dummyJobsTable.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-job-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmModal(
                    'Delete Job',
                    'Are you sure you want to delete this job posting?',
                    'deleteJob',
                    btn.dataset.id,
                    btn.dataset.type
                );
            });
        });
    } catch (error) {
        alert(error.message);
    }
}

// Load stats data
async function loadStatsData() {
    try {
        const response = await fetch('/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load statistics');
        }
        
        // Update stats
        document.getElementById('stats-total-users').textContent = data.stats.totalUsers;
        document.getElementById('stats-total-jobs').textContent = data.stats.totalJobs;
        document.getElementById('stats-user-jobs').textContent = data.stats.totalUserJobs;
        
        // Update recent users table
        const recentUsersTable = document.getElementById('stats-recent-users-table').querySelector('tbody');
        recentUsersTable.innerHTML = '';
        
        data.stats.recentUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-2 px-4 border">${user.name}</td>
                <td class="py-2 px-4 border">${user.email}</td>
                <td class="py-2 px-4 border">${new Date(user.createdAt).toLocaleString()}</td>
            `;
            recentUsersTable.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Show confirmation modal
function showConfirmModal(title, message, action, id, type = null) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    currentAction = action;
    currentItemId = id;
    
    if (type) {
        currentAction += `:${type}`;
    }
    
    confirmModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    confirmModal.classList.add('hidden');
    currentAction = null;
    currentItemId = null;
}

// Confirm action
async function confirmAction() {
    try {
        let endpoint = '';
        let method = 'DELETE';
        
        switch (currentAction) {
            case 'deleteUser':
                endpoint = `/admin/users/${currentItemId}`;
                break;
            case 'deleteJob:user':
            case 'deleteJob:dummy':
                endpoint = `/admin/jobs/${currentItemId}`;
                break;
            default:
                throw new Error('Unknown action');
        }
        
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Action failed');
        }
        
        // Reload the current page to reflect changes
        navigateTo(currentPage);
        closeModal();
    } catch (error) {
        alert(error.message);
        closeModal();
    }
}

// Initialize the admin panel when the page loads
document.addEventListener('DOMContentLoaded', initAdminPanel);