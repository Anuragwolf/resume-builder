document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const editProfileForm = document.getElementById("editProfileForm");
    const fullNameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phone");
    const locationInput = document.getElementById("location");
    const positionInput = document.getElementById("position");
    const companyInput = document.getElementById("company");
    const industryInput = document.getElementById("industry");
    const experienceInput = document.getElementById("experience");
    const educationInput = document.getElementById("education");
    const universityInput = document.getElementById("university");
    const gradYearInput = document.getElementById("gradYear");
    const profileAvatar = document.getElementById("profileAvatar");
    const userEmailDisplay = document.getElementById("userEmail");
    const uploadAvatarBtn = document.getElementById("uploadAvatarBtn");
    const avatarInput = document.getElementById("avatarInput");
    const skillsContainer = document.getElementById("skillsContainer");
    const addSkillBtn = document.getElementById("addSkillBtn");
    const newSkillInputContainer = document.getElementById("newSkillInputContainer");
    const newSkillInput = document.getElementById("newSkillInput");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const blurOverlay = document.getElementById("blurOverlay");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");

    // Global state
    let userSkills = [];
    let userData = null;
    const API_URL = "http://localhost:5000"; // Update this with your actual API URL

    // Check if user is logged in
    function checkAuthStatus() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "../login.html";
            return;
        }
        
        // Update nav elements based on auth status
        document.getElementById("userProfile").style.display = "flex";
        document.getElementById("loginNavBtn").style.display = "none";
        
        // Load user data
        loadUserProfile();
    }

    // Load user profile data
    async function loadUserProfile() {
        showLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/current-user`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "Failed to load profile");
            }
            
            userData = data.user;
            populateFormWithUserData(userData);
            updateUserInterface(userData);
            
        } catch (error) {
            console.error("Error loading profile:", error);
            showError("Failed to load your profile data. Please try again.");
        } finally {
            showLoading(false);
        }
    }

    // Populate form with user data
    function populateFormWithUserData(user) {
        // Text fields
        fullNameInput.value = user.name || "";
        phoneInput.value = user.phone || "";
        locationInput.value = user.location || "";
        positionInput.value = user.position || "";
        companyInput.value = user.company || "";
        industryInput.value = user.industry || "";
        experienceInput.value = user.experience || "";
        
        // Education fields
        if (user.education) {
            // If education is stored as JSON string, parse it
            let educationData = user.education;
            try {
                if (typeof user.education === 'string') {
                    educationData = JSON.parse(user.education);
                }
                
                if (typeof educationData === 'object') {
                    educationInput.value = educationData.degree || "";
                    universityInput.value = educationData.institution || "";
                    gradYearInput.value = educationData.graduationYear || "";
                } else {
                    educationInput.value = user.education;
                }
            } catch (e) {
                // If parsing fails, use as-is
                educationInput.value = user.education;
            }
        }
        
        // Skills
        userSkills = Array.isArray(user.skills) ? [...user.skills] : [];
        renderSkills();
        
        // Avatar
        if (user.avatar) {
            profileAvatar.src = user.avatar.startsWith('/uploads') 
                ? `${API_URL}${user.avatar}` 
                : user.avatar;
        } else {
            // Default avatar if user doesn't have one
            profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        }
    }

    // Update user interface elements
    function updateUserInterface(user) {
        // Update user email display
        userEmailDisplay.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
        
        // Update nav user elements
        const usernameElem = document.getElementById("username");
        const userAvatarElem = document.getElementById("userAvatar");
        const userNameDropdownElem = document.getElementById("userNameDropdown");
        const userEmailDropdownElem = document.getElementById("userEmailDropdown");
        const userAvatarDropdownElem = document.getElementById("userAvatarDropdown");
        
        if (usernameElem) usernameElem.textContent = user.name;
        if (userNameDropdownElem) userNameDropdownElem.textContent = user.name;
        if (userEmailDropdownElem) userEmailDropdownElem.textContent = user.email;
        
        // Set avatar in navbar and dropdown
        const avatarSrc = user.avatar 
            ? (user.avatar.startsWith('/uploads') ? `${API_URL}${user.avatar}` : user.avatar)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
            
        if (userAvatarElem) userAvatarElem.src = avatarSrc;
        if (userAvatarDropdownElem) userAvatarDropdownElem.src = avatarSrc;
    }

    // Render skills UI
    function renderSkills() {
        skillsContainer.innerHTML = "";
        
        userSkills.forEach(skill => {
            const skillTag = document.createElement("div");
            skillTag.className = "skill-tag";
            skillTag.innerHTML = `
                ${skill}
                <button type="button" class="remove-skill" data-skill="${skill}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            skillsContainer.appendChild(skillTag);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-skill").forEach(button => {
            button.addEventListener("click", function() {
                const skillToRemove = this.getAttribute("data-skill");
                userSkills = userSkills.filter(skill => skill !== skillToRemove);
                renderSkills();
            });
        });
    }

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Hide any previous messages
        successMessage.style.display = "none";
        errorMessage.style.display = "none";
        
        // Prepare education data
        const educationData = {
            degree: educationInput.value.trim(),
            institution: universityInput.value.trim(),
            graduationYear: gradYearInput.value.trim()
        };
        
        // Prepare profile data
        const profileData = {
            name: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            location: locationInput.value.trim(),
            position: positionInput.value.trim(),
            company: companyInput.value.trim(),
    industry: industryInput.value.trim(),
    education: JSON.stringify({
        degree: educationInput.value.trim(),
        university: universityInput.value.trim(), // Consistent field name
        graduationYear: gradYearInput.value.trim()
    }),
            skills: userSkills
        };
        
        // Validate required fields
        if (!profileData.name) {
            showError("Name is required");
            return;
        }
        
        // Update profile
        try {
            showLoading(true);
            
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/update-profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "Failed to update profile");
            }
            
            // Update user data with the response
            userData = data.user;
            
            // Show success message
            successMessage.style.display = "flex";
            
            // Redirect to profile page after a short delay
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
            
        } catch (error) {
            console.error("Error updating profile:", error);
            showError(error.message || "Failed to update your profile. Please try again.");
        } finally {
            showLoading(false);
        }
    }

    // Handle avatar upload
    async function uploadAvatar(file) {
        if (!file) return;
        
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            showError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError("Image size should be less than 5MB");
            return;
        }
        
        try {
            showLoading(true);
            
            const formData = new FormData();
            formData.append("avatar", file);
            
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/upload-avatar`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "Failed to upload avatar");
            }
            
            // Update avatar in UI
            profileAvatar.src = `${API_URL}${data.avatar}`;
            
            // Update avatar in navbar
            const userAvatarElem = document.getElementById("userAvatar");
            const userAvatarDropdownElem = document.getElementById("userAvatarDropdown");
            
            if (userAvatarElem) userAvatarElem.src = `${API_URL}${data.avatar}`;
            if (userAvatarDropdownElem) userAvatarDropdownElem.src = `${API_URL}${data.avatar}`;
            
            // Update user data
            userData.avatar = data.avatar;
            
        } catch (error) {
            console.error("Error uploading avatar:", error);
            showError(error.message || "Failed to upload avatar. Please try again.");
        } finally {
            showLoading(false);
        }
    }

    // Show/hide loading spinner
    function showLoading(show) {
        loadingSpinner.style.display = show ? "block" : "none";
        blurOverlay.style.display = show ? "block" : "none";
    }

    // Show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = "flex";
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 5000);
    }

    // Initialize event listeners
    function initEventListeners() {
        // Form submission
        editProfileForm.addEventListener("submit", handleFormSubmit);
        
        // Avatar upload
        uploadAvatarBtn.addEventListener("click", () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener("change", (event) => {
            if (event.target.files.length > 0) {
                uploadAvatar(event.target.files[0]);
            }
        });
        
        // Skills management
        addSkillBtn.addEventListener("click", () => {
            newSkillInputContainer.style.display = "block";
            newSkillInput.focus();
            addSkillBtn.style.display = "none";
        });
        
        newSkillInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                const skill = newSkillInput.value.trim();
                
                if (skill && !userSkills.includes(skill)) {
                    userSkills.push(skill);
                    renderSkills();
                }
                
                newSkillInput.value = "";
                newSkillInput.focus();
            } else if (event.key === "Escape") {
                newSkillInputContainer.style.display = "none";
                addSkillBtn.style.display = "inline-flex";
                newSkillInput.value = "";
            }
        });
        
        // Close skill input when clicked outside
        document.addEventListener("click", (event) => {
            if (newSkillInputContainer.style.display === "block" && 
                !newSkillInputContainer.contains(event.target) && 
                event.target !== addSkillBtn) {
                
                const skill = newSkillInput.value.trim();
                if (skill && !userSkills.includes(skill)) {
                    userSkills.push(skill);
                    renderSkills();
                }
                
                newSkillInputContainer.style.display = "none";
                addSkillBtn.style.display = "inline-flex";
                newSkillInput.value = "";
            }
        });
    }

    // Initialize
    function init() {
        checkAuthStatus();
        initEventListeners();
    }

    // Start the application
    init();
});