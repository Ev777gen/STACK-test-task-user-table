<template>
  <div class="table-wrapper">
    <table class="user-table">
      <thead>
        <tr>
          <th>
            <input 
              type="checkbox" 
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th 
            @click="sortBy('id')"
            :class="{ sortable: true, active: sortColumn === 'id' }"
          >
            ID
            <span v-if="sortColumn === 'id'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th 
            @click="sortBy('name')"
            :class="{ sortable: true, active: sortColumn === 'name' }"
          >
            Имя
            <span v-if="sortColumn === 'name'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th 
            @click="sortBy('email')"
            :class="{ sortable: true, active: sortColumn === 'email' }"
          >
            Email
            <span v-if="sortColumn === 'email'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th 
            @click="sortBy('registrationDate')"
            :class="{ sortable: true, active: sortColumn === 'registrationDate' }"
          >
            Дата регистрации
            <span v-if="sortColumn === 'registrationDate'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Последняя активность</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in paginatedUsers" 
          :key="user.id"
          :class="{ 
            selected: selectedUsers.includes(user.id),
            editing: editingUserId === user.id,
            inactive: user.status === 'inactive'
          }"
        >
          <td>
            <input 
              type="checkbox" 
              :checked="selectedUsers.includes(user.id)"
              @change="toggleSelectUser(user.id)"
            />
          </td>
          <td>{{ user.id }}</td>
          <td>
            <div v-if="editingUserId === user.id">
              <input 
                v-model="editForm.name"
                type="text"
                class="edit-input"
              />
            </div>
            <div v-else class="user-name-cell">
              <img 
                :src="user.avatar || getDefaultAvatar(user.name)" 
                :alt="user.name"
                class="avatar"
              />
              <span>{{ user.name }}</span>
            </div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <input 
                v-model="editForm.email"
                type="email"
                class="edit-input"
              />
            </div>
            <div v-else>{{ user.email }}</div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <select v-model="editForm.role" class="edit-select">
                <option value="admin">Администратор</option>
                <option value="user">Пользователь</option>
                <option value="moderator">Модератор</option>
              </select>
            </div>
            <div v-else>
              <span :class="['role-badge', 'role-' + user.role]">
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
          </td>
          <td>
            <span 
              :class="['status-badge', user.status === 'active' ? 'status-active' : 'status-inactive']"
              @click="toggleUserStatus(user.id)"
              :style="{ cursor: 'pointer' }"
            >
              {{ user.status === 'active' ? '✓ Активен' : '✗ Неактивен' }}
            </span>
          </td>
          <td>{{ formatDate(user.registrationDate) }}</td>
          <td>
            <span :class="getActivityClass(user.lastActivity)">
              {{ formatRelativeTime(user.lastActivity) }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button 
                v-if="editingUserId !== user.id"
                @click="startEdit(user)"
                class="btn-icon"
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                v-if="editingUserId === user.id"
                @click="saveEdit(user.id)"
                class="btn-icon btn-success"
                title="Сохранить"
              >
                ✓
              </button>
              <button 
                v-if="editingUserId === user.id"
                @click="cancelEdit"
                class="btn-icon btn-cancel"
                title="Отмена"
              >
                ✗
              </button>
              <button 
                v-if="editingUserId !== user.id"
                @click="openUserDetails(user)"
                class="btn-icon"
                title="Подробнее"
              >
                👁️
              </button>
              <button 
                v-if="editingUserId !== user.id"
                @click="deleteUser(user.id)"
                class="btn-icon btn-danger"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Сообщение если нет данных -->
    <div v-if="paginatedUsers.length === 0" class="no-data">
      <p>😔 Нет данных для отображения</p>
      <button @click="clearAllFilters" class="btn btn-primary">
        Сбросить фильтры
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePagination } from '../../composables/pagination';
import { useSearchAndFilters } from '../../composables/search';
import { useSorting } from '../../composables/sorting';
import type { User } from '../../types';
import { getDefaultAvatar, getRoleLabel } from '../../utils/user';
import { formatRelativeTime, formatDate, getActivityClass } from '../../utils/dateAndTime';
import { useUsers } from '../../composables/users';
import { useEditing } from '../../composables/editing';

const emit = defineEmits<{
  openUserDetails: [user: User],
}>();

const { users } = useUsers()

const {
  clearAllFilters,
} = useSearchAndFilters()

const {
  sortColumn,
  sortDirection,
  sortBy,
} = useSorting()

const {
  selectedUsers,
  paginatedUsers,
  isAllSelected,
  toggleSelectUser,
  toggleSelectAll,
} = usePagination()

const {
  editingUserId,
  editForm,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteUser,
  toggleUserStatus,
} = useEditing()

// Модальное окно деталей
function openUserDetails(user: User): void {
  emit('openUserDetails', user)
}
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.user-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.user-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.user-table th.sortable:hover {
  background: #eeeeee;
}

.user-table th.active {
  color: #4CAF50;
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-table tbody tr {
  transition: background 0.2s;
}

.user-table tbody tr:hover {
  background: #fafafa;
}

.user-table tbody tr.selected {
  background: #e8f5e9;
}

.user-table tbody tr.editing {
  background: #fff9c4;
}

.user-table tbody tr.inactive {
  opacity: 0.6;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.btn-icon.btn-success {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-icon.btn-cancel {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-icon.btn-danger {
  border-color: #f44336;
}

.btn-icon.btn-danger:hover {
  background: #f44336;
  color: white;
}

.edit-input,
.edit-select {
  padding: 6px 10px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}

.no-data {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>