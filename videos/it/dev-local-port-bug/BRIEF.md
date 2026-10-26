---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Thấy một phần công việc thật của lập trình viên: đọc kỹ thông báo lỗi, kiểm tra từng bước, và mẹo kể vấn đề cho người khác nghe (\"vịt cao su\") để tự tìm ra lỗi."
destination: tiktok-youtube-shorts
aspect: 1080x1920
language: vi
audience: "Học sinh THCS/THPT tò mò về nghề lập trình"
length: 47.5s
angle: narrative
narration: yes
vo_mode: verbatim
voice: "VieNeu-TTS · Hải Đăng (người kể) · Trúc Ly (chị Mai)"
---

## Intent
Video POV 2D hài hước nhẹ về nghề lập trình. Người xem là một lập trình viên ngồi ở bàn làm việc, nhìn màn hình máy tính (bàn phím, chuột, cửa sổ dòng lệnh macOS). Chạy thử ứng dụng thì gặp lỗi cổng 3000 bị chiếm. Bí quá, nhân vật xoay ghế sang than với chị Mai ở bàn bên, và tự nhận ra thủ phạm ngay khi đang kể (mẹo "vịt cao su"). Người dùng muốn xem ngay bản xuất, đặc biệt là đoạn xoay ghế sang chị Mai, nên chạy tự động.

## Assets
- ../../../content/it/dev-local-port-bug/storyboard.json — kịch bản đã duyệt (10 cảnh, lời dẫn, chữ trên màn hình, mô tả hình ảnh, nguồn). Đây là nguồn chính.
- assets/fonts/BeVietnamPro-*.ttf — phông chữ tiếng Việt của kênh (OFL).
- assets/fonts/JetBrainsMono-Variable.ttf — phông đơn cách cho terminal (OFL).
- assets/voice/NN.wav — lời dẫn VieNeu-TTS do /career-voiceover tạo.

## Customizations
- Lời dẫn tạo sẵn bằng VieNeu-TTS; không chạy audio.mjs generate.
- Không có nhạc nền/SFX trong bản này (chưa có tệp đã kiểm tra giấy phép).
- Phụ đề tiếng Việt từ `narration`.

## Notes
- VO_MODE verbatim; 10 khung tương ứng 1:1 với 10 cảnh.
- Lệnh và đầu ra trên terminal phải đúng thực tế macOS/Node.js như mô tả trong storyboard (fact-001…005); chỉ câu chuyện là hư cấu. Dòng lsof: `node 4821 minh 23u IPv6 0x… 0t0 TCP *:3000 (LISTEN)`. Nhãn "Thủ phạm: mình của thứ Sáu!" là sticker bằng phông của kênh, nằm ngoài terminal.
- Bảng màu kênh (assets/style.json): navy #0F1E33, navy nhạt #1B2E4A, xanh ngọc #14B8A6, trắng ngà #F5EFE4; lỗi trên terminal dùng đỏ #E5534B (màu trạng thái lỗi của kênh), thành công dùng xanh lá #3FB68B.
- Đoạn xoay ghế (khung 4, 6, 8, 9) là trọng tâm: máy quay lia ngang có parallax và nhòe chuyển động nhẹ; tay rời bàn phím khi quay sang chị Mai.
