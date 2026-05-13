let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUser').value;
            const password = document.getElementById('loginPass').value;
            
            try {
                const res = await fetch(`${API_PATH}auth.php?action=login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if(data.success) {
                    showToast('Login berhasil!');
                    currentUser = data.user;
                    initApp();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch(e) {
                console.error(e);
                Swal.fire('Error', 'Terjadi kesalahan jaringan', 'error');
            }
        });
    }

    const btnLogout = document.getElementById('btnLogout');
    if(btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await fetch(`${API_PATH}auth.php?action=logout`);
            location.reload();
        });
    }
});

async function checkSession() {
    try {
        const res = await fetch(`${API_PATH}auth.php?action=check`);
        const data = await res.json();
        if(data.success) {
            currentUser = data.user;
            initApp();
        } else {
            document.getElementById('authOverlay').style.display = 'flex';
        }
    } catch(e) {
        console.error(e);
        document.getElementById('authOverlay').style.display = 'flex';
    }
}
