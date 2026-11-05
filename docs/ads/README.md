# Kullanım — yalnızca taslak

Hiçbir dosya bu çalışma sırasında Google Ads'e yüklenmedi; kampanya oluşturulmadı, açılmadı veya finanse edilmedi. Bu paket manuel inceleme içindir. Google Ads Editor'da içe aktarmak bile yerel kampanya nesneleri oluşturabilir; kullanıcı açıkça başlatana kadar içe aktarmayın ve **Post/Yayınla** kullanmayın.

## Dosyalar

- `campaign-pack-tr.md`: Türkçe reklam metinleri, karakter sayıları, öğeler ve görsel seçimi.
- `ads-editor.csv`: Beş reklam grubu, her son URL için bir duraklatılmış duyarlı arama reklamı.
- `keywords-editor.csv`: Sıralı ve tam eşlemeli anahtar kelimeler; `Criterion Type` eşlemeyi belirler. Metne ayrıca tırnak/köşeli parantez eklemeyin.
- `negatives-editor.csv`: Kampanya düzeyinde negatif sıralı eşleme. Negatifler yakın varyantları otomatik kapsamaz; arama terimlerini kontrol edip yazım/çoğul varyantlarını ekleyin. Şehir adları coğrafi hedefleme yerine geçmez.
- `sitelinks-editor.csv`, `callouts-editor.csv`, `call-editor.csv`: İlgili Editor öğe türünde önizlenecek dosyalar. Arama raporlamasını kapalı tutun; aşağıdaki ülke kontrolüne bakın.
- `settings.csv`: **Editor içe aktarma dosyası değildir.** Manuel kurulum kontrol listesi; bütçe ve teklif üst sınırı boştur.

CSV başlıkları Editor için İngilizce, reklam metinleri Türkçedir. Durumlar `Paused`. Henüz gerçek hesabın Editor sürümünde import doğrulaması yapılmadı. Önizlemede sütunları eşleştirin, kırmızı hataları düzeltin, tüm öğelerin duraklatılmış kaldığını kontrol edin. Boş bütçe kasıtlıdır; paket yayına hazır bir harcama onayı değildir.

## Önerilen ayarlar

- Yalnızca Search. Search Partners ve Display kapalı.
- İzmir, Türkiye. Konum seçeneği yalnızca **Presence: hedeflenen konumda bulunan veya düzenli bulunan kişiler**; ilgi gösterenler dahil değil.
- Dil Türkçe. Başlangıçta Manual CPC veya teklif üst sınırı belirlenmiş Maximize Clicks. Bütçe ve üst sınırı işletme belirler; bu dosyalarda öneri adı altında sayı uydurulmaz.
- Otomatik etiketleme açık olmalı. Son URL eki: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`.
- İlk etapta broad match, Performance Max, otomatik oluşturulmuş öğeler ve son URL genişletme kullanmayın; onaylı hizmet ve metin kontrolü korunsun.
- Telefon tıklaması ile wizard WhatsApp tıklaması primary; diğer WhatsApp tıklamaları secondary. Her bir eylem için Google Ads Count=One önerilir. GA4'teki aynı olayları ikinci bir primary dönüşüm olarak içe aktarmayın.
- Yorumlar pencere, kapı, cam ve sineklik işlerindendir; cam balkon referansı gibi sunulmaz.
- 15+ yıl, 200+ müşteri; ısıcam, giyotin ve bioklimatik reklam metinlerinden çıkarılmıştır. Kanıt ve hizmet onayı olmadan eklemeyin.
- Mevcut sitede bulunan işletme beyanı 15+/200+ için kanıt henüz bu çalışmaya verilmedi. Reklam yayını öncesinde kanıtı doğrulayın veya bu site iddialarını kaynak facts/template üzerinden kaldırın.

## Doğrulama

`node scripts/ads-pack.mjs` dosyaları üretir. `node scripts/ads-pack.mjs --check` tüm metin sınırlarını, yasaklı iddiaları, gerçek görsel yolunu ve dosyaların güncelliğini kontrol eder. Başlık 30, açıklama 90, site bağlantısı 25, site bağlantısı açıklaması 35, açıklama öğesi/snippet değeri 25, anahtar kelime 80 karakter/10 sözcük. UTF-8 Türkçe karakterler tek karakter sayılır. `npm test` bu kontrolü de çalıştırır.

Kaynaklar (5 Kasım 2026): [Editor CSV hazırlama](https://support.google.com/google-ads/editor/answer/56368?hl=en), [CSV sütunları](https://support.google.com/google-ads/editor/answer/57747?hl=en), [site bağlantısı içe aktarma](https://support.google.com/google-ads/editor/answer/56366?hl=en), [duyarlı arama reklamları](https://support.google.com/google-ads/answer/7684791?hl=en).
