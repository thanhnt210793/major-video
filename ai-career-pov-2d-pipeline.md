# AI Career POV — Quy trình sản xuất video 2D bằng Claude + HyperFrames + Remotion

> **Mục tiêu:** Xây dựng pipeline bán tự động để sản xuất video hướng nghiệp dạng POV 2D dài 30–60 giây cho TikTok và YouTube Shorts, ưu tiên miễn phí hoặc chi phí thấp. Video dùng minh họa 2D, chuyển động có chủ đích, TTS, nhạc nền và hiệu ứng âm thanh; không dùng footage AI siêu thực hoặc hoạt cảnh 3D.
>
> **Nguyên tắc:** AI hỗ trợ sản xuất, nhưng thông tin nghề nghiệp phải được kiểm chứng trước khi đưa vào kịch bản.

---

## 1. Mục tiêu sản phẩm

Mỗi video nên giúp học sinh THCS/THPT hiểu một phần công việc thực tế bằng cách đặt người xem vào vị trí của người đang làm nghề.

- **Định dạng:** Dọc 9:16, 1080 × 1920, 30 FPS.
- **Thời lượng:** 30–60 giây; mẫu khởi đầu 45 giây.
- **Phong cách:** Hoạt họa vector 2D, POV, nhiều lớp parallax, giao diện và vật thể có tính nhất quán.
- **Âm thanh:** TTS tiếng Việt, nhạc nền nhẹ, SFX phù hợp hành động.
- **Quy trình:** Bán tự động — AI tạo kịch bản, cấu trúc cảnh và hỗ trợ code; người làm duyệt nội dung, hình ảnh, âm thanh và bản xuất cuối.
- **Đối tượng:** Học sinh THCS/THPT đang tìm hiểu ngành nghề.

## 2. Bộ công cụ đề xuất

| Công cụ | Vai trò | Lưu ý |
|---|---|---|
| **Claude / Claude Code** | Nghiên cứu có hỗ trợ nguồn, viết kịch bản, storyboard, prompt, tạo và chỉnh sửa code | Không xem nội dung AI sinh ra là sự thật nếu chưa kiểm chứng. Gói miễn phí có thể không đủ cho coding workflow dài. |
| **HyperFrames** | Workflow tạo video từ prompt qua AI agent, HTML/CSS/JavaScript, preview và render | Khởi đầu phù hợp để thử nghiệm prompt-to-video. Kiểm tra skill và API hiện hành trước khi chạy lệnh. |
| **Remotion** | Tạo video bằng React/TypeScript; quản lý timeline, scene, chữ, phụ đề và âm thanh | Phù hợp khi muốn xây dựng thư viện component và template có thể tái sử dụng. |
| **TTS** | Chuyển lời dẫn tiếng Việt thành giọng đọc | Chọn theo chất lượng tiếng Việt, giới hạn miễn phí, quyền thương mại và khả năng xuất file âm thanh. |
| **CapCut (tùy chọn)** | Dựng hoặc chỉnh sửa thủ công, kiểm tra phụ đề | Không bắt buộc nếu pipeline render đã đáp ứng yêu cầu. |
| **Audacity** | Cân âm lượng, lọc nhiễu, trộn TTS, nhạc và SFX | Miễn phí, mã nguồn mở. |
| **YouTube Audio Library / Pixabay / Freesound** | Nhạc nền và hiệu ứng âm thanh | Kiểm tra giấy phép và yêu cầu ghi công của từng tệp, nhất là khi đăng trên nhiều nền tảng. |
| **Google Docs / Sheets** | Lưu kịch bản, nguồn, trạng thái duyệt, chi phí và kết quả video | Có thể dùng công cụ bảng tính miễn phí tương đương. |

### HyperFrames hay Remotion?

Không cần triển khai cả hai như hai hệ thống làm cùng một việc ngay từ đầu.

- **Chọn Claude + HyperFrames trước** nếu ưu tiên thử nghiệm nhanh việc tạo video bằng prompt và workflow của AI agent.
- **Chọn Claude + Remotion** nếu ưu tiên hệ thống component React/TypeScript, timeline có kiểm soát và template có thể tái sử dụng lâu dài.
- Nếu dùng cả hai, cần xác định ranh giới rõ ràng; tránh tạo hai timeline hoặc hai cơ chế render song song nếu không có lý do cụ thể.

Liên kết chính thức:
- HyperFrames: https://github.com/heygen-com/hyperframes
- Remotion docs: https://www.remotion.dev/docs
- Claude: https://claude.ai/
- CapCut: https://www.capcut.com/
- Audacity: https://www.audacityteam.org/

> Tính năng, API, giấy phép và giới hạn miễn phí có thể thay đổi. Kiểm tra tài liệu chính thức trước khi cài đặt hoặc thanh toán.

## 3. Phong cách hình ảnh 2D

### Phong cách khuyến nghị: POV 2D + giao diện + parallax

- **POV minh họa:** Bàn tay/cánh tay 2D xuất hiện ở tiền cảnh, hướng về bàn làm việc, thiết bị hoặc màn hình.
- **Giao diện trực quan:** Biểu đồ, code editor, bảng điều khiển, checklist hoặc sơ đồ giúp người xem hiểu nhiệm vụ.
- **Parallax:** Tách tiền cảnh, đối tượng chính và hậu cảnh thành các lớp di chuyển nhẹ với tốc độ khác nhau.
- **Chuyển động:** Di chuyển tay, cursor, typing, nút nhấn, highlight, camera push-in nhẹ, zoom hoặc pan có kiểm soát.
- **Tính nhất quán:** Giữ cùng bảng màu, hình dạng bàn tay, quần áo, thiết bị, góc nhìn và cách dùng icon xuyên suốt.
- **Tránh:** Quá nhiều hiệu ứng, chuyển cảnh liên tục, chữ quá nhỏ, vật thể trang trí vô nghĩa và chuyển động không liên quan nội dung.

Gợi ý bắt đầu với bảng màu navy đậm, teal và trắng ngà. Đây là lựa chọn thiết kế ban đầu; có thể đổi sau khi thử nghiệm nhận diện kênh.

## 4. Kiến trúc pipeline

```text
Nghiên cứu nghề + nguồn tham khảo
              |
              v
       Fact-check / Research manifest
              |
              v
Claude: script + storyboard + narration + scene data
              |
              v
SVG / icons / reusable 2D assets
              |
              v
HyperFrames OR Remotion: animation + timeline
              |
              +-----------------------+
              |                       |
              v                       v
        TTS narration             Music + SFX
              |                       |
              +-----------+-----------+
                          |
                          v
             Render vertical MP4
                          |
                          v
          QA: content / visuals / audio
                          |
                          v
               TikTok / YouTube Shorts
                          |
                          v
            Metrics + lessons learned
```

### Quy tắc phân vai

- **Claude:** Đề xuất nội dung, tạo storyboard và cấu trúc dữ liệu cảnh; hỗ trợ code.
- **HyperFrames hoặc Remotion:** Điều khiển timeline, hình ảnh, chuyển động, phụ đề và render.
- **TTS:** Tạo lời dẫn.
- **Audacity hoặc công cụ dựng:** Cân âm lượng và trộn âm thanh nếu cần.
- **Người duyệt:** Kiểm chứng thông tin nghề nghiệp, duyệt chất lượng và quyết định xuất bản.

## 5. Quy trình thao tác từng bước

### Bước 1 — Chọn một nghề và một tình huống

Không bắt đầu bằng chủ đề quá rộng như “Nghề lập trình viên”. Chọn một tình huống cụ thể, có thể giải thích trong 45 giây.

Ví dụ:
- POV: Bạn là junior software engineer đang điều tra lỗi production.
- POV: Bạn là kỹ sư tự động hóa khi dây chuyền dừng.
- POV: Bạn là UX designer kiểm tra một luồng đăng ký.
- POV: Bạn là nhân viên phân tích dữ liệu tìm điểm bất thường trong báo cáo.

**Đầu ra:** Tên video, mục tiêu học tập, tình huống và câu hỏi kết thúc.

### Bước 2 — Nghiên cứu và kiểm chứng nội dung nghề nghiệp

1. Tìm tài liệu chính thống: trường đào tạo nghề, tài liệu nhà sản xuất, hiệp hội chuyên môn, tài liệu kỹ thuật hoặc phỏng vấn người làm nghề.
2. Liệt kê từng thông tin thực tế sẽ xuất hiện trong video.
3. Gắn nguồn cho từng thông tin quan trọng.
4. Phân biệt rõ:
   - **Fact:** Thông tin nghề nghiệp có nguồn.
   - **Simulation:** Tình huống giả lập để kể chuyện.
   - **Unverified:** Thông tin chưa đủ căn cứ — loại bỏ hoặc nghiên cứu thêm.
5. Với ngành có rủi ro an toàn, không minh họa thao tác nguy hiểm hoặc trình bày tình huống giả lập như hướng dẫn chuyên môn đầy đủ.

**Đầu ra:** Research manifest có câu khẳng định, nguồn URL, ngày truy cập, mức độ tin cậy và ghi chú.

### Bước 3 — Viết kịch bản 30–60 giây

Khung đề xuất cho video 45 giây:

| Thời gian | Nội dung | Mục tiêu |
|---|---|---|
| 0–4 giây | Hook / sự cố / nhiệm vụ | Thu hút chú ý |
| 4–11 giây | Bắt đầu thao tác POV | Đặt người xem vào vai |
| 11–19 giây | Quan sát vấn đề | Giải thích điều cần nhận biết |
| 19–28 giây | Phân tích hoặc xử lý | Cho thấy kỹ năng nghề |
| 28–37 giây | Kết quả / kiểm tra | Nêu kết quả hợp lý |
| 37–42 giây | Bài học nghề nghiệp | Chốt kiến thức |
| 42–45 giây | Câu hỏi tương tác | Khuyến khích bình luận |

Lời dẫn nên ngắn, tự nhiên, có một ý chính cho mỗi cảnh. Không nhồi quá nhiều kiến thức vào một video.

**Đầu ra:** Lời dẫn, phụ đề, storyboard và danh sách hành động/đồ họa theo thời gian.

### Bước 4 — Chuẩn hóa asset 2D

Tạo một thư viện có thể dùng lại:
- Bộ bàn tay/cánh tay POV.
- Bàn, laptop, màn hình, công cụ hoặc thiết bị phù hợp nghề.
- Background văn phòng, xưởng, phòng lab hoặc địa điểm làm việc.
- Icon và các thành phần giao diện.
- Các trạng thái như loading, warning, success, error.
- Bộ font, màu sắc và chuyển cảnh.

Ưu tiên SVG và CSS để có thể thay màu, phóng to và animate. Kiểm tra giấy phép nếu dùng asset của bên thứ ba.

**Đầu ra:** Thư viện asset nhất quán và có tên file rõ ràng.

### Bước 5 — Tạo hoạt cảnh

1. Chia video thành các scene có thời gian bắt đầu/kết thúc.
2. Mỗi scene chỉ có một hành động hoặc một ý chính.
3. Dùng chuyển động tay, cursor, highlight, zoom hoặc parallax để minh họa hành động.
4. Giữ bố cục, bảng màu và các thành phần lặp lại.
5. Preview từng scene trước khi render toàn bộ.
6. Nếu scene có quá nhiều hiệu ứng, đơn giản hóa thay vì tiếp tục thêm animation.

**Đầu ra:** Timeline hoạt cảnh có thể render và chỉnh sửa.

### Bước 6 — Tạo TTS

1. Chốt lời dẫn trước khi tạo giọng đọc.
2. Chọn giọng tiếng Việt dễ nghe, tốc độ vừa phải.
3. Nghe lại tên nghề, thuật ngữ và từ tiếng Anh.
4. Chỉnh dấu câu để giọng đọc ngắt nghỉ tự nhiên.
5. Lưu audio theo tên scene hoặc một file narration có timestamp.
6. Kiểm tra giới hạn miễn phí và quyền thương mại của dịch vụ TTS.

Có thể thử:
- ElevenLabs: https://elevenlabs.io/pricing
- Azure AI Speech: https://azure.microsoft.com/products/ai-services/ai-speech

Đây là các lựa chọn để đánh giá, không phải cam kết rằng mọi tính năng hoặc quyền sử dụng thương mại đều miễn phí.

### Bước 7 — Nhạc nền và SFX

Tạo các lớp âm thanh riêng:
- **Background ambience/music:** Nhẹ, ổn định, không lấn lời.
- **Action SFX:** Tiếng gõ phím, click, bước chân, dụng cụ hoặc thao tác.
- **Notification/event SFX:** Chỉ dùng khi phù hợp với sự kiện.
- **Narration:** Giọng dẫn chính.

Nguồn có thể xem:
- YouTube Audio Library: https://www.youtube.com/audiolibrary
- Pixabay Sound Effects: https://pixabay.com/sound-effects/
- Freesound: https://freesound.org/
- Audacity: https://www.audacityteam.org/

Kiểm tra giấy phép từng track, yêu cầu ghi công và điều kiện dùng ngoài YouTube. Không dùng âm thanh chỉ vì tải xuống được.

### Bước 8 — Render và QA

- Render MP4 1080 × 1920, 30 FPS, thời lượng 30–60 giây.
- Kiểm tra toàn bộ video, không chỉ vài frame đầu/cuối.
- Xem trên điện thoại để kiểm tra chữ, phụ đề và độ dễ đọc.
- Kiểm tra TTS không bị cắt, âm lượng cân bằng và SFX đúng thời điểm.
- Kiểm tra hình không lỗi, animation không giật và không có thông tin chưa kiểm chứng.
- Lưu file nguồn cùng bản render cuối.

### Bước 9 — Đăng và đo lường

Ghi lại:
- Lượt xem.
- Thời lượng xem trung bình và tỷ lệ xem hết nếu nền tảng cung cấp.
- Tỷ lệ tương tác, bình luận và câu hỏi của người xem.
- Những hiểu nhầm người xem gặp phải.
- Thời gian sản xuất, số lần render và chi phí thực tế.

Sau ba video, xác định format nào dễ sản xuất nhất và giúp người xem hiểu nghề rõ nhất.

---

## 6. Prompt mẫu cho Claude

Khi chạy trong Claude Code, hãy yêu cầu agent đọc skill và cấu trúc project thực tế trước khi thực hiện; không giả định API hoặc lệnh chưa được xác nhận.

```text
Create a 45-second vertical 2D animated Career POV video.

TOPIC:
POV: You are a junior software engineer investigating a production bug.

TECHNICAL REQUIREMENTS:
- Use the existing HyperFrames project and its installed skill.
- Build a deterministic, frame-accurate video composition.
- Canvas: 1080x1920, 30 FPS, 45 seconds.
- Use HTML, CSS, SVG and JavaScript animations.
- Do not use AI-generated video footage or 3D rendering.
- Use reusable components and separate scene files where appropriate.
- Keep assets local and make the project renderable offline after
  dependencies and assets have been installed.

VISUAL STYLE:
- Modern editorial 2D vector animation.
- Consistent dark navy, teal and warm off-white palette.
- First-person perspective: illustrated hands in the foreground,
  laptop and code editor in front of the viewer.
- Subtle parallax, gentle camera push-ins, cursor movement,
  typing animation and small interface transitions.
- Keep hands, clothing, desk layout and laptop consistent.
- Avoid excessive motion, random decorative effects and clutter.
- Use readable Vietnamese text with correct accents.

STORYBOARD:
1. 0-4s: Hook — a production error suddenly appears.
2. 4-11s: POV hands move to the laptop.
3. 11-19s: Inspect the error log and identify a suspicious event.
4. 19-28s: Trace the issue through a simplified diagram.
5. 28-37s: Apply a simulated fix and run a test.
6. 37-42s: Show the test passing and the system recovering.
7. 42-45s: Career takeaway and audience question.

AUDIO:
- Reserve separate tracks for Vietnamese narration,
  background music and sound effects.
- Use subtle keyboard typing, notification and interface sounds.
- Keep background music below narration.
- If audio files are unavailable, use documented placeholders;
  do not invent URLs.

CONTENT ACCURACY:
- Treat the scenario as a fictional educational simulation.
- Do not claim every production bug is fixed this way.
- Keep factual claims and source URLs in a separate research manifest.
- Do not invent citations or claim a fact has been verified without evidence.

DELIVERABLES:
1. Complete source project.
2. A scene-by-scene timeline.
3. Editable Vietnamese narration and subtitles.
4. An audio asset manifest with source and license notes.
5. A README with setup, preview and render commands.
6. Render the MP4 and check the entire video for visual errors.

Before implementation, inspect the installed HyperFrames skill
and existing project structure. Follow the actual APIs and project
conventions. Do not invent commands or dependencies.
```

### Prompt để Claude viết kịch bản trước khi code

```text
Before writing any animation code, create a research-backed
45-second Vietnamese Career POV script.

Return:
1. Target audience and one learning objective.
2. A table of factual claims and source URLs.
3. A 7-scene storyboard with timestamps.
4. Vietnamese narration for each scene.
5. On-screen text for each scene.
6. 2D assets needed for each scene.
7. Animation instructions for each scene.
8. TTS pronunciation notes.
9. Sound effects and background ambience needed.
10. A list of uncertain claims that must be verified or removed.

Do not invent citations. Separate verified facts from fictional
story elements. Wait for human approval before implementing
the animation.
```

## 7. Cấu trúc dữ liệu storyboard

Giữ storyboard ở dạng JSON hoặc cấu trúc dữ liệu tương tự để tái sử dụng với nhiều nghề.

Ví dụ minh họa:

```json
{
  "title": "POV: Junior Software Engineer",
  "language": "vi-VN",
  "durationSeconds": 45,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "scenes": [
    {
      "id": "hook",
      "start": 0,
      "duration": 4,
      "visual": "production error appears on laptop",
      "narration": "Một lỗi vừa xuất hiện trên hệ thống.",
      "onScreenText": "Có lỗi production!",
      "assets": ["pov_hands.svg", "laptop.svg", "error_panel.svg"],
      "sfx": ["notification"],
      "factIds": []
    }
  ],
  "research": [
    {
      "id": "fact-001",
      "claim": "Claim cần xác minh",
      "sourceUrl": "",
      "status": "unverified"
    }
  ]
}
```

Không xuất bản các claim còn ở trạng thái `unverified`. Trong project thật, hãy thay `sourceUrl` bằng nguồn thật và lưu ghi chú kiểm chứng.

## 8. Ước tính chi phí

### Mục tiêu thử nghiệm: 0–5 USD/tháng

| Hạng mục | Mục tiêu chi phí | Ghi chú |
|---|---:|---|
| Claude | 0 USD nếu gói miễn phí đủ dùng | Có thể cần gói trả phí nếu dùng Claude Code thường xuyên hoặc xử lý dự án dài |
| HyperFrames | 0 USD cho mã nguồn mở | Chi phí thực tế còn phụ thuộc môi trường và các dịch vụ đi kèm |
| Remotion | Có thể 0 USD trong phạm vi giấy phép áp dụng | Kiểm tra giấy phép hiện hành và trường hợp sử dụng thương mại |
| TTS | 0 USD trong hạn mức miễn phí | Kiểm tra quota, chất lượng tiếng Việt và quyền thương mại |
| Nhạc/SFX | 0 USD nếu chọn nguồn miễn phí phù hợp | Kiểm tra giấy phép từng file |
| Render | 0 USD tiền dịch vụ nếu render local | Tốn thời gian và tài nguyên máy tính |

Đây là **mục tiêu ngân sách**, không phải cam kết mọi công cụ có đủ tính năng miễn phí. Không trả phí nhiều dịch vụ trước khi render thành công video mẫu.

### Cách đo chi phí thật

Với mỗi video, ghi lại:
1. Thời gian nghiên cứu và viết kịch bản.
2. Thời gian chỉnh sửa asset và animation.
3. Số lần render lại.
4. Số ký tự/phút TTS hoặc credit đã dùng.
5. Phí công cụ thực tế.
6. Tỷ lệ thời lượng video phải làm lại do lỗi hình ảnh hoặc nội dung.

Sau ba video, dùng dữ liệu này để quyết định có cần mua gói trả phí không.

## 9. Checklist trước khi đăng

### Nội dung và kiểm chứng
- [ ] Có mục tiêu học tập rõ ràng.
- [ ] Mỗi thông tin quan trọng có nguồn đáng tin cậy.
- [ ] Tách bạch thông tin thực tế và tình huống giả lập.
- [ ] Không có claim chưa xác minh.
- [ ] Không minh họa hành động nguy hiểm như hướng dẫn nghề nghiệp đầy đủ.

### Hình ảnh 2D
- [ ] Tỷ lệ 9:16 và độ phân giải đúng.
- [ ] Bàn tay, thiết bị, bố cục và màu sắc nhất quán.
- [ ] Chuyển động phục vụ nội dung, không gây rối mắt.
- [ ] Không có chữ lỗi, vật thể thừa hoặc thành phần bị cắt.
- [ ] Tất cả asset có nguồn và giấy phép phù hợp.

### Âm thanh
- [ ] TTS phát âm đúng tiếng Việt và thuật ngữ.
- [ ] Lời dẫn không bị cắt.
- [ ] Nhạc nền không lấn lời.
- [ ] SFX khớp hành động.
- [ ] Đã kiểm tra giấy phép và yêu cầu ghi công.

### Xuất bản
- [ ] Video dài 30–60 giây.
- [ ] Phụ đề dễ đọc trên màn hình điện thoại.
- [ ] Hook xuất hiện trong 1–3 giây đầu.
- [ ] Có câu kết hoặc câu hỏi gợi tương tác.
- [ ] Đã xem toàn bộ video sau khi render.
- [ ] Đã lưu source, manifest, asset và bản render.
- [ ] Không khiến người xem nhầm mô phỏng AI thành footage thật.

## 10. Kế hoạch thử nghiệm 7 ngày

| Ngày | Công việc | Đầu ra |
|---|---|---|
| 1 | Chọn một nghề, tình huống và nguồn | Research manifest |
| 2 | Viết lời dẫn và storyboard | Kịch bản 45 giây |
| 3 | Tạo bộ asset 2D cơ bản | SVG, background, icon, giao diện |
| 4 | Xây timeline và animation | Bản preview |
| 5 | Tạo TTS, chọn nhạc/SFX | Audio tracks |
| 6 | Render, QA và sửa lỗi | MP4 hoàn chỉnh |
| 7 | Đăng thử và ghi số liệu | Báo cáo thử nghiệm đầu tiên |

## 11. Định nghĩa thành công của MVP

Không chỉ đo lượt xem. MVP đầu tiên nên trả lời được:

- Có thể tạo video 2D nhất quán bằng template hay không?
- Người xem có hiểu công việc và kỹ năng được minh họa không?
- Nội dung có đáng tin và được phân biệt rõ với tình huống giả lập không?
- Một video mất bao lâu để sản xuất?
- Có thể giảm thời gian làm video thứ hai và thứ ba không?
- Chi phí thực tế trên mỗi video là bao nhiêu?
- Người xem muốn tìm hiểu nghề nào tiếp theo?

**Khuyến nghị cuối:** Bắt đầu với một video 45 giây, một nghề, một template 2D và một pipeline render. Chọn **Claude + HyperFrames** để thử nghiệm nhanh hoặc **Claude + Remotion** để xây hệ thống component lâu dài. Chỉ mở rộng sang nhiều nghề sau khi đã render và duyệt thành công ba video đầu tiên.
