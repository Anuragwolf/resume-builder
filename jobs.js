// Sample job data
const jobs = [
    {
        id: 1,
        title: "Senior Software Developer",
        company: "Tata Consultancy Services (TCS)",
        location: "Mumbai, Maharashtra",
        type: "Full Time",
        salary: "₹12L - ₹18L",
        posted: "1 day ago",
        description: "Looking for an experienced Java developer with strong knowledge of Spring Boot and microservices architecture. Experience in cloud platforms (AWS/Azure) is preferred.",
        tags: ["Java", "Spring Boot", "Microservices", "4+ Years"],
        logo: "https://www.freepnglogos.com/uploads/tata-consultancy-services-tcs-logo-png-3.png"
    },
    {
        id: 2,
        title: "Full Stack Developer",
        company: "Infosys",
        location: "Bangalore, Karnataka",
        type: "Full Time",
        salary: "₹10L - ₹15L",
        posted: "2 days ago",
        description: "Seeking a Full Stack Developer with expertise in React.js and Node.js. Experience with MongoDB and AWS services is required.",
        tags: ["React.js", "Node.js", "MongoDB", "3+ Years"],
        logo: "https://www.freepnglogos.com/uploads/infosys-logo-png-1.png"
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "Wipro",
        location: "Hyderabad, Telangana",
        type: "Full Time",
        salary: "₹11L - ₹16L",
        posted: "3 days ago",
        description: "Looking for a DevOps Engineer with experience in CI/CD pipelines, Docker, Kubernetes, and cloud platforms. Knowledge of Terraform and Ansible is preferred.",
        tags: ["DevOps", "Kubernetes", "Docker", "4+ Years"],
        logo: "https://www.freepnglogos.com/uploads/wipro-logo-png-1.png"
    },
    {
        id: 4,
        title: "Data Scientist",
        company: "HCL Technologies",
        location: "Noida, Uttar Pradesh",
        type: "Full Time",
        salary: "₹13L - ₹19L",
        posted: "4 days ago",
        description: "Seeking a Data Scientist with expertise in machine learning, deep learning, and big data technologies. Experience with Python, TensorFlow, and PyTorch is required.",
        tags: ["Machine Learning", "Python", "TensorFlow", "3+ Years"],
        logo: "https://www.freepnglogos.com/uploads/hcl-logo-png-1.png"
    },
    {
        id: 5,
        title: "UI/UX Designer",
        company: "Tech Mahindra",
        location: "Pune, Maharashtra",
        type: "Full Time",
        salary: "₹8L - ₹12L",
        posted: "5 days ago",
        description: "Looking for a UI/UX Designer with experience in creating user-centered designs. Must be proficient in Figma, Adobe XD, and have a strong portfolio.",
        tags: ["UI/UX", "Figma", "Adobe XD", "3+ Years"],
        logo: "https://www.freepnglogos.com/uploads/tech-mahindra-logo-png-1.png"
    }
];

// Function to create job card HTML
function createJobCard(job) {
    return `
        <div class="job-card animate__animated animate__fadeIn">
            <img src="${job.logo}" alt="${job.company}" class="company-logo">
            <div class="job-details">
                <h3 class="job-title">${job.title}</h3>
                <p class="company-name">${job.company}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                    <span><i class="fas fa-clock"></i> Posted ${job.posted}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-actions">
                    <a href="#" class="apply-btn">Apply Now</a>
                    <a href="#" class="save-btn"><i class="far fa-bookmark"></i> Save</a>
                </div>
            </div>
        </div>
    `;
}

// Function to filter jobs
function filterJobs() {
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const locationFilter = document.getElementById('locationFilter');
    
    let filteredJobs = [...jobs];
    
    // Apply job type filter if it exists
    if (jobTypeFilter) {
        const jobType = jobTypeFilter.value;
        if (jobType) {
            filteredJobs = filteredJobs.filter(job => 
                job.type.toLowerCase().replace(' ', '-') === jobType.toLowerCase()
            );
        }
    }
    
    // Apply experience filter
    if (experienceFilter) {
        const experience = experienceFilter.value;
        if (experience) {
            filteredJobs = filteredJobs.filter(job => {
                const yearsTag = job.tags.find(tag => tag.includes('Years'));
                if (!yearsTag) return false;
                
                const years = parseInt(yearsTag.split('+')[0]);
                switch(experience) {
                    case 'entry':
                        return years <= 2;
                    case 'mid':
                        return years > 2 && years <= 5;
                    case 'senior':
                        return years > 5 && years <= 8;
                    case 'lead':
                        return years > 8;
                    default:
                        return true;
                }
            });
        }
    }
    
    // Apply location filter
    if (locationFilter) {
        const location = locationFilter.value;
        if (location) {
            filteredJobs = filteredJobs.filter(job => {
                const jobLocation = job.location.toLowerCase();
                switch(location) {
                    case 'remote':
                        return jobLocation.includes('remote');
                    case 'onsite':
                        return !jobLocation.includes('remote') && !jobLocation.includes('hybrid');
                    case 'hybrid':
                        return jobLocation.includes('hybrid');
                    default:
                        return true;
                }
            });
        }
    }
    
    // Update job list
    const jobList = document.querySelector('.job-list');
    jobList.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
    
    // Update job count
    const jobCount = document.getElementById('jobCount');
    if (jobCount) {
        jobCount.textContent = filteredJobs.length;
    }
}

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to filters
    const filters = document.querySelectorAll('.filter-group select');
    filters.forEach(filter => {
        filter.addEventListener('change', filterJobs);
    });
    
    // Initial job list render
    filterJobs();
}); 