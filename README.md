# ⚡ OMNISHELL / CYBERDECK (Android GodMode Hub)

[![Build & Release APK](https://github.com/your-username/omnishell/actions/workflows/build-apk.yml/badge.svg)](https://github.com/your-username/omnishell/actions/workflows/build-apk.yml)
[![Platform](https://img.shields.io/badge/Platform-Android_14+-00F0FF?logo=android&logoColor=white)](https://android.com)
[![Engine](https://img.shields.io/badge/Engine-Flutter_Impeller-00FF66?logo=flutter&logoColor=white)](https://flutter.dev)
[![Privilege](https://img.shields.io/badge/Privilege-Root_/_Shizuku_/_ADB-FF0055)](https://github.com)

> **"Termux'un saf Linux shell gücü, Shizuku/ADB'nin sistem derinliği ve bilim kurgu filmlerinden fırlamış Cyberpunk bir HUD arayüzü tek bir uygulamada!"**

---

## 📸 Ekranlar ve Modüller

```
 ┌──────────────────────────────────────────────────────────────┐
 │                      OMNISHELL CYBERDECK                     │
 ├──────────────┬──────────────┬──────────────┬─────────────────┤
 │   [ HUD ]    │ [ TERMINAL ] │ [ GODMODE ]  │   [ NETWORK ]   │
 │ Hardware &   │ Interactive  │ Resolution & │  Port Scanner & │
 │ Live Gauges  │ Linux Shell  │ DPI Override │  LAN ARP Recon  │
 ├──────────────┴──────────────┴──────────────┴─────────────────┤
 │   [ PACKAGES ]            [ HARDWARE ]         [ PRIVILEGES] │
 │ Debloat & Freeze     Tactical 30Hz Strobe   ADB Grant Helper │
 └──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Öne Çıkan Özellikler

### 1. ⚡ **Cyber HUD & Canlı Donanım Sayaçları**
* **CPU Yükü, RAM Kullanımı ve Batarya Seviyesi** için neon ışıklı özel dairesel göstergeler.
* Canlı CPU sıcaklığı, Linux çekirdek versiyonu ve çalışma süresi (Uptime).
* Tek dokunuşla çalışan **GodMode Hızlı Aksiyonlar** (RAM Temizleyici, 720p Oyun Çözünürlüğü Modu, DNS Temizliği, Batarya Kalibrasyon Dökümü).

### 2. 🧠 **İnteraktif Bash / Shell Terminali**
* Siyah konsol yerine Matrix yeşili / Cyberpunk renk vurgulu çıktı ekranı.
* Hızlı komut çipleri (`uname -a`, `id`, `dumpsys battery`, `getprop`, `top`, `netstat -tuln`, `df -h`, `ps -ef`, `pm list packages`).
* Komut geçmişi, tek tıkla tüm çıktıyı kopyalama ve temizleme.

### 3. 🛠️ **GodMode Araç Kutusu**
* **Çözünürlük & DPI Canlı Değiştirici (`wm size` / `wm density`)**: Ağır oyunlarda 120+ FPS almak için ekran çözünürlüğünü ve piksel yoğunluğunu anında değiştirin veya fabrika ayarlarına sıfırlayın.
* **Derin Batarya Telemetrisi (`dumpsys battery`)**: Şarj akımı (mA), voltaj (mV) ve pil sağlığı dökümü.
* **Gizli Android Mühendislik Kodları**: `*#*#4636#*#*` gibi test menülerine tek tıkla erişim.

### 4. 🛰️ **Ağ Keşif & Port Tarayıcı (Recon Tooldeck)**
* **Canlı Port Tarayıcı**: Belirtilen IP üzerindeki açık portları (21, 22, 80, 443, 3000, 5555, 8080 vb.) milisaniyelik gecikmeyle tarar.
* **Yerel Ağ (LAN) Tarayıcı**: Wi-Fi üzerindeki tüm bağlı cihazları (Router, IP kameralar, telefonlar) listeler.
* **Ping Plotter**: Canlı gecikme dalga formu grafiği.
* **DNS Recon**: A / AAAA kayıtlarını anında çözer.

### 5. ❄️ **Derin Paket Yöneticisi & Bloatware Dondurucu**
* Xiaomi (MIUI Analytics, MSA Ads), Samsung (Bixby, Pay), Google ve Meta arka plan servislerini tek tıkla dondurun (`pm disable-user`) veya zorla sonlandırın (`am force-stop`).
* Pil ve RAM tasarrufu sağlar.

### 6. 🔦 **Taktiksel Donanım & Sensör Kontrolü**
* **Taktiksel Flaş Strobe**: 1 Hz ile 30 Hz arasında ayarlanabilir çakar flaş modu (dakikada 1800 flaş).
* **Manyetik Alan / EMF Ölçer**: Cihazın manyetometresini kullanarak metal dedektörü ve elektromanyetik alan ölçümü yapar.
* **Işık Ölçer (Lux)** ve **Ekran Yenileme Hızı (120Hz)** denetleyicisi.

---

## 👑 Yetki Seviyeleri ve ADB Kurulumu

Uygulama 3 kademeli yetkiyle çalışır:
1. **Standart Kullanıcı**: Tüm temel araçlar ve güvenli shell komutları çalışır.
2. **Shizuku / Wireless ADB**: Bilgisayarsız ADB ile çözünürlük değiştirme, uygulama dondurma ve logcat özellikleri aktif olur.
3. **SuperUser (Root / Magisk / KernelSU)**: Çekirdek seviyesinde CPU frekans governorları ve tam donanım erişimi açılır.

### ADB İle Tam Yetki Verme (Tek Seferlik - PC veya Shizuku ile):
```bash
adb shell pm grant com.cyberdeck.omnishell android.permission.WRITE_SECURE_SETTINGS
adb shell pm grant com.cyberdeck.omnishell android.permission.PACKAGE_USAGE_STATS
adb shell pm grant com.cyberdeck.omnishell android.permission.DUMP
adb shell pm grant com.cyberdeck.omnishell android.permission.READ_LOGS
adb shell pm grant com.cyberdeck.omnishell android.permission.BATTERY_STATS
```

---

## 📦 GitHub Actions ile APK Oluşturma & İndirme Kılavuzu

Bu repoyu GitHub'a yüklediğinde **GitHub Actions otomatik olarak APK derler**:

### 1. Adım: GitHub'da Yeni Repo Oluştur
* GitHub hesabına gir -> **New repository** de (örn: `omnishell`).

### 2. Adım: Kodları Gönder (Git Push)
Bilgisayarında veya terminalde:
```bash
git init
git add .
git commit -m "feat: Initial Cyberdeck OmniShell v1.0.0"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/omnishell.git
git push -u origin main
```

### 3. Adım: APK'yı İndir!
1. GitHub repondaki **"Actions"** sekmesine tıkla.
2. Otomatik başlayan **"Build & Release Android APK"** iş akışına tıkla (yaklaşık 2-3 dakikada tamamlanır).
3. **Artifacts** bölümünden **`OmniShell-Universal-Release-APK`** dosyasını doğrudan telefonuna indir ve kur!

*(İsteğe bağlı: Bir Git tag'i gönderirsen `git tag v1.0.0 && git push --tags`, GitHub Releases sekmesinde otomatik sürüm yayınlanır!)*

---

## 🛠️ Yerel Geliştirme (Local Run)

```bash
# Bağımlılıkları yükle
flutter pub get

# Cihazda çalıştır (USB Debugging açıkken)
flutter run --release
```
