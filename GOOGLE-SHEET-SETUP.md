# Hantar data borang ke Google Sheet

Halaman ini fail statik tunggal, jadi ia tiada pelayan untuk menyimpan data. Penyelesaiannya
ialah **Google Apps Script Web App**: satu skrip kecil dalam Google Drive anda yang menerima
POST dan menulis baris ke Sheet. Percuma, tiada pelayan, tiada pangkalan data.

## Apa yang perlu anda buat (sekali sahaja, lebih kurang 3 minit)

1. **Buat Google Sheet baharu** — nama apa pun, contoh "Lead Takaful".
2. Dalam Sheet itu: **Extensions → Apps Script**.
3. Padam kod contoh, kemudian **tampal seluruh kandungan `sheet-backend.gs`**.
4. Tukar baris ini kepada rentetan rawak anda sendiri (contoh `tkg-9f3a71c2`):
   ```js
   const TOKEN = 'TUKAR-KEPADA-RENTETAN-RAWAK';
   ```
5. **Deploy → New deployment →** pilih type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Tekan **Deploy**, benarkan akses bila diminta.
6. **Salin URL** yang berakhir dengan `/exec`
   (`https://script.google.com/macros/s/AKfy.../exec`).
7. Dalam `index.html`, cari blok `HANTAR KE GOOGLE SHEET` dan isi dua nilai:
   ```js
   const SHEET_URL   = "https://script.google.com/macros/s/AKfy.../exec";
   const SHEET_TOKEN = "tkg-9f3a71c2";     // mesti sama dgn TOKEN dalam Apps Script
   ```
8. Hantar borang sekali sebagai ujian — baris baharu akan muncul dalam Sheet.

## Bagaimana ia berfungsi dalam halaman

- Pendawaian berlaku **selepas** validasi lulus, sebaris sebelum pautan WhatsApp disediakan.
  Jadi data rosak/tidak lengkap tidak pernah masuk ke Sheet.
- Ia dihantar dengan `fetch(..., {mode:'no-cors'})` dan `Content-Type: text/plain` supaya
  pelayar tidak menghantar preflight CORS (Apps Script tidak menjawab preflight).
- Ia **gagal senyap**: kalau Sheet tidak dapat dihubungi, aliran WhatsApp tetap berjalan.
  Ini disengajakan — jangan sekali-kali menghalang pelanggan menghantar WhatsApp kerana
  masalah simpanan data.
- Kalau `SHEET_URL` dibiarkan kosong, fungsi itu tidak berbuat apa-apa (mati secara lalai).

## Perkara yang perlu anda tahu

- **Halaman ini tidak lagi 100% tanpa permintaan luar** — tetapi hanya **semasa hantar**.
  Pemuatan halaman kekal bersih (0 permintaan). Kalau anda mahu kekal tanpa sebarang
  permintaan luar, jangan pasang ini.
- **URL dan token akan kelihatan dalam repo awam.** Token menghalang spam kasual, bukan
  penyerang yang bersungguh. Kalau berlaku penyalahgunaan: tukar `TOKEN`, deploy semula
  (URL baharu), kemas kini index.html.
- **Tiada maklum balas kejayaan** — dengan `no-cors` halaman tidak boleh membaca respons.
  Untuk memastikan ia berfungsi, semak Sheet itu sendiri selepas hantar.
- **Data peribadi** (nama, telefon, tarikh lahir, sejarah penyakit) kini disimpan dalam
  Google Drive anda. Itu memang tujuan asalnya, tetapi ia juga bermakna anda bertanggungjawab
  di bawah PDPA 2010 untuk menyimpannya dengan selamat — jangan kongsi Sheet itu secara awam.
- Untuk berhenti menghantar ke Sheet: kosongkan `SHEET_URL`. Untuk memadam sepenuhnya:
  buang blok `HANTAR KE GOOGLE SHEET` dan baris `hantarKeSheet(...)`.

## Kalau mahu lebih daripada ini

- **Notifikasi**: dalam Apps Script tambah `MailApp.sendEmail(...)` supaya anda dapat e-mel
  setiap lead, atau `SpreadsheetApp` + trigger harian untuk ringkasan.
- **Elak baris berganda**: kalau pengguna tekan Hantar dua kali, dua baris akan masuk. Untuk
  mengelakkannya, hantar satu `id` unik (contoh cap masa) dan semak dalam skrip.
- **Pilihan lain**: Formspree/Getform (lebih mudah, tetapi data melalui pihak ketiga) atau
  Google Form (POST ke `formResponse`, tetapi perlu memetakan `entry.ID` setiap medan).

## Penyelesaian masalah

**Gejala: URL `/exec` memaparkan "Page not found" atau "Sorry, the file you have requested does not exist" (HTTP 404).**
Ini bermakna **ID deployment itu tidak wujud** — bukan masalah kebenaran. Perbezaannya penting:
kalau masalahnya kebenaran (akses bukan "Anyone"), Google akan memaparkan **halaman log masuk
akaun Google**, bukan "fail tidak wujud". Punca biasa: URL disalin dari tempat yang salah
(URL editor, "Test deployments", deployment lama yang sudah dipadam, atau disalin sebelum
butang **Deploy** benar-benar ditekan).

Cara betul mendapat URL:
1. Apps Script → **Deploy → Manage deployments**.
2. Kalau senarai **kosong**, deployment tidak pernah tercipta — buat **Deploy → New deployment**.
3. Klik ikon pensel pada deployment, atau buat yang baharu, dan pastikan:
   Type **Web app**, Execute as **Me**, Who has access **Anyone**.
4. Tekan **Deploy** (menyalin URL dari medan dialog sebelum menekan Deploy tidak cukup — ia
   belum wujud lagi).
5. Selepas Deploy selesai, panel pengesahan memaparkan **Web app URL**. Salin dari situ.
6. Uji dengan membuka URL itu dalam pelayar anda sendiri. Anda sepatutnya nampak:
   `{"ok":true,"mesej":"Backend borang Takaful hidup."}`
   Kalau anda pun nampak "Page not found", ID itu masih salah — salin semula.

**Gejala: URL berfungsi dalam pelayar saya (saya sudah log masuk), tetapi tidak berfungsi untuk orang lain.**
Ini masalah kebenaran, bukan ID. Tukar **Who has access** kepada **Anyone**, kemudian
**Deploy → Manage deployments → pensel → Version: New version → Deploy**.

**Gejala: ubah kod dalam Apps Script tetapi tiada apa-apa berubah.**
Perubahan tidak hidup sehingga anda deploy versi baharu: **Deploy → Manage deployments →
ikon pensel → Version: New version → Deploy**. URL tidak berubah kalau anda kemas kini
deployment yang sama.

**Gejala: Sheet kosong walaupun borang dihantar, tiada ralat kelihatan.**
Halaman gagal senyap dengan sengaja (`no-cors`), jadi semak ini mengikut urutan:
token dalam `index.html` sama tepat dengan `TOKEN` dalam Apps Script; akses "Anyone";
`SHEET_URL` tidak kosong; URL berakhir dengan `/exec` (bukan `/dev`).

## E-mel notifikasi setiap lead

`doPost` menulis baris ke Sheet dahulu, kemudian menghantar e-mel, kemudian memulangkan
`{"ok":true,"emel":"alamat@..."}`. Kalau penghantaran e-mel gagal, lead itu **tetap tersimpan** —
e-mel tidak pernah boleh menghalang simpanan data.

- Penerima: `NOTIF_EMAIL` kalau diisi. Kalau dibiarkan kosong, skrip menggunakan
  `Session.getEffectiveUser().getEmail()` — iaitu akaun pemilik skrip (yang deploy).
  Jadi biasanya anda tidak perlu menulis alamat e-mel sendiri.
- Subjek: `LEAD BAHARU: <nama> — <pilihan perlindungan>` supaya boleh diimbas dari skrin kunci telefon.
- Badan: ringkasan penuh semua medan, teks biasa (bukan HTML) supaya mudah dibaca merata-rata.
- **Kebenaran baharu diperlukan:** MailApp memerlukan skop Gmail. Apabila anda deploy
  **New version**, skrin kebenaran akan muncul lagi — tekan benarkan. Kalau tidak, e-mel
  akan gagal (baris tetap masuk, jadi kegagalan itu senyap kecuali anda semak `emel` dalam
  respons `doGet`).
- Kuota: akaun Gmail percuma boleh hantar lebih kurang 100 e-mel sehari — jauh melebihi
  keperluan laman ini.
- Untuk mematikan e-mel: buang panggilan `hantarEmel(d)` daripada `doPost`.

## Ralat: "You do not have permission to call Session.getEffectiveUser"

Gejala: URL `/exec` memulangkan `Exception: You do not have permission to call
Session.getEffectiveUser. Required permissions: https://www.googleapis.com/auth/userinfo.email`.
Puncanya: kod memerlukan skop `userinfo.email` (untuk membaca alamat e-mel pemilik) dan skop itu
belum dibenarkan. Hantar borang tetap berfungsi — baris tetap ditulis, hanya e-mel gagal.

Betulkan: dalam editor Apps Script, pilih fungsi **ujiKebenaran** dalam senarai fungsi di bar atas,
tekan **Run**, dan benarkan akses (Advanced -> Go to ... (unsafe) -> Allow). Fungsi itu meminta
semua kebenaran sekaligus **dan** menghantar satu e-mel ujian, jadi anda terus tahu sama ada
e-mel benar-benar sampai. Kemudian **Deploy -> Manage deployments -> pensel -> New version -> Deploy**.

Kemudian buka semula URL `/exec` — ia akan melaporkan nama fail Sheet, senarai tab dengan bilangan
baris, dan alamat e-mel yang akan menerima notifikasi.

Alternatif tanpa kebenaran tambahan: buang semua panggilan `Session.getEffectiveUser()` daripada
kod dan isi `NOTIF_EMAIL` dengan alamat anda. Apps Script menentukan kebenaran secara statik
daripada kod, jadi mengekalkan panggilan itu di dalam `try/catch` pun masih memerlukan skop itu —
ia mesti dibuang, bukan sekadar dilindungi.

