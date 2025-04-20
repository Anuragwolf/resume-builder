const dummyRemoteJobs = [
    {
        id: 1,
        jobTitle: "Frontend Developer",
        company: "TechSolutions Remote",
        location: "Remote",
        experience: "3+ years",
        salary: "₹8L - ₹12L/year",
        jobType: "Full-Time",
        description: "We are looking for a skilled Frontend Developer to build and maintain user-friendly web applications.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        postedOn: "2023-10-01"
    },
    {
        id: 2,
        jobTitle: "Content Writer",
        company: "ContentMakers Remote",
        location: "Remote",
        experience: "1+ years",
        salary: "₹3L - ₹5L/year",
        jobType: "Part-Time",
        description: "We are hiring a Content Writer to create engaging blog posts and articles for our website.",
        skills: ["Content Writing", "SEO", "Blogging"],
        postedOn: "2023-10-02"
    },
    {
        id: 3,
        jobTitle: "Digital Marketing Specialist",
        company: "MarketGuru Remote",
        location: "Remote",
        experience: "4+ years",
        salary: "₹6L - ₹10L/year",
        jobType: "Full-Time",
        description: "We need a Digital Marketing Specialist to manage our online campaigns and improve ROI.",
        skills: ["SEO", "Social Media Marketing", "Google Ads"],
        postedOn: "2023-10-03"
    },
    {
        id: 4,
        jobTitle: "Data Analyst",
        company: "DataInsights Remote",
        location: "Remote",
        experience: "3+ years",
        salary: "₹7L - ₹11L/year",
        jobType: "Full-Time",
        description: "We are hiring a Data Analyst to analyze large datasets and provide actionable insights.",
        skills: ["Python", "SQL", "Excel", "Data Visualization"],
        postedOn: "2023-10-04"
    },
    {
        id: 5,
        jobTitle: "UI/UX Designer",
        company: "DesignCraft Remote",
        location: "Remote",
        experience: "2+ years",
        salary: "₹5L - ₹8L/year",
        jobType: "Full-Time",
        description: "We need a creative UI/UX Designer to design user-friendly interfaces for our applications.",
        skills: ["Figma", "Adobe XD", "Wireframing"],
        postedOn: "2023-10-05"
    },
    {
        id: 6,
        jobTitle: "Backend Developer",
        company: "AppCraft Remote",
        location: "Remote",
        experience: "4+ years",
        salary: "₹9L - ₹13L/year",
        jobType: "Full-Time",
        description: "We are looking for a Backend Developer to build and maintain scalable server-side applications.",
        skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
        postedOn: "2023-10-06"
    },
    {
        id: 7,
        jobTitle: "Video Editor",
        company: "VideoMakers Remote",
        location: "Remote",
        experience: "2+ years",
        salary: "₹4L - ₹6L/year",
        jobType: "Part-Time",
        description: "We need a Video Editor to create high-quality video content for our YouTube channel.",
        skills: ["Premiere Pro", "After Effects", "Motion Graphics"],
        postedOn: "2023-10-07"
    },
    {
        id: 8,
        jobTitle: "E-commerce Manager",
        company: "ShopifyExperts Remote",
        location: "Remote",
        experience: "3+ years",
        salary: "₹6L - ₹9L/year",
        jobType: "Full-Time",
        description: "We are hiring an E-commerce Manager to manage and optimize our Shopify store.",
        skills: ["Shopify", "E-commerce", "Digital Marketing"],
        postedOn: "2023-10-08"
    }
];
document.addEventListener('DOMContentLoaded', function() {
    const jobList = document.querySelector('.job-list');

    // Function to create a job card
    function createJobCard(job) {
        return `
            <div class="job-card">
                <div class="job-details">
                    <h3 class="job-title">${job.jobTitle}</h3>
                    <p class="company-name">${job.company}</p>
                    <div class="job-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span><i class="fas fa-briefcase"></i> ${job.experience}</span>
                        <span><i class="fas fa-rupee-sign"></i> ${job.salary}</span>
                    </div>
                    <p class="job-description">${job.description}</p>
                    <div class="job-tags">
                        ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="job-actions">
                        <a href="#" class="apply-btn">Apply Now</a>
                        <a href="#" class="save-btn">Save Job</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render all remote job cards
    jobList.innerHTML = dummyRemoteJobs.map(job => createJobCard(job)).join('');
});