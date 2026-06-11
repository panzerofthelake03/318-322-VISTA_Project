# Vista Air 2 — Expo Uygulama Yol Haritası

Tasarım referansı: `screen_design_imgs/sc1–sc18`
Teknik temel: Expo SDK 56 · TypeScript · React Navigation · Zustand · AsyncStorage

---

## Renk & Tema Paleti

| Token | Hex | Kullanım |
|---|---|---|
| `coral` | `#C17155` | Primary CTA, aktif tab, vurgu |
| `coralLight` | `#F5EBE6` | Seçili kart arkaplanı, chip seçili |
| `green` | `#5B8C5A` | AQI iyi, "Mükemmel", başarı |
| `greenLight` | `#E8F1E7` | AQI iyi kartı arkaplanı |
| `amber` | `#D4A017` | CO2 uyarısı, orta seviye |
| `amberLight` | `#FDF3DC` | CO2 uyarı kartı arkaplanı |
| `red` | `#C0392B` | PM2.5 alarm, kritik |
| `redLight` | `#FDE8E6` | Alarm kartı arkaplanı |
| `bg` | `#FAFAF8` | Genel ekran arkaplanı |
| `surface` | `#F2F0EB` | Kart / input arkaplanı |
| `textPrimary` | `#1A1A1A` | Ana başlık |
| `textSecondary` | `#888880` | Alt başlık, etiket |
| `border` | `#E5E3DC` | Ayırıcı çizgi |

---

## Faz 0 — Proje İskeleti

**Hedef:** Boş Expo projesi çalışır hale getirilir.

- [ ] `npx create-expo-app vista-app2 --template blank-typescript`
- [ ] Bağımlılıkları kur:
  ```
  npx expo install expo-haptics expo-status-bar react-native-safe-area-context
  npx expo install @react-native-async-storage/async-storage
  npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
  npx expo install react-native-screens react-native-gesture-handler
  npm install zustand
  npm install @expo/vector-icons
  ```
- [ ] `src/theme/index.ts` — renk/spacing/font token'ları
- [ ] `src/data/mockDevice.ts` — vista-app'ten taşı, `temperature` ve `petMode` alanları ekle
- [ ] `src/store/authStore.ts` — `isLoggedIn`, `login()`, `logout()`
- [ ] `src/store/onboardingStore.ts` — `isOnboardingComplete`, kullanıcı profili
- [ ] `src/store/deviceStore.ts` — AQI, PM2.5, CO2, nem, sıcaklık, fan hızı, mod, filtre ömrü
- [ ] `src/store/notificationStore.ts` — bildirim listesi, okunmadı sayısı
- [ ] `App.tsx` → `RootNavigator` bağlantısı

---

## Faz 1 — Auth Akışı (sc1–sc3)

**Ekranlar:** Karşılama · Giriş Yap · Kayıt Ol

### sc1 — Karşılama
- [ ] Vista Air logosu (SVG veya png asset)
- [ ] "Temiz hava, güvenli büyüme" alt başlık
- [ ] **Başla** coral CTA butonu → Kayıt Ol ekranına
- [ ] "Zaten hesabın var? Giriş yap" link satırı → Giriş Yap ekranına

### sc2 — Giriş Yap
- [ ] "Sunrise Air / Hoş geldin" başlık
- [ ] Apple ile giriş yap butonu (icon + metin, `surface` arkaplan)
- [ ] Google ile giriş yap butonu
- [ ] `veya` ayırıcı
- [ ] E-posta + Şifre (Gizle toggle) input alanları
- [ ] "Şifreni mi unuttun?" link
- [ ] **Giriş yap** CTA → mock login, `authStore.login()` tetikle
- [ ] "Hesabın yok mu? Kayıt ol" link

### sc3 — Kayıt Ol
- [ ] Apple / Google ile kayıt ol butonları
- [ ] Ad soyad + E-posta + Şifre oluştur form
- [ ] **Kayıt ol** CTA → mock kayıt, Cihaz Eşleştir ekranına geç
- [ ] "Zaten hesabın var mı? Giriş yap" link

### Auth Navigatörü
- [ ] `AuthNavigator` (native stack): Karşılama → GirişYap ↔ KayıtOl
- [ ] `RootNavigator`: `isLoggedIn && isOnboardingComplete` → App stack, yoksa Auth stack

---

## Faz 2 — Cihaz Eşleştirme (sc4–sc5)

**Ekranlar:** QR Eşleştir (bağlanıyor) · QR Eşleştir (bağlandı)

### sc4 — QR Tarama (Bağlanıyor)
- [ ] Geri butonu + "Cihaz eşleştir" başlık
- [ ] QR viewfinder: köşe bracket'leri ile `surface` arkaplan kart
- [ ] Durum satırı: sarı nokta + "Bağlanıyor..." (pulse animasyonu)
- [ ] **AI Asistan** info kartı: coral icon + "Merhaba! QR kodu okumamı bekle."
- [ ] **Manuel gir** secondary CTA (alt kısım)
- [ ] 2 saniye sonra otomatik "Bağlandı" state'ine geç (mock)

### sc5 — QR Tarama (Bağlandı)
- [ ] Aynı viewfinder
- [ ] Durum satırı: yeşil ✓ çember + "Bağlandı" (`greenLight` arkaplan)
- [ ] 1 saniye sonra Onboarding akışına geç

---

## Faz 3 — Onboarding Akışı (sc6–sc10)

**Ekranlar:** 4 adım wizard + Kurulum Tamamla

Ortak bileşen: `OnboardingLayout` — Geri butonu, kırmızı progress bar (1/4…4/4), başlık+alt başlık, Devam CTA

### sc6 — Adım 1/4: Kullanıcı Profili
- [ ] 4 seçenek kartı (tek seçim): Bebek/Küçük çocuk · Çocuk · Yetişkin · Yaşlı birey
- [ ] Seçili: `coralLight` arkaplan + coral icon
- [ ] Seçilmemişler: `surface` arkaplan, gri icon

### sc7 — Adım 2/4: Sağlık Durumu
- [ ] Chip multi-select: Astım · Alerji · KOAH · Polen has. · Toz alerjisi · Deri hassas. · Kalp hastalığı · Hiçbiri
- [ ] Seçili chip: coral border + açık coral fill
- [ ] "Hiçbiri" seçilince diğerleri temizlenir

### sv8 — Adım 3/4: Oda Tipi
- [ ] 4 seçenek kartı (tek seçim): Çocuk odası · Oturma odası · Mutfak · Ofis
- [ ] Her seçenekte ikon + başlık + açıklama

### sc9 — Adım 4/4: Evcil Hayvan
- [ ] 2 seçenek kartı: "Evet, kedi/köpek var" (+ "Tüy ve koku modu için" alt başlık) · "Hayır, yok"
- [ ] Seçili: `coralLight` + coral border
- [ ] **Kurulumu tamamla** CTA → sc10'a geç, `onboardingStore.completeOnboarding()`

### sc10 — Kurulum Tamamlandı
- [ ] Yeşil ✓ dairesi (animasyonlu pop)
- [ ] "Hazır, Ada!" başlık
- [ ] Özet tablo: Filtre tipi · PM eşiği · Oda · Profil (coral renkli değer)
- [ ] **Ana ekrana git** CTA → `isOnboardingComplete = true`, App stack'e geç

---

## Faz 4 — Navigasyon Altyapısı

- [ ] `AppNavigator` — BottomTabs: **Ana sayfa** · **Grafik** · **Kontrol** · **Ayarlar**
- [ ] Tab ikonları: `home` · `stats-chart` · `options` · `settings-outline` (Ionicons)
- [ ] Aktif tab: coral renk, inactive: gri
- [ ] `RootNavigator` — Auth stack / App stack koşullu render (Zustand'dan okur)
- [ ] Bildirimler ekranı → Ayarlar tab'ından veya header icon ile açılan native-stack modal

---

## Faz 5 — Ana Sayfa (sc11 Normal · sc12 Alarm)

### AQI Özet Kartı (sc11)
- [ ] Sol: AQI sayısı (büyük) + "AQI · Temiz hava" + renk durumu rozeti ("Mükemmel" yeşil)
- [ ] Sol üst: yeşil hedef ikonu (animated pulse normal modda)
- [ ] Metrik grid (3 sütun): PM2.5 · CO2 · Nem
- [ ] Arkaplan: `greenLight` normal, `redLight` alarm, `amberLight` orta

### Bilgi Grid (sc11 alt)
- [ ] 2×2 kart grid: Sıcaklık · Fan hızı · Filtre ömrü · Çalışma süresi
- [ ] Her kart: başlık + büyük değer + küçük alt açıklama

### Alarm Durumu (sc12)
- [ ] Header: "Uyarı var" coral + oda adı
- [ ] AQI kartı kırmızı, uyarı ikonu, "PM2.5: 68 μg · Ada için kritik"
- [ ] **Max güce geç** + **Yoksay** butonları (yan yana)
- [ ] CO2 uyarı kartı: amber, "1100 ppm · havalandırma önerilir", "Çözüm önerilerini gör →"
- [ ] Genişletilmiş metrik grid (2×2): PM2.5 · CO2 · Sıcaklık · Fan hızı — limit değerleriyle
- [ ] Filtre ömrü + Çalışma süresi alt kısım

### Hızlı Kontrol (sc12 alt)
- [ ] Mod chip'leri: **Otomatik** · Uyku · Manuel (aktif: coral dolu)

### Genel
- [ ] Header: "Günaydın / [Oda adı]" + Avatar butonu (Profiller'e açılır)
- [ ] Avatar: profil baş harfi, `surface` arkaplan

---

## Faz 6 — Grafik Ekranı (sc14)

- [ ] "Grafik" başlık + batarya/wifi ikonları (status area)
- [ ] **AQI — [Ay Yıl]** bölümü
  - [ ] Hafta / Ay toggle (coral aktif pill)
  - [ ] Bar chart: her gün bir çubuk, kırmızı = eşik aşımı, yeşil = iyi
  - [ ] Seçili çubuk: koyu + değer etiketi üstünde
- [ ] **PM2.5 · 24 saat** bölümü
  - [ ] Line chart (area fill): amber line + `amberLight` fill
  - [ ] "maks 32μg" ve "eşik" referans çizgisi
  - [ ] X ekseni: 00:00 · 06:00 · 12:00 · 18:00
- [ ] Özet kartlar (3 sütun): Temiz gün % · Ort. AQI · Çalışma süresi

---

## Faz 7 — Kontrol Ekranı (sc16)

- [ ] Mod butonları: Otomatik · Uyku · Manuel (büyük, rounded, aktif coral)
- [ ] **Fan hızı** — 4 seçenek: 1 Sessiz · 2 Normal · 3 Güçlü · 4 Max (seçili: green fill)
- [ ] 2 kolon bilgi satırı:
  - Sol: **Su Seviyesi** — dikdörtgen su seviyesi animasyonu (%45 mavi)
  - Sağ: **Nem Seviyesi** — değer + "Kontrol et →" link
- [ ] **Hava Akışı** — 4 segment seçici (1–4)
- [ ] **Işık** — toggle + renk paleti (gradient swatch) + 3 preset pill: Sunrise · Sunset · Moonlight
- [ ] **Ayarlar** toggle listesi:
  - Gece modu (orb söner, fan 1 kademe)
  - Bebek hassasiyeti (PM1.0 algılama aktif)
  - VOC alarmı (kimyasal gaz bildirimi)
  - Otomatik program

---

## Faz 8 — Ayarlar Ekranı (sc17)

- [ ] Header: "Ayarlar" + avatar ikonu (→ Profiller)
- [ ] **UYGULAMA** section:
  - Dil (Türkçe, chevron)
  - Birimler °C / °F (Celsius, chevron)
  - Gizlilik & Güvenlik (chevron)
  - Konum İzni (toggle, açık)
  - Veri Paylaşımı (chevron)
- [ ] **BİLDİRİMLER** section:
  - PM2.5 Alarmı toggle + "Eşik aşıldında bildir" alt başlık
  - CO2 Uyarısı toggle + "1000 ppm üzerinde"
  - Filtre Değişimi toggle + "%20 altına düştüğünde"
  - Cihaz Bilgileri (serial number, chevron)
  - Yardım ve Destek (chevron)
- [ ] Bildirimler satırına tıklayınca sc18'e navigate

---

## Faz 9 — Bildirimler Ekranı (sc18)

- [ ] Header: "← Geri · Bildirimler · Tümünü sil"
- [ ] Tarih grupları: **Bugün** / **Dün**
- [ ] Bildirim kartı tipleri:
  - `pm25` — kırmızı sol border, "PM2.5 alarm · Ada", CTA link
  - `co2` — amber sol border, "CO₂ yüksek", CTA link
  - `report` — yeşil/nötr sol border, "Sabah raporu"
  - `filter` — amber sol border, "Ön filtre uyarısı", CTA link
  - `mode` — gri sol border, "Uyku modu aktif"
- [ ] "Tümünü sil" → `notificationStore` temizle

---

## Faz 10 — Profiller Ekranı (sc13)

- [ ] Header: "← Geri · Profiller"
- [ ] **Aktif profil kartı** (Ada):
  - Avatar initial + yeşil online dot + "Temiz" rozeti
  - "4 yaş · aktif profil" + AQI/Fan/PM2.5 özet
  - Yeşil progress bar (AQI görsel)
  - Health toggles: Astım riski modu · Polen filtresi · Toz hassasiyeti
- [ ] **İkincil profil kartı** (Emre): avatar + "36 yaş · ebeveyn" + AQI özetli basit kart
- [ ] **"+ Cihaz ekle"** satırı → QR akışına yönlendir

---

## Faz 11 — Filtre Yönetimi Ekranı (sc15)

- [ ] Header: "← Geri · Filtre · Geçmiş"
- [ ] Büyük dairesel progress (stroke circle, yeşil): **%87** + "kalan"
- [ ] "Filtre sağlıklı · ~4 ay kaldı" alt başlık (yeşil)
- [ ] 3 kolon özet: HEPA H13 %87 · Ön filtre %45 (amber) · Karbon %72
- [ ] **Filtre bilgisi** liste:
  - HEPA H13 (Ada) — 87%
  - Aktif karbon — 72%
  - Ön filtre — 45% (amber, dikkat rengi)
  - Toplam çalışma — 312 saat
- [ ] **Filtre sipariş ver** coral CTA butonu
- [ ] Ayarlar → Cihaz Bilgileri'nden veya Kontrol sekmesinden erişim

---

## Faz 12 — Dokunuş & Animasyon Cilası

- [ ] `RipplePressable` bileşeni (vista-app'ten taşı) — tüm tıklanabilir satırlarda
- [ ] `expo-haptics` — `Light` tüm butonlarda, `Medium` mod değişiminde, `Success notification` kurulum tamamlandığında
- [ ] Onboarding progress bar geçiş animasyonu (`Animated.timing`)
- [ ] QR viewfinder köşe bracket pulse animasyonu
- [ ] "Bağlandı" durumu: scale+fade in animasyonu
- [ ] Setup complete: checkmark dairesi pop animasyonu (`spring`)
- [ ] AQI kartı yeşil hedef ikonu: hafif pulse (`loop Animated`)
- [ ] Su seviyesi fill animasyonu (`Animated.timing`, height)
- [ ] Renk paleti swatch: `TouchableOpacity` + seçili border animasyonu

---

## Faz 13 — Kalite & Test

- [ ] TypeScript strict mod — tüm `any` temizle
- [ ] Tüm dokunma hedefleri ≥ 44pt
- [ ] SafeAreaView tüm ekranlarda
- [ ] Expo Go'da iOS + Android test
- [ ] Geriye dön (Android hardware back) davranışları
- [ ] `AsyncStorage` ile auth + onboarding kalıcılığı doğrula
- [ ] Dark mode uyumu (opsiyonel)

---

## Ekran → Faz Özet Tablosu

| Frame | Ekran | Faz |
|---|---|---|
| sc1 | Karşılama | 1 |
| sc2 | Giriş Yap | 1 |
| sc3 | Kayıt Ol | 1 |
| sc4 | QR Eşleştir — Bağlanıyor | 2 |
| sc5 | QR Eşleştir — Bağlandı | 2 |
| sc6 | Onboarding 1/4 — Kullanıcı Profili | 3 |
| sc7 | Onboarding 2/4 — Sağlık Durumu | 3 |
| sv8 | Onboarding 3/4 — Oda Tipi | 3 |
| sc9 | Onboarding 4/4 — Evcil Hayvan | 3 |
| sc10 | Kurulum Tamamlandı | 3 |
| sc11 | Ana Sayfa — Normal | 5 |
| sc12 | Ana Sayfa — Alarm | 5 |
| sc13 | Profiller | 10 |
| sc14 | Grafik | 6 |
| sc15 | Filtre Yönetimi | 11 |
| sc16 | Kontrol | 7 |
| sc17 | Ayarlar | 8 |
| sc18 | Bildirimler | 9 |
