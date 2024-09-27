
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const navButtons = document.querySelectorAll('#footer-nav button');
    const tabs = document.querySelectorAll('.content-tab');

    // Function to switch tabs
    const switchTab = (targetTabId) => {
        // Hide all tabs and remove active class from buttons
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none'; // Ensure content is hidden
        });
        navButtons.forEach(button => button.classList.remove('active'));

        // Show the target tab and add active class to corresponding button
        const targetTab = document.getElementById(targetTabId);
        targetTab.style.display = 'block'; // Show the target tab
        targetTab.classList.add('active');
        document.querySelector(`#footer-nav button[data-tab="${targetTabId}"]`).classList.add('active');
    };

    // Add click event listener to all nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetTab = event.currentTarget.dataset.tab;
            switchTab(targetTab);
            triggerAnimation();
        });
    });

    // Simulate loading time
    setTimeout(() => {
        // Hide loading screen after content is loaded
        loadingScreen.style.display = 'none';
        triggerAnimation();

    }, 1500); // Adjust loading time as needed

    // Default tab to show
    switchTab('home');
});


function triggerAnimation() {
    disableButtons();

    const body = document.body;

    // Add the animation class
    body.classList.add("animate-site");

    // Remove the animation class after the animation duration
    setTimeout(() => {
        body.classList.remove("animate-site");
        enableButtons();
    }, 1000); // Duration should match the CSS animation duration
}


// Function to disable all footer buttons
function disableButtons() {
    const buttons = document.querySelectorAll('.primary-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.add('disabled');
        button.setAttribute('disabled', true);
    });
    tabButtons.forEach(button => {
        button.classList.add('disabled');
        button.setAttribute('disabled', true);
    });
}

// Function to enable all footer buttons
function enableButtons() {
    const buttons = document.querySelectorAll('.primary-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('disabled');
        button.removeAttribute('disabled');
    });
    tabButtons.forEach(button => {
        button.classList.remove('disabled');
        button.removeAttribute('disabled');
    });
}

function animateAvatar() {
    const character = document.getElementById('character');
    // Add animation class to the character
    character.classList.add('animate');

    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0; // Rewind to start (useful for rapid clicks)
    clickSound.play();

    // Remove the animation class after animation ends to allow retrigger
    character.addEventListener('animationend', () => {
        character.classList.remove('animate');
    }, { once: true }); // The `once` option ensures the listener is removed after one call
}
