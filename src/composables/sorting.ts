import { computed, ref } from 'vue';
import type { User } from '../types';
import { useSearchAndFilters } from './search';

const sortColumn = ref('id');
const sortDirection = ref('asc');

export function useSorting() {
  const { filteredAndSearchedUsers } = useSearchAndFilters()

  const sortedUsers = computed<User[]>(() => {
    const users = [...filteredAndSearchedUsers.value];

    users.sort((a, b) => {
      let aVal = a[sortColumn.value];
      let bVal = b[sortColumn.value];

      if (sortColumn.value === 'registrationDate' || sortColumn.value === 'lastActivity') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) {
        return sortDirection.value === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return users;
  });

  function sortBy(column: string): void {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  }

  return {
    sortColumn,
    sortDirection,
    sortedUsers,
    sortBy,
  }
}
