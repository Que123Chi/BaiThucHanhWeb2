import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, UserRound, X } from 'lucide-react'
import { createUser, deleteUser, getUsers, updateUser } from '../../../services/api/users.js'
import './UsersPage.css'

const emptyForm = { username: '', email: '', fullName: '', phone: '', isActive: true }

function getErrorMessage(error) {
  return error.response?.data?.message ?? error.message ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'
}

export default function UsersPage({ role }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await getUsers())
      setLoadError('')
    } catch (error) {
      setLoadError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getUsers()
      .then((data) => {
        if (active) {
          setUsers(data)
          setLoadError('')
        }
      })
      .catch((error) => {
        if (active) setLoadError(getErrorMessage(error))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  function openCreateForm() {
    setIsFormOpen(true)
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
  }

  function openEditForm(user) {
    setIsFormOpen(true)
    setEditingUser(user)
    setForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName ?? '',
      phone: user.phone ?? '',
      isActive: user.isActive,
    })
    setFormError('')
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      ...form,
      fullName: form.fullName || null,
      phone: form.phone || null,
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload)
      } else {
        await createUser(payload)
      }
      closeForm()
      setLoading(true)
      await loadUsers()
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Xóa tài khoản "${user.username}"?`)) return

    setDeletingId(user.id)
    setLoadError('')
    try {
      await deleteUser(user.id)
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id))
    } catch (error) {
      setLoadError(getErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="users-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{role.label}</p>
          <h1>Người dùng</h1>
          <p className="page-description">Quản lý tài khoản và trạng thái truy cập hệ thống.</p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreateForm}>
          <Plus size={16} /> Thêm người dùng
        </button>
      </div>

      {loadError && <p className="users-alert" role="alert">{loadError}</p>}

      <div className="users-panel">
        {loading ? (
          <p className="users-message" role="status">Đang tải danh sách người dùng...</p>
        ) : users.length === 0 ? (
          <div className="users-empty">
            <UserRound size={24} />
            <h2>Chưa có người dùng</h2>
            <p>Thêm tài khoản đầu tiên để bắt đầu quản lý.</p>
            <button className="button button--secondary" type="button" onClick={openCreateForm}>
              <Plus size={16} /> Thêm người dùng
            </button>
          </div>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Tài khoản</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName || user.username}</strong>
                      <span className="users-username">@{user.username}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span className={`users-status ${user.isActive ? 'users-status--active' : 'users-status--inactive'}`}>
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button className="users-icon-button" type="button" aria-label={`Sửa ${user.username}`} onClick={() => openEditForm(user)}>
                          <Pencil size={15} />
                        </button>
                        <button className="users-icon-button users-icon-button--danger" type="button" aria-label={`Xóa ${user.username}`} disabled={deletingId === user.id} onClick={() => handleDelete(user)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="users-dialog-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) closeForm()
        }}>
          <section className="users-dialog" role="dialog" aria-modal="true" aria-labelledby="users-dialog-title">
            <div className="users-dialog__header">
              <div>
                <p className="eyebrow">{editingUser ? 'CẬP NHẬT TÀI KHOẢN' : 'TÀI KHOẢN MỚI'}</p>
                <h2 id="users-dialog-title">{editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
              </div>
              <button className="users-icon-button" type="button" aria-label="Đóng" onClick={closeForm} disabled={saving}>
                <X size={18} />
              </button>
            </div>
            <form className="users-form" onSubmit={handleSubmit}>
              <label>
                Tên đăng nhập
                <input autoComplete="username" minLength="3" maxLength="20" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
              </label>
              <label>
                Email
                <input autoComplete="email" type="email" maxLength="255" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>
              <label>
                Họ và tên
                <input autoComplete="name" maxLength="100" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
              </label>
              <label>
                Số điện thoại
                <input autoComplete="tel" type="tel" maxLength="15" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </label>
              <label className="users-checkbox">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
                Tài khoản đang hoạt động
              </label>
              {formError && <p className="users-alert" role="alert">{formError}</p>}
              <div className="users-form__actions">
                <button className="button button--secondary" type="button" onClick={closeForm} disabled={saving}>Hủy</button>
                <button className="button button--primary" type="submit" disabled={saving}>
                  {saving ? 'Đang lưu...' : editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}
