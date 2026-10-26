# Nhật ký sản xuất — POV: Bạn so sánh thu nhập 10 nhóm ngành chuyên môn — nhóm nào cao nhất? (số liệu OECD)

## Công sức và chi phí
| Ngày | Công đoạn | Giờ | Số lần render | Ký tự TTS | Chi phí công cụ (USD) | Ghi chú |
|---|---|---|---|---|---|---|
| 16/10/2026 | research + script | — | 0 | — | 0 | 3 vòng kiểm chứng nguồn (fact-checker) + 1 vòng rà soát tiếng Việt; người dùng duyệt bản sửa thứ 4. Số giờ chưa ghi nhận. |
| 16/10/2026 | audio | — | 0 | 1071 | 0 | VieNeu-TTS chạy trên máy, giọng Hải Đăng; dùng đúng các file của bản nghe thử đã duyệt. Không có nhạc nền/SFX. |
| 16/10/2026 | animation + render-qa | — | 2 | — | 0 | HyperFrames 0.8.163, render chất lượng high mất 1 phút 4 giây; 1 vòng sửa hình trước khi render (nhãn bị cắt, mẩu "%)" sót lại, lưới đè ô bình luận). Bản 2 (55 giây render) sửa thêm theo QA: dấu của "Ở" trong phụ đề, vạch 100 xuyên nhãn số, ngắt dòng "chứng chỉ", mép chữ lộ khi biểu đồ trượt vào. |

## Xuất bản
| Nền tảng | URL | Ngày đăng | File render |
|---|---|---|---|

## Số liệu
| Ngày | Nền tảng | Lượt xem | Thời gian xem TB | Tỷ lệ xem hết | Thích | Bình luận | Chia sẻ |
|---|---|---|---|---|---|---|---|

## Câu hỏi và hiểu nhầm của người xem

## Bài học rút ra
- Biểu đồ kéo dài qua nhiều khung cần một bộ dùng chung (tools/gen-frames.mjs) để giữ đúng hình học giữa các khung.
- Đọc từ viết tắt kiểu Việt ("ô e xê đê") làm câu dài thêm khoảng 1 giây; cần đo lại thời lượng.
