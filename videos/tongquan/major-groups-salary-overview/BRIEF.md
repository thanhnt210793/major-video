---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Biết 10 nhóm ngành chuyên môn lớn theo phân loại quốc tế và mức thu nhập tương đối của từng nhóm ở các nước OECD, đồng thời hiểu rằng lương chỉ là một trong nhiều yếu tố khi chọn ngành."
destination: tiktok-youtube-shorts
aspect: 1080x1920
language: vi
audience: "Học sinh THCS/THPT đang tìm hiểu ngành học"
length: 60s
angle: listicle
narration: yes
vo_mode: verbatim
voice: "VieNeu-TTS · Hải Đăng"
---

## Intent
Video ngắn định hướng ngành học, khung hình POV 2D: người xem là một học sinh đang so sánh thu nhập của 10 nhóm ngành chuyên môn trên một ứng dụng điện thoại (ứng dụng hư cấu, chung chung). Giọng điệu rõ ràng, thân thiện, trung lập — không khiến nhóm ngành nào bị coi là "kém". Người dùng muốn xem ngay bản xuất video, nên chạy tự động: không dừng ở các bước duyệt kế hoạch hay phác thảo.

## Assets
- ../../../content/tongquan/major-groups-salary-overview/storyboard.json — kịch bản đã duyệt: 10 cảnh, lời dẫn, chữ trên màn hình, mô tả hình ảnh, gợi ý SFX, nguồn số liệu. Đây là nguồn chính.
- assets/fonts/BeVietnamPro-*.ttf — phông chữ hỗ trợ tiếng Việt (OFL), sao chép từ assets/fonts/be-vietnam-pro/ của repo.
- assets/voice/NN.wav — lời dẫn tiếng Việt do /career-voiceover tạo bằng VieNeu-TTS (giọng Hải Đăng), NN = số thứ tự khung hình.

## Customizations
- Lời dẫn được tạo sẵn bằng VieNeu-TTS qua /career-voiceover; không chạy audio.mjs generate (Kokoro không có giọng tiếng Việt).
- Không có nhạc nền và SFX trong bản này: repo chưa có tệp nhạc/SFX đã kiểm tra giấy phép, và chưa đăng nhập HeyGen.
- Phụ đề tiếng Việt từ từ ngữ trong `narration` (thời điểm từng chữ lấy từ Whisper).

## Notes
- VO_MODE verbatim: lời dẫn khung N trong SCRIPT.md = storyboard.json scenes[N-1].narration, giữ nguyên.
- 10 khung hình tương ứng 1:1 với 10 cảnh, theo đúng thứ tự; không gộp, bỏ hay đổi thứ tự.
- Bảng màu (assets/style.json, đang ở dạng đề xuất): navy #0F1E33, navy nhạt #1B2E4A, xanh ngọc #14B8A6, trắng ngà #F5EFE4. Không đặt chữ trắng ngà trên nền xanh ngọc. Thanh trên 100 màu xanh ngọc, sát 100 màu trung tính, dưới 100 màu trắng ngà/xám — không dùng màu đỏ.
- Phong cách: hoạt họa vector 2D phẳng, góc nhìn thứ nhất, hai bàn tay minh họa cầm điện thoại; tay, điện thoại, bảng màu và góc nhìn giữ nhất quán giữa các khung. Chuyển động nhẹ, phục vụ nội dung; không 3D, không ảnh thật.
- Biểu đồ thanh ngang xây dần từ khung 2 đến khung 7 với cùng một thang đo và vị trí; chú thích nguồn OECD giữ nguyên trong các khung biểu đồ, nằm trên vùng giao diện đáy của TikTok/Shorts.
- Đây là mô phỏng giáo dục hư cấu; không thêm thông tin nào ngoài kịch bản đã duyệt.
