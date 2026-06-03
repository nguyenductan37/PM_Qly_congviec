# Focus Flow 🎯

> Trợ lý quản lý công việc thông minh — giúp người trẻ bận rộn ra quyết định nhanh, kiểm soát lịch trình và thấy sự tiến bộ của bản thân.

---

## Tech Stack

- **Mobile:** React Native (Expo)
- **API:** Node.js + Fastify
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (JWT)
- **Background Jobs:** Supabase Edge Functions + pg_cron

---

## Yêu cầu Môi trường

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | v20+ |
| npm | v10+ |
| Expo CLI | `npm install -g expo-cli` |
| Supabase CLI | `npm install -g supabase` |
| Docker Desktop | Dùng cho Supabase local dev |

---

## 1. Clone & Cài đặt

```bash
git clone https://github.com/your-org/focus-flow.git
cd focus-flow

# Cài dependencies
npm install

# Cài dependencies cho từng workspace
cd apps/mobile && npm install
cd ../../apps/api && npm install
cd ../..
```

### Cấu trúc thư mục

```
focus-flow/
├── apps/
│   ├── mobile/          # React Native (Expo)
│   └── api/             # Fastify API server
├── packages/
│   └── shared/          # Shared types & utilities
├── supabase/
│   ├── migrations/      # DB migration files
│   └── functions/       # Edge Functions (cron jobs)
├── docs/                # Tài liệu kỹ thuật
└── README.md
```

---

## 2. Cài đặt Biến Môi trường

### Bước 1: Copy file template

```bash
cp .env.example .env
```

> ⚠️ **QUAN TRỌNG:** File `.env` đã có trong `.gitignore`. **Không bao giờ commit file `.env` lên git.**

### Bước 2: Điền các giá trị

Mở `.env` và điền các biến sau:

```env
# ========================
# Supabase (bắt buộc)
# ========================
# Lấy từ: Supabase Dashboard > Settings > API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# CHỈ dùng ở server-side (API). KHÔNG bao giờ đưa vào mobile app.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ========================
# API Server
# ========================
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000

# ========================
# Expo Push Notifications
# ========================
# Lấy từ: expo.dev > Project > Credentials
EXPO_ACCESS_TOKEN=your-expo-access-token

# ========================
# Sentry (Error Tracking)
# ========================
# Lấy từ: sentry.io > Project > Settings > Client Keys
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/789

# ========================
# Mobile App (thêm vào apps/mobile/.env)
# ========================
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://localhost:3000
```

> 📄 Xem `.env.example` để biết tất cả biến môi trường được hỗ trợ với mô tả chi tiết.

---

## 3. Setup Database (Local)

```bash
# Khởi động Supabase local (cần Docker Desktop đang chạy)
supabase start

# Chạy migrations
supabase db push

# (Optional) Seed dữ liệu mẫu cho development
supabase db seed
```

Sau khi chạy xong, Supabase local sẽ available tại:
- **Studio UI:** http://localhost:54323
- **API:** http://localhost:54321
- **DB (psql):** `postgresql://postgres:postgres@localhost:54322/postgres`

---

## 4. Khởi chạy Project

### Chạy toàn bộ (recommended)

```bash
# Từ root directory
npm run dev
```

Lệnh này chạy đồng thời API server và mobile app bundler.

### Chạy riêng lẻ

```bash
# API Server (http://localhost:3000)
cd apps/api
npm run dev

# Mobile App
cd apps/mobile
npx expo start
```

Sau khi Expo bundler khởi động:
- Nhấn `i` để mở iOS Simulator
- Nhấn `a` để mở Android Emulator
- Scan QR code bằng Expo Go app trên điện thoại thật

---

## 5. Chạy Tests

### Tất cả tests

```bash
npm run test
```

### Unit Tests (API)

```bash
cd apps/api
npm run test           # Chạy một lần
npm run test:watch     # Watch mode
npm run test:coverage  # Với coverage report
```

### Unit Tests (Mobile)

```bash
cd apps/mobile
npm run test
```

### Integration Tests

```bash
# Cần Supabase local đang chạy
npm run test:integration
```

### Coverage Report

Sau khi chạy `test:coverage`, mở file `coverage/index.html` trong browser để xem báo cáo chi tiết.

**Coverage thresholds (enforced):**

| Layer | Minimum |
|---|---|
| API business logic | 80% |
| Algorithm modules (suggest, reschedule) | 90% |
| Database query helpers | 70% |

---

## 6. API Documentation

Sau khi API server đang chạy, truy cập Swagger UI tại:

```
http://localhost:3000/docs
```

---

## 7. Database Migrations

### Tạo migration mới

```bash
supabase migration new <tên_migration>
# Ví dụ: supabase migration new add_energy_score_column
```

### Apply migrations

```bash
supabase db push              # Local
supabase db push --linked     # Remote (production)
```

---

## 8. Quy trình Phát triển (Git Workflow)

```
main          ← production, protected
  └── develop ← integration branch
        └── feature/PB_4-quick-action  ← feature branch
        └── fix/reschedule-bug
```

1. Tạo branch từ `develop`: `git checkout -b feature/PB_X-ten-tinh-nang`
2. Commit theo format: `feat(PB_4): add quick action button UI`
3. Mở PR vào `develop`, cần ≥ 1 approval
4. Merge `develop` → `main` khi kết thúc Sprint

---

## 9. Troubleshooting

**Supabase local không start được:**
```bash
supabase stop --no-backup
docker system prune -f
supabase start
```

**Lỗi "Invalid JWT" khi call API:**  
Kiểm tra `SUPABASE_ANON_KEY` trong `.env` của mobile app (`EXPO_PUBLIC_` prefix bắt buộc).

**Push notification không nhận được trên simulator:**  
iOS Simulator không hỗ trợ push notifications. Dùng thiết bị thật hoặc Android Emulator.
