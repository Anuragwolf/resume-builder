const jobs = [
    {
        title: "Software Engineer",
        company: "Tech Solutions",
        experience: "mid",
        type: "full-time",
        location: "onsite",
        description: "Develop and maintain software applications.",
        tags: ["JavaScript", "React", "Node.js"]
    },
    {
        title: "Data Analyst",
        company: "DataCorp",
        experience: "entry",
        type: "full-time",
        location: "remote",
        description: "Analyze data and generate reports.",
        tags: ["Excel", "SQL", "Python"]
    },
    {
        title: "Project Manager",
        company: "Business Innovations",
        experience: "senior",
        type: "part-time",
        location: "hybrid",
        description: "Manage projects and coordinate teams.",
        tags: ["Agile", "Scrum", "Leadership"]
    },
    {
        title: "Web Developer",
        company: "Creative Agency",
        experience: "mid",
        type: "freelance",
        location: "remote",
        description: "Build and maintain websites.",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "Graphic Designer",
        company: "Design Studio",
        experience: "entry",
        type: "full-time",
        location: "onsite",
        description: "Create visual concepts and designs.",
        tags: ["Photoshop", "Illustrator", "Creativity"]
    }
];

// Function to display jobs
function displayJobs(filteredJobs) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = ''; // Clear previous jobs

    filteredJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-details">
                <h2 class="job-title">${job.title}</h2>
                <p class="company-name">${job.company}</p>
                <p class="job-description">${job.description}</p>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${job.experience}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                </div>
                <div class="job-actions">
                    <a href="#" class="apply-btn">Apply Now</a>
                    <a href="#" class="save-btn">Save Job</a>
                </div>
            </div>
        `;
        jobList.appendChild(jobCard);
    });

    // Update job count
    document.getElementById('jobCount').innerText = filteredJobs.length;
}

// Function to filter jobs based on selected criteria
function filterJobs() {
    const jobType = document.getElementById('jobTypeFilter').value;
    const experienceLevel = document.getElementById('experienceFilter').value;
    const location = document.getElementById('locationFilter').value;

    const filteredJobs = jobs.filter(job => {
        return (jobType === '' || job.type === jobType) &&
               (experienceLevel === '' || job.experience === experienceLevel) &&
               (location === '' || job.location === location);
    });

    displayJobs(filteredJobs);
}

// Event listeners for filters
document.getElementById('jobTypeFilter').addEventListener('change', filterJobs);
document.getElementById('experienceFilter').addEventListener('change', filterJobs);
document.getElementById('locationFilter').addEventListener('change', filterJobs);

// Initial display of all jobs
displayJobs(jobs);

// Add event listeners for Apply and Save buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('apply-btn') || 
        e.target.parentElement.classList.contains('apply-btn')) {
        e.preventDefault();
        alert('Application functionality will be implemented soon!');
    }
    
    if (e.target.classList.contains('save-btn') || 
        e.target.parentElement.classList.contains('save-btn')) {
        e.preventDefault();
        alert('Job saved to your favorites!');
    }
});

// Redirect to jobs.html when Browse Jobs button is clicked (in other pages)
function redirectToJobs() {
    window.location.href = "jobs.html";
}