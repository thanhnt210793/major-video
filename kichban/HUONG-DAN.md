# Hướng dẫn làm video với Claude

Bạn không cần biết lập trình. Bạn chỉ cần làm 4 việc:
1. Viết ý tưởng.
2. Đọc và sửa kịch bản.
3. Bấm duyệt.
4. Xem video rồi nói muốn sửa gì.

Mọi việc còn lại Claude làm.

## Bắt đầu

1. Mở VS Code, mở thư mục **majors-video**.
2. Mở khung chat Claude bằng biểu tượng Claude ở thanh bên.
3. Gõ `/lam-video`, xuống dòng, rồi viết ý tưởng. Nếu bạn quên gõ `/lam-video` cũng không sao: cứ viết ý tưởng, Claude sẽ hiểu.

## Viết ý tưởng thế nào

Viết tự nhiên, không cần hay, không cần đủ. Có thể dựa theo mẫu này:

```
/lam-video
Nghề: lập trình viên
Tình huống: khách báo hoá đơn bị lệch đúng 1 đồng
Muốn người xem hiểu: sửa lỗi là phải tìm cho ra nguyên nhân, không đoán mò
Câu chuyện: mình nhận tin nhắn của khách, mở hoá đơn ra xem, thử lại thì đúng là lệch 1 đồng.
Hoá ra máy tính cộng số lẻ không chính xác tuyệt đối...
Ghi chú: giọng vui, dài khoảng 45 giây
```

Mẹo: ý tưởng càng cụ thể, video càng hay. Chọn **một tình huống**, có **một khoảnh khắc bất ngờ**.

## Các bước

| Bước | Bạn làm | Claude làm | Mất khoảng |
|---|---|---|---|
| 1. Ý tưởng | Viết ý tưởng vào khung chat | Lưu lại ý tưởng | — |
| 2. Gợi ý | Đọc gợi ý, bấm chọn hướng đi nếu được hỏi | Phân tích ý tưởng, gợi ý cách tập trung vào một thông điệp | Vài phút |
| 3. Kịch bản | Chờ | Tìm nguồn, kiểm tra thông tin, viết kịch bản, mở file kịch bản cho bạn | 10–20 phút |
| 4. Duyệt | Đọc, sửa, góp ý, rồi duyệt (xem mục dưới) | Cập nhật theo góp ý và báo lại những gì đã đổi | — |
| 5. Video | Chờ, rồi xem video | Dựng video, tự kiểm tra, mở video cho bạn xem | 20–40 phút |
| 6. Sửa video | Nhắn điều muốn sửa | Sửa, dựng lại, mở bản mới | 5–15 phút mỗi lượt |
| 7. Chốt | Nhắn "chốt", xem lại trên điện thoại | Kiểm tra lần cuối, mở thư mục chứa video để bạn tự đăng | Vài phút |

Trong lúc chờ, bạn có thể làm việc khác. Cuối mỗi tin nhắn, Claude luôn ghi **"Việc của bạn: …"** để bạn biết cần làm gì tiếp.

## Đọc và sửa file kịch bản

Claude tự mở file `kichban_<tên video>_final.md`. File nằm trong thư mục của nhóm ngành, ví dụ `kichban/it/` hay `kichban/giaovien/`; Claude tự chọn nhóm và báo cho bạn. Mỗi cảnh có 4 dòng:
- **Lời đọc:** câu giọng đọc sẽ nói. Phụ đề cũng lấy từ đây.
- **Chữ trên màn hình:** chữ to hiện trên video.
- **Hình ảnh:** mô tả cảnh người xem nhìn thấy.
- **Âm thanh:** tiếng động, hiệu ứng và không khí của cảnh (ví dụ tiếng tin nhắn dồn dập, tiếng tim đập). Claude tìm âm thanh có giấy phép dùng hợp lệ cho đúng mô tả này.

Cách sửa:
- Sửa thẳng phần chữ **sau dấu hai chấm**. Giữ nguyên phần đầu dòng như `- **Lời đọc:**`.
- Không muốn có chữ trên màn hình thì ghi `(không có)`.
- Góp ý khác (cảnh dài quá, muốn đổi giọng vui hơn, dùng mở đầu dự phòng…) thì viết vào mục **Ý kiến của người duyệt**, mỗi ý một dòng.
- Bấm **Ctrl+S** để lưu. Muốn xem file dạng trình bày đẹp thì bấm **Ctrl+Shift+V**. Chế độ này chỉ để xem, muốn sửa thì quay lại tab gốc.

Khi xong:
- Nếu mới sửa hoặc góp ý, nhắn Claude **"đã sửa"**. Claude cập nhật rồi báo lại.
- Nếu đồng ý toàn bộ, ở mục **Duyệt** đổi `- [ ]` thành `- [x]`, ghi tên và ngày, lưu lại, rồi nhắn **"đã duyệt"**.

Phần **Thông tin trong video và nguồn** cho biết thông tin nào Claude đã kiểm tra nguồn và thông tin nào chỉ là tình huống giả lập. Bạn không cần sửa phần này.

## Góp ý video thế nào

Nói cụ thể **cảnh nào**, **cái gì**, **muốn ra sao**. Ví dụ:
- "Cảnh 3 chữ nhỏ quá, khó đọc trên điện thoại."
- "Giọng đọc đọc sai chữ *localhost*."
- "Mở đầu hơi chậm, muốn thấy lỗi ngay."
- "Đổi câu cảnh 5 thành: Khoan đã, hình như mình quên tắt máy!"

Đổi màu hay cỡ chữ thì Claude sửa ngay. Đổi lời thoại thì Claude kiểm tra lại độ dài và thông tin trước khi sửa. Nếu đổi cả câu chuyện, ví dụ thêm hoặc bớt cảnh, kịch bản sẽ phải duyệt lại.

## Làm tiếp một video cũ

Gõ `/lam-video` kèm tên video, ví dụ `/lam-video hoa-don-lech-1-dong`. Hoặc nói tự nhiên: "làm tiếp video hoá đơn lệch 1 đồng".

## Khi máy hỏi xin phép

Đôi khi một hộp thoại hiện lên hỏi có cho chạy một lệnh không. Claude thường báo trước việc này.
- Nếu Claude đã báo trước, bấm **Yes**.
- Nếu thấy lạ, bấm **No** rồi hỏi Claude: "lệnh này để làm gì?"

## Claude sẽ không bao giờ

- Tự đăng video lên mạng. Bạn tự đăng.
- Tự duyệt kịch bản thay bạn.
- Đưa thông tin chưa kiểm chứng vào video sẽ đăng.
