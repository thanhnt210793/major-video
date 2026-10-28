---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Thấy cách một nhóm làm phần mềm xử lý khi lỗi xảy ra trên hệ thống thật, và người gây ra lỗi nên làm gì: báo ngay cho nhóm, ưu tiên để khách dùng lại được, sửa lỗi, rồi cùng rút kinh nghiệm mà không đổ lỗi cho nhau."
destination: tiktok-youtube-shorts
aspect: 1080x1920
language: vi
audience: "Học sinh THCS/THPT đang tìm hiểu nghề nghiệp"
length: 63.4s
angle: narrative
narration: yes
vo_mode: verbatim
voice: "VieNeu-TTS 3.8.3 · Hải Đăng (người kể) · Thiền Tâm Đức (sếp) · Thái Sơn (anh Quân) · Trúc Ly (chị Mai)"
---

## Intent
Video POV 2D về nghề lập trình, vừa kịch tính vừa hài hước ("dở khóc dở cười"). Người xem là lập trình viên ngồi ở bàn làm việc chiều thứ Sáu. Sau khi nhóm phát hành năm tính năng, khách không thanh toán được. Sau đó lần lượt: họp gấp với sếp, anh Quân chốt quay về bản cũ, mình vừa chờ vừa tự nói một mình và đi tìm lỗi, rồi phát hiện dòng gây lỗi do chính mình viết. Thoáng nghĩ giấu lỗi, mình gạt đi và báo ngay. Mình sửa, chị Mai thử lại, cả nhóm phát hành lại, đầu tuần sau rút kinh nghiệm không đổ lỗi. Người duyệt đã duyệt kịch bản ngày 27/10/2026. Video chạy tự động: không dừng chờ ở các bước kế hoạch, phác thảo hay xem trước.

## Assets
- ../../../content/it/loi-production-sau-release/storyboard.json — kịch bản đã duyệt: 14 cảnh với lời dẫn, chữ trên màn hình, hình ảnh, âm thanh (`sound`) và nguồn. Đây là nguồn chính.
- assets/fonts/BeVietnamPro-*.ttf, assets/fonts/JetBrainsMono-Variable.ttf — phông của kênh (OFL).
- assets/voice/NN.wav — lời dẫn VieNeu-TTS. Các cảnh meeting, mitigate và discover dùng lại đúng lượt đọc người duyệt đã nghe trong `content/it/loi-production-sau-release/audio/thu-giong/raw/`, đã xử lý theo bản 2B, 3C, 4B. Cảnh boss có câu mới từ vòng góp ý sau bản xem thử 6, nên được tạo mới cùng giọng và cùng cách lọc của bản 1A.
- assets/sfx/*.mp3|ogg — hiệu ứng CC0 chép từ thư viện của kênh `assets/audio/sfx/` (Freesound và Kenney; giấy phép ghi trong `assets/LICENSES.md`).
- Hình vẽ dùng lại từ bộ dựng của `videos/it/dev-local-port-bug/tools/gen-frames.mjs`: tường văn phòng, dải bàn, màn hình, bàn phím, chuột, tay POV, chị Mai. Tương ứng trong thư viện chung: `assets/2d/backgrounds/office-*.svg`, `devices/desktop-monitor.svg`, `devices/keyboard-mouse.svg`, `hands/pov-hands-keyboard.svg`, `characters/coworker-mai.svg`.
- Hình vẽ mới, vẽ bằng code cho kênh trong `tools/gen-frames.mjs`: anh Quân đứng cạnh bàn chị Mai, sếp trong khung họp online, ly trà sữa, điện thoại kiểm thử, ô đếm đơn lỗi, phòng họp của nhóm (khung 13: màn hình trên tường, bàn họp, chị Mai và hai đồng nghiệp nhìn từ phía sau, anh Quân đứng cạnh màn hình).

## Customizations
- Lời dẫn tạo sẵn bằng VieNeu-TTS (/career-voiceover); không chạy audio.mjs generate, không chạy sync-durations. Thời lượng lấy từ storyboard.json.
- Xử lý giọng: sếp lọc như qua loa máy tính; người kể ở cảnh 3 và 8 chậm 7% kèm vang phòng nhẹ; cảnh 6 nhỏ hơn một chút như nghĩ thầm; cảnh 7 chèn khoảng lặng sau "vậy?" cho tiếng đĩa rít, và vang nhẹ câu "Trời ơi… là mình!".
- Có hiệu ứng âm thanh theo dòng `sound` của từng cảnh.
- Góp ý sau bản xem thử 1 (27/10): người duyệt muốn lỗi trông như "kinh thiên động địa", giọng bớt chán, câu mở đầu hấp dẫn hơn. Vì vậy:
  - Mở đầu B: màn hình đỏ rực, thông báo lỗi bật chồng chất, ô đếm lớn.
  - Giọng người kể: chọn lượt sinh động nhất trong 5 lượt (tools/expressive_takes.py), có kiểm tra bằng Whisper (tools/check-takes.mjs), đọc nhanh hơn 6%.
  - Nhạc nền CC0 (tools/music-bed.mjs): căng thẳng → rón rén hài hước → im lặng → vui tươi, tự nhỏ xuống dưới lời đọc.
  - Thêm còi báo động, braam, riser, nhiễu sóng, điện thoại rung, tiếng "ồ", pháo giấy.
  - Hình: viền đỏ báo động, rung máy quay, loé sáng, đẩy máy quay thật nhanh, khung hình đập theo nhịp tim, pháo giấy.
- Góp ý sau bản xem thử 3 (27/10): ứng dụng trong truyện là sàn mua sắm hư cấu "Giỏ Hời · Siêu Sale Thứ Sáu".
- Góp ý sau bản xem thử 4 (27/10): thêm cảnh `hunt` (khung 7). Bộ đếm dừng ở 463, rồi lần lượt danh sách pull request, màn hình xem thay đổi và tìm kiếm trong code; đồng hồ 17:05 → 17:35; đến "vẫn bí!" thì tay che mặt. Nhạc hài tắt ngang ở "vẫn bí!". Video 14 cảnh, 61,8 s; chủ kênh nâng giới hạn lên 70 s. Các công cụ âm thanh tính khung theo id cảnh.
- Góp ý sau bản xem thử 6 (28/10): sếp ra hạn "Cho em mười phút xem lại code vừa gộp!" thay cho "Bao giờ thì xong?". Đến chữ "mười phút", máy quay đẩy nhanh vào khung sếp và ô cam "Hạn: 10 phút" hiện dưới "Tích tắc…"; ô này mang sang đầu khung 5. Khung 7 nhắc lại "mười phút thành nửa tiếng": ô hạn hiện lại khi đồng hồ chạm 17:11, rồi bị gạch đỏ khi đồng hồ chạy tới 17:35.
- Góp ý sau bản xem thử 7 (28/10): bỏ đoạn tự nói "Tim đập thình thịch… Hay là lặng lẽ sửa cho xong? Không!"; khung 9 cắt từ chính lượt đọc cũ, chỉ còn "Mình báo ngay: Lỗi do em, em tìm ra rồi ạ!", xoay ghế sang đồng nghiệp ngay đầu khung, không còn bong bóng suy nghĩ. Khung 13 chuyển sang phòng họp của nhóm (ROOM trong tools/gen-frames.mjs): tài liệu rút kinh nghiệm chiếu trên màn hình lớn, anh Quân giơ tay chỉ ở chữ "tìm cách", cả nhóm gật gù khi dòng "Ai viết dòng này?" bị gạch.
- Thứ tự dựng lại âm thanh: tools/make-voice.mjs → scripts/build-audio-meta.mjs → tools/fix-timings.mjs (khung 5) → tools/sfx-plan.mjs → tools/music-bed.mjs → tools/build.mjs.
- Phụ đề tiếng Việt lấy từ `narration`. Phụ đề được ngắt theo cụm từ viết tay cho từng cảnh (tools/caption-phrases.mjs, chạy trong tools/build.mjs), để không cắt đôi một từ như "ly trà | sữa".
- Các khung được tạo bằng một bộ dựng chung (tools/gen-frames.mjs) thay vì mỗi khung một sub-agent, để các khung dùng chung bối cảnh, máy quay và lớp phủ nối liền giữa các cảnh (giống video it/dev-local-port-bug).

## Notes
- VO_MODE verbatim; 14 khung tương ứng 1:1 với 14 cảnh.
- Mô phỏng giáo dục hư cấu; không thêm thông tin nghề nào ngoài storyboard. Đoạn code `const ma = maGiamGia.trim();` → `const ma = (maGiamGia ?? "").trim();` và dòng log `TypeError: Cannot read properties of undefined (reading 'trim')` phải giữ đúng như storyboard (fact-006).
- Bảng màu kênh (assets/style.json): navy #0F1E33, navy nhạt #1B2E4A, xanh ngọc #14B8A6, trắng ngà #F5EFE4, cảnh báo #F2A93B, lỗi #E5534B, thành công #3FB68B.
- Ô đỏ "Đơn thanh toán lỗi" là một widget ở góc trên bên phải, nằm trong vùng an toàn, từ cảnh 2 đến đầu cảnh 7 (dừng ở 463 khi bản cũ chạy lại xong). Số chỉ tăng đều, không nảy; từ cảnh 6 mờ còn khoảng 70%.
