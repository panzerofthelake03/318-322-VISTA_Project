# VISTA — Expo Uygulama Geliştirme To-Do

Figma tasarımına (9 frame) dayalı Expo/React Native implementasyon planı.

---

## Faz 0 — Proje Kurulumu ✅

- [x] `npx create-expo-app vista-app --template blank-typescript` ile proje oluşturuldu
- [x] Klasör yapısı kuruldu:
  ```
  src/
    screens/
    components/
    navigation/
    theme/
    hooks/
    store/
    data/
  ```
- [x] Bağımlılıklar yüklendi:
  - `@react-navigation/native` + `@react-navigation/native-stack` + `@react-navigation/bottom-tabs`
  - `expo-status-bar`
  - `react-native-safe-area-context`
  - `react-native-screens`
  - `react-native-gesture-handler`
  - `zustand`
  - `@expo/vector-icons`
  - `@react-native-async-storage/async-storage` (npx expo install ile SDK uyumlu versiyon)

---

## Faz 1 — Tema & Design Tokens ✅

- [x] `src/theme/colors.ts` oluşturuldu (coral, green, amber, red, neutrals)
- [x] `src/theme/typography.ts` oluşturuldu (fontSize, fontWeight, lineHeight)
- [x] `src/theme/spacing.ts` oluşturuldu (4pt grid + border radius sabitleri)
- [x] `src/theme/index.ts` ile tek noktadan export

---

## Faz 2 — Ortak Bileşenler (components/) ✅

- [x] **PrimaryButton** — coral, tam genişlik, disabled desteği
- [x] **SecondaryButton** — sadece border, şeffaf arka plan
- [x] **SelectionCard** — icon + title + subtitle, seçili/seçisiz durumu (Frame 2 & 7)
- [x] **ChipSelector** — wrap layout, coral seçili durum (Frame 3)
- [x] **SelectedChipsFeedback** — dinamik seçim özet kutusu (Frame 3)
- [x] **ToggleRow** — Switch ile rutin satırı (Frame 8)
- [x] **ProgressBar** — label + animasyonsuz bar, %50 altı otomatik kırmızı (Frame 6)
- [x] **AQICard** — büyük AQI sayısı, status'a göre renk (Frame 4 & 5)
- [x] **MetricGrid** — 3'lü metrik satırı, highlight desteği (Frame 4 & 5)
- [x] **FanSpeedSelector** — 1/2/3/Max toggle (Frame 4)
- [x] **RoomListItem** — oda adı + AQI + renkli badge (Frame 4)
- [x] **ActionCard** — active/passive ikon kart (Frame 5)
- [x] **AlertBanner** — kırmızı sol border'lı uyarı şeridi (Frame 5)
- [x] **OnboardingProgressBar** — adım/toplam ilerleme çubuğu (Frame 2,3,7,8)
- [x] `src/components/index.ts` — tek noktadan export

> Not: BottomNavBar `@react-navigation/bottom-tabs` ile AppNavigator içinde native olarak uygulandı.

---

## Faz 3 — Ekranlar (screens/) ✅

- [x] **WelcomeScreen** — logo placeholder, Başlayalım / Şimdi atla (Frame 1)
- [x] **OnboardingStep1Screen** — kullanıcı profili çoklu seçim, Zustand'a kayıt (Frame 2)
- [x] **OnboardingStep2Screen** — sağlık durumu chip seçimi, "Hiçbiri" exclusive logic (Frame 3)
- [x] **OnboardingStep3Screen** — oda konumu tekli seçim, disabled Devam (Frame 7)
- [x] **OnboardingStep4Screen** — günlük rutin toggleları (Frame 8)
- [x] **SetupCompleteScreen** — fade-in animasyonu, özet kartı, AsyncStorage flag (Frame 9)
- [x] **DashboardScreen** — normal + alert koşullu render, dev simülasyon butonu (Frame 4 & 5)
- [x] **FilterManagementScreen** — dairesel gösterge, ProgressBar detayı, uyarı kutusu (Frame 6)
- [x] **PlaceholderScreen** — İstatistik / Uyarılar / Profil için

---

## Faz 4 — Navigasyon Yapısı ✅

- [x] `src/navigation/OnboardingNavigator.tsx` — NativeStack (Welcome→Step1→2→3→4→SetupComplete)
- [x] `src/navigation/AppNavigator.tsx` — BottomTabs (Home/İstatistik/Kontrol/Uyarılar/Profil), alert badge
- [x] `src/navigation/RootNavigator.tsx` — AsyncStorage flag'e göre Onboarding/App yönlendirme
- [x] `App.tsx` — SafeAreaProvider + StatusBar + RootNavigator
- [x] **Bug fix:** SetupComplete'den App'e geçişte `nav.getParent()?.dispatch(reset)` ile RootNavigator hedeflendi

---

## Faz 5 — State Management (Zustand) ✅

- [x] `src/store/onboardingStore.ts` — userProfiles, healthConditions, roomType, routines, profileName, filterType, pmThreshold
- [x] `src/store/deviceStore.ts` — aqi, pm25, co2, humidity, voc, fanSpeed, mode, isAlertActive, filters, rooms
- [x] `simulateAlert()` ve `clearAlert()` aksiyonları ile dashboard'da toggle test edildi

---

## Faz 6 — Mock Data & Simülasyon ⬜

- [ ] `src/data/mockDevice.ts` — ayrı mock dosyası (şu an deviceStore içinde tanımlı)
- [ ] Dashboard'daki dev butonunu `__DEV__` flag'i arkasına al (prod'da gizlensin)

---

## Faz 7 — Detay & Cilalama ⬜

- [ ] iOS safe area testi (notch + home indicator)
- [ ] Tüm butonlarda 44×44pt minimum dokunma alanı kontrolü
- [ ] Alert durumunda status bar rengi kırmızıya çevir (`expo-status-bar`)
- [ ] SetupCompleteScreen'den `useNavigation` yerine props `navigation` kullanımını standartlaştır
- [ ] Türkçe karakter testi (ş, ğ, ü, ö, ı, ç) tüm ekranlarda
- [ ] İstatistik, Uyarılar, Profil ekranlarını gerçek içerikle doldur

---

## Ekran Listesi Özeti

| # | Ekran | Frame | Durum |
|---|-------|-------|-------|
| 1 | WelcomeScreen | Frame 1 | ✅ |
| 2 | OnboardingStep1 — Profil | Frame 2 | ✅ |
| 3 | OnboardingStep2 — Sağlık | Frame 3 | ✅ |
| 4 | OnboardingStep3 — Oda | Frame 7 | ✅ |
| 5 | OnboardingStep4 — Rutin | Frame 8 | ✅ |
| 6 | SetupCompleteScreen | Frame 9 | ✅ |
| 7 | DashboardScreen (normal) | Frame 4 | ✅ |
| 8 | DashboardScreen (alert) | Frame 5 | ✅ |
| 9 | FilterManagementScreen | Frame 6 | ✅ |
| 10 | İstatistik | — | ⬜ Placeholder |
| 11 | Uyarılar | — | ⬜ Placeholder |
| 12 | Profil | — | ⬜ Placeholder |

---

## Bileşen Listesi Özeti

| Bileşen | Kullanıldığı Ekranlar | Durum |
|---------|----------------------|-------|
| PrimaryButton | Tümü | ✅ |
| SecondaryButton | Welcome | ✅ |
| SelectionCard | Step1, Step3 | ✅ |
| ChipSelector | Step2 | ✅ |
| SelectedChipsFeedback | Step2 | ✅ |
| ToggleRow | Step4 | ✅ |
| ProgressBar | FilterManagement | ✅ |
| AQICard | Dashboard | ✅ |
| MetricGrid | Dashboard | ✅ |
| FanSpeedSelector | Dashboard | ✅ |
| RoomListItem | Dashboard | ✅ |
| ActionCard | Dashboard (alert) | ✅ |
| AlertBanner | Dashboard (alert) | ✅ |
| OnboardingProgressBar | Step1–4 | ✅ |
| BottomNavBar (native) | App navigator | ✅ |
