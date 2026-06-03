# SPEC.md — Product Specification

> **Dự án:** Focus Flow — Trợ lý quản lý công việc thông minh cho người trẻ bận rộn  
> **Phiên bản:** v1.0 (MVP)  
> **Cập nhật lần cuối:** Sprint 1

---

## 1. Bối cảnh & Vấn đề

Focus Flow giải quyết 4 nỗi đau cốt lõi của người trẻ (18–30 tuổi) có cuộc sống bận rộn:

| Nỗi đau | Biểu hiện |
|---|---|
| **Tê liệt ra quyết định** | Không biết bắt đầu việc gì, lãng phí thời gian chờ |
| **Lo lắng về công việc chất đống** | Cảm giác overwhelmed, mất kiểm soát |
| **Lịch bị vỡ khi có đột xuất** | Không có cơ chế phục hồi nhanh |
| **Không thấy sự tiến bộ** | Chạy đua mãi mà không biết mình đang đi đến đâu |

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

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Nút "Tôi có [N] phút" hiển thị từ màn hình chính; N có thể chọn: 15, 30, 60 phút | Unit test: render component, kiểm tra 3 giá trị N |
| AC2 | Thuật toán chỉ trả về task có `estimated_duration ≤ N` và trạng thái `todo` hoặc `in_progress`; tối đa 2 kết quả | Unit test: mock task list, assert output.length ≤ 2 và mọi task.duration ≤ N |
| AC3 | Nếu không có task phù hợp, hiển thị thông báo "Bạn đang trống lịch — hãy nghỉ ngơi! 🎉" thay vì màn hình trắng | Unit test: empty task list → assert fallback message rendered |

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

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Khi tạo/sửa task, người dùng phải chọn 1 trong 4 ô Eisenhower (Q1–Q4) và 1 trong 3 mức năng lượng (Cao / Trung / Thấp). Nếu bỏ trống, hệ thống gán mặc định Q2 + Trung | Unit test: submit form without labels → assert default values saved |
| AC2 | Bộ lọc trên danh sách task cho phép filter theo ô Eisenhower hoặc mức năng lượng; kết quả phải chính xác 100% | Unit test: seed 10 tasks, filter Q1+Cao → assert chỉ trả về đúng tasks |

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

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Khi 2 task có `time_slot` trùng nhau, hệ thống hiển thị banner cảnh báo trong ≤ 2 giây sau khi xung đột được tạo ra | Integration test: tạo 2 task chồng giờ → assert warning visible within 2s |
| AC2 | Hệ thống đề xuất ≥ 1 khung giờ thay thế dựa trên các task đang trống trong cùng ngày; người dùng bấm "Xác nhận" để áp dụng | Unit test: mock calendar gaps → assert suggestion list non-empty |
| AC3 | Sau khi người dùng xác nhận, task được cập nhật `time_slot` mới; lịch sử thay đổi được lưu vào `task_history` | Integration test: confirm reschedule → assert new time_slot saved & history entry created |

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

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Nút "Kết thúc ngày" xuất hiện sau 17:00 (hoặc giờ do người dùng cài); khi bấm hiển thị màn hình tóm tắt: số task hoàn thành, số task dang dở, % hoàn thành ngày | Unit test: mock time = 17:00 → assert button visible; assert summary data correct |
| AC2 | Sau khi hoàn thành flow, hệ thống chuyển sang trạng thái "Off" — tắt toàn bộ thông báo công việc cho đến 7:00 sáng hôm sau | Integration test: complete end-of-day flow → assert notifications muted; assert auto-resume at 7:00 |

**Definition of Done (DoD):**
- [ ] User test với ≥ 3 người dùng thực tế; ghi nhận feedback
- [ ] Trạng thái "Off" không bị reset khi app bị kill và mở lại (persist qua local storage/db)

---

#### PB_2.1 — Tự động tóm tắt và Lên kế hoạch Sáng

**User Story:**  
> Là **người dùng**, tôi muốn **khi thức dậy đã thấy sẵn danh sách việc cần làm hôm nay được ưu tiên tự động**, để **tôi không phải suy nghĩ về "bắt đầu từ đâu" ngay từ sáng sớm**.

**Acceptance Criteria:**

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Vào lúc 6:30 (mặc định), hệ thống tự động tạo danh sách "Today's Plan" từ tasks dang dở hôm qua + tasks mới có deadline hôm nay, sắp xếp theo Eisenhower priority | Integration test: mock tasks from yesterday → assert morning plan generated at 06:30 |
| AC2 | Danh sách này được hiển thị như notification push VÀ trong màn hình Home khi mở app lần đầu trong ngày | Unit test: first open of day → assert morning plan widget visible |

**Definition of Done (DoD):**
- [ ] Cron job / scheduled notification đã được test trên staging với timezone Asia/Ho_Chi_Minh
- [ ] Đã xử lý edge case: không có task nào → hiển thị thông điệp tích cực

---

### Epic 4 — Bản đồ Tăng trưởng (Growth Map)

#### PB_5 — Dashboard Tiến bộ Kỹ năng

**User Story:**  
> Là **người dùng**, tôi muốn **xem biểu đồ thể hiện sự cân bằng giữa thời gian làm việc và học tập của mình**, để **tôi không cảm thấy tội lỗi khi nghỉ ngơi hoặc học tập**.

**Acceptance Criteria:**

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Dashboard hiển thị biểu đồ phần trăm thời gian theo category (Làm việc / Học tập / Cá nhân) theo tuần, có thể drill-down theo ngày | Unit test: mock weekly data → assert chart renders với đúng % |
| AC2 | Chỉ số "Skill Progress" hiển thị trending (+/-%) so với tuần trước cho mỗi category | Unit test: week1 vs week2 data → assert delta calculated correctly |

**Definition of Done (DoD):**
- [ ] Chart không bị vỡ layout trên màn hình < 375px
- [ ] Dữ liệu được aggregated bằng background job, không tính real-time để tránh overload DB

---

#### PB_5.1 — Time-boxing Học tập Tự động

**User Story:**  
> Là **người dùng**, tôi muốn **hệ thống tự động gợi ý chèn khoảng thời gian học tập ngắn vào lịch của tôi**, để **việc phát triển bản thân trở thành thói quen tự nhiên, không cần nỗ lực ý chí**.

**Acceptance Criteria:**

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Khi có khoảng trống ≥ 30 phút trong lịch, hệ thống gợi ý chèn 1 learning block; người dùng có thể Accept / Decline / Snooze (nhắc lại sau 1 giờ) | Unit test: calendar with 45-min gap → assert suggestion appears |
| AC2 | Learning block được gắn tag category (kỹ năng kỹ thuật, ngoại ngữ, v.v.) do người dùng chọn khi setup; hệ thống không tự bịa category | Unit test: block without category tag → assert cannot be saved |

---

### Epic 5 — Khớp lệnh Năng lượng (Energy Matching)

#### PB_3 — Nhận diện Khung giờ Hiệu suất Cao

**User Story:**  
> Là **người dùng**, tôi muốn **hệ thống phân tích lịch sử làm việc và nhận diện khung giờ tôi hiệu quả nhất**, để **tôi biết sắp xếp Deep Work vào đúng thời điểm tỉnh táo nhất**.

**Acceptance Criteria:**

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Sau ≥ 7 ngày sử dụng, hệ thống tự động hiển thị "Khung giờ vàng" của người dùng (ví dụ: 9:00–11:00) dựa trên tỷ lệ task hoàn thành theo giờ | Integration test: seed 7 days data → assert peak hours detected and displayed |
| AC2 | Gợi ý tự động sắp xếp tasks có nhãn năng lượng "Cao" vào khung giờ vàng khi người dùng bấm "Auto-schedule" | Unit test: 3 high-energy tasks + detected peak hours → assert tasks scheduled within peak window |

---

#### PB_3.1 — Hiển thị Ngân sách Năng lượng

**User Story:**  
> Là **người dùng**, tôi muốn **thấy chỉ số năng lượng còn lại trong ngày**, để **tôi biết khi nào nên dừng lại trước khi kiệt sức**.

**Acceptance Criteria:**

| # | Criteria | Kiểm tra bằng |
|---|---|---|
| AC1 | Thanh "Energy Budget" hiển thị % từ 0–100, giảm dần theo số task hoàn thành và thời gian ngồi liên tục | Unit test: complete 3 high-energy tasks → assert energy score decreases |
| AC2 | Khi energy < 20%, hệ thống push notification "Bạn đã làm việc nhiều — hãy nghỉ 10 phút" và tạm dừng gợi ý task mới | Integration test: energy = 15% → assert notification sent & suggestion paused |

---

## 4. Out of Scope (MVP v1)

- Tích hợp Google Calendar / Apple Calendar (planned for v2)
- Tính năng cộng tác nhóm / team task
- AI chat interface
- Gamification / badge system
