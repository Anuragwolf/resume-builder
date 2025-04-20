const dummyFreelancingJobs = [
    {
        id: 1,
        jobTitle: "Web Developer",
        company: "TechSolutions India",
        location: "Remote",
        experience: "3+ years",
        rate: "₹500 - ₹800/hour",
        jobType: "Freelance",
        description: "We are looking for a skilled web developer to build and maintain websites for our clients.",
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        postedOn: "2023-10-01"
    },
    {
        id: 2,
        jobTitle: "Graphic Designer",
        company: "DesignCraft India",
        location: "Remote",
        experience: "2+ years",
        rate: "₹400 - ₹600/hour",
        jobType: "Freelance",
        description: "We need a creative graphic designer to design marketing materials and social media posts.",
        skills: ["Adobe Photoshop", "Illustrator", "Canva", "UI/UX Design"],
        postedOn: "2023-10-02"
    },
    {
        id: 3,
        jobTitle: "Content Writer",
        company: "ContentMakers India",
        location: "Remote",
        experience: "1+ years",
        rate: "₹300 - ₹500/hour",
        jobType: "Freelance",
        description: "We are hiring a content writer to create engaging blog posts and articles for our website.",
        skills: ["Content Writing", "SEO", "Blogging", "Copywriting"],
        postedOn: "2023-10-03"
    },
    {
        id: 4,
        jobTitle: "Digital Marketing Specialist",
        company: "MarketGuru India",
        location: "Remote",
        experience: "4+ years",
        rate: "₹600 - ₹1000/hour",
        jobType: "Freelance",
        description: "We need a digital marketing expert to manage our online campaigns and improve ROI.",
        skills: ["SEO", "Social Media Marketing", "Google Ads", "Analytics"],
        postedOn: "2023-10-04"
    },
    {
        id: 5,
        jobTitle: "Mobile App Developer",
        company: "AppCraft India",
        location: "Remote",
        experience: "5+ years",
        rate: "₹700 - ₹1200/hour",
        jobType: "Freelance",
        description: "We are looking for a mobile app developer to build and maintain cross-platform apps.",
        skills: ["Flutter", "React Native", "Android", "iOS"],
        postedOn: "2023-10-05"
    },
    {
        id: 6,
        jobTitle: "Video Editor",
        company: "VideoMakers India",
        location: "Remote",
        experience: "3+ years",
        rate: "₹500 - ₹800/hour",
        jobType: "Freelance",
        description: "We need a video editor to create high-quality video content for our YouTube channel.",
        skills: ["Premiere Pro", "After Effects", "Motion Graphics", "Video Editing"],
        postedOn: "2023-10-06"
    },
    {
        id: 7,
        jobTitle: "Data Analyst",
        company: "DataInsights India",
        location: "Remote",
        experience: "4+ years",
        rate: "₹600 - ₹1000/hour",
        jobType: "Freelance",
        description: "We are hiring a data analyst to analyze large datasets and provide actionable insights.",
        skills: ["Python", "SQL", "Excel", "Data Visualization"],
        postedOn: "2023-10-07"
    },
    {
        id: 8,
        jobTitle: "E-commerce Developer",
        company: "ShopifyExperts India",
        location: "Remote",
        experience: "3+ years",
        rate: "₹500 - ₹900/hour",
        jobType: "Freelance",
        description: "We need an e-commerce developer to set up and optimize Shopify stores for our clients.",
        skills: ["Shopify", "WooCommerce", "WordPress", "E-commerce"],
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
                        <span><i class="fas fa-rupee-sign"></i> ${job.rate}</span>
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

    // Render all freelancing job cards
    jobList.innerHTML = dummyFreelancingJobs.map(job => createJobCard(job)).join('');
});