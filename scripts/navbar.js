document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('.navbar-nav');
    const navIcon = document.querySelector('.navbar-toggler i');
    const navLinks = document.querySelectorAll('.navbar-nav a'); // Select all nav links

    navbarToggler.addEventListener('click', function () {
        navbarNav.classList.toggle('active');
        navIcon.classList.toggle('active');
    });

    // Close the navbar when any link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                navIcon.classList.remove('active');
            }
        });
    });
});
