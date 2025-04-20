const dummyPartTimeJobs = [
    {
        id: 1,
        companyLogo: "https://th.bing.com/th/id/OIP.MrlsFM2Ynsl1_nqCpqPH2wAAAA?rs=1&pid=ImgDetMain",
        jobTitle: "Content Writer",
        companyName: "Blogify India",
        location: "Remote",
        experience: "0-1 years",
        salary: "₹10K - ₹20K/month",
        jobType: "Part-Time",
        description: "We are looking for a creative Content Writer to write engaging blog posts and articles for our Indian audience.",
        tags: ["Content Writing", "SEO", "Blogging"]
    },
    {
        id: 2,
        companyLogo: "https://th.bing.com/th/id/OIP.BIoEMNS-AxfESIn_Ifz8NgAAAA?rs=1&pid=ImgDetMain",
        jobTitle: "Social Media Manager",
        companyName: "SocialBuzz India",
        location: "Remote",
        experience: "1-2 years",
        salary: "₹15K - ₹25K/month",
        jobType: "Part-Time",
        description: "Manage social media accounts and create engaging content for our Indian clients.",
        tags: ["Social Media", "Content Creation", "Marketing"]
    },
    {
        id: 3,
        companyLogo: "https://th.bing.com/th/id/OIP.xjF7ZC5FRZflZQtIOVLingHaB5?rs=1&pid=ImgDetMain",
        jobTitle: "Graphic Designer",
        companyName: "DesignHub India",
        location: "Remote",
        experience: "1-3 years",
        salary: "₹20K - ₹30K/month",
        jobType: "Part-Time",
        description: "Create visually appealing designs for our marketing campaigns and social media in India.",
        tags: ["Graphic Design", "Adobe Photoshop", "Illustrator"]
    },
    {
        id: 4,
        companyLogo: "https://th.bing.com/th/id/OIP.bJmnQv518nzOF88-QgNO-AHaC5?rs=1&pid=ImgDetMain",
        jobTitle: "Customer Support Representative",
        companyName: "Supportify India",
        location: "Remote",
        experience: "0-1 years",
        salary: "₹12K - ₹18K/month",
        jobType: "Part-Time",
        description: "Provide excellent customer support via chat, email, and phone for our Indian customers.",
        tags: ["Customer Support", "Communication", "Problem Solving"]
    },
    {
        id: 5,
        companyLogo: "https://edutorsindia.co.in/1upload/308/images/5010-4491-edutor_logo.png",
        jobTitle: "Tutor (Maths & Science)",
        companyName: "EduTutors India",
        location: "Remote",
        experience: "1-2 years",
        salary: "₹15K - ₹25K/month",
        jobType: "Part-Time",
        description: "Teach Maths and Science to Indian students in grades 6-10.",
        tags: ["Teaching", "Maths", "Science"]
    },
    {
        id: 6,
        companyLogo: "https://th.bing.com/th/id/R.1c8a5e563fbdf6ce5f3f931582d6717d?rik=m1FdwqsNrQRLkA&riu=http%3a%2f%2fwww.dataworks.pro%2fwp-content%2fuploads%2f2023%2f11%2fcropped-cropped-DataWorks-logo-bhanu-client-final1.png&ehk=vinu%2fhRIlMXfZXRVYwwtPI2ddt7KGkU14mYnS8JfJN8%3d&risl=&pid=ImgRaw&r=0",
        jobTitle: "Data Entry Operator",
        companyName: "DataWorks India",
        location: "Remote",
        experience: "0-1 years",
        salary: "₹8K - ₹12K/month",
        jobType: "Part-Time",
        description: "Perform data entry tasks for our Indian clients with accuracy and efficiency.",
        tags: ["Data Entry", "MS Excel", "Typing"]
    },
    {
        id: 7,
        companyLogo: "https://th.bing.com/th/id/OIP.Ug5TTshLAQBrB5vvTrUwkwHaHa?rs=1&pid=ImgDetMain",
        jobTitle: "Digital Marketing Intern",
        companyName: "Marketify India",
        location: "Remote",
        experience: "0-1 years",
        salary: "₹10K - ₹15K/month",
        jobType: "Part-Time",
        description: "Assist in digital marketing campaigns for Indian businesses.",
        tags: ["Digital Marketing", "SEO", "Social Media"]
    },
    {
        id: 8,
        companyLogo: "https://th.bing.com/th/id/OIP.dr7C-FrqElQpT5qKSA4MnAHaBD?rs=1&pid=ImgDetMain",
        jobTitle: "Video Editor",
        companyName: "VideoCraft India",
        location: "Remote",
        experience: "1-2 years",
        salary: "₹18K - ₹25K/month",
        jobType: "Part-Time",
        description: "Edit and produce high-quality videos for our Indian clients.",
        tags: ["Video Editing", "Premiere Pro", "After Effects"]
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
    jobList.innerHTML = dummyPartTimeJobs.map(job => createJobCard(job)).join('');
});