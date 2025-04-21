let jobs = [];
let filteredJobs = [];
let currentPage = 1;
const jobsPerPage = 4;

// Function to fetch jobs from the API
async function fetchJobs() {
    try {
        const response = await fetch('http://localhost:5000/api/jobs');

        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            jobs = data;
        } else if (data.jobs && Array.isArray(data.jobs)) {
            jobs = data.jobs;
        } else if (data.data && Array.isArray(data.data)) {
            jobs = data.data;
        } else {
            console.error("Unexpected data structure:", data);
            throw new Error('Invalid data structure received from API');
        }

        filteredJobs = jobs;
        console.log("Jobs loaded:", jobs);
        renderPaginatedJobs();
    } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to load jobs. Please try again later.");
    }
}

document.addEventListener('DOMContentLoaded', fetchJobs);

function renderPaginatedJobs() {
    const start = (currentPage - 1) * jobsPerPage;
    const end = start + jobsPerPage;
    displayJobs(filteredJobs.slice(start, end));
    renderPaginationControls();
}

function renderPaginationControls() {
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');

    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = 'pagination-btn';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderPaginatedJobs();
        });
        paginationContainer.appendChild(button);
    }
}

function displayJobs(jobsToShow) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';

    if (!Array.isArray(jobsToShow)) {
        console.error("filteredJobs is not an array:", jobsToShow);
        jobList.innerHTML = '<div class="no-jobs-found">Error loading jobs. Please refresh the page.</div>';
        return;
    }

    if (jobsToShow.length === 0) {
        jobList.innerHTML = '<div class="no-jobs-found">No jobs found matching your criteria.</div>';
        return;
    }

    jobsToShow.forEach(job => {
        if (!job) return;

        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-details">
                <h2 class="job-title">${job.title || 'Untitled Position'}</h2>
                <p class="company-name">${job.company || 'Unknown Company'}</p>
                <p class="job-description">${job.description || 'No description provided'}</p>
                <div class="job-tags">
                    ${Array.isArray(job.tags) ? job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-briefcase"></i> ${job.type || 'Not specified'}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${job.experience || 'Not specified'}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location || 'Not specified'}</span>
                    ${job.salary ? `<span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>` : ''}
                </div>
                <div class="job-actions">
                    <a href="#" class="apply-btn" data-id="${job._id || job.jobId}">Apply Now</a>
                    <a href="#" class="save-btn" data-id="${job._id || job.jobId}">Save Job</a>
                </div>
            </div>
        `;
        jobList.appendChild(jobCard);
    });

    document.getElementById('jobCount').innerText = filteredJobs.length;
}

function filterJobs() {
    const jobType = document.getElementById('jobTypeFilter').value;
    const experienceLevel = document.getElementById('experienceFilter').value;
    const location = document.getElementById('locationFilter').value;

    filteredJobs = jobs.filter(job => {
        return (!jobType || (job.type && job.type.toLowerCase() === jobType.toLowerCase())) &&
               (!experienceLevel || (job.experience && job.experience.toLowerCase() === experienceLevel.toLowerCase())) &&
               (!location || (job.location && job.location.toLowerCase() === location.toLowerCase()));
    });

    currentPage = 1;
    renderPaginatedJobs();
}

['jobTypeFilter', 'experienceFilter', 'locationFilter'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', filterJobs);
    }
});

document.addEventListener('click', async function (e) {
    if (!e.target.matches('.apply-btn, .save-btn')) return;
    e.preventDefault();

    const jobId = e.target.getAttribute('data-id');
    const job = jobs.find(j => (j._id === jobId) || (j.jobId === jobId));

    if (!job) {
        alert("Job not found.");
        return;
    }

    if (e.target.classList.contains('apply-btn')) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to apply for jobs.");
            return;
        }

        try {
            console.log("Applying for job:", job);
            const response = await fetch("http://localhost:5000/api/apply-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId: job._id || job.jobId,
                    title: job.title,
                    company: job.company,
                    description: job.description || ""
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Apply job error response:", errorText);
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            if (result.success) {
                alert(`Applied to ${job.title} at ${job.company}!`);
            } else {
                alert(result.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error applying:", err);
            alert("Server error: " + err.message);
        }
    }

    if (e.target.classList.contains('save-btn')) {
        let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

        if (!savedJobs.includes(jobId)) {
            savedJobs.push(jobId);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            alert("Job saved!");
        } else {
            alert("Job already saved.");
        }
    }
});

function redirectToJobs() {
    window.location.href = "jobs.html";
}
