import { computed, reactive, ref } from 'vue';
import type { User } from '../types';
import { useSorting } from './sorting';

// Пагинация
const currentPage = ref(1);
const pageSize = ref<number>(25);

// Выбор строк
const selectedUsers: User['id'][] = reactive([]);
const showAllUsers = ref(false);

export function usePagination(initialPageSize?: number) {
  const { sortedUsers } = useSorting()
  // const { selectedUsers } = useUsers()

  if (initialPageSize)
    pageSize.value = initialPageSize

  const totalPages = computed<number>(() => {
    return Math.ceil(sortedUsers.value.length / pageSize.value);
  });

  const paginationStart = computed<number>(() => {
    return (currentPage.value - 1) * pageSize.value + 1;
  });

  const paginationEnd = computed<number>(() => {
    const end = currentPage.value * pageSize.value;
    return end > sortedUsers.value.length ? sortedUsers.value.length : end;
  });

  const paginatedUsers = computed<User[]>(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedUsers.value.slice(start, end);
  });

  const visiblePages = computed<(string | number)[]>(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });
  
  function goToPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handlePageSizeChange(): void {
    currentPage.value = 1;
  }

  function toggleSelectUser(userId: User['id']): void {
    const index = selectedUsers.indexOf(userId);
    if (index > -1) {
      selectedUsers.splice(index, 1);
    } else {
      selectedUsers.push(userId);
    }
  }

  function toggleSelectAll(): void {
    if (isAllSelected.value) {
      paginatedUsers.value.forEach(user => {
        const index = selectedUsers.indexOf(user.id);
        if (index > -1) {
          selectedUsers.splice(index, 1);
        }
      });
    } else {
      paginatedUsers.value.forEach(user => {
        if (!selectedUsers.includes(user.id)) {
          selectedUsers.push(user.id);
        }
      });
    }
  }

  // Выбор всех
  const isAllSelected = computed<boolean>(() => {
    return paginatedUsers.value.length > 0 && 
            paginatedUsers.value.every(user => selectedUsers.includes(user.id));
  })

  return {
    currentPage,
    pageSize,
    selectedUsers,
    showAllUsers,
    totalPages,
    paginationStart,
    paginationEnd,
    paginatedUsers,
    visiblePages,
    isAllSelected,

    goToPage,
    handlePageSizeChange,
    toggleSelectUser,
    toggleSelectAll,
  }
}
