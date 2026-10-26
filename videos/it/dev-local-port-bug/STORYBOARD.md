---
format: 1080x1920
duration: 47.5s
message: "Thấy một phần công việc thật của lập trình viên: đọc kỹ thông báo lỗi, kiểm tra từng bước, và mẹo kể vấn đề cho người khác nghe ('vịt cao su') để tự tìm ra lỗi."
arc: Lỗi → Thử lại → Đọc lỗi → Hỏi đồng nghiệp → Tự nhận ra → Kiểm tra → Sửa → Bài học → Câu hỏi
audience: Học sinh THCS/THPT
mode: autonomous
music: none
---

## Video direction

- **Bảng màu (frame.md):** nền #0F1E33, chữ #F5EFE4, nhấn #14B8A6; lỗi trên terminal #E5534B, thành công #3FB68B, sticker #F2A93B.
- **Bộ dùng chung (tools/gen-frames.mjs):** một thế giới rộng 2400 px gồm bàn của nhân vật (màn hình, bàn phím, chuột, vịt) và bàn chị Mai bên phải. Máy quay lia ngang giữa hai vị trí (x = 0 và 1320); tường di chuyển 55% để tạo parallax; nhòe chuyển động khi lia; tay POV ở lớp riêng, rời bàn phím khi xoay sang chị Mai. Nội dung terminal là một bản ghi duy nhất tăng dần qua các khung, nên chuyển khung bằng cut vẫn liền mạch.
- **Chuyển động:** easing đuôi dài; mọi phần tử hiện đúng lúc lời dẫn nhắc tới (thời điểm từng chữ trong audio_meta.json); gõ phím từng ký tự kèm phím sáng.
- **Không có:** 3D, ảnh thật, thương hiệu Next.js/Vite; không dồn mọi thứ ở đầu khung.
- **Thời lượng:** lấy từ storyboard.json; không chạy sync-durations.

## Frame 1 — Lỗi đỏ lòm

- scene: Góc nhìn thứ nhất tại bàn làm việc buổi sáng: màn hình máy tính lớn ở giữa, bàn phím và chuột phía dưới, hai tay đặt trên bàn phím
- duration: 4s
- poster: 3.2
- transition_in: cut
- status: animated
- voiceover: "Sáng thứ Hai, mình chạy thử ứng dụng đang làm… và cả màn hình đỏ lòm."
- src: compositions/frames/01-hook.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Góc nhìn thứ nhất tại bàn làm việc buổi sáng: màn hình máy tính lớn ở giữa, bàn phím và chuột phía dưới, hai tay đặt trên bàn phím. Cửa sổ dòng lệnh (terminal) phóng to vừa chạy `npm run dev` thì tràng chữ lỗi đỏ bật ra gần kín cửa sổ (khoảng giây thứ 2), dòng chính là `Error: listen EADDRINUSE: address already in use :::3000`. Góc trên màn hình có đồng hồ 9:00.

Chữ trên màn hình: Thứ Hai · 9:00

## Frame 2 — Chạy lại

- scene: Hai tay gõ lại `npm run dev` (phím nhấn xuống theo từng chữ, con trỏ nháy); khối lỗi đỏ hiện lại lần hai, rồi lần ba
- duration: 4.4s
- poster: 3.5
- transition_in: cut
- status: animated
- voiceover: "Chạy lại lần hai, lần ba… biết đâu nó tự hết. Vẫn lỗi y hệt."
- src: compositions/frames/02-retry.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Hai tay gõ lại `npm run dev` (phím nhấn xuống theo từng chữ, con trỏ nháy); khối lỗi đỏ hiện lại lần hai, rồi lần ba. Đồng hồ góc màn hình nhảy 9:10 → 9:25.

Chữ trên màn hình: 9:10… 9:25…

## Frame 3 — Đọc kỹ lỗi

- scene: Camera đẩy nhẹ vào màn hình; dòng `address already in use :::3000` được tô sáng bằng vệt highlight xanh ngọc; nhãn chú thích hai dòng hiện cạnh (chính là chữ trên màn hình).
- duration: 6.3s
- poster: 5.0
- transition_in: cut
- status: animated
- voiceover: "Đọc kỹ lỗi mới thấy: ứng dụng cần cổng 3000, mà có chương trình khác chiếm rồi. Nhưng là chương trình nào?"
- src: compositions/frames/03-read.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Camera đẩy nhẹ vào màn hình; dòng `address already in use :::3000` được tô sáng bằng vệt highlight xanh ngọc; nhãn chú thích hai dòng hiện cạnh (chính là chữ trên màn hình).

Chữ trên màn hình: EADDRINUSE = cổng đã bị chiếm

## Frame 4 — Xoay ghế sang chị Mai

- scene: Góc nhìn xoay sang phải (ghế xoay): màn hình trượt ra khỏi khung, hiện chị Mai ngồi bàn bên cạnh, tai nghe đeo trên cổ, quay sang lắng nghe
- duration: 5.6s
- poster: 4.5
- transition_in: cut
- status: animated
- voiceover: "Bí quá, mình quay sang than với chị Mai: “Chị ơi, em tắt hết rồi mà, từ hôm thứ Sáu…”"
- src: compositions/frames/04-turn.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Góc nhìn xoay sang phải (ghế xoay): màn hình trượt ra khỏi khung, hiện chị Mai ngồi bàn bên cạnh, tai nghe đeo trên cổ, quay sang lắng nghe. Một bong bóng thoại nhỏ hiện ra từ phía người kể.

Chữ trên màn hình: Hỏi thử chị Mai…

## Frame 5 — Khoan đã!

- scene: Chị Mai chưa nói gì, chỉ gật đầu; một bóng đèn ý tưởng bật sáng phía trên khung hình.
- duration: 3.8s
- poster: 3.0
- transition_in: cut
- status: animated
- voiceover: "“Khoan! Thứ Sáu em chạy thử xong… quên chưa tắt!”"
- src: compositions/frames/05-realize.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Chị Mai chưa nói gì, chỉ gật đầu; một bóng đèn ý tưởng bật sáng phía trên khung hình.

Chữ trên màn hình: Khoan đã!

## Frame 6 — Tìm thủ phạm

- scene: Xoay ghế về màn hình; hai tay gõ `lsof -i :3000 -P`; terminal in ra dòng tiêu đề `COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME` và dòng `node 4821 minh 23u IPv6 0x… 0t0 TCP *:3000 (LISTEN)` (IPv6 và *:3000 để khớp với lỗi :::3000); dòng này được tô sáng, cột USER "minh" cho thấy đó là chương trình của chính mình
- duration: 4.9s
- poster: 3.9
- transition_in: cut
- status: animated
- voiceover: "Kiểm tra cho chắc: đúng là chương trình của mình vẫn đang chiếm cổng."
- src: compositions/frames/06-find.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Xoay ghế về màn hình; hai tay gõ `lsof -i :3000 -P`; terminal in ra dòng tiêu đề `COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME` và dòng `node 4821 minh 23u IPv6 0x… 0t0 TCP *:3000 (LISTEN)` (IPv6 và *:3000 để khớp với lỗi :::3000); dòng này được tô sáng, cột USER "minh" cho thấy đó là chương trình của chính mình. Nhãn kiểu sticker bằng phông của kênh, có mũi tên, nằm ngoài khung terminal: "Thủ phạm: mình của thứ Sáu!". Thẻ nhỏ "macOS" ở góc terminal.

Chữ trên màn hình: Thủ phạm: mình của thứ Sáu!

## Frame 7 — Sửa xong

- scene: Gõ `kill 4821`, rồi `npm run dev` lần nữa; terminal hiện dòng xanh lá báo ứng dụng đang chạy ở `http://localhost:3000`; một dấu tick (vẽ bằng SVG) bật lên.
- duration: 4.2s
- poster: 3.4
- transition_in: cut
- status: animated
- voiceover: "Tắt nó đi, chạy lại… xanh rồi!"
- src: compositions/frames/07-fix.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Gõ `kill 4821`, rồi `npm run dev` lần nữa; terminal hiện dòng xanh lá báo ứng dụng đang chạy ở `http://localhost:3000`; một dấu tick (vẽ bằng SVG) bật lên.

Chữ trên màn hình: Chạy được rồi!

## Frame 8 — Chị Mai cười

- scene: Xoay lại sang chị Mai: chị bật cười, giơ ngón cái; bong bóng thoại của chị hiện ra.
- duration: 3.7s
- poster: 3.0
- transition_in: cut
- status: animated
- voiceover: "Đấy, chị chưa nói câu nào mà em đã tự tìm ra rồi!"
- src: compositions/frames/08-colleague.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Xoay lại sang chị Mai: chị bật cười, giơ ngón cái; bong bóng thoại của chị hiện ra.

Chữ trên màn hình: Chị chưa nói câu nào!

## Frame 9 — Mẹo vịt cao su

- scene: Trên bàn, cạnh bàn phím, một chú vịt cao su nhỏ hiện ra; nhãn 'gỡ lỗi kiểu vịt cao su' hiện cạnh.
- duration: 6.6s
- poster: 5.3
- transition_in: cut
- status: animated
- voiceover: "Đó là mẹo “vịt cao su”: kể từng bước cho ai đó nghe, dù chỉ là một chú vịt, nhiều khi đang kể là tự nhận ra lỗi."
- src: compositions/frames/09-takeaway.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Trên bàn, cạnh bàn phím, một chú vịt cao su nhỏ hiện ra; nhãn 'gỡ lỗi kiểu vịt cao su' hiện cạnh.

Chữ trên màn hình: Mẹo: “gỡ lỗi kiểu vịt cao su” (rubber duck debugging)

## Frame 10 — Câu hỏi

- scene: Quay lại màn hình máy tính đang chạy ổn; con trỏ nháy trong terminal; chú vịt đứng cạnh bàn phím.
- duration: 4s
- poster: 3.2
- transition_in: cut
- status: animated
- voiceover: "Bạn đã bao giờ mất cả buổi vì một lỗi rất nhỏ chưa?"
- src: compositions/frames/10-question.html
- blueprint: compose
- sfx: (không)

Hình ảnh: Quay lại màn hình máy tính đang chạy ổn; con trỏ nháy trong terminal; chú vịt đứng cạnh bàn phím.

Chữ trên màn hình: Kể mình nghe dưới phần bình luận nhé!

