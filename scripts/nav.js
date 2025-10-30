document.addEventListener('DOMContentLoaded', function () {
    const navButton = document.getElementById('nav-button');
    const navigation = document.getElementById('nav-bar');

    navButton.addEventListener('click', function () {
        navigation.classList.toggle('open');
        navButton.classList.toggle('open');
    });

    const navLinks = navigation.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth < 768) {
                navigation.classList.remove('open');
                navButton.classList.remove('open');
            }
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            navigation.classList.remove('open');
            navButton.classList.remove('open');
        }
    });
});