# Website Pusat KKN-PM UNM

Buka `index.html` di browser untuk menjalankan website di laptop. Foto dan font disertakan. Tautan sumber, email, dan peta membutuhkan koneksi internet.

## Mengganti isi

- Ubah judul, tahapan KKN, foto/nama/jabatan pimpinan, slogan, dan kontak di `index.html`.
- Ubah berita, pengumuman, agenda, dan keterangan foto galeri di `content.js`.
- Simpan foto di `assets/`, lalu tulis lokasi file yang sesuai pada `src` gambar di HTML atau kolom `image` di `content.js`.
- Ubah warna dan tampilan di `styles.css`.

Foto latar beranda menggunakan `assets/menara-pinisi.jpg`. Foto pimpinan menggunakan `farida-patittingi.png`, `oslan-jumadi.jpeg`, `suarlin.png`, `andi-aslinda.jpg`, `hartati.png`, `arifin-manggau.jpg`, dan `syahruddin.jpg` di folder `assets/`. Saat mengganti foto, perbarui juga nama, jabatan, teks alternatif `alt`, dan tautan sumber. Slogan utama berada pada judul beranda dengan `id="hero-heading"`. Tautan Instagram, Facebook, TikTok, dan YouTube berada pada bagian `contact-socials` di `index.html`. Perbarui alamat `href`, nama akun, dan label aksesibilitas `aria-label` bersama-sama jika akun berubah.

Setiap berita mempunyai `id` unik, kategori, tanggal, judul, ringkasan, foto, paragraf, dan tautan sumber. Gunakan kategori `Literasi` atau `Kegiatan`, atau tambahkan tombol kategori di `index.html`.

Gunakan tanggal berformat `YYYY-MM-DD`. Pengumuman dengan `expires` sebelum tanggal hari ini ditampilkan sebagai arsip. Jika `expires` dikosongkan, pengumuman terus aktif. Berita dan pengumuman bertanggal mendatang baru ditampilkan pada tanggal tersebut. Agenda bertanggal mendatang langsung terlihat pada kalender. Perhitungan hari menggunakan WITA.

## Memublikasikan perubahan

Simpan perubahan dan muat ulang browser untuk memeriksa hasilnya. Untuk GitHub Pages, unggah atau commit file yang diubah ke branch `main` repositori `syarifrif/pusat-kkn-pm-unm`. Tunggu proses GitHub Pages selesai, lalu muat ulang alamat publik. Jika masih melihat tampilan lama, tekan Ctrl+F5.

## Sumber konten

Profil dan identitas pimpinan dirujuk dari laman resmi UNM dan LP2M. Foto Kepala LP2M diambil dari profil publik PERMI. Sembilan tahapan KKN diringkas dari poster Alur Pelaksanaan KKN UNM yang diberikan pengelola. Jadwal dan ketentuan mengikuti pengumuman resmi yang berlaku. Rincian rujukan tersedia di `SUMBER_KONTEN.md`.

Berita dan foto galeri dirujuk dari publikasi UNM dan Prodi Kewirausahaan. Pengumuman awal merupakan arsip. Agenda awal mencatat 18 Februari dan 3 September 2026. Tambahkan jadwal berikutnya setelah tersedia.
