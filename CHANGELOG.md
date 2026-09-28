# Perunding Takaful — Mod Log

Folder ini adalah versi mod. `original/` menyimpan fail asal (jangan edit).

## Fail
- `index.html` — versi mod (59 KB, asal 183 KB)
- `original/Perunding Takaful Landing Page.html` — salinan asal, tidak disentuh
- `assets/logo.png` — logo GE Takaful dioptimumkan (560x212, 17.6 KB; asal 2357x1184 @ 116 KB)
- `assets/logo-original.png` — logo asal (rujukan)
- `assets/logo.png.b64` — base64 logo baru (sumber untuk embed)

## Perubahan
### Fungsi (bug fix)
1. **Butang WhatsApp pecah** — `href` di-set dalam callback async (`copyText().finally`) jadi klik pertama tidak membuka WhatsApp. Sekarang guna prefill rasmi `https://wa.me/60138884006?text=<encoded>`: satu klik terus, tiada lagi salin-tampal dan tiada `alert`.
2. **Validasi** — butang dulu `<a>`, jadi 7 medan `required` langsung tidak disemak. Kini validasi penuh dalam JS (nama, DOB termasuk tolak tarikh masa depan, telefon 9-11 digit, lokasi, jantina, merokok, pekerjaan, status, bajet, pelan) + mesej ralat inline (bukan `alert`) dan auto-fokus ke medan salah.
3. **Progress bar** — dulu hanya kira 7 medan, kini 10 (termasuk Jantina/Merokok/Status) dan dikira semula semasa load.
4. **Ikon Threads** — dulu guna glyph WhatsApp (tersalah copy-paste); kini path rasmi Threads (fill putih atas plat hitam). 
5. **Chevron select** — `appearance:none` tinggalkan select tanpa anak panah; ditambah chevron SVG (maroon dalam light, pink dalam dark).

### Mobile & aksesibiliti
6. Telefon: `type=tel inputmode=tel autocomplete=tel maxlength=16`; nama `autocomplete=name`; DOB `autocomplete=bday` + `max=hari ini`; lokasi `address-level2`; kerja `organization`.
7. Tab: `role=tab/tablist/tabpanel`, `aria-selected`, roving `tabindex`, navigasi anak panah, dan **hash routing** (`#profil`, `#produk`, `#semak`) — boleh deep-link dan butang back berfungsi.
8. Kad produk & butang pilihan: `role=radio`/`radiogroup`, `aria-checked`, boleh guna keyboard (Enter/Space).
9. Kontras teks muted digelapkan (`#8a7a7d` -> `#756568`) supaya lulus WCAG AA.
10. Safe-area: buang padding berganda pada `:root` (dulu inset dikira dua kali di iPhone berponi), scroll-padding kini kira tinggi header.

### SEO / perkongsian
11. Tambah meta description, Open Graph + Twitter card, favicon SVG, theme-color, canonical.
    **TODO sebelum deploy:** ganti `REPLACE-WITH-PUBLIC-URL` dengan domain sebenar dan muat naik `og-image.png` 1200x630.

### Kandungan
12. Notis PDPA di bawah butang hantar.
13. Logo: padding telus dipangkas + saiz paparan 50% -> 68%; fail turun 71% (183 KB -> 59 KB) tanpa bergantung pada fail luar (logo masih tertanam, jadi HTML ini masih boleh dihantar berdiri sendiri).

14. **Medan No Telefon** — `inputmode=numeric` + `pattern="[0-9]*"` + penapis hidup: huruf/simbol yang ditaip atau di-paste terus dibuang (caret dikekalkan), jadi mustahil masuk abjad.
15. **Auto HURUF BESAR** — semua input teks & textarea: CSS `text-transform:uppercase` (paparan) + penapis JS yang tukar nilai sebenar, jadi mesej WhatsApp pun keluar huruf besar sepadan dengan design. `autocapitalize="characters"` pada keyboard mobile.

16. **Mesej WhatsApp pretty-case** — emoji kekal (👤 🎂 📱 📍 🚹 🚬 💼 💍 💵 🛡️ 📝), tetapi nilai dalam mesej kini huruf biasa (`Ali Bin Abu`, `Ipoh`, `Lelaki`, `Cikgu`) walaupun kotak input masih papar HURUF BESAR. Nama guna Title Case, nota guna sentence case (token berdigit seperti RM500 dikekalkan).

17. **FIX emoji jadi `�` dalam WhatsApp** — fail kini **100% ASCII** (0 bait bukan-ASCII). Emoji tidak lagi ditulis sebagai aksara literal dalam kod; ia dijana masa-run melalui escape `\uXXXX`/surrogate pair, dan `—`/`©` dalam HTML jadi entiti (`&#8212;`, `&#169;`). Sebab: bila fail dibuka/di-host dengan charset salah (bukan UTF-8), semua aksara bukan-ASCII rosak — dan emoji adalah satu-satunya bukan-ASCII dalam mesej, jadi hanya emoji jadi �/mojibake. Diuji A/B: versi literal + charset salah → `ðŸ“±` rosak; versi escape + charset salah → 11 emoji betul. ASCII tidak boleh dirosakkan oleh sebarang charset.

18. **FIX sebenar emoji `�` — `wa.me` yang rosakkan, bukan fail.** Diuji dengan curl: `https://wa.me/…?text=%F0%9F%91%A4` di-302 oleh pelayan WhatsApp jadi `…&text=%EF%BF%BD` — `%EF%BF%BD` = U+FFFD = `�`, satu setiap emoji. `wa.me` gugurkan aksara astral (semua emoji) tetapi kekalkan aksara BMP (`caf%C3%A9` selamat) — sebab itu hanya emoji rosak. Ganti dengan endpoint terus `https://api.whatsapp.com/send?phone=…&text=…` yang simpan pengekodan bait demi bait (tiada `%EF%BF%BD`). Ujian charset (item 17) tetap berguna sebagai pertahanan kedua.

19. **FIX "kena klik dua kali"** — punca: `api.whatsapp.com/send` menyajikan halaman perantaraan WhatsApp ("Chat on WhatsApp with +60 13-888 4006" + pautan "Open app" / "Continue to WhatsApp Web"), jadi ketukan pertama hanya sampai ke halaman itu, ketukan kedua baru masuk. Halaman itu juga rosakkan emoji dalam pra-tampilan (11 × U+FFFD dalam DOM-nya). Fix: pada telefon guna skema `whatsapp://send?phone=…&text=…` — app terbuka terus, satu ketukan, tiada decoder perantaraan; jika app tiada, fallback ke halaman web selepas 1.2s. Desktop kekal guna halaman WhatsApp (halaman itu memang perlu di desktop).

20. **SATU klik / satu ketukan** — keperluan: pengguna menekan butang sekali sahaja.
   - **Desktop:** butang terus ke `https://web.whatsapp.com/send/?phone=…&text=…` (bukan lagi `api.whatsapp.com`, yang memaparkan halaman perantaraan). Ini juga destinasi pautan "Continue to WhatsApp Web" pada halaman WhatsApp sendiri, jadi ia laluan rasmi mereka. Tiada halaman perantaraan -> satu klik. Jika pengunjung belum paut WhatsApp Web, dia nampak halaman daftar masuk/QR — itu memang aliran WhatsApp Web.
   - **Telefon:** `whatsapp://send?phone=…&text=…` — app terbuka terus, tiada halaman perantaraan. Fallback 1.2s ke `api.whatsapp.com` hanya jika app tidak terbuka (pagehide/document.hidden membatalkannya apabila app mengambil alih skrin).
   - Penanda versi `v2.1` ditambah pada footer supaya mudah pastikan fail yang diuji ialah build terkini.

21. **Medan baharu: BERAT (KG) & TINGGI (CM)** — diletak selepas MEROKOK (sebelum PEKERJAAN) dalam grid 2-lajur `.row2`, sebaris. Nombor sahaja: `inputmode="numeric"`, `pattern="[0-9]*"`, `maxlength="3"`, dan penapis JS `digitsOnly` (huruf, ruang, simbol dibuang semasa taip/lekat). Pilihan (tiada `*`, tidak dikira dalam progress). Ditambah ke mesej WhatsApp: `⚖️ *Berat*: 65 kg` dan `📏 *Tinggi*: 170 cm` (nilai `-` jika kosong).
22. **NOTA (PILIHAN) -> SEJARAH PENYAKIT (JIKA ADA)** — textarea sama, placeholder ditukar kepada "CTH: DARAH TINGGI, KENCING MANIS"; baris mesej jadi `📝 *Sejarah Penyakit*: …`. Penanda versi footer naik ke **v2.2**.

23. **LOKASI dipecah dua: BANDAR + NEGERI** — diletak sebaris (grid `.row2`, sama seperti Berat/Tinggi), kedua-duanya wajib (`*`). Placeholder `CTH: IPOH` untuk Bandar dan `CTH: PERAK` untuk Negeri; `autocomplete="address-level2"` (bandar) / `"address-level1"` (negeri) untuk autofill. Auto HURUF BESAR dan huruf kecil ditaip akan jadi besar semasa taip. Validasi berasingan — pesan ralat sebut "Bandar" atau "Negeri" dengan tepat. Medan wajib kini 8 (+ 3 pilihan = 11), jadi bar progres dikira 11 item (dinamik, tiada perubahan kod). Mesej WhatsApp: satu baris `📍 *Lokasi*: Ipoh, Perak` (bandar dahulu, negeri kemudian). Penanda versi footer naik ke **v2.3**.

24. **TARIKH LAHIR + NO TELEFON sebaris** — kedua-dua dalam grid `.row2` (bukan lagi satu baris penuh setiap satu), menjimatkan ketinggian borang. Ditambah `.row2 input{min-width:0}` kerana input tarikh asli ada lebar minimum intrinsik dan akan melimpah keluar sel grid. Diuji pada 430px: kedua-dua sel 170px, `scrollWidth === clientWidth` (tiada limpahan), nilai `12/05/1990` + ikon kalendar kelihatan penuh, dan mesej WhatsApp kekal `🎂 *DOB* : 12/05/1990` / `📱 *Phone*: 013-777 4983`. Penanda versi footer naik ke **v2.4**.

25. **JANTINA + MEROKOK sebaris** — kedua-dua kumpulan butang kini dalam grid `.row2` (label sebaris, seperti Bandar/Negeri). Di dalam sel, butang pilihan disusun MENEGAK (`.row2 .option-group{flex-direction:column}` + `.row2 .option-btn{flex:0 0 auto}`) — sebab "PEREMPUAN" tidak muat dua kali sebelah-sebelah dalam sel 170px; menegak mengekalkan saiz butang dan sasaran tekan yang sama (butang 172px lebar, 40px tinggi, teks tidak terpotong). Baris ini sebenarnya jadi lebih pendek: satu label + dua butang bertindan vs dua label + dua baris butang dahulu. Diuji: tekan Perempuan + Ya -> `f_jantina`/`f_merokok` dan `aria-checked` betul, mesej `🚹 *Jantina*: Perempuan` / `🚬 *Merokok*: Ya`, progres 100%, emoji 13 utuh, 0 `%EF%BF%BD`. Footer naik ke **v2.5**.

26. **Ikon pada butang pilihan JANTINA/MEROKOK** — empat butang kini ada ikon SVG (garis, warna ikut teks): LELAKI = simbol Mars, PEREMPUAN = simbol Venus, YA = tanda betul, TIDAK = tanda pangkah. Susunan butang kembali MENEGAK->mendatar: `.row2 .option-btn` jadi lajur ikon-di-atas-label (`flex-direction:column`, ikon 18px, label 10.5px), jadi keempat-empat butang muat sebaris dalam dua kumpulan (81px x 53px setiap satu, teks tidak terpotong) tanpa perlu mengecilkan perkataan. Tanda pilih (tick) kini `position:absolute` di penjuru kanan-atas supaya ketinggian butang tidak berubah bila dipilih. Aksesibiliti kekal: teks label masih dalam DOM jadi pembaca skrin masih baca "Lelaki"/"Perempuan"/"Ya"/"Tidak". Diuji: 4 butang sebaris (y sama), tinggi tetap 53px sebelum/selepas dipilih, nilai hidden input + `aria-checked` betul, mesej `Lelaki`/`Tidak`, progres 100%, 13 emoji utuh, 0 `%EF%BF%BD`. Footer naik ke **v2.6**.

27. **Lencana Profil -> gaya Meta Verified** — lencana pada avatar (`.avatar-lg .badge`, 34x34) asalnya *seal* emas bergerigi bulat (`#f3c66b` -> `#c9860f`, 9 bulatan bertindih). Selepas dua pusingan maklum balas, bentuk akhir = **bintang 8 titik** dengan **hujung sedikit melengkung** (bahu pada 30% kelek + lengkung kuadratik ke puncak; takuk tajam), isi gradien biru Meta (`#33A0FF` -> `#0866FF`), tanda betul putih dikecilkan (laluan `M8.6 12.4l2.2 2.2 4.6-4.9`, stroke 2.1) supaya bintang terbaca pada 34px. Path dijana oleh skrip (ro=12, ri=8.3, n=8, f=0.30). Boleh dipulihkan dengan menukar `<path d=...>` dan dua `stop-color`. Footer naik ke **v2.9**.
28. **Lencana jadi lebih gempal di tengah** — kedalaman takuk dikurangkan: `ri` 8.3 -> **9.2** (`ro`=12; bahu hujung 30% -> 40% supaya lengkung hujung kekal sama). Badan bintang lebih bulat/gempal, 8 titik masih jelas dengan hujung melengkung. Dibandingkan 4 variasi (ri 8.3 / 9.2 / 9.6 / 10.0) pada 34/72/140px sebelum memilih: 9.6+ mula jadi seperti bunga kembali (titik hilang). Dijana oleh `star_curved_tip()`. Footer naik ke **v3.0**.

29. **Logo Great Eastern Takaful dikecilkan 20%** — `style="max-width:68%"` -> **`max-width:54%`** (0.80 x 68). Diukur: 242x92px -> **192x73px** (79% — perbezaan kecil kerana pembundaran peratus). Nisbah aspek kekal (`height:auto` + atribut intrinsik 560x212), jadi tiada herotan. Nota: kad putihnya masih padding 16px, jadi ada lebih ruang kosong sekeliling logo — boleh kecilkan padding kalau mahu.
30. **Lencana Meta Verified dikecilkan** — `.badge` 34x34px -> **28x28px** (82%), offset `right/bottom:-4px` -> `-3px` supaya nisbah tindanan pada avatar kekal. Kini 29% daripada avatar 96px (dulu 35%). Footer naik ke **v3.2**.

## Pusingan 4 pindaan (v3.3) — ikut urutan permintaan

31. **"SYOK" -> "SYOR"** pada kad Medical Card: `<sup class="badge-sup">SYOK</sup>` -> `SYOR` (satu-satunya tempat; CSS `.pill.syok` cuma nama kelas, tiada kesan).
32. **Perincian kad dibuang** — "Tiada had seumur hidup", "Gantian gaji keluarga", "Pampasan tunai penggantian pendapatan" (masing-masing satu `<p>`, dibuang melalui regex dengan semakan bilangan). Kad kini ikon + tajuk + cip lencana sahaja.
33. **3 kad dipindah ke Semak** — `PILIHAN PERLINDUNGAN` bukan lagi `<select>`: 3 kad `.product-full` (role=radio, `data-plan`, `onclick="selectPlan(this)"`) dalam `role="radiogroup"` di dalam borang, Medical Card terpilih secara lalai. Nilai disimpan dalam `<input type="hidden" id="f_perlindungan" value="Medical Card" required>` — `required` dikekalkan supaya medan ini masih dikira dalam progres (jumlah kekal 11) dan `form.f_perlindungan.value` masih digunakan oleh validasi + mesej. `normalizeField()` kini melangkau `type="hidden"` supaya nilai kekal "Medical Card" (bukan di-uppercase) dalam mesej; `selectPlan()` kekal tanpa perubahan.
34. **Tab PRODUK dibuang** — butang tab, panel `#panel-produk` (2,675 aksara) dan entri dalam `TABS` dibuang; `TABS = ["profil", "semak"]`. Pautan lama `#produk` jatuh ke tab pertama secara automatik (semakan `TABS.indexOf`), disahkan. Semua rujukan "produk" (termasuk komen CSS/JS) dibersihkan — 0 sisa. Kad `.products`/`.product` (grid 2-lajur) tidak digunakan lagi; CSSnya dikekalkan (tidak mengganggu).
35. Disahkan selepas semua perubahan: 2 tab (profil, semak), `#produk` -> Profil, borang lengkap -> 100% Selesai, mesej 13 baris dengan `*Nak cover* : Medical Card`, 13 emoji utuh, 0 `%EF%BF%BD`, 0 ralat JS. Footer **v3.3**.

## Pusingan 5 pindaan (v3.4)

36. **Ikon JANTINA/MEROKOK kini warna tema maroon** — peraturan `.option-btn .opt-ic{width:18px;height:18px;color:var(--maroon-2)}` (sebelum ini ikut `currentColor` teks). Sama warna dengan ikon dalam PILIHAN PERLINDUNGAN (#c41e3a).
37. **Ikon untuk 3 pilihan STATUS** — BUJANG = satu figura orang, BERKAHWIN = hati penuh, BERCERAI = hati retak (garis zigzag). Butang STATUS dapat kelas `opt-ico`; peraturan `.row2 .option-btn` diperluas jadi `.row2 .option-btn,.opt-ico` supaya gaya ikon-atas-label dikongsi (elak duplikasi CSS). 7 ikon maroon kesemuanya (4 Jantina/Merokok + 3 Status), warna disahkan `rgb(196,30,58)`.
38. **PILIHAN PERLINDUNGAN disusun 3-sebaris (seperti STATUS)** — kad `.product-full` (baris penuh + chevron) diganti `.plan-group` + `.plan-btn` (3 lajur, ikon maroon + nama + cip SYOR/POPULAR/PENTING). Setiap kotak 113x74px, semua pada baris yang sama, tiada limpahan. `selectPlan()` kini guna `.plan-btn`; navigasi papan kekunci (Enter/Space) disahkan berfungsi. 11 peraturan CSS mati (`.product*`, `.products`, `.pill.syok`) dibuang — 0 sisa 'product' dalam fail.
39. Disahkan: klik + Enter menukar pelan (Sakit Kritikal / Medical Card), STATUS Bujang terpilih, borang lengkap 100% Selesai, mesej 13 baris dengan `*Nak cover* : Medical Card`, 0 ralat JS. Footer **v3.4**.

## Pusingan 6 pindaan (v3.5 → v3.6)

40. **BAJET BULANAN: `<select>` → 4 kotak sebaris** (gaya sama seperti PILIHAN PERLINDUNGAN). Kotak: Bawah RM100 / RM100 - RM200 / RM200 - RM300 / RM300 ke atas. Placeholder `<option value="">Pilih Bajet Selesa</option>` dibuang — ia bukan pilihan sebenar, dan nilainya `""` memang sudah dikira "belum diisi" oleh validasi; kini pengguna kena pilih sendiri. Tidak ada lagi `<select>` dalam halaman (0).
41. **Nilai disimpan dalam `<input type="hidden" id="f_bajet" required>`** — `required` membolehkan medan ini terus dikira dalam progres (jumlah kekal 8 medan wajib / 11 item). `formatBajet()` dan `form.f_bajet.value` dalam mesej tidak berubah.
42. **`selectPlan()` kini skop-kumpulan + dinamik** — sebelum ini ia buang `.selected` dari SEMUA `.plan-btn` (satu kumpulan sahaja waktu itu). Dengan dua kumpulan, kod lama akan membuang pilihan pelan setiap kali pengguna pilih bajet. Kini ia guna `el.parentElement` + `data-field` pada kumpulan (`data-field="f_bajet"`, `data-field="f_perlindungan"`) untuk tahu medan tersembunyi mana yang perlu dikemas kini. Disahkan: pilih bajet → pelan kekal; pilih pelan → bajet kekal.
43. **Muat naik satu baris** — pada 4 kotak sebaris (83px setiap satu) label asal terpotong/wrap ("RM300 KE / ATAS"). `.plan-btn` padding 10px 6px → 10px 4px dan `.plan-name` 10px → 9.5px + `white-space:nowrap` + `letter-spacing:-.01em`. Diukur: setiap label perlu 65-69px, ruang ada 73px (muat, 1 baris, 4-8px lebihan); kotak pelan 103px ruang — kedua-dua kumpulan pada satu baris, 0 limpahan. Footer **v3.6**.

## Pusingan 7 pindaan (v3.7)

44. **Ikon untuk 4 kotak bajet** — ikon meter aras (4 bar menaik): aras 1 = 1 bar terang + 3 bar `opacity=.22`, aras 2 = 2 terang, aras 3 = 3, aras 4 = 4 bar penuh. Bar guna `fill="currentColor" stroke="none"` (atribut persembahan pada `<rect>` mengalahkan `fill:none` yang diwarisi daripada `.ic svg`), warna maroon `rgb(196,30,58)`. Ikon 18px sama saiz dengan ikon JANTINA/MEROKOK/STATUS/PELAN.
45. **Susun atur 4-kotak-sebaris -> 2x2** (`plan-group grid2`) — 4 kotak dalam 350px terlalu rapat (83px setiap satu) dan tiada ruang untuk ikon. Grid 2 lajur: setiap kotak 174x60px, padding 12px 8px, label naik balik 9.5px -> 10.5px, `white-space:nowrap` dibuang (ruang lebih daripada cukup: label perlu ~76px, ada 158px). Disahkan: 2 baris x 2 lajur, semua label 1 baris, 0 limpahan, 0 ralat JS.

## Pusingan 8 pindaan (v3.8)

46. **Saiz label 4 kotak bajet disamakan dgn butang BUJANG** — `.plan-group.grid2 .plan-name{font-size:12.5px;letter-spacing:normal}`. Sebab perbezaan: `.option-btn{font-size:12.5px}` berada LEBIH LEWAT dalam stylesheet daripada `.opt-ico{font-size:10.5px}` (spesifisiti sama 0,1,0), jadi butang STATUS sebenarnya render 12.5px manakala `.plan-name` kekal 10.5px. Diukur selepas perubahan: label bajet = 12.5px = BUJANG; setiap label perlu 86-92px, ruang ada 156px — satu baris, 0 limpahan; kotak 174x62px.
47. Nota: label PILIHAN PERLINDUNGAN (`.plan-name` asal) dan JANTINA/MEROKOK masih 10.5px — perbezaan asal daripada cascade CSS yang sama, bukan pilihan reka bentuk. Boleh disamakan ke 12.5px bila-bila (muat: label pelan perlu ~87-90px, ruang 103px).

## Pusingan 9 pindaan (v3.9)

48. **JANTINA/MEROKOK + PILIHAN PERLINDUNGAN: 10.5px -> 12.5px** — kini SEMUA butang/kotak pilihan dalam borang pada 12.5px (sama dgn BUJANG). Punca asal: `.row2 .option-btn` (spesifisiti 0,2,0) mengalahkan `.option-btn{font-size:12.5px}` (0,1,0), jadi butang JANTINA/MEROKOK tersekat pada 10.5px. `.plan-name` (label pelan) juga dinaikkan pada peraturan asas — override `.plan-group.grid2 .plan-name` dibuang (redundant), kini satu sumber kebenaran.
49. **Ruang dilegakan untuk PEREMPUAN** — pada 12.5px label ini perlu 73px, tetapi hanya 71px ada (kotak 81px, padding 4px + border). `.row2 .option-group{gap:6px}` (dari 10px) + `.row2 .option-btn{padding:9px 2px}` (dari 4px) → kotak 83px, ruang 77px, lebihan 4px. Semua 14 label disahkan: 12.5px, satu baris, 0 limpahan (paling ketat = PEREMPUAN 73/77px; paling lega = BAWAH RM100 86/156px). Kotak pelan kini 77px tinggi (dari 73px). Regresi penuh: 100% Selesai, nilai Jantina/Status/Bajet/Cover betul dalam mesej, href WhatsApp terbina, 0 ralat JS.

## Pusingan 10 pindaan (v4.0)

50. **KEEMPAT-EMPAT kumpulan pilihan -> 11px** — `.option-btn` asas (12.5px -> 11px), `.row2 .option-btn,.opt-ico` (12.5px -> 11px) dan `.plan-btn .plan-name` (12.5px -> 11px). Ketiga-tiga peraturan diubah supaya tak kira cascade mana yang menang, semua butang pilihan = 11px. Disahkan: setiap `.option-btn` (10) dan setiap `.plan-name` (7) = `11px`, tiada baki.
51. **Ruang JANTINA/MEROKOK dipulihkan** — `gap:6px` -> `10px` dan `padding:9px 2px` -> `9px 4px` (nilai asal). Ketatkan itu hanya perlu untuk memuatkan 12.5px; pada 11px, PEREMPUAN perlu 65px dan ruang ada 71px (6px lebihan). Kotak pelan kini 75px tinggi (dari 77px). Regresi penuh: 100% Selesai, PEREMPUAN/TIDAK/BERKAHWIN/RM200-RM300/Hibah Takaful kesemuanya direkod, 13 emoji utuh, 0 `%EF%BF%BD`, href WhatsApp terbina, 0 ralat JS. Footer **v4.0**.

## Pusingan 11 pindaan (v4.1)

52. **Ikon BAJET: bar meter -> tindanan syiling** — bar menaik kelihatan seperti bar "coverage" isyarat telefon, jadi diganti dengan syiling bertindan: 1 syiling (Bawah RM100), 2 (RM100-RM200), 3 (RM200-RM300), 4 (RM300 ke atas). Setiap syiling = `<ellipse rx="6.6" ry="2.4">`, bawah pada cy=18.9, langkah 4.6 ke atas; 24 elemen `<rect>` bar dibuang (0 baki `stroke="none"`). Warna maroon dikekalkan (`rgb(196,30,58)`), saiz 18px sama seperti ikon lain. Disahkan: 1/2/3/4 `ellipse` per kotak, kotak 174x61px, label 1 baris, 0 limpahan, 0 ralat JS. Pratonton zum 96px (`scratch/coin-preview.html`) mengesahkan tindanan jelas dibezakan.
53. Nota: ikon PILIHAN PERLINDUNGAN (kad kredit / hadiah / denyut jantung) TIDAK diubah — "coverage icons" ditafsirkan sebagai bar isyarat dalam kotak bajet. Jika yang dimaksudkan ialah ketiga-tiga ikon pelan itu, boleh ditukar bila-bila.

## Pusingan 12 pindaan (v4.2 → v4.3)

54. **Cip SYOR/POPULAR/PENTING -> cop di penjuru atas-kanan kotak** — `.plan-btn .badge-sup{position:absolute;top:0;right:6px;transform:translateY(-50%)}` (dulu elemen dalam aliran di bawah nama). Cip kini duduk atas garis sempadan kotak (menonjol 6px di atas, pusat pada garis) — 7px dari tepi kanan, masih 100% dalam kotak secara mendatar. Klik pada cip menjalar ke kotak (handler pada kotak), jadi tiada perubahan fungsi.
55. **Ikon + nama di tengah semula** — `.plan-btn{justify-content:center}` kerana cip tidak lagi mengambil ruang menegak. Diukur: offset tengah = 0px untuk ketiga-tiga kotak; tinggi kotak 75px -> 57px.
56. **Ruang atas** — `.plan-group.plan-chips{margin-top:14px}` (kelas baharu pada kumpulan pelan sahaja; kumpulan bajet kekal 2px). Tanpa ini, cip menonjol hanya 1px dari label "PILIHAN PERLINDUNGAN" — kini 8px. Disahkan: klik + Enter menukar pilihan satu demi satu, 0 ralat JS. Footer **v4.3**.

## Pusingan 13 pindaan (v5.0) — header jadi profil, tab dibuang

57. **Header kini butang**: `<button class="who-btn" id="whoBtn" aria-expanded aria-controls="profilPanel">` membalut avatar + nama + caret baharu (SVG chevron, berputar 180 darjah bila kembang). Klik pada mana-mana bahagian header turut berfungsi (delegasi pada `.topbar`, kecuali pautan WhatsApp/Call dan butang nama — tiada toggle dua kali). Untuk susun atur kekal sama, `.mini-avatar`/`.who` ditukar div -> span dan `.topbar .who` jadi flex column.
58. **Panel profil kembang dari header** — `#panel-profil` dibalut `.profil-collapse#profilPanel` (`max-height:0;overflow:hidden`, transisi .42s). JS set `max-height` kepada `scrollHeight` sebenar (bukan nilai tekaan), dan selepas `transitionend` jadi `none` supaya tiada klip bila orientasi/saiz berubah. `inert` diletakkan pada panel semasa tertutup supaya pautan di dalamnya tidak boleh di-tab.
59. **Tabbar dibuang sepenuhnya** — 8 peraturan CSS `.tabbar`, markup tablist (2 butang) dan semua JS tab (`TABS`, `tabBtn`, `switchTab`, `syncFromHash`, navigasi anak panah) dipadam; 0 sisa 'tab' dalam fail. `.tabpanel` -> `.pane` (padding dikekalkan), jadi borang Semak kini sentiasa kelihatan terus di bawah header.
60. **Pautan lama masih berfungsi** — `#profil` membuka panel, `#semak` menutupnya (`syncFromHash` + popstate/hashchange), jadi butang back telefon menutup profil dan pautan yang dikongsi tidak pecah.
61. **Bug semasa membina**: skrip pertama tersilap memasukkan `</div>` penutup di tengah tag `</div>` (indeks sisip dikira dari kedudukan lama loop) — dikesan oleh parser HTML Python (63 buka vs 62 tutup) dan dibaiki; kini 63/63, 0 tag tak padan.
62. Disahkan: klik header (nama atau latar) buka/tutup, klik pautan WhatsApp TIDAK toggle, `#profil` buka pada muat, `#semak` tutup, panel 590px tinggi apabila terbuka, caret berputar, `aria-expanded` betul, `inert` betul; borang penuh 100% Selesai, 13 emoji utuh, href WhatsApp terbina, 0 ralat JS. Footer **v5.0**.

## Pusingan 14 (v5.1) — header meluncur jadi halaman profil
- **Ganti akordion dengan peralihan halaman.** Kanvas profil (`#profilPanel`) kini `position:fixed` (569x430 pada viewport ujian), z-40, bukan lagi dalam aliran dokumen. Borang TIDAK pernah bergerak: rect medan nama kekal `[447,280,356]` pada SETIAP bingkai (tutup, +16ms, penuh, semasa tutup, buka semula) termasuk apabila halaman diskrol 180-240px.
- **Tirai clip-path, bukan translateY.** Percubaan pertama guna `translateY(-100%)` menyebabkan kanvas tiba dari BAWAH (kad MEDIA SOSIAL muncul di atas semasa avatar terbang masuk). Ditukar kepada `clip-path:inset(0 0 100% 0)` -> `inset(0 0 0 0)` supaya jalur maroon (dengan avatar/nama) terdedah DAHULU.
- **Morph FLIP.** Pasangan sumber->destinasi: `.mini-avatar`->`#pcAvatar`, `.who .n`->`#pcName` (skala+gerak), WA/Call (crossfade + luncur). Bukti: 16ms selepas ketikan, avatar kanvas = `[428,14,44]` = avatar header, nama = `[484,19,215]` = nama header (tepat piksel).
- **Lencana Meta pada avatar header** + defs gradien berasingan (`sealGrad` kanvas, `sealGradSm` header).
- **FIX bug 1:** regex "buang defs bertindih" memadankan DUA kali dan mengosongkan svg sprite -> gradien tiada di mana-mana -> kedua-dua bintang tidak berisi (lencana "hilang"). Kini setiap lencana ada `<defs>` sendiri, tiada kongsi silang.
- **FIX bug 2:** `.mini-avatar` tiada `position:relative`, jadi lencana header melekat pada `.topbar` (x=815, 28x28) bukan pada avatar. Ditambah `position:relative`.
- **FIX bug 3:** `.badge-mini` kalah cascade kepada `.badge` (kedudukan lewat dalam CSS). Ditukar kepada `.mini-avatar .badge-mini` (0,2,0).
- **FIX bug 4:** ketikan semasa animasi menetapkan `inert` pada kanvas yang kelihatan -> kanvas tak boleh ditutup lagi. Atribut kini diselaraskan hanya apabila keadaan benar-benar berubah; `inert`/`aria-hidden` hanya pada HUJUNG animasi tutup.
- **FIX bug 5:** laluan tutup menetapkan `visibility:hidden` serta-merta -> tirai undur tak kelihatan. Kini kekal kelihatan sepanjang animasi.
- **Jarak maroon header:** `padding` atas `calc(14px+safe)` -> `calc(42px+safe)`, bawah 18px -> 36px. Kandungan turun 30px (avatar y 16 -> 46); jalur maroon kini 263px tinggi.
- Verifikasi: 0 ralat JS, borang 100% SELESAI (13 emoji, 0 rosak), pepenjuru piksel lencana = 196 piksel gradien biru (`40,146,255`).

## Pusingan 15 (v5.1) — bersihkan header ringkas
- Buang ikon **WhatsApp & Call** daripada header ringkas (blok `.quick` + 2 rule CSS + 2 pasangan FLIP mati). Butang kenalan KEKAL dalam kanvas profil (`#pcActions`).
- Buang **titik hijau + "Sedia Membantu (Online)"** (`.who .s` + `.dot`).
- Tambah pil **"TEKAN UNTUK LIHAT LAGI"** + anak panah bawah (`.more`) di hujung kanan; `.caret` di dalamnya turut berputar 180 darjah bila terbuka.
- Ukuran: bar 430x72, pil 165x24 dgn 19px ruang baki; nama & pil tidak bertindih (11px jarak).
- Klik pil = klik header (buka kanvas) — disahkan.

## Pusingan 16 (v5.1) — corak logo diagonal bergerak
- Sumber: `~/Downloads/getb-logo-edm.png` (2357x1184, latar PUTIH, bukan lutsinar) -> crop kandungan (1883x712) -> knockout putih: alpha = 255 - min(R,G,B), puncak 225.
- Jubin separuh-jatuh (half-drop): logo 96x36, grid 150x96, offset (75,96), jubin 150x192. Bahagian logo yg limpah dibalut ke kiri (paste di x=-75) supaya kelim hilang. Bukti tanpa kelim: tiling 3x3, tetingkap digeser vektor kekisi (75,96) = IDENTIK.
- `assets/pattern-logo.png` (13,897 bait) dibenamkan sebagai base64 dlm CSS `.pc-top::before` (18,532 aksara).
- Pergerakan: `@keyframes logoHanyut` 26s linear infinite, translate3d(0,0) -> (75,96) = sepanjang pepenjuru grid; vektor = vektor kekisi jadi ulangan sempurna. `will-change:transform` (komposit, bukan repaint). Disahkan bergerak: sampel transform (17.01,21.78) -> (19.07,24.41), nisbah 75:96.
- `prefers-reduced-motion:reduce` mematikan animasi. Opasiti 0.14. Hanya blok maroon KANVAS (`.pc-top`); header ringkas kekal maroon kosong.
- Tiada kesan pada susun atur: `.pc-top{overflow:hidden}` + pseudo `inset:-220px` + kandungan `z-index:1`, butang tutup `z-index:2`. Rect borang & avatar tidak berubah.

## Pusingan 17 (v5.1) — latar panel profil: maroon -> PUTIH
- `.pc-top` background: gradien maroon -> `#fff`; warna teks `#fff` -> `var(--maroon-1)` (teks putih atas putih = halimunan).
- Butang tutup: `rgba(255,255,255,.18)` + ikon putih -> `rgba(143,15,43,.10)` + ikon `var(--maroon-2)`.
- Corak: logo knockout ditukar drpd PUTIH -> MAROON `#8f0f2b` (putih atas putih tak nampak); opasiti .14 -> .20. `assets/pattern-logo.png` dijana semula (14,921 bait / 19,896 aksara base64).
- Avatar: gradien hangat `#f6e7dd` + `box-shadow` maroon halus supaya bulatan putih jelas atas latar putih; cincin maroon 4px dikekalkan.
- Garis pemisah halus di bawah panel: `box-shadow:inset 0 -1px 0 rgba(143,15,43,.12)`.
- Header RINGKAS kekal maroon (belum diubah) — panel putih keluar drpd bar maroon semasa tirai dibuka.

## Pusingan 18 (v5.1) — DIBATALKAN (undo)
- Ayunan baris bertentangan (kesan ricih) telah DIBATALKAN atas permintaan.
- Corak kembali kepada SATU lapisan: jubin 2-baris 150x192, `hanyut` (75,96) per 26s linear, maroon @ opasiti .20.
- `assets/pattern-logo.png` dijana semula ke versi 2-baris (14,921 bait; tanpa kelim disahkan IDENTIK).
- Jejak dibuang sepenuhnya: `ayunA`, `ayunB`, `--corak`, `::after` = 0 rujukan. Saiz fail kembali 92,533 bait (sama spt sebelum Pusingan 18).
- Kekal: latar panel PUTIH (Pusingan 17), header ringkas maroon, morph FLIP, tirai clip-path.

## Pusingan 25 (v5.1) — susun semula WhatsApp/Call + media sosial jadi 4 platform (2x2)
- Tambah Facebook + TikTok; susunan baharu: Instagram, Facebook, TikTok, Threads (dahulu: Threads, Instagram).
- `.socials` ditukar drpd flex kpd `display:grid;grid-template-columns:1fr 1fr;gap:12px` -> 2x2; `.social{flex:1}` dibuang.
- Ikon: glif rasmi diambil drpd simple-icons v14 (facebook, tiktok) dan jalur Threads disegarkan; IG dikekalkan.
  Tema warna: IG gradien, FB #1877F2, TikTok #010101, Threads #111.
- Baris WhatsApp (hijau) + Call (outline) dikekalkan dgn `.actions a{flex:1}` = lebar sama; susunan kekal aksi dahulu, sosial kemudian.
- GEJALA PALSU: tangkapan skrin penuh nampak baris kedua terpotong. DIUKUR: kad 337-636, grid 232px, baris2 509-619 -
  semuanya dlm kad, tiada pertindihan. Ia artifak tangkapan penuh (kanvas `position:fixed` melukis hanya dlm band
  viewport atas). Dgn viewport 569px, kad sosial memerlukan skrol - bukan bug.
- URL SEBENAR drpd pengguna (Pusingan 26): Facebook `https://www.facebook.com/harunhakimiofficial/`,
  TikTok `https://www.tiktok.com/@harunhakimi`. Label bawah setiap jubin diselaraskan ikut URL masing-masing
  (@harunhakimiofficial, @harunhakimi); IG & Threads kekal @harun.hakimi.official. Disahkan dlm DOM: 4 href + 4 label.

## Pusingan 24 (v5.1) — buang banner logo GE atas bahagian Media Sosial
- Dibuang: `<div class="company" style="background:#fff;padding:16px;border:1px solid var(--border)">` yg mengandungi
  imej logo base64 (23,988 aksara) di antara butang WhatsApp/Call dan kad Media Sosial.
- Hasil: fail 85,479 -> **61,223 bait** (-24,256; -28%). Halaman kini TIADA `<img>` langsung (0) - semua ikon/logo
  guna SVG atau corak terbenam, jadi tiada fail aset luar dirujuk (rujukan `assets/` = 0, benar-benar berdikari).
- Tag disemak imbang dgn HTMLParser; `.company` (kini tak digunakan) dibiarkan dlm CSS - tidak mendatangkan kesan.
- Disahkan dlm pelayar: document.images = 0, alt GE = 0, .company = 0; kad Media Sosial naik terus di bawah butang;
  tiada jurang kosong tertinggal; corak berputar + morph + peraturan lapisan tidak tersentuh.

## Pusingan 23 (v5.1) — putaran dibetulkan ke -45 darjah, jurang dipicikkan lagi
- Putaran: +45 -> **-45 darjah** (cermin). `rotate:-45deg` disahkan pada kedua-dua pseudo.
- Band menegak 76 -> **60px** (jurang antara baris 40px -> **24px**, asal 60px). Jubin kini 192x120.
  Logo 36px tinggi berbanding jurang 24px = 2/3 tinggi logo - rapat tapi tidak bersentuh.
- Sesaran gelung (±192,120) per 60s; gelung IDENTIK kedua-dua arah; sampel langsung (+22.1,+13.8) vs (-22.1,+13.8),
  nisbah x/y 1.6000 = 192/120 tepat. Sudut di layar kini -13 darjah (cermin).
- `inset:-380px` dikekalkan (putaran sama magnitud) - penjuru panel masih diliputi sepenuhnya.
- Peraturan lapisan disemak selepas tampalan: heroMini z1, .pc-close z2, overflow:hidden - kekal.
- Nota: ketumpatan corak naik (pic lebih rapat + serong). Knob utk lembutkan tanpa ubah geometri: opacity .20 -> .16.

## Pusingan 22 (v5.1) — pic baris lebih ketat + putaran 45 darjah
- Pic menegak band: 96px -> 76px (jurang antara baris 60px -> 40px). Jubin jadi 192x152; logo 36px + jurang 40px.
- Medan corak diputar `rotate:45deg` (kedua-dua pseudo). Kekisi jadi bentuk berlian; sel (logo+nama) turut senget 45 darjah.
  Kandungan hero (avatar/nama/pil) TIDAK diputar - kekal tegak (andaian: yg diminta ialah corak, bukan panel).
- `inset` dinaikkan -300 -> -380px utk tutup sudut panel selepas putaran (disemak: penjuru panel memetakan ke
  (239,-54) dlm bingkai lapisan, jauh dlm had +/-587 x +/-511 walaupun selepas sesaran maksimum ~245px).
- Sesaran gelung: (±192,152) per 60s = satu sel penuh; kedua-dua arah IDENTIK. Sampel langsung: (+19.2,+15.2) vs (-19.2,+15.2).
- Keserasian transform: `rotate` (properti individu) disusun SEBELUM `transform` mengikut spesifikasi, jadi animasi
  translate3d berjalan dlm bingkai tempatan yg sudah diputar -> baris menggelongsor sepanjang arahnya sendiri (45 darjah).
- Peraturan lapisan disemak selepas tampalan: heroMini z1, .pc-close z2, overflow:hidden - ketiga-tiga kekal.

## Pusingan 21 (v5.1) — corak jadi monogram: logo + nama berselang
- Kehendak: dlm satu baris, ulang [logo] -> [nama] -> [logo] -> [nama]; nama ditindan "HARUN" atas "HAKIMI".
- Jubin baharu 192x192: sel = logo 96x36 + jurang 20 + blok nama 56x25 + jurang 20 (jarak rata).
  Nama: Segoe UI Bold 16px, dua baris dijustifikasi sama lebar (HAKIMI & HARUN dua-dua 58.0px asal) -> blok 56x25.
  Kedua-dua logo & blok nama ditengah dlm band 96px. Warna maroon #8f0f2b, opacity lapisan 0.20 kekal.
- Separuh-susun (half-drop) dikemas kini: lapisan B berganjak 96px (separuh sel) -> baris berselang selari.
- Sesaran gelung jadi (±192,192) per 60s (nisbah 192/192 = 1.0000 disahkan); gelung IDENTIK kedua-dua arah.
- BUG DITEMUI (hanya dlm tangkapan skrin): asas imej teks dicipta OPAQUE maroon -> nama terpapar sebagai
  blok pejal. Ukuran geometri lulus sepenuhnya. Dibetulkan: asas lutsinar + paste guna topeng glif
  (518/1400 piksel legap = glif, bukan blok).
- CSS dikemas kini dgn GANTIAN SASARAN (bukan tulis semula blok) -> peraturan lapisan terbukti kekal
  (heroMini z1, .pc-close z2, overflow:hidden).

## Pusingan 20 (v5.1) — BUG susun lapisan corak (dilaporkan pengguna)
- Gejala: "sebahagian corak nampak atas gambar profil, sebahagian tidak".
- Punca: semasa blok CSS corak ditulis semula (Pusingan 18/19), DUA peraturan lapisan tercicir:
  `.pc-top .hero-mini{position:relative;z-index:1}` dan `.pc-top .pc-close{z-index:2}`.
  Tanpa z-index, `.hero-mini` jadi `static/auto` -> avatar (relative/auto) & nama (static) berada dlm band
  yang SAMA dgn pseudo (z0), jadi susunan DOM menentukan: `::before` (anak pertama) DI BELAKANG avatar,
  `::after` (anak terakhir) DI ATAS avatar/nama. Itu sebab ia kelihatan separa-separa.
- Dibuktikan dgn nilai terkira: heroMini `static/auto` (salah) -> `relative/z1` (betul); buka `z2`; pseudo `z0`.
- PELAJARAN: memeriksa `rules.includes('.pc-top .hero-mini')` TIDAK mengesan kehilangan ini kerana ada
  peraturan lain dgn selector SAMA (padding). Semak NILAI TERKIRA (z-index/position/overflow), bukan kewujudan selector.
- Susun lapisan muktamad: pseudo corak `z0` < kandungan hero `z1` < butang tutup `z2`.

## Pusingan 19 (v5.1) — baris bersilih arah (hanyut berterusan, bukan ayunan)
- Kehendak diklarifikasi: bukan ayunan ke kiri-kanan, tetapi setiap baris TERUS bergerak satu arah
  (baris A ke kanan, baris B ke kiri, bersilih ganti, berulang tanpa henti).
- Perlaksanaan: 2 lapisan pseudo atas jubin SATU-baris; lapisan A hanyut (+150,+192), lapisan B (-150,+192), 60s linear.
  Setiap sesaran = vektor kekisi PENUH bagi kekisi {(150,0),(0,192)}.
- Kedua-dua lapisan turun pada kadar sama -> setiap baris hanyut menyerong (A ke kanan-bawah, B ke kiri-bawah).
- Bukti gelung: tetingkap jubin digeser (150,192) dan (-150,192) = IDENTIK kedua-duanya.
  Sampel pelayar: xA +10.37 -> +17.91 -> +25.40; xB -10.37 -> -17.91 -> -25.40; y sama; nisbah x/y = 0.7813 = 150/192.
- BUG DITEMUI (hanya kelihatan dlm tangkapan skrin, TIDAK dlm ukuran): `overflow:hidden` tercicir drpd `.pc-top`
  semasa blok CSS ditulis semula -> lapisan `inset:-300px` melimpah dan mengecat logo ATAS butang WhatsApp/Call,
  kad GE, kad MEDIA SOSIAL dan medan borang. Dipulihkan + disahkan bersih.
- Kekal: panel putih, header ringkas maroon, morph FLIP, tirai clip-path, reduced-motion, jeda bila tertutup.

## Pusingan 26 (v6.0) — borang berlangkah + FAQ + aksesibiliti

Rujukan idea: katalog `keenthemes/reui` (shadcn/ui, MIT). ReUI ialah React + Tailwind — tiada kodnya dipakai; hanya corak UX (Stepper, Accordion, Field) diadaptasi ke HTML tulen tanpa dependency.

### 1. Borang 3 langkah
- `#leadForm` dipecah kepada 3 `div.step`: **1 DIRI** (nama, tarikh lahir, telefon, bandar, negeri) · **2 KESIHATAN** (jantina, merokok, berat, tinggi, pekerjaan, sejarah penyakit) · **3 PELAN** (status, bajet, perlindungan).
- Penunjuk `.stepper` (role=tablist) di atas bar progress; chip semasa disorot maroon.
- Butang `Seterusnya →` (maroon penuh) + `← Kembali` (garis luar); butang hantar WhatsApp kekal di langkah 3.
- `initSteps()`: sahkan medan langkah semasa sebelum maju, tanda `.err` + skrol ke medan salah, bersihkan `.err` apabila ditaip. Enter dalam medan langkah 1–2 maju (elak penghantaran pramatang).

### 2. Kumpulan pilihan kini divalidasi
- `data-field` ditambah pada 3 `.option-group` (jantina / merokok / status). Sebelum ini tiada — tiada apa menyemaknya walaupun label bertanda `*`.

### 3. FAQ "SOALAN LAZIM"
- 6 soalan guna `<details>/<summary>` asli (sifar JS), chevron maroon sepadan tema, disklaimer kelulusan syarikat di bawah.
- **Dipindahkan ke kanvas profil** — susunan kad kini: profil → WhatsApp/Call → Media Sosial → **Soalan Lazim**, iaitu sebelum borang (bukan lagi di bawah borang).
- Dipindah sebagai satu blok (pindah tulen, saiz fail tidak berubah); induk sama `.pc-body`, geometri sama dgn kad Media Sosial (kiri 437, lebar 390). Jumlah kad kekal 3.
- **PERLU DISEMAK TUAN**: jawapan ialah draf — tiada harga, tempoh atau nombor spesifik direka.

### 4. Aksesibiliti
- `setLatar()`: semasa kanvas profil terbuka, `.topbar` + `#panel-semak` jadi `inert` + `aria-hidden`; dilepas apabila ditutup.
- Satu sumber kebenaran: `setProfil` dibungkus. (Tampalan awal pada 2 tapak sync atribut gagal — hanya satu laluan sebenarnya dijalankan.)

### 5. Buang nota komprehensif
- `<div class="info-note">` ("Perlindungan komprehensif tanpa had seumur hidup untuk bil rawatan hospital anda.", ikon `info` sekali) dibuang dari atas borang — 322 aksara.
- Peraturan CSS `.info-note` sengaja ditinggalkan (tidak digunakan) supaya mudah dikembalikan jika perlu.
- Kad borang kini terus: penunjuk langkah → bar progress → NAMA PENUH.

### 6. Susun atur butang langkah
- `Kembali` dipindahkan dari atas langkah 2 & 3 ke baris yang sama dengan butang utama: kiri = Kembali, kanan = Seterusnya / Hantar Ke WhatsApp (`.step-nav{display:flex;gap:10px}`, Kembali `flex:0 0 38%`).
- Ukuran sebenar: Kembali 135px di x=447, butang utama 211px di x=592 — baris sama (top sama).
- Langkah 1 kekal butang `Seterusnya` penuh lebar (tiada pasangan).
- Disahkan: aliran langkah (Kembali → langkah 1), maju ke langkah 3, dan pautan WhatsApp (741 aksara, nama + pekerjaan, 13 emoji bila nota diisi) tidak terjejas. 0 ralat JS.

### 7. Chip langkah boleh diklik & boleh Tab
- Chip `1 DIRI / 2 KESIHATAN / 3 PELAN` ditukar drpd `<div>` kepada `<button type="button">` — boleh **tap** dan boleh dicapai dgn kekunci **Tab** + Enter/Space. `aria-current="step"` menanda langkah semasa; bekas jadi `role="group"`.
- `pilih(n)`: undur bebas (tiada pengesahan); maju disahkan langkah demi langkah dan berhenti di langkah pertama yang gagal sambil menanda medan salah.
- **BUG dibetulkan** (ditemui semasa uji, bukan dilaporkan): `sah()` menapis medan 'tak kelihatan', jadi setiap langkah tersembunyi lulus sendiri — tekan chip 3 dari langkah 1 terus melompat ke langkah 3 walaupun langkah 2 kosong. Kini langkah tersembunyi dinilai penuh (`dlmSkrin`).
- **Pitfall gaya:** `font:inherit` pada butang mengalahkan peraturan `.stp` (spesifikasi lebih tinggi) → chip jadi 16px/400 dan hilang huruf besar; butang juga tak mewarisi `text-transform`. Ditulis eksplisit: `font-size:11.5px;font-weight:600;text-transform:uppercase`.
- Diuji semula: 8 kes navigasi (lompat kosong, lompat separuh penuh, undur, naik semula, butang Kembali/Seterusnya) + pautan WhatsApp 741 aksara dgn nama. 0 ralat JS.

### 8. Warna teks chip langkah ikut kotak pilihan
- Chip langkah kini guna peraturan yang **sama** dgn kotak Pilihan Perlindungan: belum dipilih `color:var(--ink)` atas `background:var(--card)`; langkah semasa `color/border:var(--maroon-2)` atas `#fbe6e9` + gelang `box-shadow`.
- Bulatan nombor: belum dipilih = latar `#fbe6e9` + angka maroon; semasa = maroon penuh + angka putih. Peraturan `.stp.active{color:#fff}` dibuang (langkah lepas kembali jadi warna biasa).
- Disahkan dgn `getComputedStyle`: chip belum = `rgb(243,233,234)` atas `rgb(36,26,29)` — **sama** dgn kotak pilihan belum dipilih; chip semasa = `rgb(196,30,58)` atas `rgb(251,230,233)` — **sama** dgn kotak dipilih. Guna pemboleh ubah, jadi ia betul dlm tema cerah (teks gelap) dan tema gelap (teks cerah) sekali.

### 9. Butang hantar jadi tema WhatsApp
- `#waSubmitLink` kini: latar `#25D366` (hijau WhatsApp — **sama** dgn butang WhatsApp dlm panel profil), teks putih, dan glif **logo WhatsApp sebenar** (simple-icons v14) menggantikan ikon kapal terbang kertas.
- Teks dipendekkan `Hantar Ke WhatsApp` → `Hantar` (CSS `text-transform` jadikan ia `HANTAR`).
- Glif pepejal perlu `fill:currentColor;stroke:none` — peraturan `.ic svg` asal (`fill:none;stroke:currentColor`) akan lukis ia sbg garis kosong. Ditambah kelas `.isian`.
- Gradient `.topbar` (header) sengaja **tidak** disentuh walaupun rentetan gradientnya sama.
- Disahkan: latar `rgb(37,211,102)` = tepat sama dgn `.wa-btn`; `path` bermula `M17.472` (logo WhatsApp); pautan `web.whatsapp.com` 741 aksara + nama utuh; 0 ralat JS.

### 10. Selaraskan butang WhatsApp + betulkan teks butang hantar
- Butang WhatsApp dlm panel profil (`class="wa-btn"`) kini guna **logo WhatsApp sebenar**; gelembung garis generik dibuang. Kelas `.isian` dipakai supaya glif pepejal dipenuhkan putih (`fill:currentColor;stroke:none`).
- Butang hantar: buang HURUF BESAR warisan (`body{text-transform:uppercase}`) dan garis bawah lalai `<a>` — `.submit-btn` tidak pernah menetapkan kedua-duanya. Ditambah `text-transform:none;text-decoration:none` → kini papar **"Hantar"**.
- Disahkan: butang hantar `transform:none`, `text-decoration:none`, latar `rgb(37,211,102)`; butang panel `fill` putih + `stroke:none`; kedua-dua glif bermula `M17.472`; gelembung lama tiada lagi dlm DOM.

### 11. FAQ jadi tab bernombor 1–6
- FAQ dlm panel profil diubah drpd senarai 6 akordion kepada **tab bernombor**, meniru fungsi tab borang: baris `.ftb-row` dgn 6 butang (1–6), satu soalan dipapar pd satu masa, `aria-current` menanda tab aktif, `aria-label="Soalan N: <soalan>"` utk pembaca skrin.
- **Kelas berasingan `.ftb` (bukan `.stp`) — sengaja**: kalau guna `.stp`, `initSteps()` borang akan menangkapnya sbg langkah. Disahkan `.stp` kekal 3 dan klik chip borang masih menjalankan pengesahan (5 ralat bila kosong).
- Gaya sama dgn chip langkah: belum = `var(--ink)` atas `var(--card)`; aktif = maroon atas `#fbe6e9` + gelang. Chevron `<summary>` disembunyikan (tak lagi boleh lipat).
- Disahkan: `100000` (soalan 1 sahaja) → klik tab 3 → `001000`, jawapan soalan 3 kelihatan, soalan lain tersembunyi, 0 ralat JS.

### 12. Panel profil: casing biasa, nama app dibuang, butang salin nombor
- `#profilPanel, #profilPanel *{text-transform:none}` — panel tidak lagi mewarisi SEMUA HURUF BESAR drpd `body`. Kini "Harun Hakimi", "Media Sosial", "1 Klik Terus", "Soalan Lazim", jawapan FAQ dll dlm huruf besar/kecil biasa. Butang WhatsApp papar **"WhatsApp"**.
- Media Sosial: nama app (Instagram/Facebook/TikTok/Threads) **dibuang**; tinggal ikon berwarna + handle. Handle ditanda `.handle` + `text-transform:lowercase`; nama platform dipindah ke `aria-label` anchor supaya pembaca skrin tak hilang maklumat.
- Butang telefon: `<button class="copy-btn" id="copyPhone">` baharu (ikon papan klip) di sebelah pautan `tel:`. Salin guna `navigator.clipboard.writeText` dgn **sandaran** `execCommand('copy')` + textarea tersembunyi (perlu utk konteks tak selamat / pelayar lama). Maklum balas: butang jadi hijau + `aria-label="Nombor disalin"` selama 1.6s.
- `.actions a{min-width:0}` ditambah supaya dua butang sedia ada boleh mengecil utk beri ruang kpd butang salin (gap 10px dikekalkan).
- **Disahkan dgn klik sebenar:** `writeText` dipanggil dgn `"013-888 4006"` dan **menyelesaikan (ok)**. Klik sintetik (tanpa pengaktifan pengguna) gagal dan jatuh ke sandaran — itu jangkaan pelayar, bukan pepijat.
- **Perangkap ditemui:** membuang `text-transform` tak cukup — teks yg ditaip HURUF BESAR dlm SUMBER kekal besar. `PERUNDING TAKAFUL` (badge `.role-pill`) diperbetulkan kpd `Perunding Takaful`. `FAQ` dikekalkan (akronim). Panel kini bersih drpd teks huruf besar keras.
- Ikon papan klip disemak dgn zum 6x: ia memang terlukis (pd 1:1 ia terlalu halus utk dilihat dlm tangkapan skrin penuh). Ujian piksel 'gelap' TIDAK sah dlm mod gelap — seluruh kad gelap. Gunakan julat warna maroon atau zum.
- Dua pepijat dicekup oleh pemeriksaan imbangan tag/kiraan: penggantian `aria-label` pertama menduplikasi setiap blok sosial (fail TIDAK ditulis); assert `initSteps == 2` salah (nilai sebenar 3 = 1 pengisytiharan + 2 panggilan pengawal).

### 13. "Info Extra" + pembetulan arah animasi morph semasa tutup
- Teks header `TEKAN UNTUK LIHAT LAGI` → **"Info Extra"**, ditambah `.topbar .more{text-transform:none}` supaya ia dipapar seperti ditulis (header masih guna huruf besar global utk elemen lain).
- **PEPIJAT DIBETULKAN:** animasi avatar + nama ketika MENUTUP memainkan morph arah BUKA (kedudukan header → panel) sambil panel mengecil — bukan arah bertentangan. Punca: fasa 2 sentiasa meletakkan `dst` di kedudukan `src` (header) dan fasa 3 sentiasa menganimasikan ke `'none'` (panel), tanpa mengira `open`.
- Kini fasa 2 guna `open ? (p._d + p._sk) : 'none'` dan fasa 3 guna `open ? 'none' : (p._d + p._sk)`; delta disimpan pada `p._d`/`p._sk` dlm fasa 2 utk dipakai fasa 3.
- **Disahkan dgn jejak geometri (`getBoundingClientRect` setiap ~90ms):** TUTUP `(569,46,w96) → (428,14,w44)`; BUKA `(428,14,w44) → (569,46,w96)` — cermin tepat, ~580ms. Sebelum pembetulan, KEDUA-DUA arah memberi urutan angka yang identik.

### 14. Morph nama: sejajar GLIF, bukan kotak
- **PEPIJAT:** ketika MEMBUKA, nama "Harun Hakimi" dlm panel tidak mendarat tepat di atas nama header — ia mula ~78px ke kanan. Punca: kotak `#pcName` (371px) diTENGAHKAN manakala `.topbar .who .n` rata kiri; morph menyelaraskan KOTAK (dx=0, dy=0 sebenarnya) tetapi glif di dlm kotak tidak sepadan.
- **PEMBETULAN 1:** pasangan nama ditanda `teks:true`; `rectTeks()` (Range + `selectNodeContents`) mengukur glyph, bukan kotak. Scale pun jadi tepat (0.75, dulu 0.65).
- **PEMBETULAN 2:** skala berpaksi pd penjuru KOTAK (`transform-origin:top left`), jadi offset teks dlm kotak mesti didarab skala: `dx = src.l - dstB.l - k*(dst.l - dstB.l)` (sama utk dy). Tanpa ini baki ralat 31px kekal.
- **Disahkan (kotak glyph via Range):** header `[484,26,98]`; panel pada t=0 buka `[484,26,98]` → `sepadan_t0: true`. BUKA 484→552, TUTUP 552→484 — cermin tepat.

### 15. Animasi masuk panel profil (CSS sahaja, tiada JS baharu)
- Dicetus oleh `.profil-canvas.open` (kelas yg JS sedia ada sudah togol):
  1. Pil "Perunding Takaful" — `pilMasuk` (naik 7px + skala .96→1, .4s), lengah **.26s** (selepas avatar+nama mendarat).
  2. Baris butang WA/telefon/salin — `naikMasuk` (naik 10px + skala .985→1, .36s), lengah **.14s**.
  3. Kad Media Sosial lengah **.21s**; kad FAQ lengah **.28s**.
  4. 4 tile sosial — `anakMasuk` (naik 6px + skala .97→1, .32s), lengah .30/.34/.38/.42s.
  5. Nombor tab FAQ 1–6 — lengah .38s + .025s setiap satu.
- Semua `transform`/`opacity` sahaja (GPU, tiada reflow); easing sama dgn morph `cubic-bezier(.22,.61,.36,1)`; semuanya selesai ~0.8s.
- **`animation-fill-mode: backwards`, BUKAN `both`** — selepas animasi tamat properti `transform` dibebaskan, jadi maklum balas `:active` berfungsi dan keadaan tutup tak terkunci.
- Maklum balas tekan: `.actions a`, `.copy-btn`, `.social`, `.ftb` mengecil ke .97 pd `:active`.
- Semua dibalut `@media (prefers-reduced-motion: no-preference)` — peranti yg minta kurang gerakan dapat TIADA animasi.
- **Disahkan:** frame pertama selepas buka — pil/kad/tile/tab semua `opacity:0` dgn `animation-name`+`animation-delay`+`fill:backwards` betul; pd 900ms semua `opacity:1`, `transform:none`.

Versi footer: v5.1 → **v6.0**. Saiz: 66.6 KB → 72.4 KB.

## Belum dibuat
- Duit/analitik: tiada pixel FB/GA — perlu jika nak tracking lead.
- `apple-touch-icon` (180x180 PNG) untuk "Add to Home Screen" iPhone.
- Og-image sebenar (1200x630).
- Notis "Online" 24/7 pada header masih statik.

### 16. Foto profil (DP) dibenamkan — v6.1
- `dptest.jpg` (640x640) dipotong segi empat fokus kepala/bahu, dikecilkan ke 256x256 JPEG q84 (19 KB), dibenamkan sebagai data URI sekali sahaja dalam pemboleh ubah `--dp`.
- Dipakai pada `.topbar .mini-avatar` (44px) dan `.avatar-lg#pcAvatar` (96px) melalui `background-image` + `background-size:cover` — jadi halaman kekal **0 permintaan luaran** dan kekal 0 `<img>`.
- Teks "HH" pada avatar disembunyikan (`color:transparent`); lencana biru `.badge-mini` dan gelang panel tidak disentuh.
- Morph avatar (header <-> panel) tidak terjejas kerana geometri tidak berubah.
- Saiz fail: 84289 -> 109452 bait.

### 17. Tab langkah borang gaya garis bawah — v6.2
- Rujukan reka bentuk daripada pengguna: tab ikon/nombor + label, garis halus sepanjang baris, tab aktif berlatar tint lembut dengan garis tebal 2px di bawahnya.
- Aksen guna maroon jenama (`--maroon-2`) dan tint `#fbe6e9`, bukan ungu contoh.
- Cip bulat `.stp-n` dikosongkan (jadi sebahagian teks) supaya struktur ikon+label sama seperti rujukan.
- Varian mod gelap ditambah (tint `#3a151c`, teks `#ffb3c1`).
- Saiz fail: 110422 -> 111348 bait.
- **Pepijat sedia ada dibaiki:** blok `@media (prefers-color-scheme: dark)` tidak diskop, jadi `data-theme="light"` tidak dapat menutup `body`, `input`, `select`, `textarea`, `.social`, `.quote`, `.company` — medan kekal gelap walaupun suis tema ditekan. 10 pemilih kini diskop dgn `:root:not([data-theme="light"])`. Mod gelap sendiri tidak berubah (disahkan: input `rgb(27,18,20)` tanpa atribut, `rgb(251,249,247)` bila dipaksa cerah).
### 18. Tab langkah: gaya kawalan bersegmen — v6.3
- Rujukan kedua pengguna: trek berlatar lembut bersudut bulat 12px, segmen aktif = pil putih (kad) bersudut 9px + bayang halus + teks aksen maroon.
- Menggantikan gaya garis bawah item 17 sepenuhnya; garis 2px dan tint #fbe6e9 dibuang.
- Aksen maroon jenama (`--maroon-2`); rujukan asal guna biru.
- Mod gelap: trek #2b2023, pil aktif #3f2d32, teks #ffb3c1 (7.64:1).
- Sasaran sentuh dinaikkan 33px -> ~45px.
- Nombor langkah dikembalikan sebagai bulatan tema maroon: 18px, aktif = bulatan maroon pejal + teks putih, tak aktif = tint maroon lembut `#f6dde1` + teks maroon. Gap 7px -> 5px supaya label masih muat; disahkan tiada label terpotong (3 segmen 115px).
### 19. Tab langkah: gaya garis bawah bersih — v6.4
- Rujukan ketiga pengguna: tiada trek dan tiada latar tint; tab = bulatan nombor + label.
- Tab aktif = teks maroon + garis 2px SELEBAR KANDUNGAN tab (bukan selebar lajur). Dicapai dgn `flex:0 1 auto` + `justify-content:space-between` pada `.stepper` (lebar tab 50/89/63px).
- Menggantikan kawalan bersegmen item 18 sepenuhnya (trek `#f2ede8` dan pil putih dibuang).
- Bulatan maroon dikekalkan (18px; aktif pejal + teks putih, tak aktif `#f6dde1` + teks maroon).
- Tinggi tab 40px; disahkan tiada label terpotong.
- Susun atur diubah atas permintaan pengguna: tiga tab kini SAMA LEBAR (`flex:1 1 0`) dan kandungan dipusatkan; garis aktif jadi selebar lajur (115px) bukan selebar kandungan. `justify-content:space-between` dibuang.
### 20. Label kad Pilihan Perlindungan dipecah dua baris — v6.5
- Permintaan pengguna: "Medical" di atas, "Card" di bawah — dan dua pilihan lain.
- Ketiga-tiga `.plan-name` kini guna `<br>`: Medical Card / Hibah Takaful / Sakit Kritikal.
- Nilai yang DIHANTAR tidak berubah: ia datang dari `data-plan` + input tersembunyi `#f_perlindungan`, bukan teks yang dipaparkan. Disahkan: `data-plan` kekal "Medical Card" dsb.
- Diukur: setiap label 2 baris (25px), ketiga-tiga kad 69px tinggi (sama rata), tiada limpahan.
### 21. Susun semula langkah borang + alih STATUS & SEJARAH PENYAKIT — v6.6
- Permintaan pengguna: pindahkan STATUS dan SEJARAH PENYAKIT ke langkah KESIHATAN; susunan baharu PELAN(1) -> DIRI(2) -> KESIHATAN(3).
- Isi sekarang: L1 PELAN = Bajet + Pilihan Perlindungan | L2 DIRI = Nama, Tarikh Lahir, Telefon, Bandar, Negeri | L3 KESIHATAN = Jantina, Merokok, Berat, Tinggi, Pekerjaan, Status, Sejarah Penyakit.
- Butang navigasi mengikut KEDUDUKAN: L1 Seterusnya (tiada Kembali), L2 Kembali+Seterusnya, L3 Kembali+Hantar+PDPA. `data-step` dikemas kini 1/2/3.
- Nilai yang dihantar tidak berubah (data-plan + input tersembunyi); jumlah medan `f_*` kekal 14.
- Diuji aliran sebenar dlm pelayar: klik pilihan wajib L1 -> Seterusnya maju ke L2, 0 ralat, 10% -> 18%.
- Nota: susunan soalan dlm mesej WhatsApp tidak diubah (bukan sebahagian permintaan ini).
### 22. PELAN disusun semula + 5 medan dialih ke DIRI — v6.7
- PELAN: Pilihan Perlindungan kini DAHULU, kemudian Bajet bulanan yang selesa.
- JANTINA, BERAT, TINGGI, PEKERJAAN, STATUS dialih dari KESIHATAN ke DIRI, disusun mengikut senarai pengguna dan dibubuh selepas medan sedia ada DIRI.
- KESIHATAN kini tinggal MEROKOK + SEJARAH PENYAKIT sahaja.
- JANTINA dikeluarkan drpd grid `.row2` yang dikongsinya dgn MEROKOK; MEROKOK dilepas drpd grid itu (kini lebar penuh) kerana `.row2` ialah grid 2 lajur `1fr 1fr` — sebaris seorang akan jadi separuh lebar.
- Diuji aliran sebenar: pilihan wajib L1 -> Seterusnya -> L2 aktif, progres 10% -> 18%, 0 ralat.
### 23. Susun atur DIRI dikemas — v6.8
- BANDAR & NEGERI dialih ke bawah BERAT & TINGGI.
- STATUS dan PEKERJAAN ditukar tempat (kini STATUS dahulu, kemudian PEKERJAAN).
- Susunan akhir DIRI: Nama Penuh | Tarikh Lahir + No Telefon | Jantina | Berat + Tinggi | Bandar + Negeri | Status | Pekerjaan.
- Disahkan melalui kedudukan sebenar label dlm pelayar (bukan hanya susunan DOM): urutan visual sepadan; 0 ralat; progres 10% -> 18% selepas langkah 1.
### 24. Media Sosial: empat sebaris, nama pengguna dibuang — v6.9
- `.socials` ditukar dari grid 2x2 (`1fr 1fr`) kepada `repeat(4,1fr)` + gap 8px -> empat tile sama lebar 79px, semuanya sebaris (disahkan: `top` sama utk keempat-empat).
- Teks nama pengguna (`<div class="handle">`) dibuang sepenuhnya - 4 daripadanya. Tiada JS membacanya (disahkan dgn grep pd blok skrip).
- `.social .icon` kehilangan jidar bawah 8px (itu ruang utk teks handle), dan peraturan mati `#profilPanel .social .handle` dibuang.
- `aria-label` diringkaskan kepada nama platform sahaja (Instagram/Facebook/TikTok/Threads).
- Nota: aplikasi keempat ialah THREADS, bukan WhatsApp. Tile kini ikon sahaja; nama platform hanya wujud dlm aria-label, tidak dipaparkan.

