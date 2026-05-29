// ── Auth guard ──
  if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('role') !== 'ADMIN')
    window.location.href = 'login.html';
  const currentUsername = sessionStorage.getItem('username') || 'A';
  const API_USER_URL = 'http://localhost:8080/api/users';

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
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Modal helpers ──
  function bukaModalTambah() { document.getElementById('tambahModal').classList.add('open'); }
  function tutupModal(id) { document.getElementById(id).classList.remove('open'); }
  // Close on backdrop click
  ['tambahModal','editModal'].forEach(id => {
    document.getElementById(id).addEventListener('click', function(e) {
      if (e.target === this) tutupModal(id);
    });
  });

  // ── Logout ──
  function prosesLogout() {
    Swal.fire({
      title:'Yakin ingin keluar?', text:'Sesi kerja Anda akan diakhiri.', icon:'question',
      showCancelButton:true, confirmButtonColor:'#6d28d9', cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Keluar!', cancelButtonText:'Batal',
      background:'#12121f', color:'#f1f0ff'
    }).then(r => { if (r.isConfirmed) { sessionStorage.clear(); window.location.href='login.html'; } });
  }

  // ── Utils ──
  function animateCount(id, target) {
    const el = document.getElementById(id); if (!el) return;
    let v = 0; const dur = 800; const step = 16; const inc = target/(dur/step);
    const t = setInterval(() => {
      v = Math.min(v+inc, target); el.innerText = Math.floor(v);
      if (v >= target) clearInterval(t);
    }, step);
  }

  // ── Avatar navbar ──
  async function muatAvatar() {
    try {
      const res = await fetch(API_USER_URL);
      const users = await res.json();
      const me = users.find(u => u.username === currentUsername);
      if (me) {
        const nama = me.namaLengkap || currentUsername;
        let html = nama.charAt(0).toUpperCase();
        if (me.fotoProfil && me.fotoProfil !== 'default_profil.png' && me.fotoProfil !== 'null') {
          const url = `http://localhost:8080/uploads/profil/${encodeURIComponent(me.fotoProfil)}`;
          html = `<img src="${url}" alt="Profil" style="width:100%;height:100%;object-fit:cover">`;
        }
        document.getElementById('userAvatar').innerHTML = html;
      }
    } catch(e) {}
  }
  muatAvatar();

  // ── Render row helper ──
  function buatRow(user, delayed = 0) {
    const foto = (user.fotoProfil && user.fotoProfil !== 'default_profil.png' && user.fotoProfil !== 'null')
      ? `<img src="http://localhost:8080/uploads/profil/${encodeURIComponent(user.fotoProfil)}" style="width:100%;height:100%;object-fit:cover" alt="">`
      : (user.namaLengkap || user.username).charAt(0).toUpperCase();
    const roleBadge = user.role === 'ADMIN'
      ? `<span class="role-badge role-admin"><i class="ti ti-shield-check" style="font-size:11px"></i> ADMIN</span>`
      : `<span class="role-badge role-user"><i class="ti ti-user" style="font-size:11px"></i> USER</span>`;
    const tr = document.createElement('tr');
    tr.className = 'baris-akun row-enter';
    tr.style.animationDelay = delayed + 'ms';
    tr.innerHTML = `
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="user-avatar">${foto}</div>
          <div>
            <div class="user-name">${user.namaLengkap || user.username}</div>
            <div class="user-role">${user.role === 'ADMIN' ? 'Marketing Advisor' : 'Pelanggan'}</div>
          </div>
        </div>
      </td>
      <td><span class="mono">${user.username}</span></td>
      <td><span class="wa-val"><i class="ti ti-brand-whatsapp" style="margin-right:4px"></i>${user.noWa || '—'}</span></td>
      <td style="text-align:center;">${roleBadge}</td>
      <td style="text-align:center;">
        <div style="display:flex;gap:6px;justify-content:center;">
          <button class="btn-icon btn-edit" title="Edit" onclick="siapkanEdit('${user.username}','${user.namaLengkap||''}','${user.noWa||''}','${user.role}')"><i class="ti ti-edit"></i></button>
          <button class="btn-icon btn-delete" title="Hapus" onclick="hapusAkun('${user.username}')"><i class="ti ti-trash"></i></button>
        </div>
      </td>`;
    return tr;
  }

  // ── Fetch & render ──
  let allUsers = [];
  
  // Fungsi ini sekarang menerima parameter keyword dari kolom pencarian
  async function fetchAkun(keyword = '') {
    try {
      // Panggil API Java dengan membawa keyword
      const url = keyword ? `${API_USER_URL}?keyword=${encodeURIComponent(keyword)}` : API_USER_URL;
      const res = await fetch(url);
      allUsers = await res.json();
      
      renderTabel(allUsers);
      
      // Update KPI
      const admins = allUsers.filter(u => u.role === 'ADMIN').length;
      const users  = allUsers.filter(u => u.role === 'USER').length;
      animateCount('statTotal', allUsers.length);
      animateCount('statAdmin', admins);
      animateCount('statUser',  users);
      animateCount('statBaru',  Math.min(allUsers.length, 3)); 
      
    } catch(e) {
      ['adminTableBody','userTableBody'].forEach(id => {
        document.getElementById(id).innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ti ti-wifi-off"></i><p>Gagal memuat data dari server.</p></div></td></tr>`;
      });
    }
  }

  function renderTabel(data) {
    const adminBody = document.getElementById('adminTableBody');
    const userBody  = document.getElementById('userTableBody');
    adminBody.innerHTML = '';
    userBody.innerHTML  = '';
    let ai = 0, ui = 0;
    data.forEach(u => {
      if (u.role === 'ADMIN') { adminBody.appendChild(buatRow(u, ai * 60)); ai++; }
      else                    { userBody.appendChild(buatRow(u, ui * 60));  ui++; }
    });
    if (!ai) adminBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ti ti-users-off"></i><p>Belum ada data Tim Internal.</p></div></td></tr>`;
    if (!ui) userBody.innerHTML  = `<tr><td colspan="5"><div class="empty-state"><i class="ti ti-users-off"></i><p>Belum ada data Pelanggan.</p></div></td></tr>`;
  }

  function saringTabel() {
    // Ambil teks yang diketik mase
    const q = document.getElementById('searchInput').value;
    
    // Suruh Java yang mencari datanya!
    fetchAkun(q);
  }

  // ── CRUD ──
  async function submitTambah(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('username', document.getElementById('aUsername').value);
    fd.append('password', document.getElementById('aPassword').value);
    fd.append('namaLengkap', document.getElementById('aNama').value);
    fd.append('noWa', document.getElementById('aWa').value);
    fd.append('role', document.getElementById('aRole').value);
    const foto = document.getElementById('aFoto').files[0];
    if (foto) fd.append('foto', foto);
    try {
      const res = await fetch(`${API_USER_URL}/tambah`, { method:'POST', body:fd });
      const txt = await res.text();
      if (res.ok) {
        Swal.fire({ title:'Berhasil!', text:txt, icon:'success', background:'#12121f', color:'#f1f0ff', confirmButtonColor:'#7c3aed' });
        tutupModal('tambahModal'); document.getElementById('formTambah').reset(); fetchAkun();
      } else { Swal.fire({ title:'Gagal', text:txt, icon:'error', background:'#12121f', color:'#f1f0ff' }); }
    } catch { Swal.fire({ title:'Error', text:'Terjadi kesalahan jaringan.', icon:'error', background:'#12121f', color:'#f1f0ff' }); }
  }

  function siapkanEdit(username, nama, noWa, role) {
    document.getElementById('eUsername').value = username;
    document.getElementById('eNama').value = nama;
    document.getElementById('eWa').value = noWa;
    document.getElementById('eRole').value = role;
    document.getElementById('ePassword').value = '';
    document.getElementById('eFoto').value = '';
    document.getElementById('editModal').classList.add('open');
  }

  async function submitEdit(e) {
    e.preventDefault();
    const username = document.getElementById('eUsername').value;
    const fd = new FormData();
    fd.append('namaLengkap', document.getElementById('eNama').value);
    fd.append('noWa', document.getElementById('eWa').value);
    fd.append('role', document.getElementById('eRole').value);
    const pass = document.getElementById('ePassword').value;
    if (pass) fd.append('password', pass);
    const foto = document.getElementById('eFoto').files[0];
    if (foto) fd.append('foto', foto);
    try {
      const res = await fetch(`${API_USER_URL}/edit/${username}`, { method:'PUT', body:fd });
      const txt = await res.text();
      if (res.ok) {
        Swal.fire({ title:'Berhasil!', text:txt, icon:'success', background:'#12121f', color:'#f1f0ff', confirmButtonColor:'#059669' });
        tutupModal('editModal'); fetchAkun();
      } else { Swal.fire({ title:'Gagal', text:txt, icon:'error', background:'#12121f', color:'#f1f0ff' }); }
    } catch { Swal.fire({ title:'Error', text:'Terjadi kesalahan jaringan.', icon:'error', background:'#12121f', color:'#f1f0ff' }); }
  }

  function hapusAkun(username) {
    Swal.fire({
      title:'Hapus akun ini?', text:`Akun "${username}" akan dihapus permanen!`, icon:'warning',
      showCancelButton:true, confirmButtonColor:'#e11d48', cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Hapus!', cancelButtonText:'Batal',
      background:'#12121f', color:'#f1f0ff'
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          const res = await fetch(`${API_USER_URL}/hapus/${username}`, { method:'DELETE' });
          const txt = await res.text();
          if (res.ok) {
            Swal.fire({ title:'Terhapus!', text:txt, icon:'success', background:'#12121f', color:'#f1f0ff' });
            fetchAkun();
          } else { Swal.fire({ title:'Gagal', text:txt, icon:'error', background:'#12121f', color:'#f1f0ff' }); }
        } catch { Swal.fire({ title:'Error', text:'Terjadi kesalahan jaringan.', icon:'error', background:'#12121f', color:'#f1f0ff' }); }
      }
    });
  }

  fetchAkun();