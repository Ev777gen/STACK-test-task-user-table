import { computed, ref } from 'vue';
import type { User } from '../types';
import { useUsers } from './users';

const searchQuery = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const dateFrom = ref('');
const dateTo = ref('');

const { users } = useUsers()

// Фильтрация по роли
const roleFilteredUsers = computed<User[]>(() => {
  if (!filterRole.value) {
    return users;
  }
  return users.filter(user => user.role === filterRole.value);
});

// Фильтрация по статусу
const statusFilteredUsers = computed<User[]>(() => {
  if (!filterStatus.value) {
    return roleFilteredUsers.value;
  }
  return roleFilteredUsers.value.filter(user => user.status === filterStatus.value);
});

// Фильтрация по датам
const dateFilteredUsers = computed<User[]>(() => {
  let filtered = statusFilteredUsers.value;

  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter(user => {
      const userDate = new Date(user.registrationDate);
      return userDate >= fromDate;
    });
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(user => {
      const userDate = new Date(user.registrationDate);
      return userDate <= toDate;
    });
  }

  return filtered;
});

  const filteredAndSearchedUsers = computed<User[]>(() => {
    if (!searchQuery.value.trim()) {
      return dateFilteredUsers.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return dateFilteredUsers.value.filter(user => {
      return user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query);
    });
  })

export function useSearchAndFilters() {

  // Очистка фильтров
  function clearDateFilter(): void {
    dateFrom.value = '';
    dateTo.value = '';
  }

  function clearAllFilters(): void {
    searchQuery.value = '';
    filterRole.value = '';
    filterStatus.value = '';
    dateFrom.value = '';
    dateTo.value = '';
  }

  return {
    searchQuery,
    filterRole,
    filterStatus,
    dateFrom,
    dateTo,

    roleFilteredUsers,
    statusFilteredUsers,
    dateFilteredUsers,
    filteredAndSearchedUsers,

    clearDateFilter,
    clearAllFilters,
  }
}