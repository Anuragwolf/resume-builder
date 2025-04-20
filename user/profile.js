document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ profile.js loaded");
    fetchCurrentUser();
    
    // Logout button event listener
    document.getElementById("logoutBtn").addEventListener("click", logout);
});
document.addEventListener("DOMContentLoaded", function() {
    // ... your existing code ...
    
    // Add event listener for Browse Jobs button
    const browseJobsBtn = document.getElementById("browseJobsBtn");
    if (browseJobsBtn) {
        browseJobsBtn.addEventListener("click", function() {
            window.location.href = "../jobs.html";
        });
    }
});
// Fetch current user data
async function fetchCurrentUser () {
    document.getElementById("loadingSpinner").style.display = "block"; // Show loading spinner
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/current-user", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // Parse the JSON response

        // Check if the response status is 401 (Unauthorized)
        if (response.status === 401) {
            alert("Please log in to access your profile.");
            window.location.href = "../login.html"; // Redirect to login page
            return;
        }

        // Parse the JSON response
        const data = await response.json();
        
        if (data.success) {
            updateProfileUI(data.user);
        } else {
            console.error("Failed to fetch user data:", data.message);
            alert("Failed to fetch user data. Please log in again.");
            window.location.href = "../login.html"; // Redirect to login page
        }
    } catch (error) {
        console.error("Error fetching current user:", error);
        alert("An error occurred while fetching user data.");
    } finally {
        document.getElementById("loadingSpinner").style.display = "none"; // Hide loading spinner
    }
}
// Update the profile UI with user data
function updateProfileUI(user) {
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userPhone").textContent = user.phone || "N/A";
    document.getElementById("userLocation").textContent = user.location || "N/A";
    document.getElementById("userPosition").textContent = user.position || "N/A";
    document.getElementById("userExperience").textContent = user.experience || "N/A";
    document.getElementById("userSkills").textContent = user.skills?.join(", ") || "N/A";
    document.getElementById("userEducation").textContent = user.education || "N/A";

   

// Logout function
async function logout() {
    try {
        debugger;
        const response = await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include" // Include cookies
        });

        const data = await response.json();
        
        if (data.success) {
            // Clear session storage and redirect to login page
            sessionStorage.removeItem('authUser');
            window.location.href = "../login.html"; // Redirect to login page
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout.");
    }
}
}

