const dummyFreelancers = [
    {
        id: 1,
        profilePic: "https://th.bing.com/th/id/OIP.1eLuovnhTLI8WopgYvpgpwHaJ1?w=1392&h=1848&rs=1&pid=ImgDetMain",
        name: "Rahul Sharma",
        skills: ["Web Development", "JavaScript", "React", "Node.js"],
        experience: "5 years",
        location: "Bangalore, India",
        rate: "₹800/hour",
        description: "Experienced full-stack developer specializing in building scalable web applications.",
        portfolio: "https://rahulsharma.dev"
    },
    {
        id: 2,
        profilePic: "https://img.freepik.com/premium-photo/elegant-professional-indian-businesswoman_975188-40796.jpg",
        name: "Priya Patel",
        skills: ["Graphic Design", "UI/UX Design", "Adobe XD", "Figma"],
        experience: "4 years",
        location: "Mumbai, India",
        rate: "₹600/hour",
        description: "Creative UI/UX designer with a passion for designing user-friendly interfaces.",
        portfolio: "https://priyapatel.design"
    },
    {
        id: 3,
        profilePic: "https://i.pinimg.com/originals/af/9f/1f/af9f1fed99621ae20f9edd2ab6cbb8bd.jpg",
        name: "Amit Singh",
        skills: ["Digital Marketing", "SEO", "Social Media Marketing", "Google Ads"],
        experience: "6 years",
        location: "Delhi, India",
        rate: "₹700/hour",
        description: "Digital marketing expert helping businesses grow their online presence.",
        portfolio: "https://amitsinghmarketing.com"
    },
    {
        id: 4,
        profilePic: "https://th.bing.com/th/id/OIP.B2txulUhB46V5gyxJap_JwHaLH?w=1333&h=2000&rs=1&pid=ImgDetMain",
        name: "Neha Gupta",
        skills: ["Content Writing", "Copywriting", "Blogging", "SEO Writing"],
        experience: "3 years",
        location: "Hyderabad, India",
        rate: "₹500/hour",
        description: "Skilled content writer crafting engaging and SEO-friendly content.",
        portfolio: "https://nehaguptawrites.com"
    },
    {
        id: 5,
        profilePic: "https://img.freepik.com/premium-photo/young-indian-businessman-suit-tie-standing-office-ai-generated_843560-800.jpg",
        name: "Vikram Mehta",
        skills: ["Mobile App Development", "Flutter", "Android", "iOS"],
        experience: "5 years",
        location: "Pune, India",
        rate: "₹900/hour",
        description: "Mobile app developer specializing in cross-platform app development using Flutter.",
        portfolio: "https://vikrammehtaapps.com"
    },
    {
        id: 6,
        profilePic: "https://thumbs.dreamstime.com/b/confident-indian-business-woman-21143444.jpg",
        name: "Anjali Rao",
        skills: ["Video Editing", "Premiere Pro", "After Effects", "Motion Graphics"],
        experience: "4 years",
        location: "Chennai, India",
        rate: "₹650/hour",
        description: "Professional video editor with expertise in creating high-quality video content.",
        portfolio: "https://anjalirao.video"
    },
    {
        id: 7,
        profilePic: "https://th.bing.com/th/id/OIP.9xILODTf9cJKb8hIA2yWugHaHa?w=626&h=626&rs=1&pid=ImgDetMain",
        name: "Sandeep Kumar",
        skills: ["Data Science", "Python", "Machine Learning", "Data Analysis"],
        experience: "7 years",
        location: "Gurgaon, India",
        rate: "₹1000/hour",
        description: "Data scientist with a strong background in machine learning and data analysis.",
        portfolio: "https://sandeepkumar.ai"
    },
    {
        id: 8,
        profilePic: "https://t3.ftcdn.net/jpg/02/96/07/04/360_F_296070450_Jd5JTMFIiIOycPxiXFy70sBx5enf2wuB.jpg",
        name: "Kavita Joshi",
        skills: ["E-commerce Development", "Shopify", "WooCommerce", "WordPress"],
        experience: "5 years",
        location: "Ahmedabad, India",
        rate: "₹750/hour",
        description: "E-commerce developer helping businesses set up and optimize their online stores.",
        portfolio: "https://kavitajoshi.shop"
    }
];
document.addEventListener('DOMContentLoaded', function() {
    const freelancerList = document.querySelector('.job-list'); // Assuming job-list is used for freelancers

    // Function to create a freelancer card
    function createFreelancerCard(freelancer) {
        return `
            <div class="job-card">
                <img src="${freelancer.profilePic}" alt="${freelancer.name}" class="company-logo">
                <div class="job-details">
                    <h3 class="job-title">${freelancer.name}</h3>
                    <p class="company-name">${freelancer.location}</p>
                    <div class="job-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${freelancer.location}</span>
                        <span><i class="fas fa-briefcase"></i> ${freelancer.experience}</span>
                        <span><i class="fas fa-rupee-sign"></i> ${freelancer.rate}</span>
                    </div>
                    <p class="job-description">${freelancer.description}</p>
                    <div class="job-tags">
                        ${freelancer.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="job-actions">
                        <a href="${freelancer.portfolio}" class="apply-btn" target="_blank">View Portfolio</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render all freelancer cards
    freelancerList.innerHTML = dummyFreelancers.map(freelancer => createFreelancerCard(freelancer)).join('');
});