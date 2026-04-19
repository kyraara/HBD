import { create } from 'zustand'
import * as THREE from 'three'

const appConfig = {
  // PINTU GERBANG
  secretPassword: "0804",
  passwordHint: "Masukkan 4 digit tanggal spesial kita",
  birthdayDate: "2026-02-14T00:00:00+07:00", // Tanggal ultah dia (digunakan untuk Secret Door & EKG)

  // GALERI
  photos: [
    { id: 1, url: '/images/2.jpg', audioUrl: '/audio/pembohong.mp3', text: 'Kala Itu Bersamamu', memory: 'Waktu itu kita duduk berjam-jam di café, ngobrol sampai lupa waktu...', position: [4.9, 1.8, -6], rotation: [0, -Math.PI / 2, 0] },
    { id: 2, url: '/images/3.jpg', audioUrl: '/audio/p2.mp3', text: 'Senja Keduanya', memory: 'Senja hari itu begitu indah, tapi tidak seindah senyummu.', position: [-4.9, 1.8, -13], rotation: [0, Math.PI / 2, 0] },
    { id: 3, url: '/images/1.jpg', audioUrl: '/audio/p1.mp3', text: 'Jejak Langkah', memory: 'Setiap langkah bersamamu terasa ringan, karena kamu yang menggenggam tanganku.', position: [4.9, 1.8, -20], rotation: [0, -Math.PI / 2, 0] },
    { id: 4, url: '/images/dummy_4_1775657172282.png', audioUrl: '/audio/tes.ogg', text: 'Sebuah Perayaan', memory: 'Dan setiap momen kecil bersamamu, layak untuk dirayakan.', position: [-4.9, 1.8, -27], rotation: [0, Math.PI / 2, 0] }
  ],

  // SURAT CONFESS (TEMA RESEP DOKTER)
  letterTitle: "R/",
  letterPatient: "Untuk: Cha",
  letterDiagnosis: "Diagnosis: Gue kena sesuatu yang belum ada obatnya...",
  letterText: "Gue harap di usia baru lo ini, lo bisa ngeraih semua cita-cita lo.\n\nRuangan ini, galeri ini, cuma sebagian kecil dari apa yang pengen gue unjukin ke lo. Dan gue harap kita bisa terus bikin memori bareng.\n\nI love you.",
  letterSign: "Pro: Refki",

  // BGM
  bgmUrl: '/audio/hari_ini.mp3',        // Lagu utama galeri
  bgmEndUrl: '/audio/kamu.mp3', // Lagu ending (opsional, kalau kosong pakai bgm utama)

  // KADO
  webhookUrl: "https://api.whatsapp.com/send?phone=6282176032925&text=Sayang,+aku+udah+tiup+lilinnya!+Mana+kado+aku%3F",

  // EASTER EGG
  easterEggText: "I hid this here because I knew you'd explore everything.\nYou're amazing. I love you. 💛",
  easterEggPosition: [-4.8, 1.2, -3], // Hidden on left wall near entrance
}

export const useStore = create((set) => ({
  config: appConfig,
  controlMode: 'guided',
  currentWaypoint: 0,
  maxWaypoints: appConfig.photos.length + 2, // +1 untuk Depan Pintu, +1 untuk Cake di Secret Room
  candleBlown: false,
  showLetter: false,
  focusedPhoto: null,
  isUnlocked: false,
  isSecretRoomUnlocked: false, // State untuk Secret Door
  isModeSelected: false,
  isMuted: false,
  lightboxPhoto: null, // Store the full photo object for lightbox
  showEKG: false, // State for manual EKG trigger

  unlock: () => set({ isUnlocked: true }),
  unlockSecretRoom: () => set({ isSecretRoomUnlocked: true }),
  setModeSelected: (selected) => set({ isModeSelected: selected }),
  setControlMode: (mode) => set({ controlMode: mode }),
  nextWaypoint: () => set((state) => ({
    currentWaypoint: Math.min(state.currentWaypoint + 1, state.maxWaypoints)
  })),
  prevWaypoint: () => set((state) => ({
    currentWaypoint: Math.max(state.currentWaypoint - 1, 0)
  })),
  setCandleBlown: (blown) => set({ candleBlown: blown }),
  setShowLetter: (show) => set({ showLetter: show }),
  setFocusedPhoto: (id) => set({ focusedPhoto: id }),
  setLightboxPhoto: (photo) => set({ lightboxPhoto: photo }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setShowEKG: (val) => set({ showEKG: val }),
}))
