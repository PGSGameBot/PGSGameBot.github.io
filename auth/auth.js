// MENU
document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    menuIcon.addEventListener('click', function () {
        menu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnToggle = menuIcon.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    });
});


// POPUP
document.addEventListener('DOMContentLoaded', function () {

    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popup-close');

    function showPopup() {
        popup.style.display = 'flex';
    }

    popupClose.addEventListener('click', function () {
        popup.style.display = 'none';
        window.location.href = '../index.html';
        
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showPopup') === 'true') {
        showPopup();
    }
});
