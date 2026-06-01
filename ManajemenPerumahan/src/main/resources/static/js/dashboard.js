// ── Particles ──
  (function() {
    const c = document.getElementById('particles');
    const colors = ['rgba(139,92,246,0.7)','rgba(167,139,250,0.5)','rgba(212,168,83,0.45)','rgba(168,85,247,0.6)'];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = [1.5,2,2.5,3][Math.floor(Math.random()*4)];
      const drift = (Math.random()-0.5)*160;
      p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;--drift:${drift}px;animation-duration:${9+Math.random()*16}s;animation-delay:${Math.random()*14}s;box-shadow:0 0 ${size*3}px currentColor;`;
      c.appendChild(p);
    }
  })();

  // ── Session Guard ──
  if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
  const currentUsername = sessionStorage.getItem('username') || 'A';
  document.getElementById('namaUserAktif').innerText = currentUsername;

  const API_URL = 'http://localhost:8080/api/properti';
  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  let globalDataProperti = [];
  let filteredData = [];
  let globalDataUsers = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  // ── Toast ──
  function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} toast-icon"></i>${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // ── Avatar ──
  async function muatAvatarNavbar() {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      const users = await res.json();
      const me = users.find(u => u.username === currentUsername);
      if (me) {
        const inisial = (me.namaLengkap || currentUsername).charAt(0).toUpperCase();
        let html = inisial;
        if (me.fotoProfil && me.fotoProfil !== 'default_profil.png' && me.fotoProfil !== 'null') {
          html = `<img src="http://localhost:8080/uploads/profil/${encodeURIComponent(me.fotoProfil)}" style="width:100%;height:100%;object-fit:cover;" alt="Profil">`;
        }
        document.getElementById('userAvatar').innerHTML = html;
      }
    } catch(e) {}
  }
  muatAvatarNavbar();

  // ── Fetch Properti ──
  async function fetchProperti(keyword = '', sortBy = '') {
    try {
      // 1. Ambil nilai filter dari dropdown HTML
      const st = document.getElementById('filterStatus') ? document.getElementById('filterStatus').value : '';
      const cat = document.getElementById('filterKategori') ? document.getElementById('filterKategori').value : '';

      // 2. Kirim SEMUA tugas (Keyword, Sort, Kategori, Status) ke Koki Java!
      const urlData = `http://localhost:8080/api/properti?keyword=${encodeURIComponent(keyword)}&sort=${encodeURIComponent(sortBy)}&kategori=${encodeURIComponent(cat)}&status=${encodeURIComponent(st)}`;
      const urlStatistik = `http://localhost:8080/api/properti/statistik?keyword=${encodeURIComponent(keyword)}&kategori=${encodeURIComponent(cat)}&status=${encodeURIComponent(st)}`;

      // 3. Ambil Makanan (Data) yang sudah jadi secara bersamaan
      const [resData, resStat] = await Promise.all([
        fetch(urlData),
        fetch(urlStatistik)
      ]);

      // JS sekarang HANYA menerima data bersih! Tidak ada lagi filter.filter atau forEach hitung!
      const dataBersih = await resData.json();
      globalDataProperti = dataBersih; 
      filteredData = dataBersih;
      
      const dataStatistik = await resStat.json(); 

      // 4. Langsung tampilkan angka matang ke layar
      animateCount('statTotal', dataStatistik.total);
      animateCount('statTersedia', dataStatistik.tersedia);
      animateCount('statTerjual', dataStatistik.terjual);
      document.getElementById('statOmset').innerText = formatRupiah(dataStatistik.omset);
      document.getElementById('tabelSubInfo').innerText = `${dataStatistik.total} properti ditemukan`;
      
      // 5. Kembalikan ke halaman 1 dan render tabel
      currentPage = 1;
      renderTabel();
      
    } catch(e) { 
      document.getElementById('tabelSubInfo').innerText = 'Gagal memuat data dari server.'; 
    }
  }

  function animateCount(id, target) {
    const el = document.getElementById(id);
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerText = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  }

  // ── Render Tabel ──
  function renderTabel() {
    const tbody = document.getElementById('propertyTableBody');
    tbody.innerHTML = '';
    const total = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--text-label);">Tidak ada data ditemukan.</td></tr>`;
      document.getElementById('pageInfoText').innerText = 'Menampilkan 0 dari 0 properti';
      document.getElementById('paginationNumbers').innerHTML = '';
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);
    filteredData.slice(start, end).forEach((item, idx) => {
      const catClass = item.jenisProperti === 'Apartemen' ? 'badge-apartemen' : 'badge-rumah';
      const statClass = item.terjual ? 'badge-lunas' : 'badge-tersedia';
      const statIcon = item.terjual ? 'fa-circle' : 'fa-clock';
      const pembeli = item.terjual ? `<span style="font-weight:600;color:var(--text-main);">${item.namaPembeli || '-'}</span>` : `<span style="color:var(--text-label);font-style:italic;">Belum ada</span>`;
      const nilaiTrans = item.terjual ? `<span style="font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--gold-light);">${formatRupiah(item.harga)}</span>` : `<span style="color:var(--text-label);">—</span>`;
      let actions = '';
      if (item.terjual) {
        actions = `<div class="action-btns"><button class="action-btn btn-view" onclick="lihatDetail('${item.kode}')" title="Detail"><i class="fas fa-eye"></i></button><button class="action-btn btn-locked" title="Sudah Lunas"><i class="fas fa-lock"></i></button></div>`;
      } else {
        const kt = item.kt || '', km = item.km || '', tr = item.tipeRumah || '', lt = item.luasTanah || '', ln = item.lantai || '';
        actions = `<div class="action-btns"><button class="action-btn btn-view" onclick="lihatDetail('${item.kode}')" title="Detail"><i class="fas fa-eye"></i></button><button class="action-btn btn-edit" onclick="siapkanEdit('${item.kode}','${item.nama}','${item.usernameAgen}','${item.harga}','${item.lokasi}','${item.jenisProperti}','${tr}','${lt}','${ln}','${kt}','${km}')" title="Edit"><i class="fas fa-pen"></i></button><button class="action-btn btn-delete" onclick="hapusProperti('${item.kode}','${item.nama}')" title="Hapus"><i class="fas fa-trash"></i></button></div>`;
      }
      const row = `<tr style="animation: cardReveal 400ms cubic-bezier(0.22,1,0.36,1) ${idx * 60}ms both;">
        <td><span class="badge badge-kode">${item.kode}</span></td>
        <td><div class="prop-name">${item.nama}</div></td>
        <td><div class="prop-price">${item.hargaFormat || formatRupiah(item.harga)}</div></td>
        <td><div class="prop-location"><i class="fas fa-map-pin"></i>${item.lokasi}</div></td>
        <td><span class="badge ${catClass}">${item.jenisProperti}</span></td>
        <td><span class="badge ${statClass}"><i class="fas ${statIcon}" style="font-size:8px;"></i> ${item.terjual ? 'Lunas' : 'Tersedia'}</span></td>
        <td>${pembeli}</td>
        <td>${nilaiTrans}</td>
        <td>${actions}</td>
      </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    });
    document.getElementById('pageInfoText').innerText = `Menampilkan ${start + 1}–${end} dari ${total} properti`;
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const c = document.getElementById('paginationNumbers');
    c.innerHTML = '';
    const mkBtn = (label, page, disabled, active) => {
      const b = document.createElement('button');
      b.className = 'page-btn' + (active ? ' active' : '');
      b.innerHTML = label;
      b.disabled = disabled;
      if (!disabled && !active) b.onclick = () => { currentPage = page; renderTabel(); };
      c.appendChild(b);
    };
    mkBtn('<i class="fas fa-chevron-left" style="font-size:10px;"></i>', currentPage - 1, currentPage === 1, false);
    for (let i = 1; i <= totalPages; i++) mkBtn(i, i, i === currentPage, i === currentPage);
    mkBtn('<i class="fas fa-chevron-right" style="font-size:10px;"></i>', currentPage + 1, currentPage === totalPages, false);
  }

  // ── Filters ──
  function applyFilters() {
    // Ambil kata kunci dari kolom pencarian
    const q = document.getElementById('searchProp').value;
    
    // Jika mase nanti menambahkan dropdown untuk urutkan harga, ambil ID-nya di sini
    // Sementara kita isi kosong (tidak diurutkan)
    const sortBy = document.getElementById('dropdownSort') ? document.getElementById('dropdownSort').value : '';
    
    // Suruh Java yang mencari datanya!
    fetchProperti(q, sortBy);
  }

  // ── Modal ──
  function openModal(id) { document.getElementById(id).classList.add('show'); }
  function closeModal(id) { document.getElementById(id).classList.remove('show'); }
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });

  // ── Agen Loader ──
  async function muatDaftarAgen() {
  try {
    const res = await fetch('http://localhost:8080/api/users');
    const users = await res.json();

    globalDataUsers = users;
    
    // 1. Ambil elemen dropdown untuk Tambah dan Edit
    const selTambah = document.getElementById('tAgen');
    const selEdit = document.getElementById('eAgen');
    
    // 2. Siapkan judul default-nya (Pakai hidden agar bersih saat diklik)
    selTambah.innerHTML = '<option value="" disabled selected hidden>-- Pilih Agen --</option>';
    selEdit.innerHTML = '<option value="" disabled selected hidden>-- Pilih Agen --</option>';
    
    // 3. Masukkan datanya ke KEDUA dropdown sekaligus
    users.forEach(u => {
      if (u.role === 'ADMIN') {
        const nama = u.namaLengkap || u.username;
        // Buat satu bungkus HTML
        const optionHTML = `<option value="${u.username}">${nama} (${u.username})</option>`;
        
        // Tembakkan ke tAgen dan eAgen
        selTambah.insertAdjacentHTML('beforeend', optionHTML);
        selEdit.insertAdjacentHTML('beforeend', optionHTML);
      }
    });
  } catch(e) { 
    console.error("Gagal memuat data agen:", e); 
    // Pesan error jika gagal
    document.getElementById('tAgen').innerHTML = '<option value="">Gagal memuat data</option>';
    document.getElementById('eAgen').innerHTML = '<option value="">Gagal memuat data</option>';
  }
}

// Jalankan fungsinya saat halaman dimuat
muatDaftarAgen();

  // ── Kategori Toggle ──
  document.getElementById('tKategori').addEventListener('change', function() {
    document.getElementById('tambahKhususRumah').style.display = this.value === 'Rumah' ? 'grid' : 'none';
    document.getElementById('tambahKhususApartemen').style.display = this.value === 'Apartemen' ? 'block' : 'none';
  });
  document.getElementById('eTipe').addEventListener('change', function() {
    document.getElementById('editKhususRumah').style.display = this.value === 'Rumah' ? 'grid' : 'none';
    document.getElementById('editKhususApartemen').style.display = this.value === 'Apartemen' ? 'block' : 'none';
  });

  // ── CRUD ──
  async function submitTambah(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('kode', document.getElementById('tKode').value);
    fd.append('nama', document.getElementById('tNama').value);
    fd.append('harga', document.getElementById('tHarga').value);
    fd.append('lokasi', document.getElementById('tLokasi').value);
    fd.append('kategori', document.getElementById('tKategori').value);
    fd.append('usernameAgen', document.getElementById('tAgen').value);
    fd.append('kt', document.getElementById('tKt').value);
    fd.append('km', document.getElementById('tKm').value);
    if (document.getElementById('tKategori').value === 'Rumah') {
      fd.append('tipeRumah', document.getElementById('tTipeRumah').value);
      fd.append('luasTanah', document.getElementById('tLuasTanah').value);
    } else { fd.append('lantai', document.getElementById('tLantai').value); }
    const foto = document.getElementById('tFoto').files[0];
    if (foto) fd.append('foto', foto);
    try {
      const res = await fetch(`${API_URL}/tambah`, { method: 'POST', body: fd });
      const txt = await res.text();
      if (res.ok) { showToast('Properti berhasil disimpan!'); closeModal('tambahModal'); document.getElementById('formTambah').reset(); fetchProperti(); }
      else { showToast(txt, 'error'); }
    } catch(err) { showToast('Gagal terhubung ke server.', 'error'); }
  }

  function siapkanEdit(kode, nama, usernameAgen, harga, lokasi, tipe, tipeRumah, luasTanah, lantai, kt, km) {
    document.getElementById('eKode').value = kode;
    document.getElementById('eNama').value = nama;
    document.getElementById('eAgen').value = usernameAgen;
    document.getElementById('eHarga').value = harga;
    document.getElementById('eLokasi').value = lokasi;
    document.getElementById('eTipe').value = tipe;
    document.getElementById('eKt').value = kt !== 'null' ? kt : '';
    document.getElementById('eKm').value = km !== 'null' ? km : '';
    document.getElementById('eTipeRumah').value = tipeRumah !== 'null' ? tipeRumah : '';
    document.getElementById('eLuasTanah').value = luasTanah !== 'null' ? luasTanah : '';
    document.getElementById('eLantai').value = lantai !== 'null' ? lantai : '';
    document.getElementById('eFoto').value = '';
    document.getElementById('eTipe').dispatchEvent(new Event('change'));
    openModal('editModal');
  }

  async function submitEdit(e) {
    e.preventDefault();
    const kode = document.getElementById('eKode').value;
    const fd = new FormData();
    fd.append('nama', document.getElementById('eNama').value);
    fd.append('usernameAgen', document.getElementById('eAgen').value);
    fd.append('harga', document.getElementById('eHarga').value);
    fd.append('lokasi', document.getElementById('eLokasi').value);
    fd.append('tipe', document.getElementById('eTipe').value);
    fd.append('kt', document.getElementById('eKt').value);
    fd.append('km', document.getElementById('eKm').value);
    if (document.getElementById('eTipe').value === 'Rumah') {
      fd.append('tipeRumah', document.getElementById('eTipeRumah').value);
      fd.append('luasTanah', document.getElementById('eLuasTanah').value);
    } else { fd.append('lantai', document.getElementById('eLantai').value); }
    const foto = document.getElementById('eFoto').files[0];
    if (foto) fd.append('foto', foto);
    try {
      const res = await fetch(`${API_URL}/${kode}/edit`, { method: 'PUT', body: fd });
      const txt = await res.text();
      if (txt.includes('Sukses')) { showToast('Properti berhasil diperbarui!'); closeModal('editModal'); fetchProperti(); }
      else { showToast(txt, 'error'); }
    } catch(err) { showToast('Gagal terhubung ke server.', 'error'); }
  }

  function hapusProperti(kode, nama) {
    Swal.fire({
      title: 'Hapus Properti?',
      text: `Anda yakin ingin menghapus ${nama} (${kode})?`,
      icon: 'warning',
      background: '#10101e',
      color: '#f1f0ff',
      iconColor: '#f87171',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#3f3f5a',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const r = await fetch(`${API_URL}/${kode}/hapus`, { method: 'DELETE' });
          const txt = await r.text();
          if (txt.includes('Sukses')) { showToast('Properti berhasil dihapus.'); fetchProperti(); }
          else { showToast(txt, 'error'); }
        } catch(e) { showToast('Gagal memproses.', 'error'); }
      }
    });
  }

  function lihatDetail(kode) {
    const item = globalDataProperti.find(p => p.kode === kode);
    if (!item) return;
    document.getElementById('dKode').innerText = item.kode;
    document.getElementById('dNama').innerText = item.nama;
    const dataAgen = globalDataUsers.find(u => u.username === item.usernameAgen);
    const namaLengkapAgen = dataAgen ? (dataAgen.namaLengkap || dataAgen.username) : (item.usernameAgen || 'Tidak ada agen');
    document.getElementById('dAgen').innerText = namaLengkapAgen;
    document.getElementById('dLokasi').innerHTML = `<i class="fas fa-map-marker-alt" style="color:#f87171;margin-right:5px;"></i>${item.lokasi}`;
    document.getElementById('dHarga').innerText = item.hargaFormat || formatRupiah(item.harga);
    document.getElementById('dKategori').innerText = item.jenisProperti;
    document.getElementById('dKt').innerText = item.kt || '-';
    document.getElementById('dKm').innerText = item.km || '-';
    const st = document.getElementById('dStatus');
    if (item.terjual) { st.className = 'badge badge-lunas'; st.innerHTML = '<i class="fas fa-check-circle" style="font-size:9px;"></i> Lunas'; }
    else { st.className = 'badge badge-tersedia'; st.innerHTML = '<i class="fas fa-clock" style="font-size:9px;"></i> Tersedia'; }
    document.getElementById('boxTipeRumah').style.display = 'none';
    document.getElementById('boxLuasTanah').style.display = 'none';
    document.getElementById('boxLantai').style.display = 'none';
    if (item.jenisProperti === 'Rumah') {
      document.getElementById('boxTipeRumah').style.display = '';
      document.getElementById('boxLuasTanah').style.display = '';
      document.getElementById('dTipeRumah').innerText = item.tipeRumah || '-';
      document.getElementById('dLuasTanah').innerText = item.luasTanah ? item.luasTanah + ' m²' : '-';
    } else if (item.jenisProperti === 'Apartemen') {
      document.getElementById('boxLantai').style.display = '';
      document.getElementById('dLantai').innerText = item.lantai || '-';
    }
    const bx = document.getElementById('boxTransaksi');
    if (item.terjual && item.transaksi) {
      bx.style.display = '';
      document.getElementById('dNamaPembeli').innerText = item.transaksi.namaPembeli || '-';
      document.getElementById('dAlamatPembeli').innerText = item.transaksi.alamatPembeli || '-';
      document.getElementById('dNoHp').innerText = item.transaksi.noHp || '-';
      document.getElementById('dMetode').innerText = item.transaksi.metodePembayaran || '-';
    } else { bx.style.display = 'none'; }
    openModal('detailModal');
  }

  async function submitBeli(e) {
    e.preventDefault();
    const kode = document.getElementById('bKode').value;
    const data = {
      nama: document.getElementById('bNama').value,
      alamat: document.getElementById('bAlamat').value,
      noHp: document.getElementById('bNoHp').value,
      tanggal: document.getElementById('bTanggal').value,
      metode: document.getElementById('bMetode').value
    };
    try {
      const res = await fetch(`${API_URL}/${kode}/beli`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const txt = await res.text();
      if (txt.includes('Sukses')) { showToast('Transaksi berhasil diproses!'); closeModal('beliModal'); document.getElementById('formBeli').reset(); fetchProperti(); }
      else { showToast(txt, 'error'); }
    } catch(e) { showToast('Gagal memproses transaksi.', 'error'); }
  }

  function prosesLogout() {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: 'Sesi kerja Anda akan diakhiri.',
      icon: 'question',
      background: '#10101e',
      color: '#f1f0ff',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#3f3f5a',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((r) => {
      if (r.isConfirmed) { sessionStorage.clear(); window.location.href = 'login.html'; }
    });
  }

  fetchProperti();