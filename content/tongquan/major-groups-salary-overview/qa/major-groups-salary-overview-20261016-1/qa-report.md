# QA render: major-groups-salary-overview-20261016-1

- **Render:** `videos/major-groups-salary-overview/renders/major-groups-salary-overview-20261016-1.mp4` (11 057 567 byte, tạo lúc 2026-10-16 14:18 +07:00)
- **Storyboard:** `content/major-groups-salary-overview/storyboard.json` (`status: approved`, 10 cảnh, 60 s). `validate-storyboard.mjs --strict` báo OK.
- **Thời điểm QA:** 2026-10-16 14:28 +07:00
- **Thư mục kết quả:** `content/major-groups-salary-overview/qa/major-groups-salary-overview-20261016-1/`

## Kết luận: **PASS** (không có lỗi chặn)

Không có lỗi chặn. Hai lỗi của bản trước đã được sửa:
- "124 (+24%)" không còn bị cắt ở mép màn hình điện thoại.
- Cảnh 8 "vietnam" không còn mảnh "%)" thừa.

Có 9 lỗi nhỏ không chặn (mục **A1–A9**) nên sửa nếu render lại. Danh sách "Cần người duyệt" ở cuối vẫn chưa ai kiểm tra; video chỉ nên đăng sau khi người duyệt đánh dấu xong các mục đó.

### Lỗi chặn
Không có.

### Lỗi không chặn, nên sửa
- **A1. Dấu hỏi của "Ở" bị khuất khi từ đang được tô sáng (4,07–4,27 s, khoảng 6 khung hình).** Ô màu xanh ngọc của từ đang đọc không có đệm trên dưới (`.caption-word { padding: 0 0.18em }` trong `compositions/captions.html`). Dấu hỏi của chữ hoa "Ở" vì vậy nhô lên trên ô và có màu chữ navy đậm trên nền khung phụ đề cũng đậm, nên gần như không thấy; người xem dễ đọc thành "Ơ" hoặc "Ớ". Từ 4,27 s, khi chữ chuyển sang trạng thái "đã đọc" (màu kem), dấu hiện đủ. Chữ thường "ở" lúc 41,48 s nằm gọn trong ô. Gợi ý: thêm khoảng 0,1 em đệm trên dưới cho `.caption-word`. Ảnh: `zoom_caption_O-hoi_active_4.15.png`, `zoom_caption_O-hoi_spoken_4.40.png`, `zoom_caption_o-hoi_active_41.48.png`.
- **A2. Một số nhóm phụ đề hiện quá ngắn để đọc**, do mốc thời gian lấy từ Whisper (bản thân chữ đúng). Ví dụ: "Nhưng y" hiện 0,11 s (22,48–22,59; ảnh `perframe_captions_22.40-22.70.png`), "Còn ở" 0,16 s, "và xây" 0,18 s, "người" (cảnh 8) 0,18 s, "chưa có" và "ngành chỉ" 0,20 s. Có thể gộp các nhóm ngắn hơn khoảng 0,3 s vào nhóm bên cạnh (`caption-overrides.json` hiện đang rỗng).
- **A3. Đường gạch đứt "100" chạy xuyên qua nhãn số** của các thanh dừng sát dưới 100: 93 (`zoom_health-split_93-label.png`), 97, 86, 85, 82, 81. Dấu "í" trong "Báo chí" cũng chạm vào đường này. Chỉ ảnh hưởng thẩm mỹ, số vẫn đọc được. Có thể thêm nền nhỏ cho nhãn, hoặc vẽ nhãn đè lên đường.
- **A4. Chữ phụ rất nhỏ khi xem trên điện thoại** (khoảng 21–24 px trên khung rộng 1080 px):
  - chú thích "25–34 tuổi · làm toàn thời gian / các nước OECD, năm 2023 · không gồm Việt Nam"
  - "Nguồn: Cục Thống kê · Điều tra lao động việc làm 2024"
  - "(du lịch, khách sạn…)"
  - "100 = mức chung"
  - "theo bằng cấp"

  Dấu tiếng Việt đều đúng (`zoom_baseline_footnote.png`, `zoom_vietnam_source.png`). Tuy vậy, chú thích này mang lưu ý quan trọng "không gồm Việt Nam", nên người duyệt cần xem trên máy thật.
- **A5. Xuống dòng tách đôi từ ghép "chứng chỉ"** trong nhãn "Chưa có bằng, chứng / chỉ nghề" (`zoom_vietnam_labels.png`). Nên ngắt sau "bằng,".
- **A6. Khung hình giật nhẹ ở ranh giới cảnh 41,30 s.** Ở cảnh below-average-2, khung hình đã lùi ra khoảng 3%; đúng 41,30 s nó trở về cỡ cũ ngay lập tức, ngay trước khi thẻ được vuốt (`dense_vietnam_41.0-41.7.png`, ô 3 và ô 4).
- **A7. Takeaway, khoảng 52,6–55,5 s: một vùng chồng nhiều lớp.** Sau khi điện thoại hạ xuống, phụ đề nằm đè lên biểu đồ và con dấu "Số liệu OECD", khiến vùng này rối (`frame_takeaway_52.80.png`, `frame_takeaway_54.50.png`). Từ khoảng 50,3 s, con dấu bán trong suốt che hai hàng "Khoa học tự nhiên – Toán 101" và "Sức khỏe & phúc lợi 100"; chữ bên dưới hiện mờ qua con dấu (`frame_takeaway_51.50.png`). Bố cục này đúng ý storyboard, nhưng nên làm nền con dấu đặc hơn.
- **A8. Tay không cử động trong suốt video.** Storyboard ghi "ngón cái chạm" (cảnh baseline), "ngón cái vuốt" (vietnam) và "điện thoại nghiêng xuống" (takeaway). Bản render thể hiện bằng vòng chạm trên tab "Thu nhập" (khoảng 4,0 s), thẻ trượt ngang và điện thoại trượt xuống; ngón tay không động đậy. Đây là chuyện cảm nhận, xem mục cần người duyệt.
- **A9. Thiết bị khác nhau đôi chút ở 0–0,7 s.** Khi màn hình còn tối, điện thoại có "đảo" camera; đảo này mờ dần khi màn hình sáng lên và không xuất hiện lại ở cảnh nào sau đó (`perframe_hook_0.0-0.7_top.png`, `pair_hook0_baseline4.png`). Ảnh hưởng rất nhỏ.

## 1. Định dạng (ffprobe)

| Mục | Kỳ vọng | Thực tế | Kết quả |
|---|---|---|---|
| Video codec | (h264) | h264, yuv420p | OK |
| Kích thước | 1080×1920 | 1080×1920 | OK |
| FPS | 30 | 30/1 (r và avg) | OK |
| Thời lượng | 30–60 s, lệch ≤ 0,1 s so với `durationSeconds` = 60 | 60,000 s (lệch 0,000 s) | OK |
| Luồng audio | 1 | 1 (AAC, 48 kHz, stereo) | OK |

## 2. Kiểm tra hình ảnh

Đã đọc toàn bộ các ảnh sau:
- 5 contact sheet phủ cả 60 s, 2 khung hình/giây (`sheet_01.png` … `sheet_05.png`).
- 4 dải phụ đề phủ cả 60 s, 4 khung hình/giây (`captions_01.png` … `captions_04.png`).
- 20 khung hình độ phân giải gốc: giữa mỗi cảnh và 0,2 s trước mỗi ranh giới cảnh.
- Các khung hình bổ sung và ảnh xem từng khung ở mọi lần chuyển cảnh kiểu vuốt.

Kiểm tra tự động: `blackdetect` (d=0.1) và `freezedetect` (n=0.001, d=2) **không phát hiện** đoạn đen hay đứng hình nào.

### Hai lỗi của bản trước: đã sửa
- **"124 (+24%)" bị cắt: ĐÃ SỬA.** Nhãn kết thúc ở khoảng x≈850–858, mép trong màn hình ở khoảng x≈880–893, tức còn cách mép khoảng 28–35 px. Kiểm tra ở mọi khung có biểu đồ: 12,5 / 14,4 / 17,5 / 20,2 / 24,95 / 29,3 / 32,25 / 34,8 / 38,15 / 41,1 (lúc khung đã lùi ra) / 51,5 s. Ảnh phóng to: `zoom_top-ict_124-label.png`.
- **Mảnh "%)" thừa ở cảnh 8 "vietnam": KHÔNG CÒN.**
  - Đã xem từng khung 41,40–41,67 s (`perframe_vietnam_41.40-41.70.png`): biểu đồ trượt sang trái, mờ dần và biến mất hẳn từ 41,633 s.
  - Đã xem 41,8–43,2 s ở 5 khung hình/giây (`dense_vietnam_41.8-43.2.png`), cả cảnh ở 2 khung hình/giây, và hai khung gốc 45,35 s và 49,2 s: không có mảnh chữ nào thừa.
  - Một lưu ý để tránh nhầm: ở **49,600–49,633 s** (cảnh takeaway, 0,2 s sau ranh giới), lúc biểu đồ trượt vào từ bên trái, đúng 2 khung hình chỉ thấy ")" rồi "·24%)" ở mép trái màn hình (`perframe_takeaway_49.40-49.80.png`). Đây là phần mép phải của biểu đồ đi vào trước trong một chuyển động trượt liên tục; các khung ngay sau cho thấy cả biểu đồ trượt theo. Vì vậy đây **không phải** phần tử sót lại. Nếu xem ở tốc độ 1× thấy giống lỗi, có thể cho biểu đồ mờ dần trong lúc trượt vào, giống cách nó trượt ra.

### Theo từng cảnh

| # | Cảnh (start–end) | Khung đã đọc | Chữ trên màn hình so với `onScreenText` | Nhận xét |
|---|---|---|---|---|
| 1 | hook (0–4) | `frame_hook_2.00.png`, `frame_hook_3.80.png`, `perframe_hook_0.0-0.7_top.png` | "10 nhóm ngành chuyên môn" + "theo phân loại quốc tế của UNESCO": khớp. Lưới 10 nhóm có đủ dấu (Giáo dục, Nghệ thuật – Nhân văn, Khoa học xã hội – Báo chí, Kinh doanh – Luật, Khoa học tự nhiên – Toán, Công nghệ thông tin, Kỹ thuật – Xây dựng, Nông – Lâm – Thủy sản, Thú y, Sức khỏe & phúc lợi, Dịch vụ). | Lời dẫn bắt đầu ở 0,07 s; tiêu đề hiện lúc khoảng 1,5 s, nên hook nằm trong 1–3 s đầu. Xem A9. |
| 2 | baseline (4–10,4) | `frame_baseline_4.00.png` (trong `pair_hook0_baseline4.png`), `frame_baseline_7.20.png`, `frame_baseline_10.20.png` | "100 = mức chung" và chú thích 2 dòng "25–34 tuổi · làm toàn thời gian / các nước OECD, năm 2023 · không gồm Việt Nam": nội dung khớp (chữ "Chú thích:" trong storyboard chỉ là mô tả). Chú thích giữ nguyên qua cảnh 7, đúng storyboard. | Có vòng chạm trên tab "Thu nhập"; tab đổi đúng. Xem A4. |
| 3 | top-ict (10,4–14,6) | `frame_top-ict_12.50.png`, `frame_top-ict_14.40.png`, `zoom_top-ict_124-label.png` | "Công nghệ thông tin" và "124 (+24%)": khớp, không bị cắt. | Tỉ lệ thanh đúng: thanh 124 dài khoảng 1,24 lần thanh 100. |
| 4 | above-average (14,6–20,4) | `frame_above-average_17.50.png`, `frame_above-average_20.20.png` | Kỹ thuật – Xây dựng 108, Kinh doanh – Luật 102, Khoa học tự nhiên – Toán 101: khớp. | Hai thanh xanh ngọc, thanh 101 màu trung tính, đúng storyboard. Nhãn số hiện khi thanh dài tới cuối. |
| 5 | health-split (20,4–29,5) | `frame_health-split_24.95.png`, `frame_health-split_29.30.png`, `zoom_health-split_panel-title.png`, `zoom_health-split_93-label.png` | "Sức khỏe & phúc lợi 100"; khung "VÍ DỤ TRONG NHÓM · SỐ LIỆU 6 NƯỚC"; "Y khoa, Nha khoa 116"; "Điều dưỡng & ngành liên quan 93": khớp, các dấu trên chữ hoa hiển thị đúng. | Hai thanh ví dụ nằm trong khung riêng, không vẽ như phần cộng lại của thanh 100, đúng storyboard. Khung ví dụ mờ dần ở khoảng 29,5–30 s. Xem A3. |
| 6 | below-average-1 (29,5–35) | `frame_below-average-1_32.25.png`, `frame_below-average-1_34.80.png` | Khoa học xã hội – Báo chí 97, Nghệ thuật – Nhân văn 86: khớp. | Màu trắng ngà/xám, không dùng đỏ, đúng storyboard. Xem A3. |
| 7 | below-average-2 (35–41,3) | `frame_below-average-2_38.15.png`, `frame_below-average-2_41.10.png` | Dịch vụ (du lịch, khách sạn…) 85, Giáo dục 82, Nông – Lâm – Thủy sản, Thú y 81: khớp. | Khung hình lùi ra, thấy đủ 10 thanh; thanh cuối không đè lên chú thích. Xem A6. |
| 8 | vietnam (41,3–49,4) | `frame_vietnam_45.35.png`, `frame_vietnam_49.20.png`, `dense_vietnam_41.0-41.7.png`, `dense_vietnam_41.8-43.2.png`, `perframe_vietnam_41.40-41.70.png`, `zoom_vietnam_labels.png`, `zoom_vietnam_source.png` | "Việt Nam 2024", "theo bằng cấp", "≈ gấp 1,6 lần", "Đại học trở lên", "Chưa có bằng, chứng chỉ nghề", "1", "Nguồn: Cục Thống kê · Điều tra lao động việc làm 2024": khớp `onScreenText`. Mô tả hình ảnh trong storyboard ghi "gấp ≈ 1,6 lần", trên màn hình là "≈ gấp 1,6 lần", đúng như `onScreenText`. | Tỉ lệ cột đúng 1,6. Không có mảnh "%)". Xem A5. |
| 9 | takeaway (49,4–56,2) | `frame_takeaway_51.50.png`, `frame_takeaway_52.80.png`, `frame_takeaway_54.50.png`, `frame_takeaway_56.00.png`, `dense_takeaway_49.2-49.9.png`, `perframe_takeaway_49.40-49.80.png` | Con dấu "Số liệu OECD / không gồm Việt Nam"; giấy nhớ "Sở thích · Năng lực · Nhu cầu xã hội · Thu nhập", bốn mục lần lượt được đánh dấu: khớp. | Điện thoại hạ xuống và tay biến mất từ khoảng 53 s (storyboard không yêu cầu tay ở đoạn này). Xem A7. |
| 10 | question (56,2–60) | `frame_question_58.10.png`, `frame_question_59.80.png`, `dense_question_55.6-57.0.png` | "Bạn nghiêng về nhóm nào?" và ô bình luận "Bình luận nhé!" có con trỏ nhấp nháy: khớp. | Điện thoại nâng lên từ dưới, tay quay lại, lưới 10 nhóm hiện lại. Khung cuối không đen, không bị cắt. |

**Nhất quán giữa các cảnh:**
- Bàn tay (hình dáng, màu da, vị trí ngón), khung điện thoại, thanh trạng thái "21:30", tiêu đề ứng dụng và bảng màu navy / xanh ngọc / trắng ngà giống nhau ở mọi cảnh có điện thoại.
- Không thấy chữ giữ chỗ, chữ debug hay logo sản phẩm có thật.
- Không có phần tử nào bị cắt, ngoài các chuyển động trượt đã được che theo mép màn hình, và cảnh takeaway (điện thoại cố ý hạ xuống ra khỏi khung).

**Phụ đề:** đã đọc toàn bộ 107 nhóm phụ đề trong `captions_01.png` … `captions_04.png`. Chữ khớp lời dẫn và dấu đúng hết. Hai điểm cần lưu ý là A1 (dấu hỏi của "Ở" khi đang tô sáng) và A2 (nhóm hiện quá ngắn). Phụ đề nằm ở dải dưới cùng, đè lên tay, đúng như thiết kế; ở takeaway nó đè lên điện thoại (A7).

## 3. Âm thanh

| Mục | Kết quả |
|---|---|
| Độ to tích hợp (EBU R128) | **−17,7 LUFS**; khoảng biến thiên (LRA) 3,2 LU |
| Đỉnh thực (true peak) | **−1,5 dBTP**, dưới 0 dBTP nên không bị méo (clipping) |
| 0,2 s cuối (59,8–60,0) | Im lặng hoàn toàn (đỉnh −inf dB). Lời dẫn kết thúc ở 58,93 s, **không bị cắt** |
| 0,5 s đầu | Có tiếng ngay (đỉnh −5,2 dB); lời dẫn bắt đầu khoảng 0,07 s |
| Đoạn lặng ≥ 1 s (−40 dB) | 28,50–29,61 (1,11 s, chuyển health-split → below-average-1); 48,49–49,51 (1,02 s, chuyển vietnam → takeaway); 58,93–60,00 (1,07 s, cuối video). Đúng kỳ vọng của bản chỉ có lời dẫn. |
| Khớp lời dẫn với cảnh (silencedetect d=0,25) | Lời dẫn của mỗi cảnh bắt đầu 0,06–0,11 s sau khi cảnh bắt đầu và kết thúc trước ranh giới cảnh sau ít nhất 0,9 s. Không cảnh nào bị lời dẫn tràn sang cảnh khác hoặc bị cắt. Các khoảng lặng ngắn hơn 1 s còn lại (khoảng 0,9–1,0 s ở các ranh giới khác, 0,3–0,5 s giữa câu) là bình thường. |
| Nhạc nền / SFX | Không có, đúng thiết kế (`audio-manifest.json` ghi chưa có âm thanh nào đã kiểm tra giấy phép). Trường `sfx` trong storyboard chưa được dùng. |

Ghi chú: −17,7 LUFS thấp hơn khoảng 3–4 dB so với mức tham chiếu thường gặp trên các nền tảng (khoảng −14 LUFS). Nhiều nền tảng chỉ giảm âm lượng video quá to chứ không tăng video nhỏ, nên video có thể nghe nhỏ hơn video khác. Có nâng mức hay không là quyết định của người duyệt; nếu nâng, giữ đỉnh thực ≤ −1 dBTP.

## Cần người duyệt (QA không tự kiểm được)

- [ ] **Phát âm TTS** (giọng Hải Đăng, VieNeu 3.8.3):
  - "ô e xê đê" (OECD)
  - các con số đọc thành chữ: "hai mươi tư phần trăm", "một phẩy sáu lần", "mười lăm đến mười chín phần trăm"
  - "Nông lâm thủy sản", "thú y"
  - ngữ điệu câu hỏi ở hook và ở câu kết
- [ ] **VieNeu chèn hoặc bỏ từ:** nghe lại toàn bộ và đối chiếu với `narration`. QA chỉ thấy mốc thời gian Whisper, không nghe được nội dung.
- [ ] **Độ to và độ cân của giọng** khi nghe trên loa điện thoại và tai nghe; có cần chuẩn hóa về khoảng −14 LUFS không.
- [ ] **Khoảng lặng khoảng 1 s giữa các cảnh:** nghe có tự nhiên không, hay tạo cảm giác ngắt quãng vì không có nhạc nền.
- [ ] **Không có nhạc/SFX:** chấp nhận đăng như vậy, hay chờ thêm âm thanh đã kiểm tra giấy phép rồi mới đăng.
- [ ] **Đọc trên máy thật:** chú thích, dòng nguồn và "(du lịch, khách sạn…)" (A4); phụ đề hiện ngắn (A2); dấu của "Ở" lúc 4,1 s (A1).
- [ ] **Vùng an toàn của TikTok/Shorts:** chú thích ở y≈1440–1500 và phụ đề ở y≈1712–1808 có bị mô tả video, tên kênh hay thanh nhạc của nền tảng che không (nên kiểm bằng lớp phủ vùng an toàn).
- [ ] **Cảm nhận chuyển động:** tay không cử động khi chạm/vuốt (A8); khung hình giật ở 41,3 s (A6); 2 khung hình "·24%)" lúc biểu đồ trượt vào ở 49,6 s; vùng chồng lớp ở takeaway (A7).
- [ ] **Tổng thể:** nhịp độ, độ rõ của thông điệp "lương chỉ là một yếu tố", và việc không có cảnh nào khiến người xem tưởng là cảnh quay thật.

## Các file đã tạo (cùng thư mục với báo cáo)

- **Contact sheet và dải phụ đề:**
  - `sheet_01.png` … `sheet_05.png`
  - `captions_01.png` … `captions_04.png`
- **Khung hình gốc:**
  - `frame_hook_0.00.png`, `frame_hook_2.00.png`, `frame_hook_3.80.png`
  - `frame_baseline_4.00.png`, `frame_baseline_7.20.png`, `frame_baseline_10.20.png`
  - `frame_top-ict_12.50.png`, `frame_top-ict_14.40.png`
  - `frame_above-average_17.50.png`, `frame_above-average_20.20.png`
  - `frame_health-split_24.95.png`, `frame_health-split_29.30.png`
  - `frame_below-average-1_32.25.png`, `frame_below-average-1_34.80.png`
  - `frame_below-average-2_38.15.png`, `frame_below-average-2_41.10.png`
  - `frame_vietnam_45.35.png`, `frame_vietnam_49.20.png`
  - `frame_takeaway_51.50.png`, `frame_takeaway_52.80.png`, `frame_takeaway_54.50.png`, `frame_takeaway_56.00.png`
  - `frame_question_58.10.png`, `frame_question_59.80.png`
- **Chuyển cảnh và xem từng khung:**
  - `dense_vietnam_41.0-41.7.png`, `dense_vietnam_41.8-43.2.png`, `dense_takeaway_49.2-49.9.png`, `dense_question_55.6-57.0.png`
  - `perframe_vietnam_41.40-41.70.png`, `perframe_takeaway_49.40-49.80.png`, `perframe_hook_0.0-0.7_top.png`
  - `perframe_captions_4.00-4.60.png`, `perframe_captions_22.40-22.70.png`, `perframe_captions_41.30-41.60.png`
  - `pair_hook0_baseline4.png`
- **Ảnh phóng to:**
  - `zoom_top-ict_124-label.png`
  - `zoom_health-split_93-label.png`, `zoom_health-split_panel-title.png`
  - `zoom_vietnam_labels.png`, `zoom_vietnam_source.png`, `zoom_baseline_footnote.png`
  - `zoom_caption_O-hoi_active_4.15.png`, `zoom_caption_O-hoi_spoken_4.40.png`, `zoom_caption_o-hoi_active_41.48.png`, `zoom_captions_O-hoi_4.15_4.40_41.48.png`

Trong quá trình QA không sửa file storyboard, mã nguồn hay asset nào.
