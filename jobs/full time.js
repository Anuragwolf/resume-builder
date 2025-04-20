const dummyJobs = [
    {
        id: 1,
        companyLogo: "https://th.bing.com/th/id/OIP.SfcdSZkdd0Qocn5q8OZEQgHaDq?rs=1&pid=ImgDetMain",
        jobTitle: "Software Engineer",
        companyName: "TechCorp",
        location: "Remote",
        experience: "2-5 years",
        salary: "₹8L - ₹12L",
        jobType: "Full-Time",
        description: "We are looking for a skilled Software Engineer to join our team and help build innovative software solutions.",
        tags: ["JavaScript", "React", "Node.js"]
    },
    {
        id: 2,
        companyLogo: "https://th.bing.com/th/id/OIP.rPsYFjkXGz8Tsvis0EznTQHaHa?rs=1&pid=ImgDetMain",
        jobTitle: "Data Scientist",
        companyName: "DataWorks",
        location: "Hybrid",
        experience: "3-6 years",
        salary: "₹10L - ₹15L",
        jobType: "Full-Time",
        description: "Join our data science team to analyze large datasets and build predictive models.",
        tags: ["Python", "Machine Learning", "Data Analysis"]
    },
    {
        id: 3,
        companyLogo: "https://th.bing.com/th/id/OIP.RIJ5A5itQU7qNvxunSpc3gHaFb?rs=1&pid=ImgDetMain",
        jobTitle: "Product Manager",
        companyName: "Innovate Inc.",
        location: "On-site",
        experience: "5-8 years",
        salary: "₹12L - ₹18L",
        jobType: "Full-Time",
        description: "We are seeking an experienced Product Manager to lead our product development team.",
        tags: ["Product Management", "Agile", "Scrum"]
    },
    {
        id: 4,
        companyLogo: "https://thumbs.dreamstime.com/b/design-studio-logo-template-design-vector-illustration-87086841.jpg",
        jobTitle: "UI/UX Designer",
        companyName: "DesignStudio",
        location: "Remote",
        experience: "1-3 years",
        salary: "₹6L - ₹9L",
        jobType: "Full-Time",
        description: "We are looking for a creative UI/UX Designer to design user-friendly interfaces.",
        tags: ["Figma", "Adobe XD", "Wireframing"]
    },
    {
        id: 5,
        companyLogo: "https://th.bing.com/th/id/OIP.vDm821Kw0x9-pBhGnxlKCgHaEK?rs=1&pid=ImgDetMain",
        jobTitle: "DevOps Engineer",
        companyName: "CloudTech",
        location: "Hybrid",
        experience: "3-5 years",
        salary: "₹9L - ₹13L",
        jobType: "Full-Time",
        description: "Join our DevOps team to manage and optimize our cloud infrastructure.",
        tags: ["AWS", "Docker", "Kubernetes"]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const jobList = document.querySelector('.job-list');

    // Function to create a job card
    function createJobCard(job) {
        return `
            <div class="job-card">
                <img src="${job.companyLogo}" alt="${job.companyName}" class="company-logo">
                <div class="job-details">
                    <h3 class="job-title">${job.jobTitle}</h3>
                    <p class="company-name">${job.companyName}</p>
                    <div class="job-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span><i class="fas fa-briefcase"></i> ${job.experience}</span>
                        <span><i class="fas fa-rupee-sign"></i> ${job.salary}</span>
                    </div>
                    <p class="job-description">${job.description}</p>
                    <div class="job-tags">
                        ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="job-actions">
                        <a href="#" class="apply-btn">Apply Now</a>
                        <a href="#" class="save-btn">Save Job</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render all job cards
    jobList.innerHTML = dummyJobs.map(job => createJobCard(job)).join('');
});