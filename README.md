# FixFlow — Quản lý bảo trì thiết bị

Ứng dụng frontend quản lý bảo trì/sửa chữa thiết bị điện tử, xây dựng bằng Vite, React và JavaScript. Các màn hình dùng chung layout/component, có điều hướng theo vai trò và responsive trên laptop, tablet, điện thoại.

## Chạy dự án

- Cài dependencies: `npm install`
- Chạy môi trường phát triển: `npm run dev`
- Build production: `npm run build`
- Kiểm tra lint: `npm run lint`

## Vai trò và màn hình

- `/admin/dashboard`: Quản trị viên — thiết bị, yêu cầu, lệnh công việc, người dùng, báo cáo, cài đặt.
- `/manager/dashboard`: Quản lý — theo dõi thiết bị, phê duyệt và phân công công việc.
- `/equipment-user/dashboard`: Người dùng thiết bị — thiết bị cá nhân và yêu cầu sửa chữa.
- `/technician/dashboard`: Kỹ thuật viên — công việc được giao và thiết bị.

Bộ chọn vai trò ở thanh trên cùng chuyển nhanh giữa bốn giao diện. Các trang danh sách hiện là khung giao diện để tiếp tục kết nối dữ liệu.

## Cấu trúc chính

```text
src/
├── app/                 # Khai báo routes và ứng dụng
├── assets/              # Hình ảnh, biểu tượng
├── components/          # Component dùng chung và layout
├── config/              # Cấu hình vai trò, menu, dashboard
├── context/             # Context dùng chung (xác thực)
├── features/            # Dashboard, thiết bị, yêu cầu, lệnh việc, người dùng...
├── hooks/               # React hooks dùng chung
├── pages/               # Màn hình vai trò
├── services/api/        # API client và các endpoint theo domain
├── styles/              # CSS toàn cục
└── utils/               # Hàm tiện ích
```

## Backend ASP.NET Core và kết nối database

Backend thiết bị nằm trong `backend/FixFlow.Api`, dùng ASP.NET Core 8, PostgreSQL và EF Core 8. Backend người dùng nằm trong `backend/user-service`; hai service dùng chung PostgreSQL cluster nhưng có database/user riêng (`fixflow_dotnet`/`fixflow_app` và `cmms_dotnet`/`users_app`) để migration và quyền truy cập không xung đột.

PostgreSQL 17 được cài trên máy; development cluster nằm trong `%LOCALAPPDATA%\FixFlow\PostgreSQL\data` và chạy trên cổng `5433`. Cluster này không phụ thuộc Windows service trên cổng `5432`. Để khởi động lại cluster sau khi khởi động lại máy:

```powershell
$pgData = Join-Path $env:LOCALAPPDATA 'FixFlow\PostgreSQL\data'
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' start -D $pgData -l (Join-Path (Split-Path $pgData) 'postgres.log') -o '-h 127.0.0.1 -p 5433'
```

Tạo file cấu hình riêng cho từng backend từ file mẫu:

```powershell
cd backend\FixFlow.Api
Copy-Item .env.example .env
```

Điền password PostgreSQL vào `.env`, sau đó chạy migration và API:

```powershell
dotnet tool restore
dotnet ef database update
dotnet run --urls http://localhost:5090
```

Thực hiện tương tự với `backend\user-service` theo [hướng dẫn user service](./backend/user-service/README.md). Cả hai service đọc kết nối database từ `.env` hoặc biến môi trường; file `.env` không được commit.

API thiết bị:

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/equipment` | Lấy danh sách |
| GET | `/api/equipment/{id}` | Lấy một thiết bị |
| POST | `/api/equipment` | Tạo thiết bị |
| PUT | `/api/equipment/{id}` | Cập nhật thiết bị |
| DELETE | `/api/equipment/{id}` | Xóa thiết bị |

Ví dụ body tạo/cập nhật:

```json
{
  "name": "Máy in tầng 2",
  "category": "Printer",
  "location": "Tòa nhà A, tầng 2",
  "status": "Operational"
}
```

Các lệnh migration tiếp theo chạy từ thư mục `backend\FixFlow.Api`:

```powershell
dotnet ef migrations add TenMigration
dotnet ef database update
```

EF Core so sánh model với migration đã có để ghi lại thay đổi schema. Commit các file migration để môi trường khác có thể cập nhật database bằng `dotnet ef database update`.

## Kết nối Frontend

Tạo file `.env` từ `.env.example`; `VITE_API_BASE_URL` được đặt mặc định là `http://localhost:5090/api` và `VITE_USER_API_BASE_URL` là `http://localhost:5087/api`. Khởi chạy frontend ở terminal khác bằng `npm run dev`. CORS cho Vite localhost được cấu hình trong từng service.

API client dùng Axios tại `src/services/api/client.js`. Các hàm trong `src/services/api/equipment.js` minh họa `get`, `post`, `put`, và `delete`; `src/services/api/users.js` kết nối tới `backend/user-service`. Chạy user service riêng theo hướng dẫn tại `backend/user-service/README.md` (cần PostgreSQL); trang quản lý người dùng gọi API để liệt kê, tạo, sửa và xóa. Các service request/work-order cũng dùng Axios, nhưng endpoint tương ứng cần được triển khai trước khi gọi.

## Xuất cây thư mục Windows

Chạy `show-tree.cmd` để ghi cấu trúc project ra `PROJECT_TREE.md` (bỏ qua `node_modules`, `.git` và `dist`).
