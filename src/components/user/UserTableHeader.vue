<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <span class="total-count">{{ filteredAndSearchedUsers.length }} записей</span>
    </div>
    
    <div class="header-right">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Поиск по имени, email..."
        class="search-input"
        @input="handleSearch"
      />
      
      <select v-model="filterRole" class="role-filter">
        <option value="">Все роли</option>
        <option value="admin">Администратор</option>
        <option value="user">Пользователь</option>
        <option value="moderator">Модератор</option>
      </select>
      
      <button 
        @click="openAddUserModal"
        class="btn btn-primary"
        :disabled="isLoading"
      >
        + Добавить пользователя
      </button>
      
      <button 
        @click="exportToCSV"
        class="btn btn-secondary"
        :disabled="isLoading || selectedUsers.length === 0 && !showAllUsers"
      >
        📥 Экспорт
      </button>
      
      <button 
        v-if="selectedUsers.length > 0"
        @click="deleteSelectedUsers"
        class="btn btn-danger"
      >
        🗑️ Удалить выбранные ({{ selectedUsers.length }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRoleLabel } from '../../utils/user';
import { formatDate } from '../../utils/dateAndTime';
import { usePagination } from '../../composables/pagination';
import { useSorting } from '../../composables/sorting';
import { useSearchAndFilters } from '../../composables/search';
import { useUsers } from '../../composables/users';
import { useEditing } from '../../composables/editing';

defineProps<{
  title: string
  isLoading: boolean
}>()

const emit = defineEmits<{
  addUser: [],
}>();

const { users } = useUsers()

const {
  searchQuery,
  filterRole,
  filteredAndSearchedUsers,
} = useSearchAndFilters()

const {
  sortedUsers,
} = useSorting()

const {
  selectedUsers,
  showAllUsers,
} = usePagination()

const {
  deleteSelectedUsers,
} = useEditing()

// Модальное окно добавления
function openAddUserModal(): void {
  emit('addUser')
}

// Поиск
function handleSearch() {
  // Дебаунс можно добавить здесь
}

// Экспорт
function exportToCSV(): void {
  const usersToExport = selectedUsers.length > 0
    ? users.filter(u => selectedUsers.includes(u.id))
    : sortedUsers.value;
  
  const headers = ['ID', 'Имя', 'Email', 'Роль', 'Статус', 'Дата регистрации'];
  const rows = usersToExport.map(user => [
    user.id,
    user.name,
    user.email,
    getRoleLabel(user.role),
    user.status === 'active' ? 'Активен' : 'Неактивен',
    formatDate(user.registrationDate)
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `users_export_${new Date().getTime()}.csv`;
  link.click();
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.role-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

/* Global styles for UserTable */

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>