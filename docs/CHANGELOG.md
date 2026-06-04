# CHANGELOG.md

> Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
> Versioning: Sprint-based (`v0.X.0`) → Semantic Versioning (`v1.0.0`) sau khi hoàn thành Sprint 5

---

## [Unreleased]

> Ghi lại các thay đổi đã được merge vào `develop` nhưng chưa release.

### Added
- **[PB_4]** Service `getQuickSuggest` trong `taskService.js`: lọc task `estimated_min ≤ N`, status `todo`/`in_progress`, soft-delete loại trừ; tối đa 2 kết quả, sắp xếp Eisenhower Q tăng dần rồi energy_level (high → medium → low)

---

## [v0.5.0] — Sprint 5: Energy Intelligence
> **Sprint Goal:** Tối ưu hóa hiệu suất đỉnh cao dựa trên dữ liệu hành vi người dùng  
> **Story Points:** 18 pts (PB_3: 13pts + PB_3.1: 5pts)  
> **Trạng thái:** 🔜 Planned

### Added
- **[PB_3]** Data analytics pipeline: ghi nhận thời gian hoàn thành task theo khung giờ
- **[PB_3]** Pattern recognition engine để phát hiện "khung giờ vàng" sau ≥ 7 ngày dữ liệu
- **[PB_3]** Hiển thị "Khung giờ vàng" trên màn hình Home (sau 7 ngày đủ dữ liệu)
- **[PB_3.1]** Chỉ số "Energy Budget" (0–100%) trên thanh trạng thái
- **[PB_3.1]** Thông báo "Cảnh báo kiệt sức" khi energy < 20%
- **[PB_3.1]** Tự động tạm dừng gợi ý task mới khi user ở trạng thái low-energy

### Technical
- Thêm bảng aggregation `hourly_task_stats` cho pattern recognition
- Edge Function: `analyze-peak-hours` chạy mỗi Chủ nhật 22:00

### Definition of Done — Sprint 5
- [ ] Thuật toán pattern recognition tested với ≥ 50 test cases (bao gồm edge: ít hơn 7 ngày dữ liệu)
- [ ] Performance: analysis job chạy < 5s cho user có 30 ngày lịch sử
- [ ] Privacy: dữ liệu behavioral không bao giờ share ra ngoài account của user (RLS verified)
- [ ] Docs: ADR cho thuật toán peak-hour detection được thêm vào ARCHITECTURE.md

---

## [v0.4.0] — Sprint 4: Growth Map
> **Sprint Goal:** Chuyển đổi từ làm việc "sống sót" sang phát triển kỹ năng dài hạn  
> **Story Points:** 13 pts (PB_5: 8pts + PB_5.1: 5pts)  
> **Trạng thái:** 🔜 Planned

### Added
- **[PB_5]** Dashboard "Growth Map" với biểu đồ phân bổ thời gian theo category (Làm việc / Học tập / Cá nhân)
- **[PB_5]** Chỉ số "Skill Progress" với trending so sánh tuần trước
- **[PB_5]** Drill-down theo ngày từ biểu đồ tuần
- **[PB_5.1]** Tính năng Time-boxing: tự động phát hiện khoảng trống ≥ 30 phút trong lịch
- **[PB_5.1]** Gợi ý chèn learning block với 3 lựa chọn: Accept / Decline / Snooze (1 giờ)
- **[PB_5.1]** Learning block categories: Kỹ năng kỹ thuật / Ngoại ngữ / Sức khỏe / Khác

### Technical
- Background job `daily-aggregator`: chạy 23:45 mỗi ngày, populate `daily_summaries`
- Chart library: React Native Charts Wrapper (lightweight, 60fps trên mid-range devices)
- ADR-003 implemented: pre-aggregated summaries thay vì real-time query

### Definition of Done — Sprint 4
- [ ] Chart không bị vỡ layout trên màn hình 375px (iPhone SE) và 414px (iPhone Plus)
- [ ] `daily-aggregator` job tested với timezone Asia/Ho_Chi_Minh (Daylight Saving edge cases)
- [ ] Dashboard load time < 1s (data từ `daily_summaries`, không query raw tasks)

---

## [v0.3.0] — Sprint 3: Closure Mechanism
> **Sprint Goal:** Xóa bỏ "nợ tâm lý" — giải tỏa tâm trí người dùng sau giờ làm  
> **Story Points:** 6 pts (PB_2: 3pts + PB_2.1: 3pts)  
> **Trạng thái:** 🔜 Planned

### Added
- **[PB_2]** Nút "Kết thúc ngày" xuất hiện sau 17:00 (cài được theo user preference)
- **[PB_2]** Màn hình "Day Summary": task hoàn thành, task dang dở, % completion
- **[PB_2]** Trạng thái "Off Mode": tắt toàn bộ push notification cho đến 7:00 sáng
- **[PB_2.1]** Cron job: 06:30 mỗi sáng tự động tạo "Morning Plan"
- **[PB_2.1]** Morning Plan: tổng hợp task dang dở + task có deadline hôm nay, sắp xếp theo Eisenhower priority
- **[PB_2.1]** Push notification Morning Plan + widget trên màn hình Home

### Changed
- `user_preferences` table: thêm cột `end_of_day_time`, `morning_plan_time`, `mute_until`

### Technical
- Supabase pg_cron: `morning-plan-generator` job, timezone-aware
- Expo notification categories: WORK, MORNING_PLAN, URGENT — cho phép mute từng loại

### Definition of Done — Sprint 3
- [ ] Off Mode persist khi app bị kill và mở lại (tested trên iOS + Android)
- [ ] Morning Plan cron job tested với user có 0 tasks (empty state graceful)
- [ ] User test với ≥ 3 người dùng thực tế; NPS ≥ 8/10 cho tính năng Closure

---

## [v0.2.0] — Sprint 2: Dynamic Scheduling
> **Sprint Goal:** Xây dựng khả năng tự động thích nghi với lịch trình bị gián đoạn  
> **Story Points:** 8 pts (PB_1: 8pts)  
> **Trạng thái:** 🔜 Planned

### Added
- **[PB_1]** Engine phát hiện xung đột lịch: alert trong ≤ 2 giây khi 2 task trùng time slot
- **[PB_1]** Re-scheduling algorithm: gợi ý ≥ 1 khung giờ thay thế trong cùng ngày
- **[PB_1]** UI xác nhận thay đổi lịch (confirm/dismiss flow)
- **[PB_1]** Audit trail: mọi thay đổi lịch được lưu vào `task_history`

### Technical
- `task_history` table: implemented (xem ARCHITECTURE.md section 2.2)
- Conflict detection: O(n log n) interval overlap algorithm
- ADR-002 (Soft Delete) được apply cho task deletions từ sprint này

### Definition of Done — Sprint 2
- [ ] Conflict detection tested với ≥ 20 test cases (bao gồm: task qua nửa đêm, all-day tasks)
- [ ] Re-scheduling perf: ≤ 500ms cho calendar có ≤ 100 tasks
- [ ] `task_history` records không bao giờ bị xóa (append-only, không có delete API)

---

## [v0.1.0] — Sprint 1: Decision Foundation ✅
> **Sprint Goal:** Xử lý nỗi đau "Tê liệt ra quyết định" và thiết lập khung phân loại nhiệm vụ  
> **Story Points:** 10 pts (PB_4: 5pts + PB_1.1: 5pts)  
> **Release Date:** TBD  
> **Trạng thái:** 🚧 In Progress

### Added
- **[PB_4]** Nút "Quick Action" với 3 tùy chọn thời gian: 15 / 30 / 60 phút
- **[PB_4]** Thuật toán gợi ý task: lọc theo `estimated_duration ≤ N`, tối đa 2 kết quả
- **[PB_4]** Empty state: "Bạn đang trống lịch — hãy nghỉ ngơi! 🎉"
- **[PB_4]** API endpoint: `GET /api/tasks/quick-suggest?minutes=N`
- **[PB_1.1]** Bộ nhãn Eisenhower (Q1–Q4) trên task create/edit form
- **[PB_1.1]** Bộ nhãn Energy Level (Cao / Trung / Thấp) trên task form
- **[PB_1.1]** Default values: Q2 + Trung khi không chọn
- **[PB_1.1]** Bộ lọc task theo Eisenhower quadrant và Energy level
- **[PB_1.1]** DB schema: bảng `tasks` với full indexes (xem ARCHITECTURE.md)

### Infrastructure (Sprint 0 → Sprint 1)
- Setup project monorepo (npm workspaces)
- Supabase project init + RLS policies
- GitHub Actions CI pipeline (lint, test, build)
- Sentry integration (API + Mobile)
- `.env.example` template

### Definition of Done — Sprint 1
- [x] Unit test coverage ≥ 80% cho quick-suggest algorithm
- [x] RLS policies verified: user A không thể read task của user B
- [x] API response time ≤ 200ms (p95) trên staging
- [ ] Internal demo với team, sign-off từ Product Owner

---

## Versioning Convention

| Version | Ý nghĩa |
|---|---|
| `v0.X.0` | Sprint release (pre-production) |
| `v1.0.0` | MVP Launch sau khi hoàn thành Sprint 5 + UAT |
| `v1.X.0` | Minor feature additions post-launch |
| `v1.0.X` | Bug fixes và hotfixes |

---

## Changelog Authors

Mọi thay đổi cần được ghi bởi người thực hiện với format:
```
- **[PBI_ID]** Mô tả thay đổi ([@github-username])
```
