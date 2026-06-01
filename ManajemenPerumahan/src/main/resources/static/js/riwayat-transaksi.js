// ── Auth ──
  if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
  const usernameAktif = sessionStorage.getItem('username') || 'A';

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
  const fmtShort = n => n >= 1e9 ? (n/1e9).toFixed(1)+' M' : (n/1e6).toFixed(1)+' Jt';
  const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];

  function fmtTanggal(str) {
    if (!str || str === '-') return '-';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
  }

  function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0; const dur = 900; const step = 16;
    const inc = target / (dur/step);
    const timer = setInterval(() => {
      start = Math.min(start+inc, target);
      el.innerText = Math.floor(start);
      if (start >= target) clearInterval(timer);
    }, step);
  }

  function prosesLogout() {
    Swal.fire({
      title:'Yakin ingin keluar?',text:"Sesi kerja Anda akan diakhiri.",icon:'question',
      showCancelButton:true,confirmButtonColor:'#6d28d9',cancelButtonColor:'#374151',
      confirmButtonText:'Ya, Keluar!',cancelButtonText:'Batal',
      background:'#12121f',color:'#f1f0ff'
    }).then(r => { if (r.isConfirmed) { sessionStorage.clear(); window.location.href='login.html'; } });
  }

  // ── Avatar ──
  async function muatAvatarNavbar() {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      const users = await res.json();
      const me = users.find(u => u.username === usernameAktif);
      if (me) {
        const nama = me.namaLengkap || usernameAktif;
        let html = nama.charAt(0).toUpperCase();
        if (me.fotoProfil && me.fotoProfil !== 'default_profil.png' && me.fotoProfil !== 'null') {
          const url = `http://localhost:8080/uploads/profil/${encodeURIComponent(me.fotoProfil)}`;
          html = `<img src="${url}" alt="Profil" style="width:100%;height:100%;object-fit:cover">`;
        }
        document.getElementById('userAvatar').innerHTML = html;
      }
    } catch(e) { console.error(e); }
  }
  muatAvatarNavbar();

  // ── Data state ──
  let globalDataTransaksi = [], filteredData = [], currentPage = 1;
  const ITEMS_PER_PAGE = 7;

  // ── Fetch ──
  async function fetchTransaksi(keyword = '') {
    try {
      // 1. Suruh Java mencari teksnya
      const url = `http://localhost:8080/api/properti/transaksi/semua?keyword=${encodeURIComponent(keyword)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      globalDataTransaksi = data;

      // 2. JS cukup bertugas memfilter Dropdown Metode Pembayaran
      const m = document.getElementById('filterMetode') ? document.getElementById('filterMetode').value.toLowerCase() : '';
      filteredData = globalDataTransaksi.filter(trx => {
        return m === '' || (trx.metodePembayaran || '').toLowerCase().includes(m);
      });

      // 3. Update KPI secara dinamis berdasarkan hasil filter!
      let cash = 0, transfer = 0, transaksiBulanIni = 0;
      
      // Ambil patokan bulan dan tahun saat ini dari komputer/browser
      const waktuSekarang = new Date();
      const bulanSekarang = waktuSekarang.getMonth(); // 0 (Jan) s/d 11 (Des)
      const tahunSekarang = waktuSekarang.getFullYear();

      filteredData.forEach(t => {
        // A. Hitung Metode Pembayaran (Hanya Cash & Transfer)
        const met = (t.metodePembayaran || '').toUpperCase();
        if (met.includes('CASH')) cash++;
        else if (met.includes('TRANSFER')) transfer++;
        
        // B. Hitung Transaksi Bulan Ini
        const tglTrans = new Date(t.tanggalTransaksi || t.tanggal_transaksi);
        if (!isNaN(tglTrans)) { // Pastikan tanggalnya valid
            if (tglTrans.getMonth() === bulanSekarang && tglTrans.getFullYear() === tahunSekarang) {
                transaksiBulanIni++;
            }
        }
      });
      
      animateCount('kpiTotal', filteredData.length);
      animateCount('kpiTransfer', transfer);
      animateCount('kpiCash', cash);
      animateCount('statBulanIni', transaksiBulanIni);

      currentPage = 1;
      renderTabel();
    } catch (err) {
      document.getElementById('tabel-transaksi').innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="ti ti-wifi-off"></i><p>Gagal memuat data dari server.</p></div></td></tr>';
    }
  }

  // ── Render table ──
  function renderTabel() {
    const tbody = document.getElementById('tabel-transaksi');
    tbody.innerHTML = '';
    const total = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    document.getElementById('tabelSubInfo').innerText = `Total ${total} transaksi tercatat di sistem.`;

    if (total === 0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="ti ti-receipt-off"></i><p>Tidak ada transaksi ditemukan.</p></div></td></tr>';
      document.getElementById('pageInfoText').innerText = 'Tidak ada transaksi';
      document.getElementById('paginationNumbers').innerHTML = '';
      return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, total);
    const items = filteredData.slice(start, end);

    items.forEach((trx, idx) => {
      const prop = trx.properti || {};
      const kode = prop.kode || '-';
      const namaProp = prop.nama || 'Data Properti Tidak Tersedia';
      const harga = prop.harga ? fmtShort(prop.harga) : '—';

      const metode = (trx.metodePembayaran || 'CASH').toUpperCase();
      let metodeBadge = 'metode-cash';
      let metodeIcon = 'ti-cash';
      if (metode.includes('TRANSFER')) { metodeBadge = 'metode-transfer'; metodeIcon = 'ti-building-bank'; }
      else if (metode.includes('KPR') || metode.includes('KPA')) { metodeBadge = 'metode-kpr'; metodeIcon = 'ti-home-dollar'; }

      const row = document.createElement('tr');
      row.className = 'trx-row';
      row.style.transitionDelay = `${idx * 60}ms`;
      row.innerHTML = `
        <td class="col-date">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:32px;height:32px;border-radius:9px;background:var(--accent-dim);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="ti ti-calendar-event" style="font-size:13px;color:var(--accent-glow);"></i>
            </div>
            <span>${fmtTanggal(trx.tanggalTransaksi)}</span>
          </div>
        </td>
        <td class="col-kode"><span class="kode-badge">${kode}</span></td>
        <td>
          <div class="col-prop-name">${namaProp}</div>
          <div class="col-prop-price">${harga}</div>
        </td>
        <td>
          <div class="col-buyer-name">${trx.namaPembeli || '—'}</div>
          <div class="col-buyer-phone"><i class="ti ti-brand-whatsapp"></i> ${trx.noHp || '—'}</div>
        </td>
        <td><span class="metode-badge ${metodeBadge}"><i class="ti ${metodeIcon}"></i> ${metode}</span></td>
        <td style="text-align:center;">
          <div class="status-lunas">
            <div class="status-dot"></div>
            Lunas
          </div>
        </td>`;
      tbody.appendChild(row);
      // Trigger entrance animation
      requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('row-visible')));
    });

    document.getElementById('pageInfoText').innerText = `Menampilkan ${start+1}–${end} dari ${total} transaksi`;
    renderPagination(totalPages);
  }

  // ── Pagination ──
  function renderPagination(totalPages) {
    const container = document.getElementById('paginationNumbers');
    container.innerHTML = '';

    const mkBtn = (label, page, isIcon=false) => {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (page === currentPage && !isIcon ? ' active' : '') + (page === null ? ' disabled' : '');
      btn.innerHTML = isIcon ? `<i class="ti ${label}"></i>` : label;
      if (page !== null && page !== currentPage) btn.onclick = () => { currentPage = page; renderTabel(); };
      return btn;
    };

    container.appendChild(mkBtn('ti-chevron-left', currentPage > 1 ? currentPage-1 : null, true));
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
        if (i === 3 || i === totalPages - 2) { const sp = document.createElement('span'); sp.className='page-btn disabled';sp.innerText='…'; container.appendChild(sp); }
        continue;
      }
      container.appendChild(mkBtn(i, i));
    }
    container.appendChild(mkBtn('ti-chevron-right', currentPage < totalPages ? currentPage+1 : null, true));
  }

  // ── Filters ──
  function applyFilters() {
    const q = document.getElementById('inputCari').value;
    // Lempar kata kunci ke Java! (Metode pembayaran otomatis ter-filter di dalam fetchTransaksi)
    fetchTransaksi(q);
  }

  // ── Refresh ──
  async function segarkanDataManual() {
    const btn = document.getElementById('btnRefresh');
    const icon = document.getElementById('ikonRefresh');
    btn.classList.add('spinning');
    icon.style.transition = 'transform .6s ease';
    icon.style.transform = 'rotate(360deg)';
    await fetchTransaksi();
    setTimeout(() => {
      btn.classList.remove('spinning');
      icon.style.transform = 'rotate(0deg)';
    }, 600);

    Swal.mixin({
      toast:true, position:'top-end', showConfirmButton:false, timer:1800,
      background:'#12121f', color:'#f1f0ff',
      customClass:{ popup:'swal-dark-toast' }
    }).fire({ icon:'success', title:'Data berhasil diperbarui!' });
  }

  fetchTransaksi();