# Decision Log — Grafik Sayfası Düzenlemeleri

Tarih: 12 Haziran 2026

Bu doküman, Grafik sayfasını (GraphScreen) hedef tasarıma yaklaştırmak için yapılan değişiklikleri ve alınan kararları kaydeder.

---

## 1. Çizgi grafiği için `react-native-svg` paketine geçildi

**Sorun:** PM2.5 çizgi grafiği, döndürülmüş `View` parçaları ve dikdörtgen bloklarla taklit ediliyordu; çizgi kırıklı, alan dolgusu basamaklı görünüyordu.

**Karar:** `npx expo install react-native-svg` ile SVG paketi eklendi ve `LineChart` bileşeni gerçek SVG öğeleriyle (`Polyline`, `Polygon`, `Line`, `Circle`) yeniden yazıldı.

**Sonuç:**
- Düzgün çizgi (`Polyline`) + altında alan dolgusu (`Polygon`, açık sarı)
- Kesikli "eşik" çizgisi (15 μg, `strokeDasharray`)
- Tepe noktasına sabitlenen "maks 32μg" etiketi
- Saat ekseni etiketleri: 00:00 / 06:00 / 12:00 / 18:00

**Not:** Expo Go `react-native-svg`'yi içerdiği için ek native build gerekmedi; sadece dev sunucusunu yeniden başlatmak yeterli.

---

## 2. Bar grafiği (AQI) tasarıma uyarlandı

**Sorun:** Barlar tam dolu renk bloklarıydı; değer etiketi yalnızca seçili günde vardı ve görünüm hedef tasarımdan uzaktı.

**Karar:** Tasarımdaki bar stili uygulandı:
- Her barın üstünde değer etiketi
- Bar gövdesi açık renk dolgu + üstte 4px koyu renk şerit (cap)
- Renkler AQI değerine göre: ≤50 yeşil, 51–100 sarı (amber), >100 kırmızı
- En yüksek değerli bar vurgulanıyor (etiket ve gün adı bar renginde)
- Sabit "Çrş seçili" mantığı kaldırıldı; vurgu veriden (maksimum değer) türetiliyor

---

## 3. Hafta / Ay butonları işlevsel hale getirildi

**Sorun:** "Hafta" ve "Ay" butonları state'i değiştiriyordu ama grafik hep aynı haftalık veriyi gösteriyordu.

**Karar:**
- `src/data/mockDevice.ts` dosyasına `monthlyAQI` mock verisi eklendi (4 haftalık ortalama: "1. Hf" – "4. Hf")
- **Hafta:** son 7 gün, günlük barlar (Pzt–Pzr), başlık "AQI · {Ay Yıl}"
- **Ay:** son 30 gün, 4 haftalık bar, başlık "AQI · Son 30 gün"
- "ort. AQI" alt başlığı ve alttaki "Ort. AQI" metrik kutusu seçilen döneme göre yeniden hesaplanıyor

---

## 4. Görsel stil kararları

- Grafiklerin etrafındaki kart kutusu (`chartContainer`) kaldırıldı; tasarımdaki gibi düz zemine alındı, AQI ve PM2.5 bölümleri arasına ince ayırıcı çizgi (divider) eklendi.
- Aktif dönem butonu stili dolu turuncudan, tasarımdaki gibi açık mercan zemin + mercan yazıya çevrildi.
- "Temiz gün / Ort. AQI / Çalışma" metrik kutularına dokunulmadı (kullanıcı isteği: değişmeyecek).

---

## 5. İçerik sayfaya yayıldı (boşluk sorunu)

**Sorun:** Metrik kutuları ile alt tab çubuğu arasında büyük boş alan kalıyordu.

**Karar:**
- `scrollContent` stiline `flexGrow: 1` ve `justifyContent: 'space-between'` eklendi → içerik ekran yüksekliğine dağılıyor, metrik kutuları sayfanın altına oturuyor.
- Grafik yükseklikleri artırıldı: bar grafiği 140→170 px, çizgi grafiği 130→150 px.
- Küçük ekranlarda içerik sığmazsa sayfa kaydırılabilir kalıyor (`flexGrow` scroll davranışını bozmuyor).

---

## Değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `src/screens/app/GraphScreen.tsx` | Bar ve çizgi grafiği yeniden yazıldı, Hafta/Ay işlevi, sayfa yerleşimi |
| `src/data/mockDevice.ts` | `monthlyAQI` mock verisi eklendi |
| `package.json` | `react-native-svg` bağımlılığı eklendi |
