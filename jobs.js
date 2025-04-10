// Function to fetch jobs from MongoDB
async function fetchJobs() {
    try {
        const response = await fetch('http://localhost:5000/api/jobs');
        const jobs = await response.json();
        console.log('Fetched jobs:', jobs); // Debug log
        return jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

// Function to create job card HTML
function createJobCard(job) {
    return `
        <div class="job-card">
            <div class="job-header">
                <img src="${job.logo}" alt="${job.company} Logo" class="company-logo">
                <div class="job-title">
                    <h3>${job.title}</h3>
                    <p class="company-name">${job.company}</p>
                </div>
            </div>
            <div class="job-details">
                <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
            </div>
            <div class="job-description">
                <p>${job.description ? job.description.substring(0, 150) + '...' : ''}</p>
            </div>
            <div class="job-tags">
                ${job.tags ? job.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
            <div class="job-footer">
                <span class="posted-date">Posted ${new Date(job.posted).toLocaleDateString()}</span>
                <button class="apply-btn">Apply Now</button>
            </div>
        </div>
    `;
}

// Function to filter jobs
async function filterJobs() {
    try {
        // Fetch jobs from MongoDB
        const jobs = await fetchJobs();
        console.log('Number of jobs:', jobs.length); // Debug log

        const jobType = document.getElementById('jobTypeFilter')?.value || 'all';
        const experience = document.getElementById('experienceFilter')?.value || 'all';
        const location = document.getElementById('locationFilter')?.value || 'all';

        let filteredJobs = jobs;

        // Apply filters
        if (jobType !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.type.toLowerCase() === jobType.toLowerCase());
        }

        if (experience !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.experience.toLowerCase() === experience.toLowerCase());
        }

        if (location !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.location.toLowerCase() === location.toLowerCase());
        }

        // Update job list
        const jobList = document.getElementById('jobList');
        if (jobList) {
            if (filteredJobs.length === 0) {
                jobList.innerHTML = '<div class="no-jobs">No jobs found</div>';
            } else {
                jobList.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
            }
        } else {
            console.error('Job list container not found!'); // Debug log
        }

        // Update job count
        const jobCount = document.getElementById('jobCount');
        if (jobCount) {
            jobCount.textContent = filteredJobs.length;
        }
    } catch (error) {
        console.error('Error filtering jobs:', error);
    }
}

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing jobs...'); // Debug log
    
    // Add event listeners to filter selects
    const filterSelects = document.querySelectorAll('select[id$="Filter"]');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterJobs);
    });

    // Initial render
    filterJobs();
}); 