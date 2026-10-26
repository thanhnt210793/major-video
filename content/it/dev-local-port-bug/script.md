# POV: Lập trình viên gặp lỗi khi chạy thử trên máy — và tự tìm ra lỗi khi đang kể cho đồng nghiệp

Bản duyệt này được tạo từ `storyboard.json`; tệp JSON vẫn là nguồn chính. Trạng thái: **đã duyệt** — **Đã duyệt bởi thanhnt210793 ngày 22/10/2026**.

## 1. Đối tượng và mục tiêu học tập

- **Đối tượng:** học sinh THCS/THPT tò mò về nghề lập trình.
- **Mục tiêu:** Thấy một phần công việc thật của lập trình viên: đọc kỹ thông báo lỗi, kiểm tra từng bước, và mẹo kể vấn đề cho người khác nghe ("vịt cao su") để tự tìm ra lỗi.
- **Định dạng:** 47,5 giây, 1080×1920. Góc nhìn POV ngồi ở bàn làm việc nhìn màn hình máy tính (bàn phím, chuột, cửa sổ dòng lệnh), rồi xoay ghế sang đồng nghiệp. Bối cảnh máy macOS.
- **Giọng đọc:** người kể là Hải Đăng (giọng của kênh); chị Mai là **Trúc Ly** (nữ, miền Bắc, tự nhiên) — giọng thứ hai cho câu thoại của đồng nghiệp.
- **Câu hỏi kết:** Bạn đã bao giờ mất cả buổi vì một lỗi rất nhỏ chưa?

## 2. Các thông tin cần kiểm chứng

| Mã | Nội dung (tóm tắt) | Nguồn | Trạng thái |
|---|---|---|---|
| fact-001 | EADDRINUSE nghĩa là cổng/địa chỉ đã có máy chủ khác trên máy chiếm | Tài liệu Node.js (errors) | đã kiểm chứng |
| fact-002 | Máy chủ Node.js thuần in ra `Error: listen EADDRINUSE: address already in use :::3000` | Mã nguồn Node.js (errors.js, net.js), libuv | đã kiểm chứng |
| fact-003 | Trên macOS, `lsof -i :3000 -P` cho thấy tiến trình đang giữ cổng 3000 (`node 4821 … TCP *:3000 (LISTEN)`) | man page lsof; ví dụ macOS | đã kiểm chứng (trung bình) |
| fact-004 | `kill <PID>` gửi tín hiệu TERM, làm chương trình Node.js thoát | man page kill; tài liệu Node.js (process) | đã kiểm chứng |
| fact-005 | `npm run dev` chạy lệnh "dev" trong package.json | Tài liệu npm | đã kiểm chứng |
| fact-006 | Mẹo "vịt cao su": giải thích từng bước cho người khác nghe thường giúp tự tìm ra lỗi; tên bắt nguồn từ sách The Pragmatic Programmer | Wikipedia, blog Michigan Tech | đã kiểm chứng (trung bình) |
| fact-008 | Nhân vật, chị Mai, giờ giấc, PID 4821, chương trình quên tắt từ thứ Sáu là hư cấu | — | tình huống giả lập |

## 3. Kịch bản từng cảnh

Thời lượng giọng đo bằng giọng mẫu thật (bản nghe thử: `audio/draft-narration-preview.wav`).

| Thời gian (giây) | Lời dẫn | Chữ trên màn hình | Hình ảnh | Âm thanh | Giọng |
|---|---|---|---|---|---|
| 0–4 | Sáng thứ Hai, mình chạy thử ứng dụng đang làm… và cả màn hình đỏ lòm. | Thứ Hai · 9:00 | Bàn làm việc, màn hình lớn, hai tay trên bàn phím; terminal chạy `npm run dev` → tràng chữ lỗi đỏ `Error: listen EADDRINUSE: address already in use :::3000` | gõ phím, tiếng báo lỗi | 3,6 s |
| 4–8,4 | Chạy lại lần hai, lần ba… biết đâu nó tự hết. Vẫn lỗi y hệt. | 9:10… 9:25… | Gõ lại `npm run dev`, lỗi hiện thêm hai lần; đồng hồ góc nhảy giờ | gõ phím, báo lỗi | 3,4 s |
| 8,4–14,7 | Đọc kỹ lỗi mới thấy: ứng dụng cần cổng 3000, mà có chương trình khác chiếm rồi. Nhưng là chương trình nào? | EADDRINUSE = cổng đã bị chiếm | Đẩy máy quay vào màn hình, tô sáng dòng `address already in use :::3000` | "pop" nhẹ | 5,4 s |
| 14,7–20,3 | Bí quá, mình quay sang than với chị Mai: “Chị ơi, em tắt hết rồi mà, từ hôm thứ Sáu…” | Hỏi thử chị Mai… | Xoay ghế sang phải: chị Mai ở bàn bên, tai nghe trên cổ, quay sang nghe | ghế xoay | 4,6 s |
| 20,3–24,1 | “Khoan! Thứ Sáu em chạy thử xong… quên chưa tắt!” | Khoan đã! | Chị Mai chưa nói gì, chỉ gật đầu; bóng đèn ý tưởng bật sáng | "pop" nhẹ | 2,7 s |
| 24,1–29 | Kiểm tra cho chắc: đúng là chương trình của mình vẫn đang chiếm cổng. | Thủ phạm: mình của thứ Sáu! | Xoay về màn hình, gõ `lsof -i :3000 -P` → dòng `node 4821 minh 23u IPv6 0x… 0t0 TCP *:3000 (LISTEN)` được tô sáng; nhãn sticker nằm ngoài terminal; thẻ "macOS" | gõ phím | 2,9 s |
| 29–33,2 | Tắt nó đi, chạy lại… xanh rồi! | Chạy được rồi! | Gõ `kill 4821`, rồi `npm run dev` → dòng xanh lá chạy ở `http://localhost:3000`, dấu tick bật lên | gõ phím, tiếng thành công | 2,1 s |
| 33,2–36,9 | *(chị Mai)* Đấy, chị chưa nói câu nào mà em đã tự tìm ra rồi! | Chị chưa nói câu nào! | Xoay sang chị Mai: chị cười, giơ ngón cái, bong bóng thoại | tiếng cười nhẹ | 2,6 s (Trúc Ly) |
| 36,9–43,5 | Đó là mẹo “vịt cao su”: kể từng bước cho ai đó nghe, dù chỉ là một chú vịt, nhiều khi đang kể là tự nhận ra lỗi. | Mẹo: “gỡ lỗi kiểu vịt cao su” (rubber duck debugging) | Chú vịt cao su nhỏ hiện cạnh bàn phím | "pop" nhẹ | 5,8 s |
| 43,5–47,5 | Bạn đã bao giờ mất cả buổi vì một lỗi rất nhỏ chưa? | Kể mình nghe dưới phần bình luận nhé! | Màn hình chạy ổn, con trỏ nháy, vịt đứng cạnh bàn phím | — | 3,1 s |

**Ghi chú dựng hình:**
- **Bộ hình mới, dùng lại được cho các video lập trình sau:** bàn làm việc, màn hình, bàn phím, chuột, tay POV trên bàn phím, cửa sổ terminal, nhân vật đồng nghiệp, chú vịt cao su.
- **Xoay ghế:** máy quay lia ngang (pan) sang phải để chuyển giữa màn hình và chị Mai, có parallax nhẹ.
- **Lệnh và đầu ra trên terminal:** đúng thực tế (macOS). Chỉ câu chuyện là hư cấu.
- **Âm thanh:** chưa có nhạc nền hay SFX vì repo chưa có tệp nào đã kiểm tra giấy phép. Các gợi ý SFX trong bảng là cho bản sau.

## 4. Ghi chú phát âm (giọng đọc)

- **"cổng 3000":** đọc là "cổng ba nghìn" (ttsNarration); phụ đề giữ số.
- **Câu thoại của người kể** trong cảnh xoay ghế: dùng dấu chấm sau "chị Mai" trong ttsNarration để có khoảng ngừng trước "Chị ơi…".
- **Lệnh terminal** (`npm run dev`, `EADDRINUSE`, `lsof`, `kill`, `localhost`) chỉ hiện trên màn hình, không đọc.
- **Cảnh báo sai khớp:** khi tạo phụ đề, công cụ có thể báo cảnh "read" sai khớp ("3000" so với "ba nghìn"). Đó là báo động giả.

## 5. Điểm còn chưa chắc chắn

- **Nguồn về mẹo vịt cao su:** là Wikipedia và một blog của trường đại học; chưa mở được sách gốc. Tên sách không đưa lên màn hình.
- **Dòng `node 4821 …` của lsof:** suy ra từ quy tắc cột trong man page và ví dụ thực tế trên macOS; man page không có dòng mẫu nguyên văn.
- **Đầu ra lỗi thật:** còn vài dòng khác (`node:events…`, tiêu đề của npm). Video chỉ hiện dòng Error, đây là đơn giản hóa hợp lý.

## Vấn đề còn mở

Không có vấn đề nào chặn việc xuất bản. Kết luận của lần kiểm chứng lại: nội dung đủ điều kiện xuất bản, và mẹo vịt cao su giờ khớp với nguồn (nhân vật tự nhận ra lỗi trong lúc kể). Ghi chú cho lúc dựng:
- **Dòng lsof:** phải hiện `IPv6 … TCP *:3000 (LISTEN)` cho khớp với lỗi `:::3000`.
- **Nhãn "Thủ phạm…":** dùng phông của kênh, kiểu sticker nằm ngoài terminal, để không bị đọc nhầm là đầu ra của lệnh.
- **Tùy chọn:** ghim các đường dẫn mã nguồn Node.js (fact-002) vào một phiên bản cố định.
