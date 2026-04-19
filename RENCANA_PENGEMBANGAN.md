# 🎂 Rencana Pengembangan — "3D Birthday Surprise"
> Web ulang tahun interaktif berbasis WebGL untuk seseorang yang spesial — seorang dokter.

---

## 📋 Ringkasan Ide Pengembangan

Dari diskusi, ada **4 fitur utama** yang akan ditambahkan ke project yang sudah ada, semuanya terpusat pada satu konsep besar: **Secret Birthday Room** — ruangan tersembunyi yang hanya bisa diakses pada tanggal ulang tahun dia.

---

## 🏗️ Arsitektur Baru — Alur User Experience

```
Loading Screen (nama dia muncul pelan-pelan)
        ↓
Room Utama — Galeri Memori (yang sudah ada)
        ↓
Ujung lorong → Pintu Tersembunyi samar-samar keliatan
        ↓
   [CEK TANGGAL]
   ┌─────────────────────────────┐
   │ Belum tanggal ultah         │
   │ → pintu terkunci            │
   │ → muncul tulisan kecil      │
   │   "belum waktunya..."       │
   │ → countdown timer (EKG)     │
   └─────────────────────────────┘
        ↓ (kalau sudah tanggalnya)
   Pintu terbuka otomatis + efek cahaya
        ↓
SECRET BIRTHDAY ROOM
        ↓
Tiup lilin → Fireworks → Surat Confess (animasi tulisan tangan)
```

---

## 🔐 Fitur 1 — Date Lock System

### Cara kerja
Sistem cek tanggal hari ini vs tanggal ulang tahun, pure JavaScript — sangat ringan.

```js
const today = new Date();
const birthdayThisYear = new Date(today.getFullYear(), bulanDia - 1, tanggalDia);
const isUnlocked = today >= birthdayThisYear;
```

### Behaviour
| Kondisi | Yang terjadi |
|---|---|
| Belum tanggal ultah | Pintu terkunci, muncul countdown + tulisan *"belum waktunya..."* |
| Tepat tanggal ultah | Pintu terbuka otomatis dengan efek cahaya/glow |
| Sudah lewat tanggalnya | Pintu tetap terbuka (akses permanen) |

### Countdown Timer — Tema EKG
Karena dia seorang dokter, countdown timer ditampilkan dengan visual **garis EKG / detak jantung** yang bergerak, lalu angka hari tersisa di bawahnya. Personal dan relevan dengan profesinya.

---

## 🚪 Fitur 2 — Secret Birthday Room

### Konsep Visual
Dua opsi, pilih salah satu:

| Opsi | Deskripsi | Keunggulan |
|---|---|---|
| **Starfield** | Langit malam dengan partikel bintang mengambang | Romantis, dreamy |
| **Ruang Lilin** | Gelap total, hanya cahaya dari lilin-lilin kecil di sekitar kue | Intim, emosional |

> Rekomendasi: **Ruang Lilin** — lebih cocok dengan mood dokter yang identik dengan kehangatan dan kepedulian.

### Isi Room
- Kue ulang tahun 3D → **reuse `Cake.jsx`** yang sudah ada
- Candle detector (tiup lilin) → **reuse `CandleDetector.jsx`** yang sudah ada
- Fireworks setelah tiup lilin → **reuse `Fireworks.jsx`** yang sudah ada
- Surat confess dengan animasi tulisan tangan *(baru)*
- Easter egg tersembunyi *(baru)*

### Estimasi Performa
| Komponen | Beban | Keterangan |
|---|---|---|
| Geometry baru | Sangat ringan | Reuse komponen lama |
| Texture baru | Tidak ada | — |
| Partikel bintang/lilin | Medium | Pakai `InstancedMesh` GPU |
| Animasi tulisan tangan | Ringan | SVG 2D overlay, bukan 3D |
| Logic date lock | Sangat ringan | Pure JS beberapa baris |
| **Kesimpulan** | **Tidak lebih berat dari room utama** | ✅ |

---

## ✍️ Fitur 3 — Surat Confess Animasi Tulisan Tangan

### Cara kerja
Surat muncul setelah user meniup lilin. Teks dianimasikan menggunakan **SVG path stroke animation** — terlihat seperti sedang ditulis secara real-time, bukan langsung muncul.

### Format Surat — Tema Resep Dokter
Karena dia dokter, format surat dibuat menyerupai **resep dokter**:

```
R/

[nama dia],

Diagnosis: gue kena sesuatu yang
belum ada obatnya...

[isi pesan personal lo]

Pro: [nama lo]
───────────────────
Tanda tangan
```

> Ini unik, personal, dan pasti bikin dia senyum atau nangis — atau keduanya.

### Teknis
```js
// SVG stroke animation
@keyframes draw {
  from { stroke-dashoffset: 1000; }
  to   { stroke-dashoffset: 0; }
}
path {
  stroke-dasharray: 1000;
  animation: draw 4s ease forwards;
}
```

---

## 🥚 Fitur 4 — Easter Egg Tersembunyi

### Konsep
Sembunyikan objek 3D kecil berbentuk **stetoskop atau kapsul/pil** di sudut ruangan. Tidak ada petunjuk sama sekali — hanya dia yang tau kalau dia nemuin sendiri.

### Behaviour
- Kalau diklik → muncul tulisan atau gambar **inside joke kalian berdua**
- Bisa juga berisi foto candid kalian, atau satu kalimat yang cuma kalian yang ngerti

### Implementasi
```jsx
// Di SecretRoom.jsx
<mesh
  position={[-3, 0.5, -2]}
  onClick={() => setEasterEggOpen(true)}
>
  <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
  <meshStandardMaterial color="#ff6b9d" />
</mesh>

{easterEggOpen && (
  <EasterEggOverlay message="[inside joke kalian]" />
)}
```

---

## 🩺 Detail Personalisasi — Tema Dokter

Karena dia dokter, semua elemen kecil disesuaikan:

| Elemen | Versi Biasa | Versi Dokter |
|---|---|---|
| Countdown timer | Angka biasa | Visualisasi EKG / detak jantung |
| Format surat | Surat biasa | Format resep dokter (`R/`) |
| Easter egg | Objek random | Stetoskop atau kapsul pil 3D |
| Pesan pembuka | Umum | *"Diagnosis: gue kena sesuatu yang belum ada obatnya"* |
| Loading screen | Teks biasa | Nama dia muncul pelan seperti nama di rekam medis |

---

## 📦 File Baru yang Perlu Dibuat

```
src/
├── components/
│   ├── SecretRoom.jsx          ← room baru (starfield/lilin)
│   ├── SecretDoor.jsx          ← pintu tersembunyi di room utama
│   ├── DateLock.jsx            ← logic cek tanggal + countdown EKG
│   ├── HandwrittenLetter.jsx   ← surat animasi SVG tulisan tangan
│   └── EasterEgg.jsx           ← objek tersembunyi + overlay
```

---

## 🗂️ File yang Perlu Dimodifikasi

| File | Perubahan |
|---|---|
| `App.jsx` | Tambah `<SecretRoom>` dan `<SecretDoor>` |
| `Room.jsx` | Tambah pintu tersembunyi di ujung lorong |
| `store.js` | Tambah state `isRoomUnlocked`, `isEasterEggFound` |
| `LoadingScreen.jsx` | Animasikan nama dia muncul pelan-pelan |
| `OverlayUI.jsx` | Tambah tampilan countdown EKG |

---

## 🚀 Urutan Pengerjaan (Rekomendasi)

1. **Date Lock logic** — paling cepat, pure JS, langsung bisa ditest
2. **Loading screen** — nama dia muncul, effort rendah impact tinggi
3. **Secret Door** di room utama — pintu samar di ujung lorong
4. **Secret Room** — buat environment-nya (lilin/starfield)
5. **Handwritten Letter** — animasi SVG surat format resep
6. **Easter Egg** — objek stetoskop/kapsul tersembunyi
7. **EKG Countdown** — polish terakhir

---

## 💡 Catatan Penting

- Semua fitur baru **tidak menambah beban signifikan** — room utama tetap sama
- Secret room baru dimuat **lazy** (hanya di-load kalau pintu terbuka) → performa terjaga
- Tanggal ultah dia di-hardcode di `store.js` atau `.env` — tidak perlu backend sama sekali
- Seluruh konsep ini tetap berjalan **100% di sisi client**, tidak butuh server baru

---

*Dokumen ini dibuat berdasarkan diskusi pengembangan fitur tambahan untuk project "3D Birthday Surprise".*
