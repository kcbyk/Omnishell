# ⚡ SPCK Web IDE - Mobile & Desktop Code Studio

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Live Sandbox](https://img.shields.io/badge/Sandbox-Live_Iframe-00FF66)](https://github.com)

> **Spck Editor tarzında, hem mobilde hem masaüstünde çalışan, sıfır gecikmeli, canlı kod önizleme ve DevTools konsoluna sahip Web IDE.**

---

## 🔥 Gerçekten Çalışan Özellikler

1. 📂 **Çoklu Dosya Proje Yöneticisi (File Explorer)**:
   * `.html`, `.css`, `.js`, `.json`, `.md` dosyaları oluşturma, yeniden adlandırma, silme ve düzenleme.
   * Sekmeli dosya gezgini (Tabs bar) ile açık dosyalar arasında hızlı geçiş.

2. ⌨️ **Spck Mobil Hızlı Klavye Çubuğu (Accessory Bar)**:
   * Telefondayken kod yazmayı kolaylaştıran özel sembol çubuğu: `< > / { } [ ] ( ) = " ' ; : $ ! & | + - * ?`.
   * `Tab` girintisi (2 boşluk ekleme), `Undo` (Geri al) ve `Redo` (İleri al) düğmeleri.

3. 🚀 **Canlı Sandboxed Önizleme (Live Preview Sandbox)**:
   * HTML, CSS ve JavaScript kodlarını anında izole iframe içinde çalıştırır.
   * **Cihaz Görünüm Değiştirici**: Mobil (375px), Tablet (768px) ve Masaüstü (100%) boyutları arasında tek tıkla geçiş.
   * Önizlemeyi ayrı tarayıcı sekmesinde açma desteği.

4. 📟 **Entegre DevTools Konsolu (Console REPL)**:
   * Iframe içindeki `console.log`, `console.warn`, `console.error` çıktılarını yakalar ve ekranda gösterir.
   * Canlı JavaScript REPL komut satırı (`> 2 + 2`, `> document.title`).

5. 📦 **Hazır Başlangıç Şablonları (Starter Templates)**:
   * **Cyber Matrix Rain Animation**: HTML5 Canvas Matrix dijital yağmur efekti.
   * **Neon Paddle & Ball Arcade Game**: Dokunmatik kontrollü 60 FPS Canvas oyunu.
   * **Modern Glassmorphic QuickTask**: Tailwind CDN + LocalStorage görev yöneticisi.

6. 💾 **Otomatik Kaydetme & ZIP Dışa Aktarma**:
   * Yazdığın kodlar tarayıcı `localStorage` içinde anlık saklanır, sayfa yenilense bile kaybolmaz.
   * Projeni tek tıkla `.zip` arşivi olarak bilgisayarına/telefonuna indirebilirsin.

---

## 🛠️ Yerel Geliştirme

```bash
# Paketleri yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Canlı derleme (Production)
npm run build
npm run start
```

---

## 🌐 Vercel / Netlify Canlı Dağıtım
Proje doğrudan Vercel, Netlify veya Cloudflare Pages üzerine aktarılıp tek tıkla yayına alınabilir.
