# 🎵 Spotify Web & Mobile Player (Lossless Audio & Synced Karaoke)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Audio Engine](https://img.shields.io/badge/Audio-HTML5_+_Web_Audio_API-1DB954)](https://spotify.com)

> **Spotify'ın en son sürümündeki birebir arayüz, renk paleti, canlı animasyonlar, dinamik karaoke şarkı sözleri ve çift görünüm desteğine (Mobil + Masaüstü) sahip eksiksiz Web Müzik Çalar.**

---

## 🚀 Öne Çıkan Özellikler (Hepsi %100 Çalışıyor)

### 1. 🎧 **Gerçek Ses & Çalma Motoru (Audio Engine)**
* **Play / Pause / Next / Previous**: Sıralı ve kesintisiz parça geçişi.
* **Scrubber (Zaman Çizelgesi)**: Parça içinde istediğin saniyeye sarma ve canlı süre sayacı (`01:24 / 03:34`).
* **Shuffle & Repeat Modları**: Rastgele çalma, Tümünü tekrarla ve Tek şarkıyı tekrarla modları.
* **Ses Seviyesi & Mute**: Kademeli ses kaydırıcı ve anlık sessize alma.
* **Web Audio API Entegrasyonu**: Ağ kesintisi olsa dahi müzik tonlarını üreten yedekli ses motoru.

### 2. 🎤 **Dinamik Karaoke Şarkı Sözleri (Karaoke Lyrics Engine)**
* Şarkı çaldıkça anlık olarak müzikle **senkronize kayan canlı şarkı sözleri**.
* Şarkı sözlerindeki herhangi bir satıra tıklandığında şarkıyı **doğrudan o saniyeye atlatma** özelliği!
* Albüm kapağının ana rengine göre dinamik olarak renk değiştiren atmosferik tam ekran arka plan.

### 3. 📱 **Mobilde Spotify Uygulama Deneyimi**
* **Yüzen Mini Player (Floating Mini Player)**: Alt menünün üzerinde çalan şarkıyı, albüm resmini ve çalma çubuğunu gösterir.
* **Tam Ekran Müzik Çalar (Fullscreen Player)**: Şarkıya dokunulduğunda açılan büyük albüm kapağı, kalp butonu, sözler kartı ve sıra yöneticisi.
* **Mobil Alt Menü**: Home, Search, Your Library ve Premium sekmeleri.

### 4. 🖥️ **Masaüstü Spotify Deneyimi**
* **Sol Kenar Çubuğu (Sidebar)**: Ana Sayfa, Arama, Kütüphane ve özel çalma listesi oluşturma butonu (+).
* **Alt Oynatıcı Çubuğu (Bottom Player Bar)**: Şarkı detayı, kontrol butonları, ses çubuğu, Sıra ve Şarkı Sözleri kısayolları.
* **Dinamik Gradyanlı Üst Başlık**: Çalan şarkının rengine göre tepedeki ışık süzmesi canlı değişir.

### 5. 🔍 **Canlı Arama & Kategori Keşfi (Search & Browse)**
* Şarkı, sanatçı ve albüm adına göre **anlık filtreleme**.
* Renkli müzik türü kartları (Pop, Hip-Hop, Rock, Lofi, Gaming, Chill, Türkçe Pop).

### 6. ❤️ **Kitaplık & Beğenilen Şarkılar (Library & Liked Songs)**
* Şarkıları kalp simgesiyle favorilere ekleme.
* Özel mor/mavi gradyanlı **"Liked Songs"** çalma listesi.
* Kendi özel çalma listeni oluşturma ve içine şarkı ekleme/silme.
* `localStorage` entegrasyonu: Sayfa yenilense bile favorilerin ve listelerin silinmez!

---

## 🛠️ Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (0.0.0.0:3000)
npm run dev

# Canlı derleme (Production)
npm run build
npm run start
```

---

## 🌐 Vercel / Netlify Canlı Dağıtım
Bu repo doğrudan **[Vercel](https://vercel.com)** veya **Netlify**'a bağlanıp tek tıkla tüm dünyada yayına alınabilir.
