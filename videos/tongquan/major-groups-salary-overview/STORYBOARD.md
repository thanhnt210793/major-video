---
format: 1080x1920
duration: 60s
message: "Biết 10 nhóm ngành chuyên môn lớn theo phân loại quốc tế và mức thu nhập tương đối của từng nhóm ở các nước OECD, đồng thời hiểu rằng lương chỉ là một trong nhiều yếu tố khi chọn ngành."
arc: Hook → Mốc so sánh → Xếp hạng (trên → dưới mức chung) → Việt Nam → Bài học → Câu hỏi
audience: Học sinh THCS/THPT
mode: autonomous
music: none
---

## Video direction

- **Bảng màu (frame.md):** nền bg #0F1E33; chữ text #F5EFE4; nhấn primary #14B8A6; chữ phụ text-muted #B8C4D3. Thanh trên 100 dùng primary, sát 100 dùng xám xanh #7F8FA3, dưới 100 dùng trắng ngà/xám #BDB6A9, không dùng màu đỏ.
- **Bộ dùng chung (tools/gen-frames.mjs):** nền bàn học buổi tối, điện thoại và hai bàn tay POV, biểu đồ thanh ngang cùng thang đo (3,6 px/điểm, vạch 100 cố định) để biểu đồ liền mạch từ khung 2 đến khung 9. Khung được sinh từ bộ dùng chung thay vì giao cho 10 sub-agent, để giữ hình học giống hệt nhau.
- **Chuyển động:** easing đuôi dài power3; mỗi phần chỉ hiện khi lời dẫn nhắc tới (mốc thời gian lấy từ thời điểm từng chữ trong audio_meta.json). Máy quay đẩy vào rất nhẹ và liên tục qua cả video (scale 1 → 1,035), nền trôi nhẹ để tạo parallax. Chuyển khung bằng cut; sự liền mạch do bộ dùng chung bảo đảm.
- **Nhịp:** khung 7 lùi nhẹ để thấy đủ 10 thanh; khung 9 là khung lắng (giấy nhớ). Còn lại là đúng một ý mỗi khung.
- **Không có:** đỏ cho nhóm thấp, 3D, ảnh thật, hiệu ứng trang trí vô nghĩa; không dồn mọi thứ ở đầu khung (kiểu slide), không để mọi thứ trôi lơ lửng (kiểu màn hình chờ).
- **Thời lượng:** lấy từ storyboard.json (đã đo theo giọng thật cộng khoảng nghỉ); không chạy audio.mjs sync-durations vì nó sẽ cắt khung bằng đúng độ dài giọng và bỏ các khoảng nghỉ.

## Frame 1 — Mở đầu — 10 nhóm ngành

- scene: Góc nhìn thứ nhất, bàn học buổi tối: hai bàn tay minh họa cầm điện thoại lên; màn hình sáng với một ứng dụng chung chung tên 'So sánh nhóm ngành', lưới 10 biểu tượng nhóm ngành lần lượt hiện ra nhanh.
- duration: 4s
- poster: 3.2
- transition_in: cut
- status: animated
- voiceover: "Nhóm ngành nào thu nhập cao nhất? Cùng xem 10 nhóm ngành chuyên môn lớn."
- src: compositions/frames/01-hook.html
- blueprint: kinetic-type-beats (Adapt)
- focal: số 10 và lưới 10 biểu tượng nhóm ngành
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Góc nhìn thứ nhất, bàn học buổi tối: hai bàn tay minh họa cầm điện thoại lên; màn hình sáng với một ứng dụng chung chung tên 'So sánh nhóm ngành', lưới 10 biểu tượng nhóm ngành lần lượt hiện ra nhanh.

Chữ trên màn hình: 10 nhóm ngành chuyên môn · theo phân loại quốc tế của UNESCO

## Frame 2 — Mốc 100

- scene: Ngón cái chạm vào mục 'Thu nhập'; lưới biểu tượng chuyển thành biểu đồ thanh ngang còn trống, có một đường gạch đứt thẳng đứng ghi '100 = mức chung'
- duration: 6.4s
- poster: 5.1
- transition_in: cut
- status: animated
- voiceover: "Ở các nước OECD, mốc 100 là mức thu nhập chung của người trẻ có bằng cao đẳng trở lên."
- src: compositions/frames/02-baseline.html
- blueprint: dataviz-countup (Adapt)
- focal: vạch 100 = mức chung
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Ngón cái chạm vào mục 'Thu nhập'; lưới biểu tượng chuyển thành biểu đồ thanh ngang còn trống, có một đường gạch đứt thẳng đứng ghi '100 = mức chung'. Một dòng chú thích hai dòng hiện lên phía trên vùng giao diện đáy của TikTok/Shorts và giữ nguyên qua tất cả các cảnh biểu đồ (từ cảnh này đến cảnh below-average-2).

Chữ trên màn hình: 100 = mức chung · Chú thích: 25–34 tuổi, làm toàn thời gian · các nước OECD, năm 2023 · không gồm Việt Nam

## Frame 3 — Dẫn đầu: Công nghệ thông tin

- scene: Thanh đầu tiên (biểu tượng Công nghệ thông tin) dài ra vượt đường 100, dừng ở 124, màu xanh ngọc; nhãn ghi '124 (+24%)' một lần để người xem biết cách đọc chỉ số.
- duration: 4.2s
- poster: 3.4
- transition_in: cut
- status: animated
- voiceover: "Công nghệ thông tin dẫn đầu, cao hơn mức chung khoảng 24%."
- src: compositions/frames/03-top-ict.html
- blueprint: dataviz-countup (Adapt)
- focal: thanh Công nghệ thông tin 124 (+24%)
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Thanh đầu tiên (biểu tượng Công nghệ thông tin) dài ra vượt đường 100, dừng ở 124, màu xanh ngọc; nhãn ghi '124 (+24%)' một lần để người xem biết cách đọc chỉ số.

Chữ trên màn hình: Công nghệ thông tin: 124 (+24%)

## Frame 4 — Trên mức chung

- scene: Hai thanh xanh ngọc dài ra vượt đường 100 (Kỹ thuật – Xây dựng 108, Kinh doanh – Luật 102), sau đó thanh thứ ba dừng ngay sát đường 100 với màu trung tính (Khoa học tự nhiên – Toán 101)
- duration: 5.8s
- poster: 4.6
- transition_in: cut
- status: animated
- voiceover: "Kỹ thuật và xây dựng, Kinh doanh và luật cũng cao hơn. Khoa học tự nhiên và toán gần ngang mức chung."
- src: compositions/frames/04-above-average.html
- blueprint: grid-card-assemble (Adapt)
- focal: ba thanh 108 · 102 · 101
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Hai thanh xanh ngọc dài ra vượt đường 100 (Kỹ thuật – Xây dựng 108, Kinh doanh – Luật 102), sau đó thanh thứ ba dừng ngay sát đường 100 với màu trung tính (Khoa học tự nhiên – Toán 101). Nhãn của mỗi thanh hiện cùng lúc với thanh đó.

Chữ trên màn hình: Kỹ thuật – Xây dựng 108 · Kinh doanh – Luật 102 · Khoa học tự nhiên – Toán 101

## Frame 5 — Sức khỏe và phúc lợi

- scene: Thanh 'Sức khỏe và phúc lợi' dừng đúng ở đường 100
- duration: 9.1s
- poster: 7.3
- transition_in: cut
- status: animated
- voiceover: "Sức khỏe và phúc lợi ngang mức chung. Nhưng y khoa, nha khoa cao hơn khoảng 16%, còn điều dưỡng và các ngành sức khỏe liên quan thấp hơn khoảng 7%."
- src: compositions/frames/05-health-split.html
- blueprint: dataviz-countup (Adapt)
- focal: thanh Sức khỏe & phúc lợi trên vạch 100 + thẻ ví dụ 116 / 93
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Thanh 'Sức khỏe và phúc lợi' dừng đúng ở đường 100. Bên dưới hiện hai thanh ví dụ kèm nhãn nhỏ 'ví dụ trong nhóm · số liệu 6 nước' (không vẽ như các phần cộng lại thành thanh 100): 'Y khoa, Nha khoa' ở 116 và 'Điều dưỡng & ngành liên quan' ở 93.

Chữ trên màn hình: Sức khỏe & phúc lợi 100 · ví dụ trong nhóm (số liệu 6 nước): Y khoa, Nha khoa 116 · Điều dưỡng & ngành liên quan 93

## Frame 6 — Hơi thấp hơn

- scene: Hai thanh dừng trước đường 100, màu trắng ngà/xám (không dùng màu đỏ): Khoa học xã hội – Báo chí 97, Nghệ thuật – Nhân văn 86.
- duration: 5.5s
- poster: 4.4
- transition_in: cut
- status: animated
- voiceover: "Khoa học xã hội, báo chí hơi thấp hơn. Nghệ thuật và nhân văn thấp hơn khoảng 14%."
- src: compositions/frames/06-below-average-1.html
- blueprint: grid-card-assemble (Adapt)
- focal: hai thanh 97 · 86
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Hai thanh dừng trước đường 100, màu trắng ngà/xám (không dùng màu đỏ): Khoa học xã hội – Báo chí 97, Nghệ thuật – Nhân văn 86.

Chữ trên màn hình: Khoa học xã hội – Báo chí 97 · Nghệ thuật – Nhân văn 86

## Frame 7 — Cuối bảng

- scene: Ba thanh xám cuối cùng hoàn thành biểu đồ: 'Dịch vụ' (nhãn phụ nhỏ 'du lịch, khách sạn…') 85, Giáo dục 82, Nông – Lâm – Thủy sản, Thú y 81
- duration: 6.3s
- poster: 5.0
- transition_in: cut
- status: animated
- voiceover: "Dịch vụ, Giáo dục, rồi Nông lâm thủy sản và thú y ở cuối bảng, thấp hơn khoảng 15 đến 19%."
- src: compositions/frames/07-below-average-2.html
- blueprint: grid-card-assemble (Adapt)
- focal: ba thanh cuối 85 · 82 · 81 + toàn bộ biểu đồ
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Ba thanh xám cuối cùng hoàn thành biểu đồ: 'Dịch vụ' (nhãn phụ nhỏ 'du lịch, khách sạn…') 85, Giáo dục 82, Nông – Lâm – Thủy sản, Thú y 81. Khung hình lùi ra nhẹ để thấy đủ 10 thanh.

Chữ trên màn hình: Dịch vụ (du lịch, khách sạn…) 85 · Giáo dục 82 · Nông – Lâm – Thủy sản, Thú y 81

## Frame 8 — Việt Nam theo bằng cấp

- scene: Ngón cái vuốt sang thẻ thứ hai có tiêu đề 'Việt Nam 2024 · theo bằng cấp': hai biểu tượng người với hai thanh, nhãn 'Chưa có bằng, chứng chỉ nghề: 1' và 'Đại học trở lên: gấp ≈ 1,6 lần'
- duration: 8.1s
- poster: 6.5
- transition_in: cut
- status: animated
- voiceover: "Còn ở Việt Nam, người làm công ăn lương từ đại học trở lên có thu nhập gấp khoảng 1,6 lần người chưa có bằng hay chứng chỉ nghề, chuyên môn."
- src: compositions/frames/08-vietnam.html
- blueprint: comparison-split (Adapt)
- focal: hai cột 1 và ≈ gấp 1,6 lần
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Ngón cái vuốt sang thẻ thứ hai có tiêu đề 'Việt Nam 2024 · theo bằng cấp': hai biểu tượng người với hai thanh, nhãn 'Chưa có bằng, chứng chỉ nghề: 1' và 'Đại học trở lên: gấp ≈ 1,6 lần'. Nhãn nguồn nhỏ 'Nguồn: Cục Thống kê'.

Chữ trên màn hình: Việt Nam 2024 · theo bằng cấp: đại học trở lên ≈ gấp 1,6 lần

## Frame 9 — Bài học

- scene: Câu thứ nhất: vuốt về biểu đồ 10 thanh, có con dấu 'Số liệu OECD · không gồm Việt Nam'
- duration: 6.8s
- poster: 5.4
- transition_in: cut
- status: animated
- voiceover: "Bảng nhóm ngành là số liệu nước ngoài, không phải Việt Nam. Lương còn tùy công việc và kinh nghiệm, đừng chọn ngành chỉ vì lương."
- src: compositions/frames/09-takeaway.html
- blueprint: titlecard-reveal (Adapt)
- focal: con dấu "Số liệu OECD · không gồm Việt Nam" rồi giấy nhớ 4 mục
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Câu thứ nhất: vuốt về biểu đồ 10 thanh, có con dấu 'Số liệu OECD · không gồm Việt Nam'. Câu thứ hai: điện thoại nghiêng xuống, trên bàn hiện một tờ giấy nhớ với bốn mục lần lượt được đánh dấu.

Chữ trên màn hình: Sở thích · Năng lực · Nhu cầu xã hội · Thu nhập

## Frame 10 — Câu hỏi

- scene: Quay lại điện thoại: lưới 10 biểu tượng nhóm ngành và một ô bình luận có con trỏ nhấp nháy; hai tay giữ điện thoại yên.
- duration: 3.8s
- poster: 3.0
- transition_in: cut
- status: animated
- voiceover: "Bạn đang nghiêng về nhóm ngành nào? Bình luận cho mình biết nhé!"
- src: compositions/frames/10-question.html
- blueprint: titlecard-reveal (Adapt)
- focal: câu hỏi + ô bình luận
- sfx: (không — chưa có SFX đã kiểm tra giấy phép)

Hình ảnh: Quay lại điện thoại: lưới 10 biểu tượng nhóm ngành và một ô bình luận có con trỏ nhấp nháy; hai tay giữ điện thoại yên.

Chữ trên màn hình: Bạn nghiêng về nhóm nào? Bình luận nhé!

