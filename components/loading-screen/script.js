const loadingScreen = document.getElementById('loading-screen');

// Simulate loading time
  setTimeout(() => {
    // Hide loading screen after content is loaded
    loadingScreen.style.display = 'none';
}, 1000); // Adjust loading time as needed
