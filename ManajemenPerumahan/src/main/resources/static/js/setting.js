// ── Auth ──
  if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
  const usernameAktif = sessionStorage.getItem('username') || 'A';
  const roleAktif = sessionStorage.getItem('role') || 'USER';

  // ── Particles ──
  (function() {
    const c = document.getElementById('particles');
    const colors = ['rgba(139,92,246,.7)','rgba(167,139,250,.5)','rgba(212,168,83,.45)','rgba(168,85,247,.6)'];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div'); p.className = 'particle';
      const size = [1.5,2,2.5,3][Math.floor(Math.random()*4)];
      const drift = (Math.random()-.5)*180;
      p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;--drift:${drift}px;animation-duration:${9+Math.random()*16}s;animation-delay:${Math.random()*14}s;box-shadow:0 0 ${size*3}px currentColor;`;
      c.appendChild(p);
    }
  })();

  // ── Scroll reveal ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Toast ──
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ── Logout ──
  function prosesLogout() {
    Swal.fire({
      title:'Yakin ingin keluar?',text:"Sesi kerja Anda akan diakhiri.",icon:'question',
      showCancelButton:true,confirmButtonColor:'#6d28d9',cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Keluar!',cancelButtonText:'Batal',
      background:'#12121f',color:'#f1f0ff'
    }).then(r => { if (r.isConfirmed) { sessionStorage.clear(); window.location.href='login.html'; } });
  }

  // ── Section switch ──
  function switchSection(name, el) {
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + name).classList.add('active');
    el.classList.add('active');
    // Re-trigger animation
    const wrap = document.querySelector('#sec-' + name + ' .section-wrap');
    if (wrap) { wrap.style.animation='none'; void wrap.offsetHeight; wrap.style.animation=''; }
  }

  // ── Load profil ──
  async function muatDataProfil() {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      const users = await res.json();
      const me = users.find(u => u.username === usernameAktif);
      if (me) {
        const nama = me.namaLengkap || usernameAktif;
        const inisial = nama.charAt(0).toUpperCase();
        document.getElementById('profileName').innerText = nama;
        document.getElementById('profileRoleDesc').innerText = `${me.role} · PT. Admaja Properti`;
        document.getElementById('pNama').value = me.namaLengkap || '';
        document.getElementById('pNoWa').value = me.noWa || '';
        document.getElementById('pUsername').value = me.username;
        document.getElementById('pRole').value = me.role;

        let htmlAvatar = inisial;
        if (me.fotoProfil && me.fotoProfil !== 'default_profil.png' && me.fotoProfil !== 'null') {
          const url = `http://localhost:8080/uploads/profil/${encodeURIComponent(me.fotoProfil)}`;
          htmlAvatar = `<img src="${url}" alt="Profil" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        }
        document.getElementById('userAvatar').innerHTML = htmlAvatar;
        document.getElementById('profInisial').innerHTML = htmlAvatar;
      }
    } catch(e) { console.error(e); }
  }
  muatDataProfil();

  function previewFoto(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('profInisial').innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      };
      reader.readAsDataURL(file);
    }
  }

  async function simpanProfil() {
    const fd = new FormData();
    fd.append('namaLengkap', document.getElementById('pNama').value);
    fd.append('noWa', document.getElementById('pNoWa').value);
    fd.append('role', roleAktif);
    const foto = document.getElementById('pFoto').files[0];
    if (foto) fd.append('foto', foto);
    try {
      const res = await fetch(`http://localhost:8080/api/users/edit/${usernameAktif}`, { method:'PUT', body:fd });
      if (res.ok) { showToast('<i class="ti ti-circle-check" style="margin-right:6px;"></i>Profil berhasil diperbarui!'); muatDataProfil(); }
      else Swal.fire('Gagal','Terjadi kesalahan sistem','error');
    } catch { Swal.fire('Error','Gagal menyambung ke server.','error'); }
  }

  async function ubahSandi() {
    const baru = document.getElementById('sandiBaru').value;
    const konfirm = document.getElementById('sandiKonfirmasi').value;
    if (!baru || !konfirm) return Swal.fire('Peringatan','Lengkapi form kata sandi!','warning');
    if (baru !== konfirm) return Swal.fire('Peringatan','Konfirmasi sandi tidak cocok!','warning');
    if (baru.length < 8) return Swal.fire('Peringatan','Sandi minimal 8 karakter!','warning');
    const fd = new FormData();
    fd.append('namaLengkap', document.getElementById('pNama').value || usernameAktif);
    fd.append('noWa', document.getElementById('pNoWa').value || '-');
    fd.append('role', roleAktif);
    fd.append('password', baru);
    try {
      const res = await fetch(`http://localhost:8080/api/users/edit/${usernameAktif}`, { method:'PUT', body:fd });
      if (res.ok) {
        Swal.fire({ title:'Berhasil', text:'Kata sandi telah diubah.', icon:'success', background:'#12121f', color:'#f1f0ff', confirmButtonColor:'#6d28d9' });
        document.getElementById('sandiBaru').value = '';
        document.getElementById('sandiKonfirmasi').value = '';
      } else { const t = await res.text(); Swal.fire('Gagal', t || 'Gagal mengubah kata sandi.', 'error'); }
    } catch(e) { console.error(e); Swal.fire('Error','Gagal memproses data.','error'); }
  }

  // ── Tema ──
  function setThemeMode(mode) {
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
    document.getElementById(mode === 'dark' ? 'btnThemeDark' : 'btnThemeLight').classList.add('active');
    showToast(`🎨 Tema ${mode === 'dark' ? 'Gelap' : 'Terang'} diterapkan!`);
  }

  function selectColor(el, hex) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.documentElement.style.setProperty('--color-primary', hex);
    localStorage.setItem('themeColor', hex);
    showToast('🎨 Warna aksen diperbarui!');
  }

  // ── Perusahaan ──
  async function muatPerusahaan() {
    try {
      const res = await fetch('http://localhost:8080/api/perusahaan');
      if (res.ok) {
        const o = await res.json();
        document.getElementById('cNama').value = o.nama || '';
        document.getElementById('cBrand').value = o.brand || '';
        document.getElementById('cNpwp').value = o.npwp || '';
        document.getElementById('cEmail').value = o.email || '';
        document.getElementById('cAlamat').value = o.alamat || '';
      }
    } catch(e) { console.error('Gagal memuat profil perusahaan'); }
  }
  muatPerusahaan();

  async function simpanPerusahaan() {
    const d = {
      nama: document.getElementById('cNama').value,
      brand: document.getElementById('cBrand').value,
      npwp: document.getElementById('cNpwp').value,
      email: document.getElementById('cEmail').value,
      alamat: document.getElementById('cAlamat').value,
    };
    try {
      const res = await fetch('http://localhost:8080/api/perusahaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      });
      if (res.ok) {
        showToast('<i class="ti ti-building" style="margin-right:6px;"></i>Data tersimpan di Database Global!');
      } else { Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error'); }
    } catch(e) { Swal.fire('Error', 'Gagal menyambung ke server', 'error'); }
  }

  // ── Bahaya (Factory Reset Aktif!) ──
  function resetTransaksi() {
    Swal.fire({ 
      title: 'Hapus Riwayat Transaksi?', 
      text: 'PERINGATAN: Seluruh data riwayat transaksi akan dihapus PERMANEN dari Database. Tindakan ini tidak bisa dibatalkan!', 
      icon:'warning', showCancelButton:true, confirmButtonColor:'#e11d48', cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Hapus!', cancelButtonText:'Batal', background:'#12121f', color:'#f1f0ff' 
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          // Menembak API penghancur di Java
          const res = await fetch('http://localhost:8080/api/transaksi/reset-semua', { method: 'DELETE' });
          const pesan = await res.text();
          if (res.ok) {
            Swal.fire({ title: 'Dikosongkan!', text: pesan, icon: 'success', background: '#12121f', color: '#f1f0ff' });
          } else { Swal.fire('Gagal', pesan, 'error'); }
        } catch { Swal.fire('Error', 'Gagal memproses ke server.', 'error'); }
      }
    });
  }

  function resetPengaturanUI() {
    Swal.fire({
      title:'Reset Tampilan?', text:'Semua pengaturan tema akan dikembalikan ke Default.', icon:'warning',
      showCancelButton:true, confirmButtonColor:'#6d28d9', cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Reset!', cancelButtonText:'Batal', background:'#12121f', color:'#f1f0ff'
    }).then(r => {
      if (r.isConfirmed) {
        localStorage.removeItem('theme'); localStorage.removeItem('themeColor'); localStorage.removeItem('themeColorLight');
        showToast('🔄 Tampilan dikembalikan ke Default');
        setTimeout(() => window.location.reload(), 1600);
      }
    });
  }

  function hapusAkunSendiri() {
    Swal.fire({
      title:'Hapus Akun Anda?', text:'Akses Anda akan terhapus permanen dan Anda akan dikeluarkan.',
      icon:'warning', showCancelButton:true, confirmButtonColor:'#e11d48', cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Hapus!', cancelButtonText:'Batal', background:'#12121f', color:'#f1f0ff'
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8080/api/users/hapus/${usernameAktif}`, { method:'DELETE' });
          if (res.ok) { sessionStorage.clear(); window.location.href='login.html'; }
        } catch { Swal.fire('Error','Gagal memproses ke server.','error'); }
      }
    });
  }