# Ayrı onay bekleyen ölçüm değişikliği

Durum: **Uygulanmadı.** `ad_user_data` hâlâ `denied`.

6 Kasım canlı testinde üç dönüşüm isteği doğru etiketle gönderildi; Google Ads tablosu hâlâ Unverified. Bu durumun tek nedeninin izin ayarı olduğu kanıtlanmadı. Google, `ad_user_data` izninin etiket tabanlı dönüşüm ölçümünde de kullanıldığını belirtiyor: https://support.google.com/google-ads/answer/13802165?hl=en

Onaylanabilecek somut kapsam:

1. Ziyaretçi açıkça “İzin ver” seçerse `ad_storage`, `analytics_storage` ve `ad_user_data` granted olur. Öncesinde/ret sonrasında Google ve DataFast hiç yüklenmez.
2. `ad_personalization` denied kalır; yeniden pazarlama ve gelişmiş dönüşümler açılmaz. Ad, telefon, e-posta veya WhatsApp mesajı Google'a yüklenmez.
3. Eski kabul tercihleri yeni kapsam için geçerli sayılmaz; v3 tercih anahtarıyla yeniden izin istenir. Eski ret tercihleri korunur.
4. Bildirimde reklam tıklamasını iletişim tıklamasıyla ilişkilendirme açıkça anlatılır. Gizlilik sayfası Google'ın reklam tıklama kimliklerini ve teknik cihaz/IP bilgilerini ölçüm için işleyebileceğini belirtir.
5. Ret, yeniden izin, geri alma ve üç dönüşüm etiketinin tek kez gönderimi test edilir; canlı domaine yayımlanıp Tag Assistant'ta yeniden incelenir.
6. Hesaptaki dönüşüm durumu ayrıca kontrol edilir. Bu değişiklik bir kampanya, bütçe, ödeme, GA4, müşteri verisi yükleme veya WhatsApp–gclid eşleştirmesi oluşturmaz.

Bu teklif mevcut gizlilik/izin davranışını genişlettiği için işletme sahibinin açık onayı olmadan uygulanmaz. Google Ads raporunda reklamla ilişkilendirilmiş dönüşüm doğrulaması, yalnızca test isteğinin gönderilmesinden ayrı tutulur.
