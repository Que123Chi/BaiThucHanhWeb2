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

Backend mẫu nằm trong `backend/FixFlow.Api`, dùng ASP.NET Core 8, controller CRUD cho thiết bị, EF Core 8 và SQLite. Khi chạy lần đầu cần tạo database từ migration:

```powershell
cd backend\FixFlow.Api
dotnet tool install --global dotnet-ef --version 8.0.22
dotnet ef database update
dotnet run --urls http://localhost:5090
```

Nếu đã cài `dotnet-ef`, bỏ qua lệnh cài tool. API thiết bị:

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

Chuỗi kết nối nằm trong `backend/FixFlow.Api/appsettings.json` (`ConnectionStrings:DefaultConnection`), mặc định SQLite tạo file `fixflow.db`. Có thể đổi provider hoặc lấy chuỗi kết nối triển khai từ biến môi trường `ConnectionStrings__DefaultConnection`; không lưu thông tin bí mật trong file cấu hình được commit.

Các lệnh migration chạy từ thư mục `backend\FixFlow.Api`:

```powershell
dotnet ef migrations add TenMigration
dotnet ef database update
```

EF Core so sánh model với migration đã có để ghi lại thay đổi schema. Commit các file migration để môi trường khác có thể cập nhật database bằng `dotnet ef database update`.

## Kết nối Frontend

Tạo file `.env` từ `.env.example`; `VITE_API_BASE_URL` được đặt mặc định là `http://localhost:5090/api`. Khởi chạy frontend ở terminal khác bằng `npm run dev`. CORS cho Vite localhost được cấu hình trong `appsettings.json`.

API client dùng Axios tại `src/services/api/client.js`. Các hàm trong `src/services/api/equipment.js` minh họa `get`, `post`, `put`, và `delete`; các service request/work-order cũng sử dụng Axios. Backend hiện cung cấp CRUD thiết bị, các endpoint request và work-order cần được triển khai trước khi gọi các service tương ứng.

## Xuất cây thư mục Windows

Chạy `show-tree.cmd` để ghi cấu trúc project ra `PROJECT_TREE.md` (bỏ qua `node_modules`, `.git` và `dist`).
