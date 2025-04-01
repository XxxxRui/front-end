document.addEventListener("DOMContentLoaded", function () {
    // DOM element references
    const section = document.getElementById("hiddenSection");
    const quizSection = document.getElementById("quizSection");
    const button = document.getElementById("startButton");
    const countDisplay = document.getElementById("selectedCount"); // Selected count display
    const animalImage = document.getElementById("animalImage"); // Animal image element
    const successMessage = document.getElementById("successMessage");
    const percentageText = document.getElementById("percentage");
    const progressBar = document.getElementById("progressBar");

    // Toggle section visibility and button text
    button.addEventListener("click", function () {
        if (section.style.display === "block") {
            section.style.display = "none";
            quizSection.style.display = "none";
            animalImage.style.display = "none";
            button.textContent = "Start Improving Now";
        } else {
            section.style.display = "block";
            quizSection.style.display = "block";
            animalImage.src = "image/image.png"; // Show loading image
            animalImage.style.display = "block";
            button.textContent = "Hide Best Practices";
        }
    });

    // Update selection count and progress
    function updateSelectionCount() {
        const toggles = document.querySelectorAll(".best-practice-toggle");
        const count = Array.from(toggles).filter(toggle => toggle.checked).length;
        const totalItems = 12; // Total number of best practice cards
        
        // Update progress bar
        const percentage = (count / totalItems) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        percentageText.textContent = `${percentage.toFixed(0)}%`;
        
        // Color highlights for selected cards
        const highlightColors = [
            "#e6f7ff", // Light blue
            "#f6ffed", // Light green
            "#fff7e6", // Light yellow
            "#fff1f0", // Light red
            "#f9f0ff", // Light purple
            "#e6fffb", // Light cyan
            "#fcffe6", // Light lemon
            "#f0f5ff", // Light indigo
        ];

        // Apply colors and save state
        toggles.forEach((toggle, index) => {
            const card = toggle.closest(".card");
            const colorIndex = index % highlightColors.length;
            card.style.backgroundColor = toggle.checked ? highlightColors[colorIndex] : "";
            
            // Save state to localStorage
            localStorage.setItem(`toggleState_${index}`, toggle.checked);
        });

        countDisplay.textContent = `${count}/${totalItems}`; // Display as fraction
        
        // Update progress and image display
        updateProgressAndImage(count);
    }

    // Update progress bar and animal image based on selection count
    function updateProgressAndImage(selectedCount) {
        // Update progress bar color based on completion level
        if (selectedCount >= 12) {
            progressBar.classList.remove("bg-warning", "bg-danger");
            progressBar.classList.add("bg-success");
        } else if (selectedCount >= 8) {
            progressBar.classList.remove("bg-success", "bg-danger");
            progressBar.classList.add("bg-warning");
        } else {
            progressBar.classList.remove("bg-warning", "bg-success");
            progressBar.classList.add("bg-danger");
        }

        // Update success message and fetch cat image when complete
        if (selectedCount >= 12) {
            successMessage.textContent = "🎉 Success! You have met the best practices criteria!";
            successMessage.style.color = "#ffeb3b";
            progressBar.classList.add("progress-bar-animated");
            
            // Fetch random cat image from API
            fetch("https://api.thecatapi.com/v1/images/search")
                .then(response => response.json())
                .then(data => {
                    animalImage.src = data[0].url;
                    animalImage.style.display = "block";
                })
                .catch(error => console.error("Error loading image:", error));
        } else {
            successMessage.textContent = `Keep improving! You need ${12 - selectedCount} more best practices selected.`;
            progressBar.classList.remove("progress-bar-animated");
            successMessage.style.color = "#ffffff";
            animalImage.style.display = "none";
        }
    }

    // Initialize toggle states from localStorage
    function initializeToggles() {
        const toggles = document.querySelectorAll(".best-practice-toggle");
        toggles.forEach((toggle, index) => {
            const savedState = localStorage.getItem(`toggleState_${index}`);
            if (savedState !== null) {
                toggle.checked = JSON.parse(savedState);
            }
        });

        updateSelectionCount(); // Update UI with initial state
    }

    // Add event listeners to all toggle switches
    document.querySelectorAll(".best-practice-toggle").forEach(toggle => {
        toggle.addEventListener("change", updateSelectionCount);
    });

    // Initialize the application
    initializeToggles();
});

// Add scroll effect to navbar
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});