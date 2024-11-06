document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const errorMessageElement = document.getElementById('error-message');

    // Vider les messages d'erreur avant de valider
    errorMessageElement.style.display = 'none';
    errorMessageElement.textContent = '';

    // Vérifier que tous les champs sont remplis
    if (!firstName || !lastName || !username || !email || !password) {
        errorMessageElement.style.display = 'block';
        errorMessageElement.textContent = 'Tous les champs sont requis.';
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            alert('Inscription réussie !');
            localStorage.setItem('token', data.token);

            // Rediriger vers la page de profil
            window.location.href = '/profile';
        } else {
            // Afficher les erreurs retournées par l'API
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = data.message || 'Une erreur est survenue lors de l\'inscription.';
        }
    })
    .catch(error => {
        // Afficher un message d'erreur en cas d'échec de la requête
        errorMessageElement.style.display = 'block';
        errorMessageElement.textContent = 'Erreur de connexion au serveur. Veuillez réessayer plus tard.';
        console.error('Erreur :', error);
    });
});
