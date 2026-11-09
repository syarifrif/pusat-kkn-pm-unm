# Website Pusat KKN-PM UNM

Buka `dist/index.html` di browser untuk menjalankan website di laptop. Seluruh foto dan font disertakan. Tautan sumber, email, dan peta membutuhkan koneksi internet.

## Mengganti isi

- Ubah judul, profil, dan kontak di `dist/index.html`.
- Ubah berita, pengumuman, agenda, dan keterangan foto di `dist/content.js`.
- Simpan foto di `dist/assets/`, lalu gunakan nama file yang sama di `content.js`.
- Ubah warna dan tampilan di `dist/styles.css`.

Setiap berita mempunyai `id` unik, kategori, tanggal, judul, ringkasan, foto, paragraf, dan tautan sumber. Gunakan kategori `Literasi` atau `Kegiatan`, atau tambahkan tombol kategori di `index.html`.

Gunakan tanggal berformat `YYYY-MM-DD`. Pengumuman dengan `expires` sebelum tanggal hari ini ditampilkan sebagai arsip. Jika `expires` dikosongkan, pengumuman terus aktif. Berita dan pengumuman bertanggal mendatang baru ditampilkan pada tanggal tersebut. Agenda bertanggal mendatang langsung dapat dilihat di kalender. Perhitungan hari menggunakan WITA.

Simpan perubahan, lalu muat ulang browser. Setelah perubahan source, versi yang dihosting perlu dipublikasikan kembali.

## Konten awal

Profil diringkas dari laman LP2M UNM. Berita serta foto dirujuk ke publikasi UNM dan Prodi Kewirausahaan. Pengumuman awal merupakan arsip. Agenda awal mencatat kegiatan pada 18 Februari dan 3 September 2026. Tambahkan jadwal mendatang setelah tersedia. Rujukan foto dan berita dapat dibuka dari tampilan berita dan galeri.
