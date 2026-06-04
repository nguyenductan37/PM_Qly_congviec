# SPEC.md — Product Specification

> **Dự án:** Focus Flow — Trợ lý quản lý công việc thông minh cho người trẻ bận rộn  
> **Phiên bản:** v1.0 (MVP)  
> **Cập nhật lần cuối:** Sprint 1

---

## 1. Bối cảnh & Vấn đề

Focus Flow giải quyết 4 nỗi đau cốt lõi của người trẻ (18–30 tuổi) có cuộc sống bận rộn:

| Nỗi đau                            | Biểu hiện                                          |
| ---------------------------------- | -------------------------------------------------- |
| **Tê liệt ra quyết định**          | Không biết bắt đầu việc gì, lãng phí thời gian chờ |
| **Lo lắng về công việc chất đống** | Cảm giác overwhelmed, mất kiểm soát                |
| **Lịch bị vỡ khi có đột xuất**     | Không có cơ chế phục hồi nhanh                     |
| **Không thấy sự tiến bộ**          | Chạy đua mãi mà không biết mình đang đi đến đâu    |

**Người dùng mục tiêu:** Người trẻ, cuộc sống bận rộn, chưa thành thục quản lý thời gian, kỳ vọng năng lực bản thân cao.

---

## 2. Định nghĩa Thành công (Success Metrics)

- ✅ Người dùng trả lời được "Việc cần làm ngay bây giờ" trong **≤ 30 giây**
- ✅ Người dùng có lịch trình hoặc được đề xuất công việc cho **1 tuần tới**
- ✅ Hệ thống hiển thị rõ: việc hoàn thành / dang dở / đang bị tắc
- ✅ Giảm **≥ 80%** cảm giác lo lắng (đo bằng self-reported survey sau 4 tuần dùng)

---

## 3. Tính năng Cốt lõi & User Stories

---

### Epic 1 — Trợ lý Ra Quyết Định (Decision Assistant)

#### PB_4 — Quick Action: "Tôi có 15 phút"

**User Story:**

> Là **người dùng bận rộn**, tôi muốn **bấm một nút và nhận ngay 1–2 nhiệm vụ phù hợp với thời gian trống**, để **tôi không lãng phí khoảng thời gian chờ vào việc lướt mạng xã hội**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC4‑1 Màn hình chính hiển thị 3 nút với nhãn lần lượt: "Tôi có 15 phút", "Tôi có 30 phút", "Tôi có 60 phút". UI / Unit
AC4‑2 Khi người dùng bấm vào một nút, hệ thống gọi API GET /api/tasks/quick-suggest?minutes=N với N tương ứng (15, 30, 60). Integration
AC4‑3 API chỉ trả về tối đa 2 task có estimated_min ≤ N và status là todo hoặc in_progress. Unit (logic)
AC4‑4 Kết quả trả về được sắp xếp theo thứ tự ưu tiên: eisenhower_q tăng dần (1→4), nếu bằng nhau thì energy_level giảm dần (high→low). Unit (sort)
AC4‑5 Nếu không có task nào phù hợp, hiển thị thông báo: "Bạn đang trống lịch — hãy nghỉ ngơi! 🎉" (không hiển thị danh sách rỗng). Unit / UI
AC4‑6 Thời gian phản hồi API (p95) ≤ 200ms trên staging với 1000 tasks mock. Performance

**Definition of Done (DoD):**

- [ ] Code review bởi ≥1 peer, không có critical comment chưa resolve
- [ ] Unit test coverage ≥ 80% cho module thuật toán lọc
- [ ] Đã test trên iOS Safari và Android Chrome
- [ ] Tài liệu API endpoint `/api/tasks/quick-suggest` đã được cập nhật vào Swagger

---

#### PB_1.1 — Ma trận Eisenhower + Mức Năng lượng

**User Story:**

> Là **người dùng**, tôi muốn **mỗi công việc được gán nhãn theo 4 ô Eisenhower và 3 mức năng lượng cần thiết**, để **tôi không vô tình chọn việc khó khi đang mệt**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC1‑1 Form tạo/sửa task có 2 nhóm lựa chọn bắt buộc: Eisenhower (4 ô: Q1–Q4) và Energy Level (Cao / Trung / Thấp). UI
AC1‑2 Nếu người dùng không chọn, khi submit → hệ thống tự động gán mặc định: eisenhower_q = 2 (Q2), energy_level = 'medium'. Unit (backend)
AC1‑3 Mỗi task sau khi lưu phải có giá trị eisenhower_q và energy_level hợp lệ (không null). DB constraint
AC1‑4 Màn hình danh sách task có bộ lọc cho phép chọn một ô Eisenhower (Q1–Q4) và/hoặc một mức năng lượng. UI
AC1‑5 Khi lọc, danh sách chỉ hiển thị các task thỏa mãn đồng thời cả hai điều kiện (AND logic). Unit
AC1‑6 UI hiển thị đúng màu sắc cho từng ô Eisenhower: Q1=đỏ, Q2=xanh lam, Q3=vàng, Q4=xám. UI

**Definition of Done (DoD):**

- [ ] DB migration script đã được review và test trên môi trường staging
- [ ] Không có breaking change trên API cũ (backward compatible)
- [ ] UI label hiển thị đúng màu theo convention (Q1=đỏ, Q2=xanh lam, Q3=vàng, Q4=xám)

---

### Epic 2 — Hệ thống Ưu tiên Động (Dynamic Scheduling)

#### PB_1 — Tái cấu trúc Lịch trình Tự động

**User Story:**

> Là **người dùng**, tôi muốn **hệ thống tự động phát hiện khi có lịch bị chồng chéo và đề xuất phương án dời lịch**, để **tôi không bị mất kiểm soát khi kế hoạch thay đổi đột ngột**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC2‑1 Khi tạo hoặc cập nhật một task có scheduled_at thời gian bắt đầu + estimated_min mà trùng lặp với một task khác cùng user_id, hệ thống hiển thị banner cảnh báo trong vòng ≤ 2 giây. Integration / E2E
AC2‑2 Cảnh báo phải liệt kê rõ tên các task bị xung đột và khoảng thời gian chồng chéo. UI
AC2‑3 Hệ thống tự động đề xuất ít nhất 1 khung giờ thay thế trong cùng ngày, dựa trên các khoảng trống hiện có của lịch. Unit (algorithm)
AC2‑4 Mỗi đề xuất hiển thị dưới dạng nút "Xác nhận" – khi bấm, task được cập nhật scheduled_at mới tương ứng. Integration
AC2‑5 Sau khi xác nhận dời lịch, một bản ghi được thêm vào bảng task_history với change_type = 'reschedule', lưu old_value và new_value dưới dạng JSONB. Integration / DB
AC2‑6 Thuật toán phát hiện xung đột và đề xuất hoàn thành trong ≤ 500ms với lịch có ≤ 100 tasks. Performance

**Definition of Done (DoD):**

- [ ] Engine phát hiện xung đột được test với ≥ 20 test case (bao gồm edge case: task kéo dài qua nửa đêm)
- [ ] Notification push được test trên cả iOS và Android
- [ ] Performance: thuật toán re-scheduling chạy trong ≤ 500ms cho lịch có ≤ 100 tasks

---

### Epic 3 — Cơ chế Đóng gói (Closure Mechanism)

#### PB_2 — Quy trình "Kết thúc Ngày"

**User Story:**

> Là **người dùng**, tôi muốn **có một quy trình kết thúc ngày rõ ràng**, để **tâm trí tôi được giải tỏa hoàn toàn khi rời công việc**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC3‑1 Nút "Kết thúc ngày" chỉ xuất hiện khi thời gian hiện tại ≥ end_of_day_time (mặc định 17:00) theo timezone của người dùng. Unit (time mock)
AC3‑2 Nhấn nút → mở màn hình Day Summary hiển thị: số task hoàn thành, số task dang dở, % hoàn thành trong ngày. Integration
AC3‑3 Màn hình Day Summary có nút "Xác nhận kết thúc" – sau khi bấm, hệ thống chuyển sang Off Mode. Integration
AC3‑4 Off Mode = tắt toàn bộ push notification công việc (kể cả morning plan, urgent) cho đến 07:00 sáng hôm sau (theo timezone người dùng). Integration
AC3‑5 Off Mode vẫn được duy trì khi app bị kill và mở lại (persist qua user_preferences.mute_until). E2E

**Definition of Done (DoD):**

- [ ] User test với ≥ 3 người dùng thực tế; ghi nhận feedback
- [ ] Trạng thái "Off" không bị reset khi app bị kill và mở lại (persist qua local storage/db)

---

#### PB_2.1 — Tự động tóm tắt và Lên kế hoạch Sáng

**User Story:**

> Là **người dùng**, tôi muốn **khi thức dậy đã thấy sẵn danh sách việc cần làm hôm nay được ưu tiên tự động**, để **tôi không phải suy nghĩ về "bắt đầu từ đâu" ngay từ sáng sớm**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC4‑1 Hàng ngày lúc morning_plan_time (mặc định 06:30) theo timezone của user, background job tạo Morning Plan gồm: tasks dang dở từ hôm trước + tasks mới có due_at = today. Integration (cron)
AC4‑2 Morning Plan được sắp xếp theo Eisenhower priority (Q1 → Q2 → Q3 → Q4), và trong mỗi nhóm sắp xếp theo due_at gần nhất trước. Unit (sort)
AC4‑3 Mỗi user nhận một push notification chứa tiêu đề "📋 Kế hoạch sáng nay" và danh sách tóm tắt (≤ 3 task đầu tiên). Integration (push mock)
AC4‑4 Lần đầu mở app trong ngày (sau 00:00 local time), màn hình Home hiển thị widget Morning Plan với toàn bộ danh sách (không cắt). UI / E2E
AC4‑5 Nếu không có bất kỳ task nào, Morning Plan vẫn được tạo nhưng nội dung hiển thị: "✨ Hôm nay chưa có việc gì – tận hưởng nhé!" (không lỗi). Unit / UI

**Definition of Done (DoD):**

- [ ] Cron job / scheduled notification đã được test trên staging với timezone Asia/Ho_Chi_Minh
- [ ] Đã xử lý edge case: không có task nào → hiển thị thông điệp tích cực

---

### Epic 4 — Bản đồ Tăng trưởng (Growth Map)

#### PB_5 — Dashboard Tiến bộ Kỹ năng

**User Story:**

> Là **người dùng**, tôi muốn **xem biểu đồ thể hiện sự cân bằng giữa thời gian làm việc và học tập của mình**, để **tôi không cảm thấy tội lỗi khi nghỉ ngơi hoặc học tập**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC5‑1 Dashboard hiển thị biểu đồ tròn (pie chart) phân bổ thời gian theo 3 category: work_min, learning_min, personal_min cho tuần hiện tại. UI
AC5‑2 Bấm vào biểu đồ → drill-down hiển thị biểu đồ cột theo từng ngày trong tuần (Mon–Sun). UI
AC5‑3 Chỉ số "Skill Progress" hiển thị mỗi category có giá trị thay đổi % so với tuần trước, kèm mũi tên lên/xuống (🔼 nếu tăng, 🔽 nếu giảm). Unit (delta)
AC5‑4 Tất cả dữ liệu dashboard được lấy từ bảng daily_summaries (đã pre‑aggregated), không query trực tiếp tasks. Integration
AC5‑5 Dashboard load lần đầu < 1 giây trên thiết bị tầm trung (đo bằng network mock). Performance

**Definition of Done (DoD):**

- [ ] Chart không bị vỡ layout trên màn hình < 375px
- [ ] Dữ liệu được aggregated bằng background job, không tính real-time để tránh overload DB

---

#### PB_5.1 — Time-boxing Học tập Tự động

**User Story:**

> Là **người dùng**, tôi muốn **hệ thống tự động gợi ý chèn khoảng thời gian học tập ngắn vào lịch của tôi**, để **việc phát triển bản thân trở thành thói quen tự nhiên, không cần nỗ lực ý chí**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC6‑1 Khi người dùng có một khoảng trống liên tục ≥ 30 phút trong lịch (giữa các task đã có scheduled_at), hệ thống hiển thị popup gợi ý "Bạn có muốn học không?" cùng với danh sách category đã chọn. Unit (gap detection)
AC6‑2 Popup có 3 lựa chọn: Accept (chèn learning block), Decline (bỏ qua), Snooze (nhắc lại sau 1 giờ). UI
AC6‑3 Nếu chọn Accept → learning block được tạo như một task với category = learning, title = "Học: [category name]", và scheduled_at trùng với khoảng trống đó. Integration
AC6‑4 Người dùng phải setup learning categories trước trong màn hình cài đặt (tối thiểu 1 category). Nếu chưa setup, không bao giờ hiển thị gợi ý. Unit / DB
AC6‑5 Snooze: sau 1 giờ, nếu khoảng trống vẫn còn (không bị task khác lấp), hiển thị lại popup tương tự. Integration (time mock)

---

### Epic 5 — Khớp lệnh Năng lượng (Energy Matching)

#### PB_3 — Nhận diện Khung giờ Hiệu suất Cao

**User Story:**

> Là **người dùng**, tôi muốn **hệ thống phân tích lịch sử làm việc và nhận diện khung giờ tôi hiệu quả nhất**, để **tôi biết sắp xếp Deep Work vào đúng thời điểm tỉnh táo nhất**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC7‑1 Sau khi có ≥ 7 ngày dữ liệu hoàn thành task (completed_at + duration), hệ thống phân tích và xác định "Khung giờ vàng" – khoảng 2 giờ liên tục có tỷ lệ hoàn thành task cao nhất. Unit (algorithm)
AC7‑2 Khung giờ vàng được hiển thị trên màn hình Home, ví dụ: "🌟 Khung giờ vàng: 9:00 – 11:00". UI
AC7‑3 Nếu chưa đủ 7 ngày dữ liệu, hiển thị thông báo: "Cần thêm X ngày để phát hiện khung giờ vàng của bạn". UI
AC7‑4 Khi người dùng bấm nút "Auto-schedule" (trên màn hình danh sách task), hệ thống ưu tiên sắp xếp các task có energy_level = 'high' vào khung giờ vàng trước, sau đó mới đến các khung giờ khác. Integration / Unit
AC7‑5 Thuật toán phân tích chạy mỗi Chủ nhật lúc 22:00 (background job), cập nhật kết quả vào bảng user_preferences.peak_hours_start/end. Integration (cron)

---

#### PB_3.1 — Hiển thị Ngân sách Năng lượng

**User Story:**

> Là **người dùng**, tôi muốn **thấy chỉ số năng lượng còn lại trong ngày**, để **tôi biết khi nào nên dừng lại trước khi kiệt sức**.

**Acceptance Criteria:**

ID Acceptance Criteria Loại kiểm tra
AC8‑1 Màn hình Home có thanh Energy Budget hiển thị % từ 0–100, bắt đầu ngày mới = 100%. UI
AC8‑2 Năng lượng giảm dần theo công thức: mỗi task hoàn thành trừ đi (estimated_min / 60) \* 5% (tối thiểu 1%), và mỗi 30 phút ngồi liên tục (không có break) trừ thêm 2%. Unit (math)
AC8‑3 Khi Energy Budget < 20%, hệ thống:
Push notification: "⚠️ Bạn đã làm việc nhiều — hãy nghỉ 10 phút"

Tạm dừng mọi gợi ý task mới từ Quick Action và Time-boxing (nhưng vẫn cho phép tạo task thủ công). | Integration / E2E |
| AC8‑4 | Sau khi nghỉ 10 phút (hoặc người dùng bấm "Tôi đã nghỉ"), Energy Budget được reset lên 40% (không phải 100%). | Integration |
| AC8‑5 | Energy Budget không bao giờ âm – hiển thị tối thiểu 0% và tự động chặn gợi ý mới cho đến khi reset. | Unit |

## 4. Out of Scope (MVP v1)

- Tích hợp Google Calendar / Apple Calendar (planned for v2)
- Tính năng cộng tác nhóm / team task
- AI chat interface
- Gamification / badge system
