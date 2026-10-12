# v2 — versi baharu laman pendaratan

Titik permulaan: salinan `index.html` daripada folder induk (footer v7.1), disalin pada 2026-10-12.

## Apa yang sama dengan induk

- Struktur borang 3 langkah (1 PELAN, 2 DIRI, 3 KESIHATAN) + FAQ + panel profil
- Integrasi WhatsApp + hantar data ke Google Sheet (Apps Script)
- 100% self-contained: tiada permintaan luar semasa muat halaman (kecuali hantar borang)

## Apa yang akan berbeza

> Belum ditentukan. Catatkan di sini sebelum mula mengubah kod, supaya kedua-dua versi
> tidak terpesong tanpa sengaja.

## Nota penting

- **Sheet:** versi ini menggunakan Apps Script yang SAMA dengan induk. Medan `Sumber` dalam
  Sheet merekodkan URL penuh halaman, jadi lead dari v2 dan dari induk boleh dibezakan.
  Kalau mahu Sheet berasingan, cipta deployment Apps Script yang baharu dan tukar `SHEET_URL`.
- **Jangan** salin balik kod dari sini ke induk secara bulat-bulat — perbezaan mungkin
  disengajakan.
- Fail backend (`sheet-backend.gs`, `GOOGLE-SHEET-SETUP.md`) kekal di folder induk dan dikongsi.
- Halaman ini belum di-commit ke git. Buat keputusan kemudian sama ada ia masuk repo.
