document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMessageDiv = document.getElementById('error-message');

    // Réinitialiser le message d'erreur
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    if (!username || !password) {
        // Si des champs sont vides, afficher un message d'erreur
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            alert('Connexion réussie !');
            localStorage.setItem('token', data.token);
            window.location.href = '/profile';
        } else if (data.message) {
            // Afficher l'erreur du serveur si elle existe
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.textContent = data.message;
        } else {
            // Cas où aucune erreur spécifique n'est retournée
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        }
    })
    .catch(error => {
        // En cas d'erreur de connexion ou d'autre problème
        console.error('Erreur :', error);
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.textContent = 'Erreur de connexion. Veuillez vérifier votre réseau.';
    });
});
