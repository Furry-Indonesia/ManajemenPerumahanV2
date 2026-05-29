// ── Auth Guard ──
  if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
  if (sessionStorage.getItem('role') !== 'USER') window.location.href = 'dashboard.html';

  const currentUsername = sessionStorage.getItem('username') || 'Pengguna';
  document.getElementById('namaUserNavbar').innerText = currentUsername;
  document.getElementById('greetingName').innerText = currentUsername;

  // ── Greeting time-based ──
  (function() {
    const h = new Date().getHours();
    const sapaan = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
    document.getElementById('greetingPill').innerHTML =
      `<div class="dot"></div>${sapaan}, <strong>${currentUsername}</strong>! Temukan hunian impian Anda.`;
  })();

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

  // ── Utils ──
  const fmtRupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n);
  const fmtShort = n => n >= 1e9 ? (n/1e9).toFixed(2)+' M' : (n/1e6).toFixed(0)+' Jt';

  let globalProperti = [], filteredProperti = [], globalUsers = [];

  // ── Avatar ──
  async function muatAvatar() {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      globalUsers = await res.json();
      const me = globalUsers.find(u => u.username === currentUsername);
      if (me && me.fotoProfil && me.fotoProfil !== 'default_profil.png' && me.fotoProfil !== 'null') {
        document.getElementById('userAvatar').innerHTML = `<img src="http://localhost:8080/uploads/profil/${encodeURIComponent(me.fotoProfil)}" style="width:100%;height:100%;object-fit:cover;">`;
      } else {
        document.getElementById('userAvatar').innerText = currentUsername.charAt(0).toUpperCase();
      }
    } catch(e) { document.getElementById('userAvatar').innerText = currentUsername.charAt(0).toUpperCase(); }
  }
  muatAvatar();

  // ── Data Loader ──
  async function muatKatalog(keyword = '') {
    try {
      // 1. Ambil data dari Java beserta titipan kata kunci pencarian
      const [resP, resU] = await Promise.all([
        fetch(`http://localhost:8080/api/properti?keyword=${encodeURIComponent(keyword)}`),
        fetch('http://localhost:8080/api/users')
      ]);
      const rawProp = await resP.json();
      globalUsers = await resU.json();

      // 2. Filter Wajib: Pelanggan HANYA boleh melihat properti yang belum terjual
      globalProperti = rawProp.filter(p => !p.terjual);

      // 3. Ambil nilai dropdown Filter Kota dan Harga di HTML
      const kota = document.getElementById('filterKota') ? document.getElementById('filterKota').value.toLowerCase() : '';
      const hargaBand = document.getElementById('filterHarga') ? document.getElementById('filterHarga').value : '';

      // 4. Saring properti berdasarkan Kota dan Rentang Harga (Client-Side)
      filteredProperti = globalProperti.filter(p => {
        const matchKota = !kota || (p.lokasi || '').toLowerCase().includes(kota);
        let matchHarga = true;
        if (hargaBand) {
          const [mn, mx] = hargaBand.split('-').map(Number);
          const jt = p.harga / 1e6; // Ubah harga ke format Juta
          matchHarga = jt >= mn && jt <= mx;
        }
        return matchKota && matchHarga;
      });

      // 5. Tampilkan ke layar
      renderKartu(true);
    } catch(e) {
      document.getElementById('propGrid').innerHTML = `
        <div class="empty-state">
          <i class="ti ti-wifi-off"></i>
          <p>Gagal memuat katalog.</p>
          <small>Pastikan server backend berjalan dan dapat diakses.</small>
        </div>`;
    }
  }

  // ── Render ──
  function renderKartu(animate = false) {
    const grid = document.getElementById('propGrid');
    grid.innerHTML = '';
    document.getElementById('resultCountText').innerText = filteredProperti.length;

    if (!filteredProperti.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="ti ti-home-off"></i>
          <p>Tidak ada properti ditemukan.</p>
          <small>Coba ubah kata kunci atau filter pencarian Anda.</small>
        </div>`;
      return;
    }

    filteredProperti.forEach((item, idx) => {
      const agen = globalUsers.find(u => u.username === item.usernameAgen) || {};
      const namaAgen = agen.namaLengkap || item.usernameAgen || 'Admin';
      const noWa = agen.noWa || '6281234567890';
      const inisialAgen = namaAgen.substring(0,2).toUpperCase();
      const fotoAgen = (agen.fotoProfil && agen.fotoProfil !== 'default_profil.png' && agen.fotoProfil !== 'null')
        ? `<img src="http://localhost:8080/uploads/profil/${encodeURIComponent(agen.fotoProfil)}" style="width:100%;height:100%;object-fit:cover;" alt="${namaAgen}">`
        : inisialAgen;

      const fotoProp = item.fotoProperti
        ? `http://localhost:8080/uploads/properti/${item.fotoProperti}`
        : `https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=700&auto=format&fit=crop`;

      const katBadge = item.jenisProperti === 'Apartemen'
        ? `<span class="badge-cat cat-apt"><i class="ti ti-building" style="font-size:10px;"></i> Apartemen</span>`
        : `<span class="badge-cat cat-rmh"><i class="ti ti-home" style="font-size:10px;"></i> Rumah</span>`;

      let spekExtra = '';
      if (item.jenisProperti === 'Apartemen') {
        spekExtra = `<div class="spec-item"><i class="ti ti-building" style="font-size:11px;margin-right:3px;"></i>Lt. ${item.lantai||'—'}</div>`;
      } else {
        spekExtra = `<div class="spec-item"><i class="ti ti-resize" style="font-size:11px;margin-right:3px;"></i>${item.luasTanah||'—'} m²</div>`;
      }

      const pesanWA = encodeURIComponent(`Halo ${namaAgen}, saya tertarik dengan properti *${item.nama}* (${item.kode}) seharga ${fmtRupiah(item.harga)}. Apakah masih tersedia?`);
      const linkWA = `https://wa.me/${noWa}?text=${pesanWA}`;

      const card = document.createElement('div');
      card.className = 'prop-card';
      card.style.transitionDelay = animate ? `${idx * 70}ms` : '0ms';
      card.innerHTML = `
        <div class="prop-img">
          <img src="${fotoProp}" alt="${item.nama}" loading="lazy">
          <div class="prop-img-overlay-top"></div>
          <div class="prop-img-overlay"></div>
          <span class="badge badge-tersedia"><i class="ti ti-clock" style="font-size:10px;"></i> Tersedia</span>
          ${katBadge}
        </div>
        <div class="prop-body">
          <div class="prop-name">${item.nama}</div>
          <div class="prop-loc"><i class="ti ti-map-pin" style="font-size:12px;"></i>${item.lokasi||'—'}</div>
          <div class="prop-price-box">
            <div>
              <div class="prop-price-label">Harga</div>
              <div class="prop-price-val">${fmtRupiah(item.harga)}</div>
            </div>
            <div class="prop-divider"></div>
            <div>
              <div class="prop-agen-label">Agen</div>
              <div class="prop-agen-val">${namaAgen}</div>
            </div>
          </div>
          <div class="prop-specs">
            <div class="spec-item"><i class="ti ti-bed" style="font-size:11px;margin-right:3px;"></i>${item.kt||'—'} KT</div>
            <div class="spec-item"><i class="ti ti-bath" style="font-size:11px;margin-right:3px;"></i>${item.km||'—'} KM</div>
            ${spekExtra}
          </div>
        </div>
        <div class="prop-footer">
          <div class="agen-strip">
            <div class="agen-avatar">${fotoAgen}</div>
            <div>
              <div class="agen-name">${namaAgen}</div>
              <div class="agen-role">Official Agent</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn-detail" onclick="lihatDetail('${item.kode}')" title="Detail"><i class="ti ti-eye"></i></button>
            <a href="${linkWA}" target="_blank" class="btn-wa"><i class="ti ti-brand-whatsapp" style="font-size:16px;"></i> WA</a>
          </div>
        </div>`;
      grid.appendChild(card);

      // Trigger animation
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
    });
  }

  // ── Filters ──
  function applyFilters() {
    // Ambil kata kunci dari kolom pencarian
    const q = document.getElementById('searchNama') ? document.getElementById('searchNama').value.trim() : '';
    
    // Panggil ulang fungsi muatKatalog, Java akan mencari namanya, JS akan memfilter harga/kotanya!
    muatKatalog(q);
  }

  function resetFilter() {
    // Kosongkan semua inputan
    if (document.getElementById('searchNama')) document.getElementById('searchNama').value = '';
    if (document.getElementById('filterKota')) document.getElementById('filterKota').value = '';
    if (document.getElementById('filterHarga')) document.getElementById('filterHarga').value = '';
    
    // Panggil ulang data dari awal
    muatKatalog('');
  }

  // ── Modal ──
  function lihatDetail(kode) {
    const item = globalProperti.find(p => p.kode === kode);
    if (!item) return;

    const agen = globalUsers.find(u => u.username === item.usernameAgen) || {};
    const namaAgen = agen.namaLengkap || item.usernameAgen || 'Admin';
    const noWa = agen.noWa || '6281234567890';

    document.getElementById('mKode').innerText = item.kode;
    document.getElementById('mNama').innerText = item.nama;
    document.getElementById('mLokasi').innerText = item.lokasi || '—';
    document.getElementById('mHarga').innerText = fmtRupiah(item.harga);
    document.getElementById('mKategori').innerText = item.jenisProperti || '—';
    document.getElementById('mAgen').innerText = namaAgen;
    document.getElementById('mKt').innerText = item.kt || '—';
    document.getElementById('mKm').innerText = item.km || '—';

    // Reset optional fields
    ['mBoxTipe','mBoxLT','mBoxLantai'].forEach(id => document.getElementById(id).style.display = 'none');

    if (item.jenisProperti === 'Rumah') {
      document.getElementById('mBoxTipe').style.display = '';
      document.getElementById('mTipe').innerText = item.tipeRumah || '—';
      document.getElementById('mBoxLT').style.display = '';
      document.getElementById('mLT').innerText = item.luasTanah ? item.luasTanah + ' m²' : '—';
    } else if (item.jenisProperti === 'Apartemen') {
      document.getElementById('mBoxLantai').style.display = '';
      document.getElementById('mLantai').innerText = item.lantai || '—';
    }

    const pesan = encodeURIComponent(`Halo ${namaAgen}, saya tertarik dengan properti *${item.nama}* (${item.kode}) seharga ${fmtRupiah(item.harga)}. Apakah masih tersedia?`);
    document.getElementById('mLinkWA').href = `https://wa.me/${noWa}?text=${pesan}`;

    document.getElementById('detailModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('detailModal').classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('detailModal').addEventListener('click', e => {
    if (e.target === document.getElementById('detailModal')) closeModal();
  });

  // ── Logout ──
  function prosesLogout() {
    Swal.fire({
      title:'Yakin ingin keluar?',text:'Sesi Anda akan diakhiri.',icon:'question',
      showCancelButton:true,confirmButtonColor:'#6d28d9',cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Keluar!',cancelButtonText:'Batal',
      background:'#12121f',color:'#f1f0ff'
    }).then(r => { if (r.isConfirmed) { sessionStorage.clear(); window.location.href='login.html'; } });
  }

  muatKatalog();