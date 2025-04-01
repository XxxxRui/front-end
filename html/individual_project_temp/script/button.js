document.addEventListener("DOMContentLoaded", function () {
    let section = document.getElementById("hiddenSection");
    let quizsection = document.getElementById("quizSection");
    let button = document.getElementById("startButton");
    let countDisplay = document.getElementById("selectedCount"); // 选中的个数显示
    let animalImage = document.getElementById("animalImage"); // 目标图片
    let successMessage = document.getElementById("successMessage");
    let percentageText = document.getElementById("percentage");
    const progressBar = document.getElementById("progressBar");
    // 显示/隐藏 section，并改变按钮文本
    button.addEventListener("click", function () {
        if (section.style.display === "block") {
            section.style.display = "none";
            quizsection.style.display = "none";
            animalImage.style.display = "none";
            button.textContent = "Start Improving Now";
        } else {
            section.style.display = "block";
            quizsection.style.display = "block";
            animalImage.style.display = "block";
            button.textContent = "Hide Best Practices";
        }
    });

    // 监听 toggle 开关的变化
    function updateSelectionCount() {
        let toggles = document.querySelectorAll(".best-practice-toggle");
        let count = Array.from(toggles).filter(toggle => toggle.checked).length;
        countDisplay.textContent = `Selected: ${count}`; // 更新显示
        const totalItems = 12; // 根据实际卡片数量修改
        const percentage = (count / totalItems) * 100;
        
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        percentageText.textContent = `${percentage.toFixed(0)}%`; // 显示百分比
        const highlightColors = [
            "#e6f7ff", // 浅蓝
            "#f6ffed", // 浅绿
            "#fff7e6", // 浅黄
            "#fff1f0", // 浅红
            "#f9f0ff", // 浅紫
            "#e6fffb", // 浅青
            "#fcffe6", // 浅柠檬
            "#f0f5ff", // 浅靛蓝
        ];
        toggles.forEach((toggle, index) => {
            let card = toggle.closest(".card"); // 找到对应的卡片
            let colorIndex = index % highlightColors.length;
            card.style.backgroundColor = toggle.checked ? highlightColors[colorIndex] : ""; // 选中时变色

            // 保存状态到 localStorage
            localStorage.setItem(`toggleState_${index}`, toggle.checked);
        });

        countDisplay.textContent = `${count}/${totalItems}`;  // 改为分数显示
        
        // 修改updateCountAndImage调用
        updateCountAndImage(count);  // 传入当前count值
    }

    // 更新选中数量 & 显示可爱动物图片
    function updateCountAndImage() {
        let selectedCount = document.querySelectorAll(".best-practice-toggle:checked").length;
        // countDisplay.textContent = `Selected: ${selectedCount}`;

        if (selectedCount >= 12) {
            progressBar.classList.remove("bg-warning");
            progressBar.classList.remove("bg-danger");
            progressBar.classList.add("bg-success");
        } else if (selectedCount >= 8) {
            progressBar.classList.remove("bg-success");
            progressBar.classList.remove("bg-danger");
            progressBar.classList.add("bg-warning");
        } else {
            progressBar.classList.remove("bg-warning");
            progressBar.classList.remove("bg-danger");
            progressBar.classList.add("bg-danger");
        }

        if (selectedCount >= 12) {
            successMessage.textContent = "🎉 Success! You have met the best practices criteria!";
            successMessage.style.color = "#ffeb3b";
            progressBar.classList.add("progress-bar-animated");
            fetch("https://api.thecatapi.com/v1/images/search")
                .then(response => response.json())
                .then(data => {
                    animalImage.src = data[0].url;
                    animalImage.style.display = "block";
                })
                .catch(error => console.error("加载失败:", error));
        } else {
            successMessage.textContent = `Keep improving! You need ${12 - selectedCount} more best practices selected.`;
            progressBar.classList.remove("progress-bar-animated");
            successMessage.style.color = "#ffffff";
            animalImage.style.display = "none";
        }
    }

    // 初始化 toggle 状态
    function initializeToggles() {
        let toggles = document.querySelectorAll(".best-practice-toggle");
        toggles.forEach((toggle, index) => {
            const savedState = localStorage.getItem(`toggleState_${index}`);
            if (savedState !== null) {
                toggle.checked = JSON.parse(savedState);
            }
        });

        updateSelectionCount(); // 更新 UI
    }

    // 绑定事件监听
    document.querySelectorAll(".best-practice-toggle").forEach(toggle => {
        toggle.addEventListener("change", updateSelectionCount);
    });

    // 初始化
    initializeToggles();
});

window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});