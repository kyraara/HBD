# 🎂 3D Birthday Surprise Web App

Sebuah pengalaman web 3D interaktif dan sinematik yang dirancang khusus sebagai kado kejutan ulang tahun. Proyek ini dibangun menggunakan **React**, **Three.js** (via React Three Fiber), untuk memberikan pengalaman layaknya virtual museum/galeri memori yang imersif dan emosional.

## ✨ Fitur Utama

- **🖼️ 3D Virtual Gallery**: Susunan foto-foto memori yang dapat dijelajahi di dalam ruangan 3D layaknya berjalan di museum pribadi.
- **🎮 Dual Navigation Mode**:
  - **Cinematic Auto-Tour**: Kamera bergerak otomatis secara sinematik menelusuri memori (Guided Tour).
  - **Manual Controller**: Eksplorasi bebas menggunakan *Virtual Joystick* (Mobile) atau kontrol keyboard/mouse (Desktop).
- **🎂 Interactive Cake & Candle Detector**: Fitur interaktif tiup lilin ultah yang mendeteksi suara dari mikrofon (atau interaksi klik).
- **🎵 BGM & Sound Effects**: Musik latar dan efek audio yang dirancang untuk membangun emosi serta suasana yang romantis dan *memorable*.
- **📱 Responsive & Mobile First**: Dioptimalkan untuk berjalan lancar dan interaktif walau diakses melalui layar smartphone.
- **✨ Premium Visual Effects**: Menggunakan efek *post-processing* dari React Three Fiber (bloom glow, fog, ambient sparkles 3D) untuk tampilan tingkat tinggi.

## 🛠️ Teknologi yang Digunakan

- [React 19](https://react.dev/) - Frontend Framework.
- [Vite](https://vitejs.dev/) - Build tool & dev server yang sangat cepat.
- [Three.js](https://threejs.org/) - 3D WebGL render engine.
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) - React ecosystem untuk Three.js.
- [@react-three/drei](https://github.com/pmndrs/drei) - Serangkaian *helper* esensial untuk R3F.
- [Zustand](https://zustand-demo.pmnd.rs/) - State management yang *clean* dan stabil untuk React.
- [Framer Motion](https://www.framer.com/motion/) - Library animasi tingkat lanjut untuk UI 2D (Overlay, Lightbox, Loading Screen).

## 🚀 Cara Menjalankan Project Secara Lokal

1. Buka terminal dan pastikan Anda berada di direktori project ini (`Tepatnya di HBD/`).
2. **Install Dependensi** (jika belum di-install):
   ```bash
   npm install
   ```
3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses alamat jaringan yang diberikan di terminal (biasanya `http://localhost:5173`).

## 📦 Build untuk Production (Deployment)

Untuk melakukan build dan optimasi project agar siap di-hosting ke platform seperti **Vercel**, **Netlify**, atau hosting lainnya:

```bash
npm run build
```
Hasil optimasi web akan di-generate ke dalam folder `dist/`. Folder ini yang nantinya akan di-upload atau di-serve oleh web server.

## 💡 Kustomisasi Proyek

Anda bebas melakukan penyesuaian konten untuk perayaan atau memori lainnya:
- **Konfigurasi Aset & Teks**: Buka file store utama (`src/store.js` atau yang setara) untuk mengubah list path foto, teks, surat, dll.
- **Musik Latar**: Ganti/tambahkan file audio MP3/WAV di direktori aset dan ubah alurnya di `BGMPlayer.jsx`.
- **Interaksi 3D**: Buka `Room.jsx`, `Cake.jsx`, atau `Gifts.jsx` untuk mengatur posisi dan orientasi objek jika ada *3D model* baru yang dimasukkan.

---
*Dibuat dengan segenap 💖 sebagai hadiah kejutan yang tidak dapat dilakukan oleh kado biasa.*
