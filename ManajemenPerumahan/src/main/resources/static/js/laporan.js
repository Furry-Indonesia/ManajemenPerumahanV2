// ── Auth guard ──
    if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'login.html';
    if (sessionStorage.getItem('role') !== 'ADMIN') window.location.href = 'katalog.html';
    const currentUsername = sessionStorage.getItem('username') || 'A';

    // ── Particles ──
    (function () {
      const c = document.getElementById('particles');
      const colors = ['rgba(139,92,246,.7)', 'rgba(167,139,250,.5)', 'rgba(212,168,83,.45)', 'rgba(168,85,247,.6)'];
      for (let i = 0; i < 28; i++) {
        const p = document.createElement('div'); p.className = 'particle';
        const size = [1.5, 2, 2.5, 3][Math.floor(Math.random() * 4)];
        const drift = (Math.random() - .5) * 180;
        p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;--drift:${drift}px;animation-duration:${9 + Math.random() * 16}s;animation-delay:${Math.random() * 14}s;box-shadow:0 0 ${size * 3}px currentColor;`;
        c.appendChild(p);
      }
    })();

    // ── Scroll reveal ──
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

    // ── Utils ──
    const fmtRupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const fmtShort = n => n >= 1e9 ? (n / 1e9).toFixed(1) + ' M' : (n / 1e6).toFixed(1) + ' Jt';

    function prosesLogout() {
      Swal.fire({
        title: 'Yakin ingin keluar?', text: "Sesi kerja Anda akan diakhiri.", icon: 'question',
        showCancelButton: true, confirmButtonColor: '#6d28d9', cancelButtonColor: '#374151',
        confirmButtonText: 'Ya, Keluar!', cancelButtonText: 'Batal',
        background: '#12121f', color: '#f1f0ff'
      }).then(r => { if (r.isConfirmed) { sessionStorage.clear(); window.location.href = 'login.html'; } });
    }

    // ── Avatar ──
    async function muatAvatarNavbar() {
      try {
        const res = await fetch('http://localhost:8080/api/users');
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
      } catch (e) { console.error(e); }
    }
    muatAvatarNavbar();

    // ── Pagination state ──
    let globalProperti = [], filteredProperti = [], currentPage = 1;
    const PER_PAGE = 4;

    // ── Main data loader ──
    // ── Main data loader (Hybrid Server-Side & Client-Side) ──
    async function muatDataLaporan(keyword = '') {
      try {
        // 1. Fetch dari Java (Server-Side Search)
        // Kita titipkan keyword pencarian ke Properti dan Transaksi
        const [resP, resU, resT] = await Promise.all([
          fetch(`http://localhost:8080/api/properti?keyword=${encodeURIComponent(keyword)}`),
          fetch('http://localhost:8080/api/users'),
          fetch(`http://localhost:8080/api/properti/transaksi/semua?keyword=${encodeURIComponent(keyword)}`)
        ]);

        const raw = await resP.json();
        const users = await resU.json();
        const semuaTransaksi = await resT.json();

        // 2. Ambil nilai Dropdown (Client-Side)
        const st = document.getElementById('filterStatus') ? document.getElementById('filterStatus').value : '';
        const ct = document.getElementById('filterKategori') ? document.getElementById('filterKategori').value : '';

        // 3. Saring Properti berdasarkan Status & Kategori
        let propertiFilter = raw.filter(p => {
          const matchS = st === '' ? true : st === 'Lunas' ? p.terjual === true : p.terjual === false;
          const matchC = ct === '' ? true : p.jenisProperti === ct;
          return matchS && matchC;
        });

        // 4. Petakan data untuk tampilan Kartu
        const properti = propertiFilter.map(p => ({
          ...p,
          inisialAgen: p.usernameAgen ? p.usernameAgen.substring(0, 2).toUpperCase() : '?',
          hargaShort: fmtShort(p.harga),
          spek: { lantai: p.lantai || 1, kt: p.kt || '3+1', km: p.km || '2+1' }
        }));

        globalProperti = properti; 
        filteredProperti = properti;

        // =========================================================
        // 🔥 UPDATE CHART OTOMATIS BERDASARKAN HASIL PENCARIAN 🔥
        // =========================================================

        // --- A. KPI (Statistik Atas) ---
        let lunas = 0, tersedia = 0, omset = 0, jmlRumah = 0, jmlApt = 0;
        properti.forEach(p => {
          if (p.terjual) { lunas++; omset += p.harga; } else tersedia++;
          if (p.jenisProperti === 'Rumah') jmlRumah++;
          if (p.jenisProperti === 'Apartemen') jmlApt++;
        });
        const total = properti.length;
        animateCount('lapTotal', total);
        animateCount('lapLunas', lunas);
        animateCount('lapTersedia', tersedia);
        document.getElementById('lapOmset').innerText = fmtRupiah(omset);

        // --- B. Donut Chart ---
        const circ = 364.4;
        const pR = total === 0 ? 0 : jmlRumah / total;
        const pA = total === 0 ? 0 : jmlApt / total;
        document.getElementById('donutTotalText').innerText = total;
        document.getElementById('pctRumahText').innerText = (pR * 100).toFixed(1) + '%';
        document.getElementById('pctAptText').innerText = (pA * 100).toFixed(1) + '%';
        document.getElementById('barRumah').style.width = (pR * 100) + '%';
        document.getElementById('barApt').style.width = (pA * 100) + '%';
        setTimeout(() => {
          document.getElementById('donutRumah').setAttribute('stroke-dasharray', `${pR * circ} ${circ}`);
          document.getElementById('donutApt').setAttribute('stroke-dasharray', `${pA * circ} ${circ}`);
          document.getElementById('donutApt').setAttribute('stroke-dashoffset', `-${pR * circ}`);
        }, 400);

        // --- C. Rata-Rata & Konversi ---
        const rata = total === 0 ? 0 : properti.reduce((s, p) => s + p.harga, 0) / total;
        document.getElementById('lapRataHarga').innerText = fmtRupiah(rata);
        document.getElementById('lapRataSub').innerText = `Dari ${total} properti tersaring`;
        const konv = total === 0 ? 0 : lunas / total * 100;
        document.getElementById('lapKonversiText').innerText = konv.toFixed(1) + '%';
        document.getElementById('lapKonversiSub').innerText = `${lunas} dari ${total} properti terjual lunas`;
        setTimeout(() => { document.getElementById('lapKonversiBar').style.width = konv + '%'; }, 400);

        // --- D. Bar chart (Perkembangan Transaksi) ---
        const bar = document.getElementById('barChartContainer'); 
        bar.innerHTML = ''; 
        
        const bulanNama = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        let penjBulan = {}; 
        let enamBulan = [];
        
        let d = new Date();
        d.setDate(1); 
        
        for (let i = 5; i >= 0; i--) {
          let tempD = new Date(d.getFullYear(), d.getMonth() - i, 1);
          let key = `${tempD.getFullYear()}-${String(tempD.getMonth() + 1).padStart(2, '0')}`;
          penjBulan[key] = 0; 
          enamBulan.push({ key: key, label: bulanNama[tempD.getMonth()] });
        }
        
        semuaTransaksi.forEach(t => {
          const prop = t.properti || {};
          const matchC = ct === '' ? true : prop.jenisProperti === ct;
          
          if (matchC) {
              let tglStr = t.tanggalTransaksi || t.tanggal_transaksi; 
              if (tglStr) {
                let k = String(tglStr).substring(0, 7); 
                if (penjBulan[k] !== undefined) penjBulan[k]++;
              }
          }
        });
        
        let maxU = Math.max(...Object.values(penjBulan)); 
        if (maxU === 0) maxU = 1;
        
        enamBulan.forEach(b => {
          let u = penjBulan[b.key]; 
          let pxHeight = (u / maxU) * 100; 
          if (u === 0) pxHeight = 6; 
          
          const col = document.createElement('div'); 
          col.className = 'bar-col';
          col.style.justifyContent = 'flex-end'; 
          
          col.innerHTML = `
          <div class="bar-inner" style="height: 0px;" data-h="${pxHeight}px">
            <div class="bar-tooltip">${u} unit</div>
          </div>
          <span class="bar-label">${b.label}</span>`;
          bar.appendChild(col);
        });
        
        setTimeout(() => {
          document.querySelectorAll('.bar-inner').forEach(b => { 
            b.style.height = b.getAttribute('data-h'); 
          });
        }, 100);

        // --- E. Tabel Performa Agen ---
        const resOmset = await fetch('http://localhost:8080/api/laporan/omset-agen');
        const dataOmsetAgen = await resOmset.json();

        const tb = document.getElementById('agenTableBody'); 
        tb.innerHTML = '';

        if (!dataOmsetAgen.length) {
          tb.innerHTML = '<tr><td colspan="5" style="padding:40px;text-align:center;color:var(--text-label)">Belum ada penjualan agen pada data ini.</td></tr>';
        } else {
          // 2. JS hanya bertugas melooping data matang ke HTML
          dataOmsetAgen.forEach((ag, i) => {
            const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n';
            
            // Gabungkan dengan data users agar foto profil dan nama asli tetap muncul
            const dataLengkap = users.find(u => u.username === ag.usernameAgen) || {};
            const namaAsli = dataLengkap.namaLengkap || ag.usernameAgen || 'Tanpa Agen';
            const inisial = String(namaAsli).substring(0, 2).toUpperCase();
            
            let avatarHtml = inisial; 
            if (dataLengkap.fotoProfil && dataLengkap.fotoProfil !== 'default_profil.png' && dataLengkap.fotoProfil !== 'null') {
              const imgUrl = `http://localhost:8080/uploads/profil/${encodeURIComponent(dataLengkap.fotoProfil)}`;
              avatarHtml = `<img src="${imgUrl}" alt="Profil" style="width:100%;height:100%;object-fit:cover;">`;
            }
            
            tb.innerHTML += `
            <tr>
              <td style="text-align:center"><span class="rank-badge ${rankClass}">${i + 1}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:12px;">
                  <div class="agen-avatar">${avatarHtml}</div>
                  <div><div class="agen-name">${namaAsli}</div><div class="agen-role">Marketing Advisor</div></div>
                </div>
              </td>
              <td><span class="mono">${ag.usernameAgen}</span></td>
              <td style="text-align:center;font-weight:700;color:var(--text-sub)">Top Sales</td>
              <td style="text-align:right"><span class="omset-val">${fmtRupiah(ag.totalOmset)}</span></td>
            </tr>`;
          });
        }

        // Render kartunya
        currentPage = 1;
        renderPropertiCards();
      } catch (err) {
        console.error(err);
        document.getElementById('propCardContainer').innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-wifi-off"></i><p>Gagal memuat data dari server.</p></div>';
      }
    }

    // ── Property cards (Tidak banyak berubah) ──
    function renderPropertiCards() {
      const container = document.getElementById('propCardContainer'); container.innerHTML = '';
      const data = filteredProperti; const total = data.length;
      const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
      if (currentPage > totalPages) currentPage = totalPages;
      if (total === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-home-off"></i><p>Tidak ada aset properti ditemukan.</p></div>';
        updatePagination(0, 0, 0, 0, 0); return;
      }
      const start = (currentPage - 1) * PER_PAGE; const end = Math.min(start + PER_PAGE, total);
      data.slice(start, end).forEach(item => {
        const statusBadge = item.terjual
          ? `<span class="badge badge-lunas"><i class="ti ti-circle-check"></i>Lunas</span>`
          : `<span class="badge badge-available"><i class="ti ti-clock"></i>Tersedia</span>`;
        const foto = item.fotoProperti
          ? `http://localhost:8080/uploads/properti/${item.fotoProperti}`
          : `https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop`;
        container.insertAdjacentHTML('beforeend', `
        <div class="prop-card">
          <div class="prop-img">
            <img src="${foto}" alt="${item.nama}" loading="lazy">
            <div class="prop-img-overlay"></div>
            ${statusBadge}
          </div>
          <div class="prop-body">
            <div class="prop-name">${item.nama}</div>
            <div class="prop-loc"><i class="ti ti-map-pin" style="font-size:12px"></i> ${item.lokasi || '—'}</div>
            <div class="prop-price-row">
              <div>
                <div class="prop-price-label">Omset</div>
                <div class="prop-price-val">${item.hargaShort}</div>
              </div>
              <div class="prop-divider"></div>
              <div>
                <div class="prop-agen-label">Agen</div>
                <div class="prop-agen-val">${item.usernameAgen || '—'}</div>
              </div>
            </div>
            <div class="prop-specs">
              <div class="spec-item"><i class="ti ti-building" style="font-size:11px;margin-right:3px"></i>${item.spek.lantai} Lt</div>
              <div class="spec-item"><i class="ti ti-bed" style="font-size:11px;margin-right:3px"></i>${item.spek.kt} KT</div>
              <div class="spec-item"><i class="ti ti-bath" style="font-size:11px;margin-right:3px"></i>${item.spek.km} KM</div>
            </div>
          </div>
          <div class="prop-footer">
            <span class="prop-footer-label">Detail Laporan</span>
            <button class="btn-eye" onclick="window.location.href='dashboard.html'" title="Buka di Dashboard"><i class="ti ti-eye"></i></button>
          </div>
        </div>`);
      });
      updatePagination(currentPage, totalPages, start, end, total);
    }

    function updatePagination(cur, tot, start, end, total) {
      document.getElementById('pageInfoText').innerText = total === 0 ? 'Tidak ada properti' : `Menampilkan ${start + 1}–${end} dari ${total} properti`;
      document.getElementById('pageSlideText').innerText = `${cur} / ${tot}`;
    }

    function changePage(dir) {
      const max = Math.max(1, Math.ceil(filteredProperti.length / PER_PAGE));
      currentPage = Math.min(Math.max(1, currentPage + dir), max);
      renderPropertiCards();
      document.getElementById('propCardContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ── Filters (Sekarang Memicu Pencarian Server-Side) ──
    function applyFilters() {
      // Ambil nilai dari kolom pencarian, lalu lemparkan ke Java!
      const q = document.getElementById('searchProp') ? document.getElementById('searchProp').value : '';
      muatDataLaporan(q);
    }

    // Panggil saat halaman pertama kali dibuka
    muatDataLaporan();

    // ── Count animation (Fungsi yang hilang) ──
    function animateCount(id, target) {
      const el = document.getElementById(id);
      if (!el) return;
      let start = 0; const dur = 900; const step = 16;
      const inc = target / (dur / step);
      const timer = setInterval(() => {
        start = Math.min(start + inc, target);
        el.innerText = Math.floor(start);
        if (start >= target) clearInterval(timer);
      }, step);
    }