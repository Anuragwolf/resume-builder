document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ profile.js loaded");
    fetchCurrentUser();
    
    // Logout button event listener
    document.getElementById("logoutBtn").addEventListener("click", logout);
});
document.addEventListener("DOMContentLoaded", function() {
    // ... your existing code ...
    document.getElementById("postJobBtn").addEventListener("click", function() {
        window.location.href = "../post-job.html"; // Or your job posting page URL
      });
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
// Add this inside the DOMContentLoaded event listener

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
       
    }
}
}

// Fetch applied jobs from the server and display them
async function fetchAppliedJobs() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to view your applied jobs.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/my-applied-jobs", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (result.success) {
            displayAppliedJobs(result.appliedJobs);
        } else {
            alert(result.message || "Something went wrong.");
        }
    } catch (err) {
        console.error("Error fetching applied jobs:", err);
        alert("Server error. Please try again later.");
    }
}

// Function to display the applied jobs
function displayAppliedJobs(appliedJobs) {
    const appliedJobsList = document.getElementById("appliedJobsList");
    appliedJobsList.innerHTML = "";

    if (appliedJobs.length === 0) {
        appliedJobsList.innerHTML = "<p>You haven't applied to any jobs yet.</p>";
    }

    appliedJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";
        jobCard.innerHTML = `
            <div class="job-details">
                <h2 class="job-title">${job.title}</h2>
                <p class="company-name">${job.company}</p>
                <p class="job-description">Applied on: ${new Date(job.appliedAt).toLocaleDateString()}</p>
            </div>
        `;
        appliedJobsList.appendChild(jobCard);
    });
}

// Call the fetch function on page load
document.addEventListener("DOMContentLoaded", fetchAppliedJobs);// Function to display the applied jobs in card format
// Function to display the applied jobs in card format
function displayAppliedJobs(appliedJobs) {
    const appliedJobsList = document.getElementById("appliedJobsList");
    appliedJobsList.innerHTML = "";

    if (appliedJobs.length === 0) {
        appliedJobsList.innerHTML = "<p>You haven't applied to any jobs yet.</p>";
        return;
    }

    // ✅ Remove duplicates based on jobId
    const uniqueJobsMap = new Map();
    appliedJobs.forEach(job => {
        if (!uniqueJobsMap.has(job.jobId)) {
            uniqueJobsMap.set(job.jobId, job);
        }
    });

    const uniqueJobs = Array.from(uniqueJobsMap.values());

    uniqueJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = "job-card applied-job-card";
        jobCard.innerHTML = `
            <div class="job-details">
                <h2 class="job-title">${job.title}</h2>
                <p class="company-name">${job.company}</p>
                <p class="job-description">${job.description}</p>
                <div class="job-meta">
                    <span><i class="fas fa-briefcase"></i> ${job.type || "N/A"}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${job.experience || "N/A"}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location || "N/A"}</span>
                </div>
                <div class="job-applied-date">
                    <p>Applied on: ${new Date(job.appliedAt).toLocaleDateString()}</p>
                </div>
                <div class="job-actions">
                    <button class="remove-btn" data-id="${job.jobId}">Remove</button>
                </div>
            </div>
        `;
        appliedJobsList.appendChild(jobCard);
    });
}

// Add event listener for remove buttons
// Handle the "Remove" button click
document.addEventListener('click', async function (e) {
    if (!e.target.matches('.remove-btn')) return;
    e.preventDefault();

    const jobId = e.target.getAttribute('data-id');
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to remove jobs.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/remove-applied-job", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ jobId })
        });

        const result = await response.json();
        if (result.success) {
            alert("Job removed successfully!");

            // Remove the job card from the UI
            const jobCard = e.target.closest('.job-card');
            if (jobCard) {
                jobCard.remove();
            }
        } else {
            alert(result.message || "Something went wrong.");
        }
    } catch (err) {
        console.error("Error removing:", err);
        alert("Server error. Please try again later.");
    }
});
    