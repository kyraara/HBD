import { create } from 'zustand'
import * as THREE from 'three'

const appConfig = {
  // ACCESS GATE
  secretPassword: "0804",
  passwordHint: "Enter 4-digit master_key to decrypt...",
  birthdayDate: "2026-04-26T00:00:00",

  // GALLERY — Photo Frames
  photos: [
    { id: 1, url: '/images/gambar1.png', audioUrl: '/audio/pembohong.mp3', text: 'init_commit.jpg', memory: 'Waktu itu project pertama yang kita bikin bareng inget gak? Walaupun berantem mulu tapi lucu', position: [4.9, 1.8, -6], rotation: [0, -Math.PI / 2, 0] },
    { id: 2, url: '/images/gambar2.png', audioUrl: '/audio/p2.mp3', text: 'second_push.jpg', memory: 'Project kedua kita, waktu kamu pusing bikin web GIS ini dan kita selesaikan berdua.', position: [-4.9, 1.8, -13], rotation: [0, Math.PI / 2, 0] },
    { id: 3, url: '/images/gambar3.jpeg', audioUrl: '/audio/p1.mp3', text: 'feature_branch.jpg', memory: 'Kamu yang mulai duluan loh wkwkwk.', position: [4.9, 1.8, -20], rotation: [0, -Math.PI / 2, 0] },
    { id: 4, url: '/images/dummy_4_1775657172282.png', audioUrl: '/audio/tes.ogg', text: 'milestone_v1.0.jpg', memory: 'Dan setiap momen kecil bersamamu, layak untuk dirayakan.', position: [-4.9, 1.8, -27], rotation: [0, Math.PI / 2, 0] }
  ],

  // TERMINAL LETTER (git commit log style)
  letterTitle: "git log --oneline",
  letterAuthor: "Refki <refki@heart.dev>",
  letterCommitHash: "a8f04d2",
  letterCommitMsg: "fix(heart): patch vulnerability to you",
  letterBody: "Selamat ulang tahun, Bintang.\n\nDi usia yang baru ini, aku harap semua error dan bug dalam hidup kamu bisa ter-resolve dengan baik, dan semua mimpimu sukses di-deploy jadi kenyataan.\n\nSemangat terus ya ngerjain skripsinya! Anggap aja lagi nge-debug code, pelan-pelan tapi pasti bakal nemu jalan keluarnya dan cepet lulus.\n\nVirtual room ini, repository ini, cuma sebagian kecil dari rasa sayang aku ke kamu. Jalan kita masih panjang, dan aku pengen kita terus 'commit' dan bikin memori indah bareng-bareng.\n\nI love you.",
  letterSignOff: "Signed-off-by: Refki",
  // Legacy compat
  letterPatient: "@to: Bintang Aprilia",
  letterDiagnosis: "commit: fix(heart): patch vulnerability to you",
  letterText: "Selamat ulang tahun, Bintang.\n\nDi usia yang baru ini, aku harap semua error dan bug dalam hidup kamu bisa ter-resolve dengan baik, dan semua mimpimu sukses di-deploy jadi kenyataan.\n\nSemangat terus ya ngerjain skripsinya! Anggap aja lagi nge-debug code, pelan-pelan tapi pasti bakal nemu jalan keluarnya dan cepet lulus.\n\nVirtual room ini, repository ini, cuma sebagian kecil dari rasa sayang aku ke kamu. Jalan kita masih panjang, dan aku pengen kita terus 'commit' dan bikin memori indah bareng-bareng.\n\nI love you.",
  letterSign: "Signed-off-by: Refki",

  // BGM
  bgmUrl: '/audio/hari_ini.mp3',
  bgmEndUrl: '/audio/kamu.mp3',
  bgmSecretUrl: '', // Optional: separate BGM for secret room

  // GIFT
  webhookUrl: "https://api.whatsapp.com/send?phone=6282176032925&text=aku+udah+tiup+lilinnya!+Mana+kado+aku%3F",

  // EASTER EGG
  easterEggText: "// TODO: find a way to tell her\n// she means everything to me\n// ...maybe in the next commit 💛",
  easterEggPosition: [-4.8, 1.2, -3],
}

export const useStore = create((set) => ({
  config: appConfig,
  controlMode: 'guided',
  currentWaypoint: 0,
  maxWaypoints: appConfig.photos.length + 2,
  candleBlown: false,
  showLetter: false,
  focusedPhoto: null,
  isUnlocked: false,
  isSecretRoomUnlocked: false,
  isModeSelected: false,
  isMuted: false,
  lightboxPhoto: null,
  showEKG: false,
  curtainOpen: false,

  unlock: () => set({ isUnlocked: true }),
  setCurtainOpen: (val) => set({ curtainOpen: val }),
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
