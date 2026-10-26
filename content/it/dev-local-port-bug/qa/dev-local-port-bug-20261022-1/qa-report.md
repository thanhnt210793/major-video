# QA render: dev-local-port-bug-20261022-1

- **Bản render:** `C:\majors-video\videos\dev-local-port-bug\renders\dev-local-port-bug-20261022-1.mp4` (11,2 MB, tạo lúc 2026-10-22 08:52)
- **Storyboard:** `C:\majors-video\content\dev-local-port-bug\storyboard.json` (`status: approved`, 10 cảnh, 47,5 s)
- **Thời điểm QA:** 2026-10-22 08:53 (+07)
- **Cách kiểm tra:** ffprobe; 4 contact sheet 2 khung/s cho toàn bộ video; 20 khung full-res (giữa cảnh và 0,2 s trước mỗi ranh giới); dải 10 fps và 30 fps cho 4 lần xoay ghế; dải 30 fps cho cả 9 điểm cắt cảnh; dải phụ đề 3 khung/s cho toàn bộ video; blackdetect/freezedetect; ebur128; silencedetect.

## Kết luận: **FAIL**

Mọi chữ trên màn hình đều đúng: nội dung terminal, dấu tiếng Việt, định dạng, âm lượng và việc lời dẫn không bị cắt. Video không đạt vì hai lỗi hình ảnh dưới đây. Theo §9, đây là lỗi "thành phần bị cắt" và lỗi liền mạch giữa các cảnh.

### Lỗi chặn (phải sửa trước khi đăng)

**B1. Lớp phủ, đạo cụ và tư thế nhân vật biến mất đột ngột ở điểm cắt cảnh, trong lúc khung cảnh vẫn liền mạch.** Tại mỗi ranh giới, các thành phần riêng của cảnh trước biến mất trong đúng 1 khung hình, không có hiệu ứng mờ dần, mà camera vẫn đứng yên hoặc đang chuyển động. Ba chỗ dễ thấy nhất là ba điểm bắt đầu xoay ghế, vì camera còn đứng yên từ 0,1 đến 0,2 s rồi mới xoay:
- **24,067 → 24,100 s (realize → find):** bóng đèn và pill "Khoan đã!" biến mất cùng lúc. Camera giữ yên trên chị Mai khoảng 0,1–0,2 s rồi mới xoay. File: `cut_realize-find_30fps.png`
- **33,167 → 33,200 s (fix → colleague):** dấu tick và pill "Chạy được rồi!" biến mất. Khoảng 0,2 s sau camera mới xoay. File: `cut_fix-colleague_30fps.png`
- **36,867 → 36,900 s (colleague → takeaway):** bong bóng "Chị chưa nói câu nào!" biến mất. Đồng thời **bàn tay giơ ngón cái của chị Mai biến mất** và miệng đang cười chuyển sang mím, tất cả trong 1 khung khi camera còn đứng yên. File: `cut_colleague-takeaway_30fps.png`
- Các chỗ tương tự nhưng ít lộ hơn, vì camera đang chuyển động ngay lúc đó:
  - **14,667 → 14,700 s:** thẻ "EADDRINUSE = cổng đã bị chiếm", dấu "?" và vệt highlight biến mất (`cut_read-turn_30fps.png`).
  - **20,267 → 20,300 s:** pill "Hỏi thử chị Mai…" biến mất. Điều này không nhất quán, vì bong bóng "Chị ơi…" ngay cạnh thì mờ dần (`cut_turn-realize_30fps.png`).
  - **28,967 → 29,000 s:** sticker "Thủ phạm…" và highlight dòng `node` biến mất, đồng hồ nhảy từ 9:25 sang 9:30 trong cùng khung (`cut_find-fix_30fps.png`).
  - **43,467 → 43,500 s:** thẻ "Mẹo…" biến mất (`cut_takeaway-question_30fps.png`).
- Gợi ý sửa: cho lớp phủ mờ dần trong 6–8 khung trước điểm cắt, hoặc giữ chúng sang cảnh sau và mờ dần trong lúc xoay. Với chị Mai, cho chị hạ tay trước khi cắt, hoặc giữ nguyên tư thế cho tới khi chị ra khỏi khung.

**B2. Tia sáng của bóng đèn bị cắt** trong cảnh realize (20,3–24,1 s). Hai tia trên bị cắt phẳng ở y≈110 px, hai tia bên bị cắt thẳng ở x≈430 và 650 px. Có thể do khung viewBox/overflow của SVG. File: `zoom_realize_lightbulb_22.20.png`, `frame_realize_22.20.png`

### Không chặn (nên sửa)

- **N1. Takeaway, 38,2–43,5 s:** cú đẩy cận lệch sang phải làm mất mép trái terminal suốt khoảng 5 s, chữ bị cắt giữa từ: "sten EADDRINUSE", "ook du-an %", "PID USER". PID `4821` còn lại "821", nhìn giống "321". File: `frame_takeaway_40.20.png`, `zoom_takeaway_leftcrop_40.20.png`, `pushin_takeaway_10fps.png`
- **N2. Question, 44,1–47,5 s:** thẻ "Kể mình nghe dưới phần bình luận nhé!" đè lên thanh tiêu đề, để lộ nửa dưới chữ "Terminal" và "Thứ Hai 9:31" bên dưới thẻ, trông như rác hình. File: `zoom_question_titlebar_45.50.png`, `frame_question_45.50.png`
- **N3. Read, khoảng 9,3–14,7 s:** cú đẩy cận cắt "Terminal" thành "rminal" và đồng hồ thành "Thứ Ha" ở mép phải. File: `frame_read_11.55.png`
- **N4. Phụ đề ngắt trang làm tách từ ghép:** "thử ứng | dụng đang" (1,3–2,0 s), "cả màn | hình đỏ lòm." (2,3–3,0 s), "cần cổng | 3000," (10,0–10,6 s), "mẹo “vịt | cao su”:" (37,3–38,3 s). File: `captions_01.png`, `captions_04.png`
- **N5. Thẻ chú thích bán trong suốt** nên chữ terminal phía sau lộ ra: "minh@macbook du-an % npm run dev" sau "= cổng đã bị chiếm", "EADDRINUSE: address…" sau "Mẹo…". Vẫn đọc được nhưng giảm tương phản. File: `frame_read_11.55.png`, `zoom_takeaway_leftcrop_40.20.png`
- **N6. Chi tiết vẽ chị Mai:**
  - Bàn tay giơ ngón cái không nối với tay áo, trông như bàn tay "nổi" cạnh vai.
  - Có một mẩu tay áo trắng tròn đè lên mép bàn, ở khoảng x 700–730, y 1130–1155 (cảnh colleague).
  - Hai mẩu da tay nhỏ ló lên trên mép bàn.

  Các chi tiết này nhỏ, khó thấy trên điện thoại. File: `zoom_colleague_hands_35.05.png`, `zoom_turn_desk_17.50.png`
- **N7.** Sau khi terminal cuộn, dòng trên cùng bị thanh tab che một phần: "> du-an@1.0.0 dev" ở 26,55 s, "> node server.js" ở 31,1 s. File: `frame_find_26.55.png`, `frame_fix_31.10.png`
- **N8.** Khi đẩy cận (read, find, takeaway), bàn tay POV giữ nguyên kích thước trong khi bàn phím phóng to, nên lệch phối cảnh nhẹ. File: `frame_read_14.50.png`, `frame_find_28.80.png`
- **N9.** Bong bóng "Chị chưa nói câu nào!" che chậu cây trên kệ, chỉ ngọn lá xanh còn ló ra phía trên bong bóng. File: `frame_colleague_35.05.png`
- **Ghi chú, không phải lỗi:**
  - Storyboard cảnh hook ghi "tràng chữ lỗi đỏ bật ra gần kín cửa sổ". Bản render chỉ có 1 dòng `Error:` cùng nền cửa sổ ngả đỏ, khớp ghi chú của fact-002 ("trên màn hình chỉ hiện dòng Error").
  - Cảnh takeaway không có tay POV (bàn phím trống từ 37,3 đến 43,8 s), khớp danh sách asset. Tay quay lại mượt ở cảnh question, trượt lên trong 43,8–44,1 s (`question_entry_15fps.png`).

## 1. Định dạng (ffprobe)

| Mục | Mong đợi | Thực tế | Kết quả |
|---|---|---|---|
| Video codec / kích thước | 1080×1920 | h264, 1080×1920 | Đạt |
| Khung hình/giây | 30 | 30/1 (1425 khung) | Đạt |
| Thời lượng | 30–60 s, ≈ 47,5 s (storyboard) | 47,500 s | Đạt (lệch 0,0 s) |
| Audio | 1 luồng | 1 luồng AAC, 48 kHz, stereo, 47,5 s | Đạt |

## 2. Hình ảnh theo từng cảnh

| Cảnh (start–end) | Khung đã xem | Kết quả |
|---|---|---|
| hook 0–4 | `frame_hook_2.00.png`, `frame_hook_3.80.png`, `hook_0-3s_4fps.png`, `cut_hook-retry_30fps.png` | Pill "Thứ Hai · 9:00" và đồng hồ terminal 9:00 đúng. Gõ `npm run dev`, dòng lỗi đỏ hiện lúc 2,25 s, tức hook xuất hiện trong 1–3 s. Ở 4,0 s pill đổi sang "9:10…" ngay trong 1 khung, có thể chấp nhận. |
| retry 4–8,4 | `frame_retry_6.20.png`, `frame_retry_8.20.png`, `cut_retry-read_30fps.png` | Chạy lần 2 và lần 3, ba khối lỗi giống nhau. Pill "9:10…" rồi "9:25…", đồng hồ 9:10 rồi 9:25. Phím sáng khi gõ. Đạt. |
| read 8,4–14,7 | `frame_read_11.55.png`, `frame_read_14.50.png`, `pushin_read_10fps.png` | Đẩy cận mượt từ 8,8 đến 9,6 s. Highlight xanh ngọc đúng đoạn `address already in use :::3000`. Thẻ hai dòng "EADDRINUSE / = cổng đã bị chiếm" đúng dấu. Còn N3, N5, N8. |
| turn 14,7–20,3 | `frame_turn_17.50.png`, `frame_turn_20.10.png`, `pan1_*` | Chị Mai đeo tai nghe trên cổ và nhìn về phía camera. Bong bóng "Chị ơi…" hiện từ phía người kể. Pill "Hỏi thử chị Mai…" đúng dấu. Còn B1 (ở 14,7 và 20,3 s). |
| realize 20,3–24,1 | `frame_realize_22.20.png`, `frame_realize_23.90.png`, `zoom_realize_nod_5fps.png` | Chị Mai gật đầu ở khoảng 21,0–21,7 s. Bóng đèn và "Khoan đã!" đúng dấu. Còn **B2**, và **B1** ở 24,1 s. |
| find 24,1–29 | `frame_find_26.55.png`, `frame_find_28.80.png`, `zoom_find_highlight_5fps.png`, `zoom_find-fix_10fps.png` | Toàn bộ nội dung terminal đúng (bảng bên dưới). Highlight quét từ trái sang phải trong 26,4–26,7 s, là hiệu ứng chủ ý. Sticker có mũi tên nằm ngoài terminal. Thẻ "macOS" ở góc. Còn B1 ở 29,0 s, N7, N8. |
| fix 29–33,2 | `frame_fix_31.10.png`, `frame_fix_33.00.png` | Có `kill 4821`, `npm run dev` và dòng xanh `Server listening on http://localhost:3000`. Dấu tick SVG đúng, "Chạy được rồi!" đúng dấu, đồng hồ 9:30. Còn B1 ở 33,2 s. |
| colleague 33,2–36,9 | `frame_colleague_35.05.png`, `frame_colleague_36.70.png`, `pan3_*` | Chị Mai cười, giơ ngón cái; bong bóng "Chị chưa nói câu nào!" đúng dấu. Còn **B1** ở 36,9 s, N6, N9. |
| takeaway 36,9–43,5 | `frame_takeaway_40.20.png`, `frame_takeaway_43.30.png`, `pan4_*`, `pushin_takeaway_10fps.png` | Vịt cao su bật ra cạnh bàn phím ở 38,1–38,2 s. Thẻ "Mẹo: “gỡ lỗi kiểu vịt cao su” (rubber duck debugging)" đúng dấu, đúng dấu ngoặc kép. Còn **N1**, N5. |
| question 43,5–47,5 | `frame_question_45.50.png`, `frame_question_47.30.png`, `question_entry_15fps.png` | Terminal chạy ổn, con trỏ nháy dưới dòng `Server listening…`. Vịt cạnh bàn phím, tay quay lại, đồng hồ 9:31. Thẻ "Kể mình nghe dưới phần bình luận nhé!" đúng dấu. Còn **N2**. |

Nhất quán giữa các cảnh: bàn tay, bàn phím, chuột, màn hình, cửa sổ, kệ cây và bảng màu (navy, teal, trắng ngà, điểm nhấn cam/vàng) giữ nguyên trong mọi cảnh. Không thấy nội dung giữ chỗ hay nội dung debug sót lại.

### Bốn lần xoay ghế (trọng tâm 1)

Tôi đo vị trí màn hình, cửa sổ, cốc và chị Mai qua từng khung ở 30 fps.

| Lần xoay | Thời gian chuyển động | Kết quả | File |
|---|---|---|---|
| 1. sang chị Mai (turn) | khoảng 15,1–16,1 s | Chuyển động tăng rồi giảm tốc đều, không giật. Thế giới trôi sang trái, chị Mai vào từ mép phải ở 15,67 s, đúng hướng xoay phải. Cửa sổ ở xa trôi chậm hơn màn hình và cốc, tức parallax đúng. Có motion blur. Tay POV trượt xuống ra khỏi khung trong 15,0–15,33 s, không biến mất đột ngột. | `pan1_turn_10fps.png`, `pan1_turn_30fps_15.3-15.8.png`, `turn-transition-strip.png` (có sẵn) |
| 2. về màn hình (find) | khoảng 24,2–24,9 s | Mượt, thế giới trôi sang phải, màn hình vào từ mép trái ở 24,43 s. Tay trượt lên trong 24,63–24,8 s. | `pan2_find_10fps.png`, `pan2_find_30fps_24.2-24.8.png` |
| 3. sang chị Mai (colleague) | khoảng 33,45–34,1 s | Mượt, cùng hướng với lần 1. Tay trượt xuống trong 33,4–33,6 s. | `pan3_colleague_10fps.png`, `pan3_colleague_30fps_33.4-34.0.png` |
| 4. về màn hình (takeaway) | khoảng 37,03–37,7 s | Mượt, chuyển động giống hệt lần 2. Không có tay POV, như đã ghi ở phần ghi chú. | `pan4_takeaway_10fps.png`, `pan4_takeaway_30fps_37.0-37.6.png` |

Tại cả 9 điểm cắt, các thành phần của thế giới (nền, bàn, màn hình, vị trí chị Mai, nội dung terminal) đều khớp giữa khung cuối cảnh trước và khung đầu cảnh sau. Chỉ có lớp phủ, đạo cụ và tư thế bị biến mất đột ngột như mô tả ở **B1**.

### Nội dung terminal (trọng tâm 2)

| Mong đợi (storyboard) | Trên hình | Kết quả |
|---|---|---|
| `npm run dev` | `minh@macbook du-an % npm run dev` | Đúng |
| `Error: listen EADDRINUSE: address already in use :::3000` | đúng từng ký tự, cả ba lần chạy | Đúng |
| `lsof -i :3000 -P` | `minh@macbook du-an % lsof -i :3000 -P` | Đúng |
| dòng tiêu đề lsof | `COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME` | Đúng |
| `node 4821 minh 23u IPv6 0x… 0t0 TCP *:3000 (LISTEN)` | `node 4821 minh 23u IPv6 0x1f3a9c2e 0t0 TCP *:3000 (LISTEN)` | Đúng, có highlight |
| `kill 4821` | `minh@macbook du-an % kill 4821` | Đúng |
| `Server listening on http://localhost:3000` | dòng xanh lá, đúng nguyên văn | Đúng |
| Sticker "Thủ phạm: mình của thứ Sáu!" nằm ngoài terminal | nằm dưới khung terminal, trên vùng chân màn hình, mũi tên chỉ lên dòng `node` | Đúng (`frame_find_28.80.png`) |

### Dấu tiếng Việt và độ dễ đọc (trọng tâm 3)

- Tất cả pill, thẻ, sticker, bong bóng và toàn bộ phụ đề karaoke (đọc ở 3 khung/s qua cả video) đều đúng dấu. Không phát hiện lỗi dấu nào. File: `captions_01.png` đến `captions_04.png`.
- Phụ đề: chữ cao khoảng 60 px ở khung 1080 px, tương phản cao, dễ đọc trên điện thoại. Vấn đề ngắt trang xem N4.
- Chữ terminal ở khung bình thường chỉ khoảng 20 px, khá nhỏ trên điện thoại. Các dòng quan trọng đều được đẩy cận hoặc có thẻ chú thích, nên cần người xem đánh giá thêm.

### Gợi ý tự động

- `blackdetect` và `freezedetect`: không phát hiện đoạn đen hay đoạn đứng hình nào.

## 3. Âm thanh

- **Âm lượng (ebur128):** I = −17,8 LUFS, LRA = 4,5 LU, true peak = −1,5 dBTP. Không clipping.
- **Đoạn im lặng ≥ 1 s (−40 dB):**
  - 13,77–14,81 (1,04 s)
  - 19,15–20,34 (1,18 s)
  - 22,99–24,18 (1,19 s)
  - 27,31–29,10 (1,79 s)
  - 31,06–33,28 (**2,23 s**)
  - 35,64–37,01 (1,37 s)
  - 45,86–47,50 (1,64 s)

  Tất cả nằm ở chỗ chuyển cảnh. Riêng hai đoạn 2,2 s và 1,8 s là khoảng lặng dài khi không có nhạc nền, cần người xem đánh giá nhịp.
- **Cuối video:** 0,2 s cuối và cả 0,5 s cuối đều ở −91 dB, tức lời dẫn **không bị cắt**.
- **Đầu video:** 0–0,05 s im lặng, tiếng nói bắt đầu khoảng 0,07 s. Khoảng đệm rất sát, cần nghe xem chữ "Sáng" có bị mất âm đầu không.
- **Lời dẫn theo cảnh** (silencedetect −40 dB, d = 0,25 s; giọng lấy từ `videos/dev-local-port-bug/assets/voice/vieneu-run.json`):

| Cảnh | Ranh giới cảnh | Lời dẫn | Giọng | Âm lượng đoạn |
|---|---|---|---|---|
| hook | 0–4 | 0,07–3,23 | Hải Đăng | −17,4 LUFS |
| retry | 4–8,4 | 4,10–7,49 | Hải Đăng | −17,4 |
| read | 8,4–14,7 | 8,47–13,77 | Hải Đăng | −18,1 |
| turn | 14,7–20,3 | 14,81–19,15 | Hải Đăng | −17,6 |
| realize | 20,3–24,1 | 20,34–22,99 | Hải Đăng | −16,6 |
| find | 24,1–29 | 24,18–27,31 | Hải Đăng | −17,8 |
| fix | 29–33,2 | 29,10–31,06 | Hải Đăng | −18,3 |
| **colleague** | 33,2–36,9 | **33,28–35,64** | **Trúc Ly** (chị Mai) | −17,9 |
| takeaway | 36,9–43,5 | 37,01–42,65 | Hải Đăng | −18,2 |
| question | 43,5–47,5 | 43,60–45,86 | Hải Đăng | −18,4 |

  Không có lời dẫn nào tràn qua ranh giới cảnh. Mức âm lượng hai giọng tương đương nhau (chênh dưới 2 LU).
- Gợi ý yếu, không phải kết luận: phổ trung bình (spectral centroid) của đoạn colleague cao nhất, khoảng 2280 Hz, so với 1430–2080 Hz ở các đoạn khác. Điều này phù hợp với việc dùng một giọng khác, nhưng chưa chứng minh được.

## Cần người duyệt kiểm tra (QA không đánh giá được bằng tai hay cảm nhận)

- [ ] Câu của chị Mai (33,28–35,64 s) nghe rõ là giọng khác (Trúc Ly), phân biệt được với Hải Đăng.
- [ ] TTS đọc đúng tiếng Việt: "cổng ba nghìn" (phụ đề ghi "3000"), "thứ Sáu", "Khoan!", "vịt cao su"; không chèn thêm từ (VieNeu #213).
- [ ] Âm đầu chữ "Sáng" ở 0,07 s không bị mất.
- [ ] Nhịp và khoảng lặng: 2,2 s im lặng sau "xanh rồi!" (31,06–33,28) và 1,8 s ở 27,31–29,10, khi video không có nhạc nền hay SFX.
- [ ] Âm lượng tổng −17,8 LUFS: chấp nhận được hay cần nâng lên khoảng −14 đến −16 LUFS cho TikTok/Shorts.
- [ ] Storyboard có liệt kê SFX (gõ phím, ghế xoay, tiếng bíp lỗi, chime…), nhưng manifest ghi "Không có" theo thiết kế. Cần xác nhận chấp nhận được.
- [ ] Cảm nhận chung về 4 lần xoay ghế (mỗi lần khoảng 0,6–1,0 s, có motion blur) và nửa dưới khung còn trống trong các cảnh có chị Mai.
- [ ] Vùng an toàn của giao diện nền tảng: pill phụ đề ở y 1708–1812 px có thể bị phần mô tả của TikTok/Shorts che.
- [ ] Độ dễ đọc của chữ terminal ở khung bình thường trên điện thoại thật.

## File đầu ra (trong thư mục này)

- Contact sheet: `sheet_01.png` đến `sheet_04.png`
- Khung giữa cảnh và trước ranh giới: `frame_<sceneId>_<t>.png` (20 file)
- Điểm cắt cảnh, 30 fps: `cut_<a>-<b>_30fps.png` (9 file)
- Xoay ghế: `pan1_turn_10fps.png`, `pan1_turn_30fps_15.3-15.8.png`, `pan2_find_10fps.png`, `pan2_find_30fps_24.2-24.8.png`, `pan3_colleague_10fps.png`, `pan3_colleague_30fps_33.4-34.0.png`, `pan4_takeaway_10fps.png`, `pan4_takeaway_30fps_37.0-37.6.png`, `turn-transition-strip.png` (có sẵn, giữ nguyên)
- Đẩy cận và zoom: `pushin_read_10fps.png`, `pushin_takeaway_10fps.png`, `zoom_find-fix_10fps.png`, `question_entry_15fps.png`, `hook_0-3s_4fps.png`
- Phóng to chi tiết: `zoom_realize_lightbulb_22.20.png`, `zoom_realize_nod_5fps.png`, `zoom_find_highlight_5fps.png`, `zoom_colleague_hands_35.05.png`, `zoom_turn_desk_17.50.png`, `zoom_takeaway_leftcrop_40.20.png`, `zoom_question_titlebar_45.50.png`
- Phụ đề: `captions_01.png` đến `captions_04.png`
