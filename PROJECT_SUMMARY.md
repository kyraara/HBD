# 📁 Ringkasan & Detail Project "3D Birthday Surprise"

Dokumen ini berisi rincian tentang apa saja yang telah kita bangun dalam project ini. Project didesain sebagai virtual museum 3D interaktif yang romantis dan emosional, di mana *user* akan dibawa menyusuri memori sebelum akhirnya sampai ke perayaan utama (Kue Ulang Tahun dan Surat Spesial).

Berikut adalah seluruh daftar komponen fungsional dan visual yang telah berhasil kita buat di dalam project ini beserta penjelasannya:

---

## 🏛️ 1. Lingkungan & Ruangan Utama (3D Environment)

- **`Room.jsx`**
  Ini adalah fondasi ruangan 3D (dinding, lantai, pilar, dan pencahayaan dasar). Didesain gelap, elegan, dan *cinematic* layaknya sebuah galeri pameran atau museum yang eksklusif.

- **`Curtain.jsx`**
  Komponen tirai atau gorden 3D yang diposisikan di akhir galeri. Berfungsi menambahkan elemen estetika visual untuk menyembunyikan atau mempermanis area panggung utama tempat kue berada.

- **`DynamicLighting.jsx`**
  Mengatur intensitas dan pergerakan cahaya di dalam ruangan, yang bereaksi sesuai dengan *mood* ruangan.

- **`PostEffects.jsx`**
  Visual *finishing* tingkat lanjut menggunakan arsitektur post-processing Three.js. Kita menggunakannya untuk memberikan efek cahaya natural (*Bloom Glow*), mengurangi ketajaman tepi, serta memberikan kabut (*Fog*) dan debu ajaib (percikan *Sparkles*) di dalam ruangan 3D. 

---

## 🖼️ 2. Eksibisi & Memori

- **`PhotoFrame.jsx`**
  Merupakan pigura foto 3D interaktif yang digantung di sepanjang dinding lorong. Komponen ini menampilkan foto-foto momen spesial. Saat di-klik oleh user, objek ini mendelegasikan sinyal untuk menampilkan layar foto yang membesar.

- **`Lightbox.jsx` (2D Overlay)**
  Layar *pop-up* 2D (modal) yang muncul ketika user meng-klik salah satu *PhotoFrame* di lingkungan 3D. Menampilkan foto dengan ukuran lebih besar lengkap dengan *caption* atau cerita pendek, plus efek bayangan yang *smooth*.

---

## 🎂 3. Puncak Kejutan & Perayaan

- **`Cake.jsx`**
  Kue ulang tahun 3D yang muncul pada titik puncak ruangan. Dilengkapi tekstur yang *premium* dengan lilin yang menyala di bagian atasnya, siap menanti ditiup.

- **`Gifts.jsx`**
  Objek bingkisan atau kado kotak 3D di sekitar kue ulang tahun untuk menambah kesan perayaan di ujung perjalanan "galeri" memori kita.

- **`CandleDetector.jsx` (Pendeteksi Tiup Lilin)**
  Ini salah satu fitur paling unik! Komponen ini meminta izin mikrofon user, mendeteksi sinyal audio ketukan angin/suara dari hembusan ("tiupan"), dan kemudian memicu efek mematikan api lilin pada `Cake.jsx`. 

- **`Fireworks.jsx`**
  Efek ledakan kembang api (partikel animasi) di latar belakang layar yang muncul secara otomatis setelah user "meniup" lilin atau ketika sedang membaca surat kejutan bahagia. Efek ini sebagai *grand final* kejutan!

---

## 🏎️ 4. Kendali & Pergerakan Kamera (Navigasi)

Kita membuat inovasi lewat opsi **Dual Navigation**, user bisa berjalan santai otomatis atau dikontrol 100% secara manual!

- **`CameraPath.jsx` (Cinematic Tour)**
  Komponen yang meracik jalur rahasia tidak kasat mata bagi kamera utama (*Directed Path*). Begitu diklik "Mulai", kamera akan melayang maju secara sinematik tanpa user repot mengarahkan, layaknya menonton film interaktif!

- **`ManualControls.jsx` (Eksplorasi Santai)**
  Sistem kendali kompleks bagi mereka yang suka bergerak acak. Untuk pengguna *desktop* bisa pakai WASD/Keyboard, sedangkan untuk *mobile/HP*, ada sistem **Virtual Joystick** on-screen yang dbuat sangat rapi agar tak memblokir pandangan layar sentuh.

---

## 🪄 5. Antarmuka 2D (User Interface & Flow)

Walaupun isinya 3D, elemen-elemen instruksi untuk manusia (UI) tetap kita perhatikan:

- **`LoadingScreen.jsx`**
  Layar perkenalan yang sangat mulus saat halaman web pertama kali memuat semua model 3D, animasi, tekstur resolusi tinggi, dan musik yang berat. Semuanya di-loading di *background* agar saat mulai tidak terjadi "patah-patah" (*stuttering*).

- **`OverlayUI.jsx`**
  Otak visual komunikasi web! Termasuk di antaranya rentetan kata-kata sapaan *(“Ada pesan khusus…”,"Let's go" dll)* di tengah layar, surat terakhir (*Secret Letter*), teks ucapan ulang tahun panjang, hingga menu Start/Mode. Semuanya dianimasikan menggunakan *Framer Motion* untuk kesan lembut, lentur, dan modern.

- **`BGMPlayer.jsx`**
  Sistem tata suara cerdas di belakang layar yang menangani pemutaran latar belakang musik (BGM). Bisa *looping*, bisa memudar (*fade-in / fade-out*), dan akan aktif secara perlahan setelah layar loading lewat untuk mendukung narasi emosi romantisnya.

---

## ⚙️ 6. Jantung Utama Proyek (App Setup)

Selain komponen di atas, ada struktur yang mengikat seluruh aplikasi agar bisa jalan tanpa eror:

- **`App.jsx`**: Semua komponen yang ada di daftar ini dikumpulkan dan dirakit bersama di file ini. Menentukan posisi komponen 3D (Kue dimana, Frame dimana) hingga menempatkan semua fungsionalnya dalam Tag Canvas.
- **`store.js` (Zustand)**: Mengatur "Memori Global". Kita meletakkan daftar URL foto, konfigurasi suara (*muted/unmuted*), hingga mencatat *"apakah lilin sudah ditiup?"* dalam file ini.
- **`index.html` dan `index.css`**: Tempat di mana kita memasukkan fondasi warna (hitam/gelap *modern gradient*), konfigurasi font kustom (seperti font tulisan tangan atau *Inter* yang terbaca bersih), serta styling tombol-tombol modern.

## 📝 Kesimpulan

Proyek ini bukan sekadar web ucapan ulang tahun biasa, tapi sebuah penggabungan teknologi *WebGL*, *User Interface Interaktif*, *Audio Processing* dan *Cinematic Flow*. Dibuat sangat mendetail – dari intro di loading screen hingga ending berupa surat ucapan personal yang dieksekusi dengan mewah melalui tebaran *Fireworks* dan partikel. 🚀 ✨
