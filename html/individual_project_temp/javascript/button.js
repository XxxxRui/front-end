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

    // Toggle section visibility with animation
    // In the button.js file, modify the button click event handler
    button.addEventListener("click", function () {
        if (section.style.display === "block") {
            // Animation effect when hiding content
            section.classList.remove("visible");
            quizSection.classList.remove("visible");
            section.style.opacity = 0;
            section.style.transform = "translateY(20px)";
            quizSection.style.opacity = 0;
            quizSection.style.transform = "translateY(20px)";

            setTimeout(() => {
                section.style.display = "none";
                quizSection.style.display = "none";
                animalImage.style.display = "none";
                button.textContent = "Start Improving Now";
            }, 500);
        } else {
            // Show content
            section.style.display = "block";
            quizSection.style.display = "block";
            animalImage.src = "image/image.png";
            animalImage.style.display = "block";
            button.textContent = "Hide Best Practices";

            // Reset CSS properties to ensure animation works properly
            section.style.opacity = 0;
            section.style.transform = "translateY(20px)";
            quizSection.style.opacity = 0;
            quizSection.style.transform = "translateY(20px)";

            // Force reflow before adding visibility classes
            setTimeout(() => {
                section.style.opacity = 1;
                section.style.transform = "translateY(0)";
                quizSection.style.opacity = 1;
                quizSection.style.transform = "translateY(0)";
                section.classList.add("visible");
                quizSection.classList.add("visible");
            }, 50);
        }
    });

    // Update selection count and progress
    function updateSelectionCount() {
        const toggles = document.querySelectorAll(".best-practice-toggle");
        const count = Array.from(toggles).filter(toggle => toggle.checked).length;
        const totalItems = toggles.length; // Dynamic total based on actual items

        // Update progress bar
        const percentage = (count / totalItems) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        percentageText.textContent = `${percentage.toFixed(0)}%`;

        // Category-specific counts
        const htmlToggles = Array.from(document.querySelectorAll("#card1, #card2, #card3, #card4")).filter(toggle => toggle.checked).length;
        const cssToggles = Array.from(document.querySelectorAll("#card5, #card6, #card7, #card8")).filter(toggle => toggle.checked).length;
        const jsToggles = Array.from(document.querySelectorAll("#card9, #card10, #card11, #card12")).filter(toggle => toggle.checked).length;
        const genericToggles = Array.from(document.querySelectorAll("#card17, #card18, #card19, #card20")).filter(toggle => toggle.checked).length;

        // Update category progress bars if elements exist
        if (document.getElementById("htmlProgress")) {
            document.getElementById("htmlProgress").style.width = `${(htmlToggles / 4) * 100}%`;
            document.getElementById("cssProgress").style.width = `${(cssToggles / 4) * 100}%`;
            document.getElementById("jsProgress").style.width = `${(jsToggles / 4) * 100}%`;
            document.getElementById("genericProgress").style.width = `${(genericToggles / 4) * 100}%`;

            // Update category counts
            document.getElementById("htmlCount").textContent = `${htmlToggles}/4`;
            document.getElementById("cssCount").textContent = `${cssToggles}/4`;
            document.getElementById("jsCount").textContent = `${jsToggles}/4`;
            document.getElementById("genericCount").textContent = `${genericToggles}/4`;

            // Update category colors based on completion
            const categoryProgressElements = [
                { element: document.getElementById("htmlProgress"), count: htmlToggles },
                { element: document.getElementById("cssProgress"), count: cssToggles },
                { element: document.getElementById("jsProgress"), count: jsToggles },
                { element: document.getElementById("genericProgress"), count: genericToggles }
            ];

            categoryProgressElements.forEach(item => {
                if (item.count === 4) {
                    item.element.style.backgroundColor = "#28a745"; // Green for complete
                } else if (item.count >= 2) {
                    item.element.style.backgroundColor = "#ffc107"; // Yellow for in progress
                } else {
                    item.element.style.backgroundColor = "#dc3545"; // Red for little progress
                }
            });
        }

        // Enhanced highlighting for selected cards with visual categories
        const highlightColors = [
            { bg: "#e6f7ff", border: "#1890ff" }, // Blue
            { bg: "#f6ffed", border: "#52c41a" }, // Green
            { bg: "#fff7e6", border: "#fa8c16" }, // Orange
            { bg: "#fff1f0", border: "#f5222d" }, // Red
        ];

        // Apply colors and save state with improved visual feedback
        toggles.forEach((toggle, index) => {
            const card = toggle.closest(".card");
            const colorIndex = index % highlightColors.length;

            if (toggle.checked) {
                card.style.backgroundColor = highlightColors[colorIndex].bg;
                card.style.borderColor = highlightColors[colorIndex].border;
                card.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`;

                // Add a completion checkmark
                let checkmark = card.querySelector('.completion-check');
                if (!checkmark) {
                    checkmark = document.createElement('div');
                    checkmark.className = 'completion-check';
                    checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
                    card.appendChild(checkmark);
                }
            } else {
                card.style.backgroundColor = "";
                card.style.borderColor = "";
                card.style.boxShadow = "";

                // Remove checkmark if exists
                const checkmark = card.querySelector('.completion-check');
                if (checkmark) {
                    checkmark.remove();
                }
            }

            // Update ARIA attributes for accessibility
            const switchRole = toggle.closest('[role="switch"]');
            if (switchRole) {
                switchRole.setAttribute('aria-checked', toggle.checked);
            }

            // Save state to localStorage with error handling
            try {
                localStorage.setItem(`toggleState_${index}`, toggle.checked);
            } catch (e) {
                console.warn('LocalStorage not available:', e);
            }
        });

        countDisplay.textContent = `${count}/${totalItems}`; // Display as fraction

        // Update progress and image display
        updateProgressAndImage(count, totalItems);
    }

    // Update progress bar and animal image based on selection count
    function updateProgressAndImage(selectedCount, totalItems) {
        const completionThreshold = 12; // Set fixed completion threshold to match original requirement

        // Update progress bar color based on completion level
        if (selectedCount >= completionThreshold) {
            progressBar.classList.remove("bg-warning", "bg-danger");
            progressBar.classList.add("bg-success");
        } else if (selectedCount >= completionThreshold * 0.66) {
            progressBar.classList.remove("bg-success", "bg-danger");
            progressBar.classList.add("bg-warning");
        } else {
            progressBar.classList.remove("bg-warning", "bg-success");
            progressBar.classList.add("bg-danger");
        }

        // Update success message and fetch cat image when complete
        if (selectedCount >= completionThreshold) {
            successMessage.textContent = "🎉 Success! You have met the best practices criteria!";
            successMessage.style.color = "#ffeb3b";
            progressBar.classList.add("progress-bar-animated");

            // Fetch random cat image from API
            fetch("https://api.thecatapi.com/v1/images/search")
                .then(response => {
                    // Add loading message during fetch
                    animalImage.style.display = "block";
                    animalImage.alt = "Loading your reward...";
                    return response.json();
                })
                .then(data => {
                    animalImage.src = data[0].url;
                    animalImage.alt = "Cute animal reward for completing best practices";
                    animalImage.style.display = "block";

                    // Add celebration animation
                    document.body.classList.add('celebration');
                })
                .catch(error => {
                    console.error("Error loading image:", error);
                    // Fallback to the local image if API fails
                    animalImage.src = "image/image.png";
                    animalImage.style.display = "block";
                });
        } else {
            successMessage.textContent = `Keep improving! You need ${completionThreshold - selectedCount} more best practices selected.`;
            progressBar.classList.remove("progress-bar-animated");
            successMessage.style.color = "#ffffff";
            animalImage.style.display = "none";
            document.body.classList.remove('celebration');
        }
    }


    // Add click event for sliders
    document.querySelectorAll(".slider").forEach(slider => {
        slider.addEventListener("click", function (e) {
            // Prevent event bubbling to avoid triggering label's click event
            e.preventDefault();
            e.stopPropagation();

            // Get the corresponding checkbox
            const toggle = this.previousElementSibling;
            if (toggle && toggle.classList.contains("best-practice-toggle")) {
                // Toggle state
                toggle.checked = !toggle.checked;

                // Manually trigger change event
                const event = new Event('change');
                toggle.dispatchEvent(event);

                // Update ARIA attributes
                const switchRole = toggle.closest('[role="switch"]');
                if (switchRole) {
                    switchRole.setAttribute('aria-checked', toggle.checked);
                }
            }
        });
    });

    // Initialize toggle states from localStorage
    function initializeToggles() {
        const toggles = document.querySelectorAll(".best-practice-toggle");
        toggles.forEach((toggle, index) => {
            try {
                const savedState = localStorage.getItem(`toggleState_${index}`);
                if (savedState !== null) {
                    toggle.checked = JSON.parse(savedState);

                    // Update ARIA attributes
                    const switchRole = toggle.closest('[role="switch"]');
                    if (switchRole) {
                        switchRole.setAttribute('aria-checked', toggle.checked);
                    }
                }
            } catch (e) {
                console.warn('Error accessing localStorage:', e);
            }
        });

        updateSelectionCount(); // Update UI with initial state
    }

    // Add event listeners to all toggle switches
    document.querySelectorAll(".best-practice-toggle").forEach(toggle => {
        toggle.addEventListener("change", updateSelectionCount);

        // Add keyboard accessibility
        toggle.addEventListener("keydown", function (e) {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle.checked = !toggle.checked;
                updateSelectionCount();
            }
        });
    });

    // Add accessibility to help users print their selected best practices
    document.addEventListener("keydown", function (e) {
        // Ctrl+P or Command+P opens print dialog
        if ((e.ctrlKey || e.metaKey) && e.key === "p") {
            // Add a hint to the user about printing
            const printHint = document.createElement('div');
            printHint.className = 'print-hint';
            printHint.textContent = "Printing your selected best practices...";
            document.body.appendChild(printHint);

            // Remove the hint after printing
            window.addEventListener('afterprint', function () {
                if (document.body.contains(printHint)) {
                    document.body.removeChild(printHint);
                }
            }, { once: true });
        }
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