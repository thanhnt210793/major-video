# Phương án mở đầu (0–4 giây) — it/loi-production-sau-release

## Cập nhật 27/10 — sau bản xem thử 1

Người duyệt thấy mở đầu `oddly-specific` dưới đây "không hấp dẫn" và muốn lỗi trông như "kinh thiên động địa". Mình đưa ra hai phương án mới, người duyệt chọn **B**. Mở đầu đang dùng:

- **Mẫu:** `in-medias-res`. Vào thẳng sự cố, đánh vào thiệt hại.
- **Khung đầu (0,0 s):** màn hình đỏ rực, các thông báo "Thanh toán thất bại" chồng lên nhau, viền đỏ nhấp nháy như đèn báo động, ô đếm lớn "Đơn thanh toán lỗi" đang chạy.
- **Chữ trên màn hình:** "Thứ Sáu · 16:45".
- **Lời đọc:** "Mười phút sau khi phát hành… hàng trăm khách không thanh toán được!" (16 âm tiết, đọc nhanh hơn 6%; khoảng 3 s).
- **Âm thanh:** còi báo động, tiếng "bùm" trầm, tiếng nhiễu sóng, nhạc nền căng thẳng.
- **Điều hứa hẹn:** chuyện gì khiến hàng trăm khách không thanh toán được, và ai đã gây ra? Cảnh trả lời: `discover`.
- **Phương án không chọn:** A, `curiosity-question`, "Một dòng code… làm cả công ty náo loạn!".

**Sau bản xem thử 4 (27/10):** cảnh `hunt` mới (dò pull request, xem thay đổi, tìm kiếm, "nửa tiếng trôi qua, vẫn bí!") nằm trước `discover`. Mở đầu giữ nguyên. Lời giải cho điều hứa hẹn đến muộn hơn, ở khoảng 33 s thay vì 26 s. Nhưng cảnh `hunt` tự giữ người xem: bộ đếm dừng ở 463 ngay đầu cảnh, có một câu hỏi mới ("lỗi nằm ở đâu?"), và đồng hồ chạy 17:05 → 17:35.

**Sau bản xem thử 6 (28/10):** sếp ra hạn ("Cho em mười phút xem lại code vừa gộp!") thay cho câu hỏi "Bao giờ thì xong?". Cảnh `hunt` nhắc lại: "mười phút thành nửa tiếng". Mở đầu giữ nguyên. Hạn mười phút là một điều hứa hẹn nhỏ thứ hai, vì người xem chờ xem có kịp không. Cảnh `hunt` trả lời ngay là không kịp (ô hạn bị gạch đỏ), rồi `discover` trả lời điều hứa hẹn chính.

Phần dưới đây là bản phân tích lúc soạn kịch bản (vòng 1), giữ lại để tham khảo.

Chế độ lúc đó: **bản nháp**. Phương án đứng đầu khi ấy đã được đưa vào cảnh 1.

## Chất liệu từ câu chuyện

- **Khoảnh khắc lạ và cụ thể nhất:** khách nào **bỏ trống ô mã giảm giá** thì không thanh toán được, còn khách có mã thì vẫn bình thường (lời giải ở cảnh `discover`). Ngoài ra còn có:
  - chú thích "minh · thứ Ba" cạnh dòng gây lỗi (cảnh `discover`);
  - cảnh báo tự động và tin nhắn dồn dập, bộ đếm đơn lỗi tăng dần (cảnh `escalate` → `own-it`);
  - đoạn tự nói "Đoạn này hôm trước mình làm đúng rồi mà nhỉ? Hay ai sửa đè lên?" (cảnh `works-locally`);
  - ly trà sữa chưa kịp uống rồi tan hết đá (cảnh `meeting` → `release`);
  - "trên máy mình vẫn chạy" (cảnh `works-locally`).
- **Điều đang bị đe doạ:** khách hàng lớn không thanh toán được, chuyện đã lên tới sếp, lại đúng chiều thứ Sáu (cảnh `escalate` → `release`).
- **Bài học nghề:**
  - báo ngay cho nhóm, không giấu (cảnh `own-it`);
  - ưu tiên để khách dùng lại được, sửa sau (cảnh `mitigate`);
  - rút kinh nghiệm không đổ lỗi (cảnh `postmortem`).
- **Điểm bắt đầu muộn nhất:** lúc lỗi đã hiện trên màn hình (16:45), trước khi biết nguyên nhân.

## 3 phương án tốt nhất

### 1. Chi tiết lạ mà cụ thể (`oddly-specific`) — **đã chọn**, 12/12
- **Khung đầu (0,0 s):** trang thanh toán đã mở trên màn hình; ô "Mã giảm giá" để trống được khoanh, thông báo đỏ lớn "Thanh toán thất bại" đã hiện.
- **Chữ trên màn hình:** "Thứ Sáu · 16:45"
- **Lời đọc:** "Không nhập mã giảm giá… là không thanh toán được à?" (11 âm tiết; chữ "à" được thêm sau khi rà soát tiếng Việt, để câu nghe rõ là câu hỏi ngạc nhiên)
- **Âm thanh:** tiếng báo lỗi khi thông báo đỏ nhấp sáng.
- **Điều hứa hẹn:** vì sao bỏ trống ô mã giảm giá lại làm khách không thanh toán được, và ai gây ra? **Cảnh trả lời:** `discover`.
- **Điểm:** Dừng lướt 2 · Cụ thể 2 · Vòng mở 2 · Gần gũi 2 · Nhanh 2 · Khớp & trả lời 2.
- **Rủi ro:** câu dạng hỏi cần giọng đọc lên giọng cuối câu; nghe lại khi tạo giọng.

### 2. Câu hỏi gợi tò mò (`curiosity-question`) — 10/12
- **Khung đầu:** dòng code tô đỏ kèm chú thích "minh · thứ Ba".
- **Chữ trên màn hình:** "Thứ Sáu · 17:20"
- **Lời đọc:** "Lỗi do chính mình viết… nên nói ngay hay lặng lẽ sửa?" (13 âm tiết)
- **Điều hứa hẹn:** nhân vật sẽ chọn nói ngay hay giấu? **Cảnh trả lời:** `own-it`.
- **Điểm:** Dừng lướt 2 · Cụ thể 1 · Vòng mở 2 · Gần gũi 2 · Nhanh 1 · Khớp & trả lời 2.
- **Rủi ro:** lộ trước chuyện "thủ phạm là mình", nên cảnh `discover` bớt bất ngờ; nếu chọn, cảnh 2 cần câu nối "Quay lại lúc 16:45…" (thay đổi cấu trúc).

### 3. Đồng hồ đếm ngược (`countdown`) — 10/12
- **Khung đầu:** đồng hồ menu chỉ 16:45 thứ Sáu, ba lô đặt sẵn trên ghế, điện thoại bắt đầu rung.
- **Chữ trên màn hình:** "Còn 15 phút là về"
- **Lời đọc:** "Còn mười lăm phút là về… thì sếp gọi." (9 âm tiết)
- **Điều hứa hẹn:** chuyện gì xảy ra mà sếp gọi, có kịp về không? **Cảnh trả lời:** `escalate` → `release`.
- **Điểm:** Dừng lướt 1 · Cụ thể 2 · Vòng mở 2 · Gần gũi 2 · Nhanh 2 · Khớp & trả lời 1.
- **Rủi ro:** khung đầu chưa cho thấy lỗi; dễ làm người xem nghĩ trọng tâm là chuyện tăng ca.

## Các phương án khác đã chấm (đủ điều kiện nhưng điểm thấp hơn)
- `result-first` (10/12): "Dòng gây lỗi… là của mình." — lộ cú twist ngay từ đầu, cần câu nối ở cảnh 2.
- `in-medias-res` (10/12): "Hai mươi bảy tin nhắn… và tất cả đều gọi tên mình." — hơi phóng đại, hình phải cho thấy các tin nhắc tên @minh.
- `oddly-specific` bản 2 (11/12): "Có mã giảm giá thì mua được… không có mã thì không!" — chữ chốt đến muộn (âm tiết 11–13).
- `pov-stakes` (8/12, chưa đủ điểm): "Vừa phát hành xong… khách hàng lớn báo không thanh toán được." — thiếu vòng mở, chữ chốt đến muộn.

## Đã loại
- `myth-vs-reality` "Tưởng lập trình viên chỉ gõ code…" — phạm quy tắc 3: câu khẳng định về nghề cần nguồn đã kiểm chứng.
- `wrong-move` "Mình định lặng lẽ sửa, không ai biết…" — cái sai được làm mẫu là giấu lỗi, không nên để học sinh bắt chước.
- `relatable` "Bạn từng làm bài sai rồi cả lớp bị phạt chưa?" — liên hệ gượng ép, câu hỏi có/không không dẫn tới đâu.
