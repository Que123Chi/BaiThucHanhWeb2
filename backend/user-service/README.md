# User Service (.NET 8)

ASP.NET Core Web API mẫu cho `user-service`, dùng controller, PostgreSQL và EF Core. API lưu dữ liệu vào bảng `dotnet_users` để không ghi đè bảng `users` của backend hiện tại.

## Yêu cầu

- .NET SDK 8
- PostgreSQL cluster đang chạy tại `localhost:5433`
- Node.js/npm (dùng frontend Axios)

## Cấu hình database

Sao chép `.env.example` thành `.env`, sau đó cập nhật thông tin PostgreSQL. Không đưa mật khẩu thật vào source control. Ứng dụng nạp `.env` lúc khởi động và các biến môi trường hệ thống đã khai báo sẽ được ưu tiên.

PowerShell:

```powershell
Set-Location backend\user-service
Copy-Item .env.example .env
```

`Cors__AllowedOrigins__0` trong `.env` cho phép Vite chạy tại `http://localhost:5173`.

## Cài công cụ EF và tạo database

Chạy các lệnh trong thư mục `backend\user-service`:

```powershell
dotnet tool restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

Phiên bản `dotnet-ef` được cố định trong manifest `.config/dotnet-tools.json` của project.
EF Core lấy model từ `UserDbContext`, tạo migration trong `Migrations`, sau đó `database update` áp dụng migration lên PostgreSQL. Khi model thay đổi, tạo migration mới bằng `dotnet ef migrations add <TenMigration>` rồi chạy lại `dotnet ef database update`.

API mặc định chạy ở `http://localhost:5087`.
Database mặc định là `cmms_dotnet`, với role ứng dụng `users_app`; cấu hình kết nối được lấy từ `.env.example`.

## Các endpoint

| Method | URL | Kết quả |
| --- | --- | --- |
| `GET` | `/api/users` | Danh sách user |
| `GET` | `/api/users/{id}` | Lấy một user; `404` nếu không tồn tại |
| `POST` | `/api/users` | Tạo user; `201`, `400` nếu dữ liệu sai, `409` nếu username/email trùng |
| `PUT` | `/api/users/{id}` | Cập nhật user; `404` nếu không tồn tại, `409` nếu username/email trùng |
| `DELETE` | `/api/users/{id}` | Xóa user; `204` khi thành công |

`UserService.http` có request mẫu cho cả bốn HTTP methods.

## Gọi API từ frontend bằng Axios

File `frontend/userApi.js` chứa ví dụ các phương thức Axios `get`, `post`, `put` và `delete`. Trong frontend chính:

1. Axios được cài ở thư mục gốc dự án.
2. Các hàm `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser` được tích hợp trong `src/services/api/users.js`.
3. Đặt `VITE_USER_API_BASE_URL=http://localhost:5087/api` trong file `.env` tại thư mục gốc frontend (mặc định đã dùng URL này).
4. Trang quản trị `/admin/users` sử dụng service để liệt kê, tạo, sửa và xóa tài khoản.

Ví dụ:

```js
const users = await getUsers()
const newUser = await createUser({
  username: 'nguyenvana',
  email: 'vana@example.com',
  fullName: 'Nguyen Van A',
  phone: '0900000000',
  isActive: true,
})
```
