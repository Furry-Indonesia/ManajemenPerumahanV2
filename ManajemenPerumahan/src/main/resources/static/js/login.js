// ── Floating Particles ──────────────────────────────────────
    (function spawnParticles() {
      const container = document.getElementById('particles');
      const colors = ['rgba(139,92,246,0.7)', 'rgba(167,139,250,0.5)', 'rgba(212,168,83,0.4)', 'rgba(168,85,247,0.6)'];
      const sizes  = [2, 2.5, 3, 1.5, 2];
      for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const drift = (Math.random() - 0.5) * 160;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          background:${colors[Math.floor(Math.random() * colors.length)]};
          left:${Math.random() * 100}%;
          --drift:${drift}px;
          animation-duration:${8 + Math.random() * 14}s;
          animation-delay:${Math.random() * 12}s;
          box-shadow: 0 0 ${size * 3}px currentColor;
        `;
        container.appendChild(p);
      }
    })();

    // ── DOM References ──────────────────────────────────────────
    const loginSection    = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const formTitle       = document.getElementById('form-title');
    const formSubtitle    = document.getElementById('form-subtitle');
    const statusEl        = document.getElementById('status');
    const linkToRegister  = document.getElementById('link-to-register');
    const linkToLogin     = document.getElementById('link-to-login');

    // ── Toggle Logic ────────────────────────────────────────────
    function hideStatus() {
      statusEl.style.display = 'none';
      statusEl.className = 'status';
    }

    linkToRegister.addEventListener('click', () => {
      hideStatus();
      loginSection.style.display = 'none';
      registerSection.style.display = 'block';
      registerSection.classList.remove('form-container');
      void registerSection.offsetWidth;
      registerSection.classList.add('form-container');
      formTitle.textContent = 'Daftar Akun Baru';
      formSubtitle.textContent = 'Bergabunglah dengan PerumahanPro';
    });

    linkToLogin.addEventListener('click', () => {
      hideStatus();
      registerSection.style.display = 'none';
      loginSection.style.display = 'block';
      loginSection.classList.remove('form-container');
      void loginSection.offsetWidth;
      loginSection.classList.add('form-container');
      formTitle.textContent = 'Masuk ke Akun Anda';
      formSubtitle.textContent = 'Kelola properti Anda dengan mudah';
    });

    // ── Eye Toggle ──────────────────────────────────────────────
    document.querySelectorAll('.eye-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon  = this.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'ti ti-eye-off';
        } else {
          input.type = 'password';
          icon.className = 'ti ti-eye';
        }
      });
    });

    // ── LOGIN API ───────────────────────────────────────────────
    document.getElementById('btn-login').addEventListener('click', async () => {
      const usernameVal = document.getElementById('login-email').value.trim();
      const passVal     = document.getElementById('login-password').value;

      if (!usernameVal || !passVal) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Harap isi Username dan Kata Sandi terlebih dahulu.';
        statusEl.style.display = 'block';
        return;
      }

      statusEl.className = 'status success';
      statusEl.textContent = 'Memproses otentikasi...';
      statusEl.style.display = 'block';

      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameVal, password: passVal })
        });

        const resultText = await response.text();

        if (resultText.includes("Sukses")) {
          const roleUser = resultText.split(": ")[1];
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', usernameVal);
          sessionStorage.setItem('role', roleUser);
          statusEl.className = 'status success';
          statusEl.textContent = '✓ Berhasil masuk! Mengalihkan...';
          setTimeout(() => {
            if (roleUser === 'ADMIN')      window.location.href = 'dashboard.html';
            else if (roleUser === 'USER')  window.location.href = 'katalog.html';
            else                           window.location.href = 'login.html';
          }, 1000);
        } else {
          statusEl.className = 'status error';
          statusEl.textContent = resultText;
        }
      } catch (error) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Gagal terhubung ke server database.';
      }
    });

    // ── REGISTER API ────────────────────────────────────────────
    document.getElementById('btn-register').addEventListener('click', async () => {
      const name  = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass  = document.getElementById('reg-password').value;

      if (!name || !email || !pass) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Harap lengkapi semua data pendaftaran.';
        statusEl.style.display = 'block';
        return;
      }

      statusEl.className = 'status success';
      statusEl.textContent = 'Memproses pendaftaran...';
      statusEl.style.display = 'block';

      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ namaLengkap: name, username: email, password: pass })
        });

        const resultText = await response.text();

        if (resultText.includes("Sukses")) {
          statusEl.className = 'status success';
          statusEl.textContent = resultText;
          document.getElementById('reg-name').value = '';
          document.getElementById('reg-email').value = '';
          document.getElementById('reg-password').value = '';
          setTimeout(() => { linkToLogin.click(); }, 2000);
        } else {
          statusEl.className = 'status error';
          statusEl.textContent = resultText;
        }
      } catch (error) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Gagal terhubung ke server database.';
      }
    });

    // ── LUPA KATA SANDI ─────────────────────────────────────────
    document.querySelector('.forgot').addEventListener('click', (e) => {
      e.preventDefault();
      statusEl.className = 'status error';
      statusEl.textContent = 'Silakan hubungi Admin Pusat di WA (0889-xxxx) untuk mereset kata sandi Anda.';
      statusEl.style.display = 'block';
    });