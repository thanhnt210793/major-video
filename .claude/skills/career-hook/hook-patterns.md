# Hook patterns, rules and rubric

Reference for `/career-hook`. Also used by `vi-script-reviewer` (scene 1 checks), `/career-build` (the first second on screen) and the `render-qa` agent.

The channel's narrator (VieNeu preset "Hải Đăng") speaks about 4.4–5.0 Vietnamese syllables per second, and the first word starts about 0.1 s in. These rates were measured on the first two videos. So:
- ~10 syllables ≈ 2 s, which is where the hook's key word must land.
- A 4 s hook scene holds at most ~17 syllables.

## Hard rules (breaking any one drops the candidate)

1. **No greeting or announcement.** Don't open with "Xin chào", "Chào các bạn", "Hôm nay mình sẽ…", "Trong video này…" or "Cùng tìm hiểu…". Start inside the moment.
2. **The promise is paid off.** A named later scene (`hook.payoffSceneId`) answers or shows exactly what the hook promises. No bait-and-switch visual, and no implying something the story doesn't contain.
3. **Facts are sourced.** Every factual assertion needs a `research[]` entry and must be `verified` before publishing. That covers numbers, statistics, salary, and "most / always / never / X% of developers…". A story detail (the invoice that is 1 đồng off) is `simulation`.
4. **No fear, shame or pressure about the viewer's future.**
   - No "Chọn sai ngành là hỏng cả đời" or "Bạn sẽ thất nghiệp nếu…".
   - No salary bait.
   - No sensational words: "sốc", "kinh hoàng", "sự thật đáng sợ", "không ai nói cho bạn biết".
5. **No mocking a person, a job or a group.** In blame stories the hook doesn't point at a culprit.
6. **Safety-sensitive careers:** the hook never shows a dangerous procedure, even as a flash-forward.
7. **Keep it generic.** Apps and companies in the story stay generic. No real company, product or person appears as part of the story unless a source supports it.

## Rubric (each 0–2, total /12)

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Dừng lướt** (stops the scroll) | Frame 0 is empty, dark, a logo or setup | Something is happening by ~1.5 s | Frame 0 already shows the problem or something unusual, and it changes within 1 s |
| **Cụ thể** (concrete) | Abstract: "một lỗi", "một ngày làm việc" | Some detail | An exact detail: a number, time, error or object ("lệch đúng 1 đồng", "20 giờ, flash sale") |
| **Vòng mở** (open loop) | Nothing to wonder about, or answered at once | General curiosity | A specific question the viewer wants answered and can't guess |
| **Gần gũi** (fits a 12–18-year-old) | Needs jargon to follow | Understandable | Linked to their life (school, phone, games, their name, pocket money) or a feeling they know |
| **Nhanh** (fast) | Key moment after ~3 s, or the line overruns the scene | Key moment at 2–3 s | Key moment by ~2 s (≤ ~10 syllables), and the line fits the scene |
| **Khớp & trả lời** (aligned and paid off) | Layers contradict, or the promise isn't paid off | Paid off, but the layers are only loosely related | Visual, text and voice show one moment, and the payoff scene delivers exactly the promise |

Eligible: ≥ 9/12 and no 0 on "Khớp & trả lời".

## Patterns

Use the `id` in `storyboard.json` `hook.pattern`. `/career-log summary` compares retention by pattern, so don't invent new ids. To add a pattern, add it here and to `HOOK_PATTERNS` in `scripts/validate-storyboard.mjs`.

### `in-medias-res` — Vào thẳng sự cố
- **Fits:** incident, debug and error stories.
- **Shape:** the problem is already on screen at frame 0, and the line names it or reacts to it.
- **Example:**
  - Frame 0: the terminal is already full of red error.
  - Text: "Thứ Hai · 9:00".
  - Voice: "Câu lệnh đầu tiên của tuần… đỏ lòm."
- **Trap:** opening with setup (the desk, the typing), so the problem only shows after 2 s.

### `oddly-specific` — Chi tiết lạ mà cụ thể
- **Fits:** stories where the trigger is small but precise.
- **Example:**
  - Frame 0: an invoice with "1 đ" circled in red.
  - Voice: "Khách báo hoá đơn sai… đúng 1 đồng."
- **Trap:** using a real-world statistic as the "odd number" without a source.

### `curiosity-question` — Câu hỏi khoảng trống tò mò
- **Fits:** any story whose payoff is an explanation.
- **Shape:** a specific question that the video answers.
- **Good:** "Vì sao chỉ 1 đồng mà cả nhóm phải dừng việc?"
- **Bad:** "Bạn có biết lập trình viên làm gì không?" It's generic, yes/no, and has no tension.
- **Trap:** the answer is obvious, or comes in scene 2 so the loop closes too early.

### `pov-stakes` — POV + điều đang bị đe doạ
- **Fits:** on-call, release and customer-facing stories.
- **Shape:** the on-screen text "POV: bạn là …" plus what is at stake right now. The narration stays in `mình`.
- **Example:**
  - Text: "POV: bạn trực sự cố tối nay".
  - Frame 0: the error chart is already spiking.
  - Voice: "20 giờ, flash sale vừa mở… và khách không thanh toán được."
- **Trap:** stakes too frightening for students, or switching the narrator to "bạn".

### `countdown` — Đồng hồ đếm ngược
- **Fits:** release, demo and deadline stories.
- **Example:**
  - Frame 0: a clock reading 16:52 and a checklist with one red item.
  - Text: "Phát hành lúc 17:00".
  - Voice: "Còn 8 phút. Ô cuối cùng… đỏ."
- **Trap:** urgency that has nothing to do with the payoff.

### `myth-vs-reality` — Tưởng là… hoá ra…
- **Fits:** stories that show a side of the job students don't expect.
- **Example:** "Lập trình viên đâu chỉ gõ code. Sáng nay mình chỉ… đọc lỗi."
- **Trap:** the "reality" is a claim about the job, so it needs a verified source. Don't caricature the myth.

### `result-first` — Cho xem kết quả trước
- **Fits:** stories with a surprising ending.
- **Shape:** show the strange end state, then rewind.
- **Example:**
  - Frame 0: a green terminal, with a colleague looking puzzled.
  - Voice: "Chị Mai chưa nói câu nào… mà mình đã sửa xong lỗi."
  - Scene 2 opens with "Quay lại lúc 9 giờ sáng…".
- **Trap:** it needs a bridge line in scene 2, which is a structural change. The end state must really be in the video.

### `relatable` — Điều học sinh đã từng gặp
- **Fits:** bugs or situations that touch everyday life.
- **Example:**
  - Frame 0: a name tag reading "Nguyá»…n".
  - Voice: "Tên bạn có dấu? Có khi nó từng làm vỡ cả một hệ thống."
- **Trap:** stretching the link, or asking a yes/no question that goes nowhere.

### `wrong-move` — Làm sai ngay trước mắt người xem
- **Fits:** stories where a beginner's habit is the lesson.
- **Shape:** the protagonist makes the classic mistake, and viewers want to correct it.
- **Example:**
  - Frame 0: a finger hits Enter and the red error flashes again.
  - Text: "Lần thứ 3…".
  - Voice: "Chạy lại lần nữa… chắc nó tự hết lỗi nhỉ?"
  - The right way comes in the analyze scene.
- **Trap:** the mistake must be safe and harmless to copy.

## Writing the spoken line

- **Start as late as possible.** Cut "Sáng nay, mình…" when the visual already shows it.
- **Place the turn word well.** Put it near the end of the first ~10 syllables. A "…" before it gives VieNeu a natural pause.
- **Keep it short.** One sentence, at most two short ones. Use spoken words ("đỏ lòm", "khoan đã", "y hệt"). Write numbers as words in `ttsNarration`.
- **Questions end with "?"** so the voice rises. Don't ask two questions in a row.
- **Keep the narrator's person.** It stays `mình`, as in the rest of the script.

## The first second on screen (for `/career-build` and `render-qa`)

- **Frame 0 is fully composed.** It already has the background, hands, device, and the problem or its sign. No fade from black, empty screen, logo or title card.
- **The hook moment is visible by 1.0 s.** The error, number or red item is the highest-contrast element and big enough to read on a phone. A single small line of terminal text is not enough: push in on it or add a large card. Use the palette's `error`/`warning`/`success` only for real UI states.
- **On-screen text is visible at 0.0–0.3 s.** It sits inside the TikTok/Shorts safe zone and doesn't collide with captions.
- **Audio starts right away.** Narration within ~0.2 s, no music lead-in, and one SFX accent on the hook moment.
- **One motion move only:** a punch-in or a pop on the problem element.

## Worked example — `dev-local-port-bug` as built (renders 20261022-1 and -2)

**As built:**
- Frame 0: an empty terminal with hands at rest. The "Thứ Hai · 9:00" pill appears at 0.25 s.
- Voice: "Sáng thứ Hai, mình chạy thử ứng dụng đang làm… và cả màn hình đỏ lòm." (16 syllables)
- The red error is one small line that appears at 2.25 s.

| Dừng lướt | Cụ thể | Vòng mở | Gần gũi | Nhanh | Khớp & trả lời | Total |
|---|---|---|---|---|---|---|
| 0 | 2 | 1 | 1 | 1 | 1 | **6/12** |

- Dừng lướt is 0 because frame 0 is setup.
- Khớp & trả lời is 1 because the voice says "cả màn hình đỏ lòm", but the screen shows one small red line.

**Candidates that pass:**

| Pattern | Frame 0 | Text | Voice (syllables) | Payoff |
|---|---|---|---|---|
| `in-medias-res` | Terminal already red, pushed in on `EADDRINUSE` | "Thứ Hai · 9:00" | "Câu lệnh đầu tiên của tuần… đỏ lòm." (8) | `read` → `find` |
| `wrong-move` | Finger hits Enter, the error flashes again, the clock shows 9:25 | "Lần thứ 3…" | "Chạy lại lần nữa… chắc nó tự hết lỗi nhỉ?" (10) | `read` |
| `result-first` | Green terminal, chị Mai looking puzzled | "Chị chưa nói câu nào!" | "Chị Mai chưa nói câu nào… mà mình đã sửa xong lỗi." (12) | `colleague` → `takeaway` |

**Dropped:** "Mình sửa được lỗi nhờ… một chú vịt cao su." It breaks rule 2: in this story the listener was chị Mai, and the duck only appears in the takeaway as the name of the trick.
