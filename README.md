# Perunding Takaful — Landing Page

Laman pendaratan (landing page) mudah alih untuk perunding Takaful **Harun Hakimi**.
Satu fail HTML sahaja, tiada binaan (build), tiada kebergantungan luar.

**Fail utama:** `index.html` — buka terus dalam pelayar, atau hos di mana-mana
perkhidmatan statik (GitHub Pages, Netlify, Cloudflare Pages).

## Apa yang ada di dalam

| Bahagian | Keterangan |
| --- | --- |
| Header → panel profil | Morph satu gerakan (clip-path + avatar/nama bergerak dari header ke kanvas) |
| Borang 3 langkah | DIRI → KESIHATAN → PELAN, dengan pengesahan setiap langkah |
| CTA WhatsApp | Bina mesej penuh (emoji + semua medan) dan buka WhatsApp |
| Butang salin | Ikon papan klip di sebelah nombor telefon (dengan sandaran `execCommand` untuk iOS lama) |
| Media sosial | 4 tile: Instagram, Facebook, TikTok, Threads |
| Soalan Lazim | 6 soalan sebagai tab bernombor 1–6 |

## Ciri teknikal

- **100% serba lengkap** — 0 fail luaran, 0 permintaan rangkaian, 0 `<img>`
  (semua ikon SVG sebaris, corak latar belakang base64).
- **Mudah alih dahulu** — direka untuk lebar 430px, selamat untuk `env(safe-area-inset-*)`.
- **Aksesibiliti** — kanvas yang tertutup `inert` + `aria-hidden`; chip langkah ialah
  `<button>` sebenar (Tab + Enter); tab FAQ ada `aria-label` penuh bagi setiap soalan.
- **`prefers-reduced-motion`** dihormati — animasi dimatikan sepenuhnya.
- **Tanpa JavaScript pun masih boleh dibaca** — kandungan dalam HTML biasa.

## Struktur

```
index.html      laman itu sendiri (satu fail, jangan pecahkan)
CHANGELOG.md    rekod setiap pusingan perubahan — kenapa, bukan sekadar apa
original/       salinan baseline asal (untuk rujukan/diff)
assets/         logo sumber
```

## Cara kemas kini

1. Sunting `index.html` sahaja — ia berdiri sendiri.
2. Naikkan nombor versi dalam footer (`v6.0` → `v6.1`) selepas perubahan yang kelihatan.
3. Rekod perubahan dalam `CHANGELOG.md`: apa yang berubah **dan sebabnya**
   (banyak catatan di situ menerangkan pepijat yang telah dibetulkan supaya ia tidak berulang).

## Ujian yang telah dijalankan

- Klik sebenar (bukan sintetik) mengesahkan butang salin memanggil
  `navigator.clipboard.writeText("013-888 4006")` dan selesai dengan jayanya.
- Morph profil dijejak dengan `getBoundingClientRect` setiap ~90ms: buka dan
  tutup ialah cermin tepat, dan nama mendarat tepat pada kedudukan glyph nama header.
- 0 ralat JavaScript pada setiap pusingan.

## Nota

- Nombor telefon dan pautan WhatsApp di dalam laman ini adalah untuk kegunaan
  perniagaan dan memang bertujuan untuk paparan awam.
- © 2026 Harun Hakimi. Hak cipta terpelihara.
