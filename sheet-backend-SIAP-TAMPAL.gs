/**
 * BACKEND GOOGLE SHEET + E-MEL NOTIFIKASI
 * borang laman pendaratan Perunding Takaful
 * -----------------------------------------------------------------
 * Cara pasang (sekali sahaja):
 *   1. Buka Google Sheet baharu (nama apa pun).
 *   2. Extensions -> Apps Script. Padam kod contoh, tampal fail ini.
 *   3. Tukar TOKEN di bawah kepada rentetan rawak anda sendiri.
 *      Biarkan NOTIF_EMAIL kosong supaya e-mel pergi ke akaun pemilik skrip.
 *   4. Deploy -> New deployment -> type: Web app
 *        Execute as  : Me
 *        Who has access: Anyone
 *      -> Deploy -> salin URL .../exec
 *      -> KEMUDIAN: pilih fungsi ujiKebenaran -> Run -> benarkan akses Gmail
 *   5. Tampal URL itu ke dalam index.html:
 *        const SHEET_URL = "https://script.google.com/macros/s/AKfy.../exec";
 *      Pastikan TOKEN di sini sama dengan SHEET_TOKEN dalam index.html.
 *
 * Nota keselamatan: URL Web App akan kelihatan dalam repo awam. TOKEN menghalang
 * spam kasual, bukan penyerang yang bersungguh. Kalau berlaku penyalahgunaan,
 * tukar TOKEN dan deploy semula (URL baharu), atau hadkan rate di sini.
 */

const TOKEN       = 'tgk_t8h3mfdq6ug4ys54r66e3r25hudwcmps';
const SHEET_NAME  = 'Lead';
const NOTIF_EMAIL = '';          // kosong = akaun pemilik skrip (Execute as: Me)
const HEADER = ['Masa','Nama','Tarikh Lahir','Telefon','Bandar','Negeri','Jantina',
                'Merokok','Berat (kg)','Tinggi (cm)','Pekerjaan','Status','Bajet/bulan',
                'Nak cover','Sejarah Penyakit','Bahasa','Sumber'];

function doPost(e) {
  try {
    let d = {};
    if (e && e.postData && e.postData.contents) {
      try { d = JSON.parse(e.postData.contents); }
      catch (err) { d = e.parameter || {}; }         // sandaran: borang klasik
    } else {
      d = (e && e.parameter) || {};
    }

    if (TOKEN && d.token !== TOKEN) {
      return json({ ok: false, ralat: 'token' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADER);
      sh.getRange(1, 1, 1, HEADER.length).setFontWeight('bold').setBackground('#f1f3f4');
      sh.setFrozenRows(1);
    }

    // Baris ditulis DAHULU. E-mel menyusul; kegagalan e-mel tidak boleh
    // menghalang penyimpanan lead.
    sh.appendRow([
      new Date(),
      d.nama || '', d.dob || '', d.telefon || '', d.bandar || '', d.negeri || '',
      d.jantina || '', d.merokok || '', d.berat || '', d.tinggi || '',
      d.kerja || '', d.status || '', d.bajet || '', d.perlindungan || '',
      d.nota || '', d.bahasa || '', d.sumber || ''
    ]);

    return json({ ok: true, emel: hantarEmel(d) });
  } catch (err) {
    return json({ ok: false, ralat: String(err) });
  }
}

function hantarEmel(d) {
  try {
    const ke = NOTIF_EMAIL || alamatPemilik();
    if (!ke) return 'tiada alamat — isi NOTIF_EMAIL atau benarkan kebenaran userinfo.email';
    MailApp.sendEmail({
      to: ke,
      subject: 'LEAD BAHARU: ' + (d.nama || '(tiada nama)') +
               ' — ' + (d.perlindungan || 'tanpa pilihan'),
      body: barisEmel(d)
    });
    return ke;
  } catch (err) {
    return 'gagal: ' + String(err);      // lead tetap tersimpan
  }
}

function barisEmel(d) {
  const b = function (label, nilai) { return label + ' : ' + (nilai || '-'); };
  const bt = [d.berat, d.tinggi].filter(String).join(' kg / ') + (d.tinggi ? ' cm' : '');
  return [
    'Lead baharu dari laman pendaratan Takaful.',
    '',
    b('Nama',             d.nama),
    b('Telefon',          d.telefon),
    b('Tarikh Lahir',     d.dob),
    b('Bandar / Negeri',  [d.bandar, d.negeri].filter(String).join(', ')),
    b('Jantina',          d.jantina),
    b('Merokok',          d.merokok),
    b('Berat / Tinggi',   bt),
    b('Pekerjaan',        d.kerja),
    b('Status',           d.status),
    b('Bajet/bulan',      d.bajet),
    b('Nak cover',        d.perlindungan),
    b('Sejarah Penyakit', d.nota),
    b('Bahasa',           d.bahasa),
    b('Sumber',           d.sumber),
    '',
    'Balas pelanggan melalui WhatsApp secepat mungkin.'
  ].join('\n');
}

function alamatPemilik() {
  try { return Session.getEffectiveUser().getEmail() || ''; }
  catch (err) { return ''; }          // kebenaran belum diberikan
}

/**
 * Jalankan fungsi ini SEKALI dari editor Apps Script:
 *   pilih "ujiKebenaran" dalam senarai fungsi -> tekan Run -> benarkan akses.
 * Ia meminta semua kebenaran yang diperlukan DAN menghantar satu e-mel ujian,
 * supaya anda tahu e-mel notifikasi benar-benar sampai ke peti masuk anda.
 */
function ujiKebenaran() {
  ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);   // paksa skrin kebenaran muncul
  const keadaan = doGet().getContent();
  const emel = hantarEmel({
    nama: 'UJIAN KEBENARAN', perlindungan: 'Test', telefon: '012-345 6789',
    bandar: 'Ipoh', negeri: 'Perak', kerja: 'Jurutera', status: 'Berkahwin',
    bajet: 'RM100 - RM200', jantina: 'Lelaki', merokok: 'Tidak',
    berat: '70', tinggi: '170', bahasa: 'ms', sumber: 'editor',
    nota: 'E-mel ujian daripada ujiKebenaran()'
  });
  return keadaan + '\n---\nE-mel ujian -> ' + emel;
}

function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return json({
      ok: true,
      fail: ss ? ss.getName() : 'TIADA — skrip tidak terikat pada mana-mana Sheet',
      tab: ss ? ss.getSheets().map(function (s) { return s.getName() + ' (' + s.getLastRow() + ' baris)'; }) : [],
      emel: NOTIF_EMAIL || alamatPemilik() || '(belum dibenarkan — jalankan ujiKebenaran sekali)',
      mesej: 'Backend borang Takaful hidup.'
    });
  } catch (err) {
    return json({ ok: false, ralat: String(err) });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
                       .setMimeType(ContentService.MimeType.JSON);
}
