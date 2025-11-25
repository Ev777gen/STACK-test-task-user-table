import { ref } from 'vue';
import type { EditForm, User } from '../types';
import { useUsers } from './users';
import { usePagination } from './pagination';

const isSaving = ref(false);

const editingUserId = ref<number | null>(null);
const editForm = ref<EditForm>({
  name: '',
  email: '',
  role: ''
});

export function useEditing() {
  const { users } = useUsers();
  const { selectedUsers } = usePagination()

  // Редактирование
  function startEdit(user: User): void {
    editingUserId.value = user.id;
    editForm.value = {
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  function cancelEdit(): void {
    editingUserId.value = null;
    editForm.value = {
      name: '',
      email: '',
      role: ''
    };
  }

  async function saveEdit(userId: User['id']): Promise<void> {
    isSaving.value = true;
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...editForm.value
        };
      }
      
      editingUserId.value = null;
      editForm.value = {
        name: '',
        email: '',
        role: ''
      };
    } catch (err) {
      if (err instanceof Error) {
        alert('Ошибка сохранения: ' + err.message);
      }
    } finally {
      isSaving.value = false;
    }
  }

  // Удаление
  async function deleteUser(userId: User['id']): Promise<void> {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users.splice(index, 1);
      }
      
      // Удаляем из выбранных
      const selectedIndex = selectedUsers.indexOf(userId);
      if (selectedIndex > -1) {
        selectedUsers.splice(selectedIndex, 1);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert('Ошибка удаления: ' + err.message);
      }
    }
  }

  async function deleteSelectedUsers(): Promise<void> {
    if (!confirm(`Вы уверены, что хотите удалить ${selectedUsers.length} пользователей?`)) {
      return;
    }
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      selectedUsers.forEach(user => {
        const index = users.findIndex(u => u.id === user)
        if (index === -1)
          throw new Error('Пользователь не найден');

        users.splice(index, 1)
      })
      selectedUsers.length = 0;
    } catch (err) {
      if (err instanceof Error) {
        alert('Ошибка удаления: ' + err.message);
      }
    }
  }

  // Переключение статуса
  async function toggleUserStatus(userId: User['id']): Promise<void> {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
      }
    } catch (err) {
      if (err instanceof Error) {
        alert('Ошибка изменения статуса: ' + err.message);
      }
    }
  }

  return {
    isSaving,
    editingUserId,
    editForm,

    startEdit,
    cancelEdit,
    saveEdit,
    deleteUser,
    deleteSelectedUsers,
    toggleUserStatus,
  }
}
