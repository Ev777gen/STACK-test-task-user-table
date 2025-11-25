<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3>Добавить нового пользователя</h3>
        <button @click="close" class="btn-close">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Имя*</label>
          <input 
            v-model="newUser.name"
            type="text"
            :class="{ error: newUserErrors.name }"
            @input="validateNewUserName"
          />
          <span v-if="newUserErrors.name" class="error-text">
            {{ newUserErrors.name }}
          </span>
        </div>
        
        <div class="form-group">
          <label>Email*</label>
          <input 
            v-model="newUser.email"
            type="email"
            :class="{ error: newUserErrors.email }"
            @input="validateNewUserEmail"
          />
          <span v-if="newUserErrors.email" class="error-text">
            {{ newUserErrors.email }}
          </span>
        </div>
        
        <div class="form-group">
          <label>Роль*</label>
          <select v-model="newUser.role">
            <option value="user">Пользователь</option>
            <option value="moderator">Модератор</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>
            <input 
              v-model="newUser.sendWelcomeEmail"
              type="checkbox"
            />
            Отправить приветственное письмо
          </label>
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          @click="close"
          class="btn btn-secondary"
        >
          Отмена
        </button>
        <button 
          @click="addNewUser"
          class="btn btn-primary"
          :disabled="!isNewUserValid || isSaving"
        >
          {{ isSaving ? 'Сохранение...' : 'Добавить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { User } from '../../types';
import { useUsers } from '../../composables/users';

const emit = defineEmits<{
  close: [],
}>();

const { users } = useUsers()

// Состояния загрузки
const isSaving = ref(false);

// Новый пользователь
const newUser = ref<Partial<User>>({
  name: '',
  email: '',
  role: 'user',
  sendWelcomeEmail: true
});
const newUserErrors = ref<{ name: string, email: string }>({
  name: '',
  email: ''
});

// Валидация нового пользователя
const isNewUserValid = computed<boolean>(() => {
  return Boolean(newUser.value.name && newUser.value.name.trim().length > 0 &&
    newUser.value.email && newUser.value.email.trim().length > 0 &&
    validateEmail(newUser.value.email) &&
    !newUserErrors.value.name &&
    !newUserErrors.value.email);
});

function close(): void {
  emit('close')
}

function validateNewUserName(): void {
  if (newUser.value.name.trim().length === 0) {
    newUserErrors.value.name = 'Имя обязательно для заполнения';
  } else if (newUser.value.name.trim().length < 3) {
    newUserErrors.value.name = 'Имя должно содержать минимум 3 символа';
  } else {
    newUserErrors.value.name = '';
  }
}

function validateNewUserEmail(): void {
  if (newUser.value.email.trim().length === 0) {
    newUserErrors.value.email = 'Email обязателен для заполнения';
  } else if (!validateEmail(newUser.value.email)) {
    newUserErrors.value.email = 'Некорректный формат email';
  } else if (users.some(u => u.email === newUser.value.email)) {
    newUserErrors.value.email = 'Пользователь с таким email уже существует';
  } else {
    newUserErrors.value.email = '';
  }
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function addNewUser(): Promise<void> {
  validateNewUserName();
  validateNewUserEmail();
  
  if (!isNewUserValid.value) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      status: 'active',
      registrationDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      avatar: null,
      loginCount: 0,
      postsCount: 0,
      commentsCount: 0
    };
    
    users.unshift(user);
    close();
  } catch (err) {
    if (err instanceof Error) {
      alert('Ошибка создания пользователя: ' + err.message);
    }
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>