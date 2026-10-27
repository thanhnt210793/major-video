# Hướng dẫn làm video với Claude

Bạn không cần biết lập trình. Bạn chỉ cần làm 4 việc:
1. Viết ý tưởng.
2. Đọc và sửa kịch bản.
3. Bấm duyệt.
4. Xem video rồi nói muốn sửa gì.

Mọi việc còn lại Claude làm: tìm nguồn, kiểm tra thông tin, viết kịch bản, làm giọng đọc, vẽ hình, dựng video.

Video làm ra là video dọc 30–60 giây cho TikTok và YouTube Shorts. Mỗi video kể **một tình huống** trong **một nghề**, nhìn qua mắt người làm nghề đó, dành cho học sinh cấp 2 và cấp 3.

## Chuẩn bị (chỉ làm một lần)

Máy này đã cài đặt sẵn mọi thứ. Bạn chỉ cần:
- **VS Code** đã cài và đã có tiện ích **Claude Code** (biểu tượng Claude hình ngôi sao cam).
- Đã **đăng nhập Claude**. Lần đầu mở khung chat, nếu Claude đề nghị đăng nhập thì làm theo hướng dẫn trên màn hình, hoặc nhờ chồng đăng nhập giúp.

Nếu muốn dùng trên một máy khác, cần cài thêm nhiều phần mềm. Việc đó nhờ chồng làm.

## Bắt đầu

1. Mở VS Code.
2. Chọn **File → Open Folder…**, rồi mở thư mục **D:\Projects\major-video**. Lần sau VS Code thường tự mở lại thư mục này.
3. Mở khung chat Claude: bấm biểu tượng Claude ở góc trên bên phải hoặc ở thanh bên.
4. Gõ `/lam-video`, xuống dòng (Shift+Enter), rồi viết ý tưởng. Bấm **Enter** để gửi.
   Nếu bạn quên gõ `/lam-video` cũng không sao: cứ viết ý tưởng, Claude sẽ hiểu.

### Cuộc trò chuyện mới hay cũ?

- **Video mới:** nên mở một cuộc trò chuyện mới (nút **+** hoặc **New chat** trên khung chat). Mỗi video một cuộc trò chuyện thì Claude làm gọn gàng hơn.
- **Làm tiếp video đang dở:** có thể quay lại cuộc trò chuyện cũ (biểu tượng đồng hồ / lịch sử), hoặc mở cuộc mới và gõ tên video (xem mục [Làm tiếp một video cũ](#làm-tiếp-một-video-cũ)). Mọi thứ đã lưu trong thư mục, nên mở cuộc mới cũng không mất gì.

## Chọn nội dung sắp làm

Mở file [KE-HOACH.md](KE-HOACH.md) trong thư mục `kichban`. Đó là bảng kế hoạch: 10 nhóm ngành, mỗi nhóm 5 nghề đang được tuyển nhiều, kèm trạng thái từng video.

Thư mục được xếp theo 3 tầng:

```
kichban/
├─ KE-HOACH.md                 ← bảng kế hoạch chung (mở file này trước)
├─ HUONG-DAN.md                ← file bạn đang đọc
├─ yte/                        ← nhóm ngành
│  ├─ top-5-nganh-hot.md       ← vì sao 5 nghề này được chọn, có nguồn
│  ├─ 1-dieu-duong/            ← nghề (số = thứ hạng)
│  │  ├─ KE-HOACH.md           ← tóm tắt nghề + ý tưởng video
│  │  └─ kichban_..._final.md  ← kịch bản các video về nghề này
│  └─ 2-bac-si/ ...
└─ it/, giaovien/, ...
```

Cách dùng:
1. Mở [KE-HOACH.md](KE-HOACH.md), chọn một nghề còn ở trạng thái **Ý tưởng**.
2. Bấm vào tên nghề để đọc tóm tắt và ý tưởng video.
3. Gõ `/lam-video`, dán ý tưởng vào (sửa theo ý bạn cũng được), rồi gửi.

Có ý tưởng mới cho một nghề, bạn ghi thêm vào mục **Ý tưởng video** trong file `KE-HOACH.md` của nghề đó. Claude tự cập nhật trạng thái mỗi khi video chuyển bước.

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

Chỉ có một dòng cũng được, ví dụ `/lam-video nghề điều dưỡng`. Khi đó Claude sẽ đề xuất vài tình huống cụ thể để bạn chọn.

Mẹo để video hay:
- Chọn **một tình huống**, có **một khoảnh khắc bất ngờ**. "Một ngày của bác sĩ" thì quá rộng; "bác sĩ trực đêm nhận ca cấp cứu lúc 2 giờ sáng" thì vừa.
- Nói rõ **người xem nên hiểu gì** sau khi xem.
- Con số, mức lương, "nhiều nhất", "đa số"… Claude sẽ tìm nguồn để kiểm tra. Điều gì không tìm được nguồn sẽ bị bỏ hoặc nói lại cho đúng.

### Nhóm ngành

Claude tự xếp video vào một nhóm ngành và báo cho bạn. Các nhóm hiện có:

| Nhóm | Gồm các nghề như |
|---|---|
| Công nghệ thông tin | lập trình, an ninh mạng, dữ liệu, AI, làm game |
| Y tế và sức khoẻ | bác sĩ, điều dưỡng, dược sĩ, xét nghiệm, cấp cứu |
| Giáo dục | giáo viên các cấp, mầm non, tư vấn học đường |
| Tài chính và ngân hàng | giao dịch viên, kế toán, kiểm toán, chứng khoán, bảo hiểm |
| Marketing và truyền thông | marketing, quảng cáo, sáng tạo nội dung, báo chí |
| Thiết kế và kiến trúc | đồ hoạ, UI/UX, kiến trúc, nội thất, hoạt hình |
| Logistics và thương mại điện tử | kho, vận tải, giao hàng, sàn thương mại điện tử, xuất nhập khẩu |
| Hàng không, du lịch và khách sạn | tiếp viên, phi công, hướng dẫn viên, lễ tân, đầu bếp |
| Kỹ thuật và sản xuất | điện, ô tô, cơ khí, xây dựng, tự động hoá, nghề kỹ thuật |
| Luật | luật sư, công chứng viên, thẩm phán, pháp chế |
| Tổng quan nhiều ngành | video so sánh nhiều nhóm ngành cùng lúc |

Nghề không thuộc nhóm nào thì Claude sẽ hỏi bạn có muốn thêm nhóm mới không.

Với nghề Y tế, Hàng không và Kỹ thuật, Claude cẩn thận hơn: không chiếu các thao tác nguy hiểm, không biến video thành hướng dẫn hành nghề.

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

Trong lúc chờ, bạn có thể làm việc khác, nhưng **đừng tắt VS Code và đừng tắt máy**. Cuối mỗi tin nhắn, Claude luôn ghi **"Việc của bạn: …"** để bạn biết cần làm gì tiếp.

Khi Claude hỏi kèm vài nút để chọn, bạn bấm vào nút. Muốn trả lời khác thì chọn ô **Other** rồi gõ.

## Đọc và sửa file kịch bản

Claude tự mở file `kichban_<tên video>_final.md`. File nằm trong thư mục của nghề, ví dụ `kichban/it/1-lap-trinh-vien/` hay `kichban/yte/1-dieu-duong/`. Mỗi cảnh có 4 dòng:
- **Lời đọc:** câu giọng đọc sẽ nói. Phụ đề cũng lấy từ đây.
- **Chữ trên màn hình:** chữ to hiện trên video.
- **Hình ảnh:** mô tả cảnh người xem nhìn thấy.
- **Âm thanh:** tiếng động, hiệu ứng và không khí của cảnh (ví dụ tiếng tin nhắn dồn dập, tiếng tim đập). Claude tìm âm thanh có giấy phép dùng hợp lệ cho đúng mô tả này.

Cách sửa:
- Sửa thẳng phần chữ **sau dấu hai chấm**. Giữ nguyên phần đầu dòng như `- **Lời đọc:**`.
- Không muốn có chữ trên màn hình thì ghi `(không có)`.
- Góp ý khác (cảnh dài quá, muốn đổi giọng vui hơn, dùng mở đầu dự phòng…) thì viết vào mục **Ý kiến của người duyệt**, mỗi ý một dòng.
- Bấm **Ctrl+S** để lưu. Tab có dấu chấm tròn ở tên tức là chưa lưu.
- Muốn xem file dạng trình bày đẹp thì bấm **Ctrl+Shift+V**. Chế độ này chỉ để xem, muốn sửa thì quay lại tab gốc.
- Lỡ sửa sai thì bấm **Ctrl+Z** để hoàn tác.

Khi xong:
- Nếu mới sửa hoặc góp ý, nhắn Claude **"đã sửa"**. Claude cập nhật rồi báo lại.
- Nếu đồng ý toàn bộ, ở mục **Duyệt** đổi `- [ ]` thành `- [x]`, ghi tên và ngày, lưu lại, rồi nhắn **"đã duyệt"**.

Phần **Thông tin trong video và nguồn** cho biết thông tin nào Claude đã kiểm tra nguồn và thông tin nào chỉ là tình huống giả lập. Bạn không cần sửa phần này.

Lời đọc đôi khi viết khác chữ trên màn hình một chút (ví dụ số viết thành chữ) để giọng đọc phát âm đúng. Đó là chủ ý, bạn không cần sửa.

## Góp ý video thế nào

Claude tự mở video sau khi dựng. Khi xem, để ý:
- Mở đầu có khiến người xem dừng lại không?
- Chữ có đọc được trên điện thoại không?
- Giọng đọc có đọc sai chữ nào không?
- Nhịp video nhanh hay chậm quá?

Nói cụ thể **cảnh nào**, **cái gì**, **muốn ra sao**. Ví dụ:
- "Cảnh 3 chữ nhỏ quá, khó đọc trên điện thoại."
- "Giọng đọc đọc sai chữ *localhost*."
- "Mở đầu hơi chậm, muốn thấy lỗi ngay."
- "Đổi câu cảnh 5 thành: Khoan đã, hình như mình quên tắt máy!"

Gom nhiều góp ý vào **một tin nhắn** thì Claude sửa một lần, nhanh hơn.

Đổi màu hay cỡ chữ thì Claude sửa ngay. Đổi lời thoại thì Claude kiểm tra lại độ dài và thông tin trước khi sửa. Nếu đổi cả câu chuyện, ví dụ thêm hoặc bớt cảnh, kịch bản sẽ phải duyệt lại.

Video nằm trong thư mục `videos/<nhóm>/<tên video>/renders/`. Mỗi lần sửa có một bản mới, đuôi số tăng dần (`-1`, `-2`, …). Bản số lớn nhất là bản mới nhất.

## Làm tiếp một video cũ

Gõ `/lam-video` kèm tên video, ví dụ `/lam-video hoa-don-lech-1-dong`. Hoặc nói tự nhiên: "làm tiếp video hoá đơn lệch 1 đồng". Claude tự tìm xem video đang ở bước nào.

Danh sách mọi video và tình trạng của chúng nằm trong [KE-HOACH.md](KE-HOACH.md). Hiện có một kịch bản **đang chờ bạn đọc và duyệt**: "Lỗi trên hệ thống thật sau khi phát hành", trong thư mục `kichban/it/1-lap-trinh-vien/`.

## Khi máy hỏi xin phép

Đôi khi một hộp thoại hiện lên hỏi có cho chạy một lệnh không. Claude thường báo trước việc này.
- Nếu Claude đã báo trước, bấm **Yes**.
- Nếu thấy lạ, bấm **No** rồi hỏi Claude: "lệnh này để làm gì?"
- Nếu hộp thoại nhắc đến **publish**, **đăng**, **upload** hay **cloud**, luôn bấm **No**. Bạn tự đăng video.

## Khi gặp trục trặc

| Chuyện xảy ra | Làm gì |
|---|---|
| Claude im lâu, không thấy trả lời | Bước kịch bản và dựng video vốn lâu (10–40 phút). Nếu thấy chữ đang chạy hoặc vòng quay thì cứ chờ. Quá 1 tiếng không có gì mới thì nhắn "bạn đang làm đến đâu rồi?". |
| Muốn dừng Claude lại | Bấm nút dừng (ô vuông) trên khung chat, hoặc phím **Esc**. Sau đó nhắn điều bạn muốn. |
| Claude báo hết lượt dùng (usage limit) | Chờ đến giờ Claude ghi, rồi nhắn "làm tiếp". |
| Lỡ tắt VS Code hoặc tắt máy | Mở lại, gõ `/lam-video <tên video>`. Claude làm tiếp từ bước đang dở. |
| Không thấy file kịch bản hay video | Nhắn "mở lại kịch bản" hoặc "mở lại video mới nhất". |
| Claude nói dùng từ khó hiểu | Nhắn "nói dễ hiểu hơn giúp mình". |
| Claude báo cần **chủ kênh** xem (màu kênh, giọng đọc, nhạc nền…) | Đó là việc của chồng. Bạn chuyển lời nhắn cho chồng. |
| Bất cứ chuyện gì khác | Hỏi thẳng Claude bằng tiếng Việt, như hỏi một người bạn. |

## Claude sẽ không bao giờ

- Tự đăng video lên mạng. Bạn tự đăng.
- Tự duyệt kịch bản thay bạn.
- Đưa thông tin chưa kiểm chứng vào video sẽ đăng.
- Dùng giọng thật của ai đó khi chưa có sự đồng ý bằng văn bản.
