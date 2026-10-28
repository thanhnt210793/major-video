---
format: 1080x1920
duration: 60.6s
message: "Thấy cách một nhóm làm phần mềm xử lý khi lỗi xảy ra trên hệ thống thật, và người gây ra lỗi nên làm gì: báo ngay cho nhóm, ưu tiên để khách dùng lại được, sửa lỗi, rồi cùng rút kinh nghiệm mà không đổ lỗi cho nhau."
arc: Lỗi → Báo lên sếp → Họp gấp → Sếp ra hạn mười phút → Quay về bản cũ → Tự nói một mình → Mười phút thành nửa tiếng → Thì ra là mình → Báo ngay → Thử lại → Đạt → Phát hành lại → Họp rút kinh nghiệm → Câu hỏi
audience: Học sinh THCS/THPT
mode: autonomous
music: none
---

## Video direction

- **Bảng màu (frame.md, assets/style.json):** nền #0F1E33, navy nhạt #1B2E4A, chữ #F5EFE4, nhấn #14B8A6; cảnh báo #F2A93B, lỗi #E5534B, thành công #3FB68B.
- **Bộ dùng chung (tools/gen-frames.mjs):** một thế giới rộng 2400 px gồm bàn của nhân vật (màn hình, bàn phím, chuột, ly trà sữa), và bên phải là bàn chị Mai có anh Quân đứng cạnh. Máy quay lia ngang giữa hai vị trí (x = 0 và 1320), tường di chuyển 55% để tạo parallax, nhòe nhẹ khi lia. Tay POV nằm ở lớp riêng. Nội dung màn hình (trang thanh toán, chat, họp online, trình soạn thảo, xem lịch sử, tài liệu) là HTML trong khung màn hình. Riêng khung 13 là phòng họp của nhóm: tài liệu rút kinh nghiệm chiếu trên màn hình lớn trên tường, anh Quân đứng cạnh, chị Mai và hai đồng nghiệp ngồi quanh bàn (nhìn từ phía sau), tay POV đặt trên cuốn sổ.
- **Ô đỏ "Đơn thanh toán lỗi":** một widget ở lớp màn hình, góc trên bên phải (vùng an toàn). Xuất hiện từ khung 2; số chỉ tăng đều; từ khung 5 có thanh tiến trình bên dưới, từ khung 6 mờ còn khoảng 70%. Đầu khung 7 (bản cũ chạy lại xong) số dừng ở 463, chuyển xám kèm dấu tick rồi ẩn.
- **Chuyển động (assets/style.json → motion):** easing đuôi dài, đơn vị thời gian 0,4 s. Mỗi phần tử hiện đúng lúc lời dẫn nhắc tới (theo thời điểm từng chữ trong audio_meta.json). Mỗi khung chỉ một thứ chính. Không áp dụng overshoot cho số hay thông tin. Lớp phủ của khung trước được mang sang đầu khung sau rồi mờ dần, nên không có gì biến mất đột ngột ở chỗ cắt.
- **Không có:** 3D, ảnh thật, emoji (dấu tick, X, giọt mồ hôi vẽ bằng SVG), thương hiệu thật.
- **Thời lượng:** lấy từ storyboard.json; không chạy sync-durations.

## Frame 1 — Không mã là không thanh toán

- scene: Khung đầu tiên (0,0 s): màn hình máy tính đỏ rực
- duration: 3.6s
- poster: 1.2
- transition_in: cut
- status: animated
- voiceover: "Mười phút sau khi phát hành… hàng trăm khách không thanh toán được!"
- src: compositions/frames/01-hook.html
- blueprint: compose
- hero: thông báo đỏ "Thanh toán thất bại" cạnh ô mã giảm giá trống
- support: nhãn "Thứ Sáu · 16:45", đẩy máy quay vào
- texture: hai tay POV trên bàn phím, tường văn phòng
- sfx: alarm, braam, glitch, error-beep
- voice: Hải Đăng

Hình ảnh: Khung đầu tiên (0,0 s): màn hình máy tính đỏ rực. Trang thanh toán của sàn mua sắm hư cấu "Giỏ Hời" giữa đợt sale: banner vàng "SIÊU SALE THỨ SÁU · GIẢM ĐẾN 50%" với đồng hồ đếm ngược đang chạy, món hàng "Tai nghe không dây" gắn nhãn "-50%", ô "Mã giảm giá" để trống, và thông báo đỏ lớn "Thanh toán thất bại", và các thông báo "Thanh toán thất bại" khác đang bật lên chồng lên nhau. Viền đỏ quanh khung hình nhấp nháy như đèn báo động. Ô đếm lớn giữa màn hình "Đơn thanh toán lỗi" đã chạy (47 → 120 → 200+). Nhãn "Thứ Sáu · 16:45" có sẵn. 0,0–1,0 s: máy quay giật mạnh một nhịp cùng tiếng "bùm", rồi đẩy nhanh vào ô đếm. Cuối cảnh, ô đếm thu nhỏ bay về góc trên bên phải.

Chữ trên màn hình: Thứ Sáu · 16:45

Âm thanh: Còi báo động vang ngay từ giây đầu, một tiếng "bùm" trầm thật lớn, tiếng nhiễu sóng khi thông báo đỏ bật lên; nhạc nền căng thẳng bắt đầu từ đây.

## Frame 2 — Báo lên tận sếp

- scene: Màn hình chat nhóm trên máy tính: tin nhắn lúc 16:35 "Đã phát hành 5 tính năng mới cho Siêu Sale Thứ Sáu" kèm pháo giấy
- duration: 3.6s
- poster: 3.2
- transition_in: cut
- status: animated
- voiceover: "Vừa phát hành năm tính năng, khách hàng lớn đã báo lên tận sếp."
- src: compositions/frames/02-escalate.html
- blueprint: compose
- hero: thẻ cảnh báo tự động bay về góc thành ô đỏ đếm đơn lỗi
- support: tin nhắn của sếp, chữ "10 phút sau khi phát hành"
- texture: tin nhắn dồn lên, pháo giấy của tin phát hành
- sfx: error-beep, notification
- voice: Hải Đăng

Hình ảnh: Màn hình chat nhóm trên máy tính: tin nhắn lúc 16:35 "Đã phát hành 5 tính năng mới cho Siêu Sale Thứ Sáu" kèm pháo giấy; ngay dưới, thẻ đỏ "Cảnh báo tự động: thanh toán lỗi tăng vọt" bật lên, rồi thu nhỏ bay vào ô đỏ "Đơn thanh toán lỗi" ở góc trên bên phải (ô đỏ lúc này 212 và tiếp tục tăng); tin nhắn mới dồn lên liên tục, tin cuối của sếp: "Khách hàng lớn báo không thanh toán được!" Từ cuối cảnh 1 đến đầu cảnh 7 (đoạn tìm lỗi), ô đỏ luôn nằm ở góc trên bên phải, trong vùng an toàn (dưới thanh trên cùng của app, tránh cột nút bên phải); số chỉ tăng đều, không nhấp nháy, không nảy, không phóng to.

Chữ trên màn hình: 10 phút sau khi phát hành

Âm thanh: Tiếng cảnh báo "bíp bíp" khi thẻ đỏ bật lên, rồi tiếng tin nhắn "ting ting" dồn dập, mỗi lúc một nhanh hơn.

## Frame 3 — Họp gấp

- scene: Cuộc họp online gấp hiện trên màn hình: khung lớn của sếp đang họp từ xa (nhãn "Sếp", mặt nghiêm)
- duration: 3.6s
- poster: 2.4
- transition_in: cut
- status: animated
- voiceover: "Cả nhóm im phăng phắc, ly trà sữa còn chưa kịp uống."
- src: compositions/frames/03-meeting.html
- blueprint: compose
- hero: khung họp của sếp, máy quay đẩy chậm vào
- support: tay POV với ly trà sữa rồi rụt về, "17:00 · Họp gấp"
- texture: khung nhỏ của cả nhóm, micro tắt, ô đỏ 87
- sfx: tension-drone, clock-tick, heartbeat
- voice: Hải Đăng

Hình ảnh: Cuộc họp online gấp hiện trên màn hình: khung lớn của sếp đang họp từ xa (nhãn "Sếp", mặt nghiêm); khung nhỏ là cả nhóm — mình, chị Mai, anh Quân — ngồi chung bàn, vào họp bằng một máy; đồng hồ góc màn hình 17:00. Trên bàn, ly trà sữa đầy đá, ống hút còn nguyên vỏ; đến chữ "ly trà sữa", tay POV với tới ly, khựng lại giữa chừng rồi rụt về, đúng lúc máy quay đẩy chậm vào khung của sếp. Ô đỏ góc màn hình tăng đều lên 300.

Chữ trên màn hình: 17:00 · Họp gấp

Âm thanh: Tiếng tin nhắn tắt hẳn; giọng người kể chậm lại một chút, hơi vang như trong phòng họp; dưới giọng là tiếng đồng hồ tích tắc, tiếng tim đập rõ dần và một tiếng nền trầm, kéo dài, căng thẳng.

## Frame 4 — Hạn mười phút

- scene: Khung của sếp phóng to gần kín màn hình, sếp nhìn thẳng vào máy quay, giọng điềm tĩnh mà dứt khoát
- duration: 5.3s
- poster: 2.6
- transition_in: cut
- status: animated
- voiceover: "“Khách lớn đang chờ đấy. Cho em mười phút xem lại code vừa gộp!”"
- src: compositions/frames/04-boss.html
- blueprint: compose
- hero: khuôn mặt sếp gần kín màn hình, vòng sáng "đang nói", đẩy nhanh vào ở chữ "mười phút"
- support: chữ nhỏ "Tích tắc… tích tắc…" và ô cam "Hạn: 10 phút"
- texture: tay POV siết mép bàn, ô đỏ 112
- sfx: clock-tick, heartbeat, tension-hit
- voice: Thiền Tâm Đức

Hình ảnh: Khung của sếp phóng to gần kín màn hình, sếp nhìn thẳng vào máy quay, giọng điềm tĩnh mà dứt khoát; nhãn "Sếp" vẫn rõ trên khung, biểu tượng micro của sếp bật, có vòng sáng "đang nói"; hai tay POV siết nhẹ mép bàn. Chữ "Tích tắc… tích tắc…" nhỏ, cạnh biểu tượng đồng hồ, đặt ở phía đối diện ô đỏ, không dùng màu báo lỗi, không che phụ đề hay nhãn "Sếp". Đến chữ "mười phút", máy quay đẩy nhanh vào khung sếp và ngay dưới chữ "Tích tắc…" hiện một ô nhỏ màu cam "Hạn: 10 phút" (đồng hồ trên màn hình đang là 17:01). Ô đỏ góc màn hình tăng đều lên 340 (không nảy).

Chữ trên màn hình: Tích tắc… tích tắc…

Âm thanh: Giọng sếp (giọng nam trầm, khác giọng người kể), điềm tĩnh, chậm rãi, nghiêm, nghe như qua loa máy tính vì đang họp online; nói xong là một nhịp im lặng, chỉ còn tiếng tích tắc, tiếng tim đập và một tiếng "thụp" trầm.

## Frame 5 — Quay về bản cũ trước

- scene: Anh Quân (nhãn tên "Anh Quân · trưởng nhóm") nói vào cuộc họp, giơ tay chốt
- duration: 5.2s
- poster: 4.4
- transition_in: cut
- status: animated
- voiceover: "“Cứ quay về bản cũ đã, để khách thanh toán lại được ngay. Sửa lỗi tính sau!”"
- src: compositions/frames/05-mitigate.html
- blueprint: compose
- hero: anh Quân giơ tay chốt
- support: thanh "Đang quay về bản cũ…" lớn giữa màn hình rồi thu về góc
- texture: chị Mai bên cạnh, nhãn tên anh Quân
- sfx: whoosh
- voice: Thái Sơn

Hình ảnh: Anh Quân (nhãn tên "Anh Quân · trưởng nhóm") nói vào cuộc họp, giơ tay chốt. Đến câu "Sửa lỗi tính sau!", thanh "Đang quay về bản cũ…" bật lên lớn ở giữa màn hình cùng chữ "Ưu tiên 1: khách dùng lại được"; cuối cảnh, thanh thu nhỏ về nằm ngay dưới số trong ô đỏ ở góc (lúc này 380) và vẫn chạy chậm, để người xem thấy việc quay về bản cũ đang diễn ra song song với các cảnh sau.

Chữ trên màn hình: Ưu tiên 1: khách dùng lại được

Âm thanh: Giọng anh Quân (giọng nam miền Nam, khác người kể và sếp), dứt khoát; tiếng "vút" khi thanh "Đang quay về bản cũ…" bắt đầu chạy; tiếng tích tắc vẫn còn nhưng nhỏ dần.

## Frame 6 — Tự nói một mình

- scene: Ba nhịp liền nhau
- duration: 6s
- poster: 5.4
- transition_in: cut
- status: animated
- voiceover: "Ơ kìa, trên máy mình vẫn chạy ngon lành… Đoạn này hôm trước mình làm đúng rồi mà nhỉ? Hay ai sửa đè lên?"
- src: compositions/frames/06-works-locally.html
- blueprint: compose
- hero: lần lượt: màn hình chia đôi tick/X → đoạn code với dấu "?" → cú liếc sang bàn bên
- support: chữ "Cùng thao tác, khác kết quả"
- texture: ô đỏ mờ 140 → 163, thanh quay về bản cũ gần nửa
- sfx: comedic-spring, scroll-ticks, whoosh
- voice: Hải Đăng

Hình ảnh: Ba nhịp liền nhau. (1) Câu "Ơ kìa…": màn hình chia đôi, bên trái nhãn "Máy của mình" và một dấu tick xanh lớn, bên phải nhãn "Hệ thống thật" và một dấu X đỏ lớn (cả hai vẽ bằng SVG), cùng là trang thanh toán Giỏ Hời bỏ trống ô mã giảm giá; hai tay POV giơ lên kiểu "ơ kìa". (2) Câu "Đoạn này hôm trước mình làm đúng rồi mà nhỉ?": trình soạn thảo mở đoạn code thanh toán, tay POV cuộn chậm, một dấu "?" nhỏ hiện cạnh con trỏ. Chữ "Cùng thao tác, khác kết quả" hiện nhỏ phía trên từ nhịp (1) đến hết nhịp (2), tắt khi máy quay liếc sang bàn bên. (3) Câu "Hay ai sửa đè lên?": máy quay liếc ngang sang bàn bên: chị Mai đang chăm chú bấm điện thoại kiểm thử, anh Quân đang nhìn thanh quay về bản cũ, cả hai không hay biết gì (không tô đỏ, không có tiếng nhạc doạ nào gắn với họ); rồi liếc về màn hình. Ô góc màn hình nhỏ, mờ (khoảng 70%): số chạy 380 → 410, thanh quay về bản cũ chạy được gần một nửa.

Chữ trên màn hình: Cùng thao tác, khác kết quả

Âm thanh: Đây là đoạn tự nói một mình: giọng người kể đọc thường, nhanh hơn cảnh họp một chút, như đang nghĩ thầm (gần micro, nhỏ hơn một chút; câu "Hay ai sửa đè lên?" khẽ nhất). Tiếng "tưng" như lò xo bật ngay trước câu "Ơ kìa"; tiếng cuộn trang lách tách khi đọc code; một tiếng "vút" nhỏ khi máy quay liếc sang bàn bên, kiểu nghi ngờ trong phim hài; nền căng thẳng tạm lắng.

## Frame 7 — Mười phút thành nửa tiếng

- scene: Đoạn cắt nhanh trên màn hình máy tính
- duration: 6.5s
- poster: 5.6
- transition_in: cut
- status: animated
- voiceover: "Bản cũ chạy lại rồi, giờ đi tìm lỗi. Lục từng yêu cầu gộp code, dò lịch sử… mười phút thành nửa tiếng, vẫn bí!"
- src: compositions/frames/07-hunt.html
- blueprint: compose
- hero: lần lượt: bộ đếm dừng → danh sách pull request → màn hình thay đổi → kết quả tìm kiếm → tay che mặt
- support: ô "Hạn: 10 phút" hiện lại rồi bị gạch đỏ, chữ "17:05 → 17:35 · vẫn chưa ra", đồng hồ nhảy
- texture: ly trà sữa tan dần, con trỏ bấm lia lịa
- sfx: success-chime, typing-fast, scroll-ticks, whoosh, clock-tick, pen-strike, relief-sigh
- voice: Hải Đăng

Hình ảnh: Đoạn cắt nhanh trên màn hình máy tính. (1) 17:05: ô đỏ góc màn hình chạy nốt lên 463 thì dừng, chuyển xám, hiện dấu tick xanh vẽ bằng SVG; một thông báo nhỏ "Đã quay về bản cũ · khách thanh toán lại được"; rồi ô đỏ ẩn đi. (2) Danh sách "Yêu cầu gộp code (Pull request)" #231–#235 của năm tính năng cho Siêu Sale, mỗi mục có nhãn "Đã gộp" (không hiện tên người viết); con trỏ bấm lần lượt từng mục. (3) Màn hình xem thay đổi: các dòng đỏ, xanh lướt nhanh, "+128 −46". (4) Đến chữ "mười phút": ô tìm kiếm gõ "maGiamGia" ra "37 kết quả"; đồng hồ trên màn hình chạm 17:11 và ô cam "Hạn: 10 phút" của sếp hiện lại phía trên màn hình, không che ô tìm kiếm. (5) Đến chữ "nửa tiếng": ô hạn bị gạch ngang và chuyển đỏ, đồng hồ nhảy vùn vụt 17:20 → 17:28 → 17:35, danh sách kết quả lướt nhanh; ly trà sữa bên cạnh tan dần đá suốt cảnh. (6) Đến chữ "vẫn bí": hai tay POV đưa lên che mặt, khung hình tối đi một nhịp; rồi bỏ tay xuống, một kết quả tìm kiếm sáng lên, dẫn sang cảnh sau.

Chữ trên màn hình: 17:05 → 17:35 · vẫn chưa ra

Âm thanh: Tiếng chuông nhẹ khi bộ đếm dừng; nhạc rón rén tiếp tục và nhanh dần; tiếng gõ phím dồn dập, tiếng cuộn trang, tiếng "vút" mỗi lần đổi màn hình, tiếng đồng hồ tích tắc nhanh từ chữ "mười phút"; tiếng gạch bút khi ô hạn bị gạch ở chữ "nửa tiếng"; đến chữ "vẫn bí" nhạc tắt phựt, một tiếng thở dài.

## Frame 8 — Trời ơi… là mình!

- scene: Màn hình xem lịch sử thay đổi theo từng dòng, có một cột tên người viết bên trái (tên đăng nhập lan, tuan, hoa…, chữ nhỏ
- duration: 4.4s
- poster: 5.2
- transition_in: cut
- status: animated
- voiceover: "Ai viết dòng này vậy? Trời ơi… là mình!"
- src: compositions/frames/08-discover.html
- blueprint: compose
- hero: chú thích "minh · thứ Ba" phóng to cạnh dòng code tô đỏ
- support: chữ "Ô mã để trống → dòng này báo lỗi", giọt mồ hôi
- texture: cột tên người viết lướt qua, dòng log mờ
- sfx: scroll-ticks, record-scratch, dramatic-sting, heartbeat
- voice: Hải Đăng

Hình ảnh: Màn hình xem lịch sử thay đổi theo từng dòng, có một cột tên người viết bên trái (tên đăng nhập lan, tuan, hoa…, chữ nhỏ; không có tên mai hay quan), dừng ở dòng `const ma = maGiamGia.trim();` được tô đỏ. Dòng log nhỏ, mờ bên dưới: `TypeError: Cannot read properties of undefined (reading 'trim')`. Hỏi xong "Ai viết dòng này vậy?" thì con trỏ chuột dừng ở chú thích tên người viết, chú thích phóng to: "minh · thứ Ba" (chữ "minh" dùng phông đơn cách như tên đăng nhập). Đến chữ "Trời ơi", máy quay giật nhẹ một nhịp, giọt mồ hôi vẽ bằng SVG lăn xuống cạnh tên.

Chữ trên màn hình: Ô mã để trống → dòng này báo lỗi

Âm thanh: Tiếng dồn nén dâng lên; hỏi xong "Ai viết dòng này vậy?" thì giọng ngắt một nhịp, tên "minh" phóng to cùng tiếng đĩa nhạc rít "két" rồi khựng lại; câu "Trời ơi… là mình!" có tiếng vang nhẹ như đang tự nói trong đầu; nói xong mới vang đoạn nhạc ngắn "tèn tèn ten" kiểu phim hài, rồi tiếng tim đập dồn dập dẫn sang cảnh sau.

## Frame 9 — Báo ngay, không giấu

- scene: Máy quay rời chữ "minh · thứ Ba", xoay ghế ngay sang bàn bên: chị Mai và anh Quân (đứng cạnh) quay sang nhìn
- duration: 3.4s
- poster: 1.6
- transition_in: cut
- status: animated
- voiceover: "Mình báo ngay: “Lỗi do em, em tìm ra rồi ạ!”"
- src: compositions/frames/09-own-it.html
- blueprint: compose
- hero: xoay ghế sang đồng nghiệp ngay khi nói
- support: anh Quân gật đầu, chị Mai giơ điện thoại kiểm thử
- texture: tay POV hơi run
- sfx: heartbeat, chair-swivel
- voice: Hải Đăng

Hình ảnh: Máy quay rời chữ "minh · thứ Ba", xoay ghế ngay sang bàn bên: chị Mai và anh Quân (đứng cạnh) quay sang nhìn. Không có bong bóng thoại, vì phụ đề đã mang câu nhận lỗi. Hai tay POV hơi run. Nói xong câu nhận lỗi: anh Quân chỉ gật đầu một cái, bình thản; chị Mai giơ sẵn điện thoại kiểm thử lên. Chữ "Báo ngay, không giấu" chỉ hiện ở khoảng 1 giây cuối.

Chữ trên màn hình: Báo ngay, không giấu

Âm thanh: Giọng người kể dứt khoát, có vang phòng nhẹ; tiếng ghế xoay "cót két" ngay đầu cảnh; tiếng tim đập từ cảnh trước vẫn còn, luôn nhỏ hơn giọng đọc, và tắt ngang đúng lúc anh Quân gật đầu.

## Frame 10 — Thử lại

- scene: Xoay ghế sang chị Mai
- duration: 3.2s
- poster: 4.6
- transition_in: cut
- status: animated
- voiceover: "Mình sửa xong, nhờ chị Mai thử lại…"
- src: compositions/frames/10-fix-check.html
- blueprint: compose
- hero: điện thoại kiểm thử của chị Mai, ngón tay bấm Thanh toán
- support: dòng code đã sửa sáng xanh
- texture: vòng xoay chờ
- sfx: success-chime, tap
- voice: Hải Đăng

Hình ảnh: Xoay ghế sang chị Mai; lướt qua màn hình chính, dòng đã sửa `const ma = (maGiamGia ?? "").trim();` sáng xanh khoảng 0,5 s (không quay cảnh gõ phím). Chị Mai thử ứng dụng Giỏ Hời trên điện thoại kiểm thử (nhãn nhỏ "Bản thử · giống hệ thống thật"): ô mã để trống, ngón tay bấm "Thanh toán", vòng xoay chờ quay. Chữ "Thử lại với ô mã để trống" chỉ hiện từ lúc chị Mai cầm máy.

Chữ trên màn hình: Thử lại với ô mã để trống

Âm thanh: Tiếng gõ phím lách cách, tiếng chạm màn hình; lúc vòng xoay chờ, mọi âm thanh im bặt, như cả phòng nín thở.

## Frame 11 — Ngon lành rồi em ơi!

- scene: Điện thoại hiện "Thanh toán thành công" kèm dấu tick xanh vẽ bằng SVG
- duration: 2s
- poster: 1.6
- transition_in: cut
- status: animated
- voiceover: "“Ngon lành rồi em ơi!”"
- src: compositions/frames/11-qc-ok.html
- blueprint: compose
- hero: chị Mai giơ ngón cái, cười
- support: điện thoại "Thanh toán thành công" kèm dấu tick
- texture: chữ "Kiểm thử: Đạt"
- sfx: success-chime
- voice: Trúc Ly

Hình ảnh: Điện thoại hiện "Thanh toán thành công" kèm dấu tick xanh vẽ bằng SVG; chị Mai quay sang, giơ ngón cái, cười tươi.

Chữ trên màn hình: Kiểm thử: Đạt

Âm thanh: Tiếng "ting" thành công trong trẻo đúng lúc điện thoại chuyển sang "Thanh toán thành công", ngay trước câu nói; rồi giọng chị Mai (giọng nữ) vui vẻ.

## Frame 12 — Cả nhóm cùng xử lý

- scene: Màn hình hiện "Phát hành bản sửa" kèm dấu tick xanh vẽ bằng SVG (không chạy thanh tiến trình, không có biểu đồ)
- duration: 4.6s
- poster: 3.4
- transition_in: cut
- status: animated
- voiceover: "Phát hành lại xong. Tối đó về muộn một chút, nhưng không ai phải gánh một mình."
- src: compositions/frames/12-release.html
- blueprint: compose
- hero: cả nhóm đập tay
- support: "Phát hành bản sửa" kèm tick, cụm chat có lời cảm ơn của sếp
- texture: cửa sổ trời tối 18:45, ly trà sữa tan đá
- sfx: whoosh, team-cheer, high-five, relief-sigh
- voice: Hải Đăng

Hình ảnh: Màn hình hiện "Phát hành bản sửa" kèm dấu tick xanh vẽ bằng SVG (không chạy thanh tiến trình, không có biểu đồ). Rồi cảnh rộng: ngoài cửa sổ trời đã tối, đồng hồ 18:45; ba người đập tay, cùng thở phào (hình chính); trên màn hình phía sau chỉ một cụm chat: tin anh Quân "Đã báo tình hình cho khách", ngay dưới là tin sếp "Cảm ơn cả nhóm nhé!". Khoảng 1 giây cuối: đẩy vào ly trà sữa đã tan hết đá, nhạt màu, cạnh bàn phím, đúng lúc tiếng thở phào.

Chữ trên màn hình: Xong! Cả nhóm cùng xử lý

Âm thanh: Tiếng "vút" khi phát hành; tiếng reo vui (không lời) và tiếng đập tay của cả nhóm nằm dưới giọng đọc, nhỏ hơn giọng; nói xong câu cuối là một tiếng thở phào ngắn.

## Frame 13 — Họp rút kinh nghiệm

- scene: Sáng thứ Hai, phòng họp của nhóm
- duration: 5.2s
- poster: 4.8
- transition_in: cut
- status: animated
- voiceover: "Đầu tuần sau, cả nhóm rút kinh nghiệm: tìm cách để lỗi không lặp lại, chứ không tìm người để trách."
- src: compositions/frames/13-postmortem.html
- blueprint: compose
- hero: dòng "Ai viết dòng này?" bị gạch đi trên màn hình phòng họp
- support: anh Quân chỉ vào màn hình, dòng thay thế, sticker "Không phải bản kiểm điểm đâu!"
- texture: cả nhóm quanh bàn gật gù, ly trà sữa mới, nhãn "Sáng thứ Hai"
- sfx: pen-strike, soft-pop
- voice: Hải Đăng

Hình ảnh: Sáng thứ Hai, phòng họp của nhóm; máy quay ở đầu bàn, hai tay POV đặt trên cuốn sổ. Màn hình lớn trên tường chiếu tài liệu chung "Báo cáo rút kinh nghiệm" với ba mục "Chuyện gì đã xảy ra · Vì sao · Làm gì để không lặp lại". Anh Quân đứng cạnh màn hình; chị Mai và hai đồng nghiệp ngồi quanh bàn, nhìn lên màn hình. Máy quay đẩy chậm về phía màn hình. Đến chữ "tìm cách", anh Quân giơ tay chỉ vào màn hình và dòng "→ Thêm bước tự động thử: ô mã để trống" hiện ra; đến chữ "người", dòng "Ai viết dòng này?" bị gạch đi, mấy người quanh bàn gật gù; một sticker nhỏ ngay dưới màn hình: "Không phải bản kiểm điểm đâu!".

Chữ trên màn hình: Tìm cách, không tìm người

Âm thanh: Yên tĩnh, nhẹ nhõm; tiếng bút gạch "soạt" khi dòng "Ai viết dòng này?" bị gạch đi, tiếng "póc" nhỏ khi sticker hiện ra.

## Frame 14 — Bạn sẽ làm gì?

- scene: Quay lại bàn làm việc buổi sáng, màn hình trang thanh toán Giỏ Hời chạy ổn, banner Siêu Sale vẫn chạy
- duration: 4s
- poster: 2.6
- transition_in: cut
- status: animated
- voiceover: "Nếu là bạn, bạn sẽ nhận lỗi ngay, hay đợi sửa xong mới nói?"
- src: compositions/frames/14-question.html
- blueprint: compose
- hero: thẻ câu hỏi giữa màn hình
- support: chữ "Bạn sẽ làm gì? Bình luận nhé!"
- texture: bàn làm việc buổi sáng, màn hình chạy ổn
- sfx: soft-pop
- voice: Hải Đăng

Hình ảnh: Quay lại bàn làm việc buổi sáng, màn hình trang thanh toán Giỏ Hời chạy ổn, banner Siêu Sale vẫn chạy; thẻ câu hỏi hiện giữa màn hình.

Chữ trên màn hình: Bạn sẽ làm gì? Bình luận nhé!

Âm thanh: Yên tĩnh, chỉ một tiếng "póc" nhẹ khi thẻ câu hỏi hiện ra.
