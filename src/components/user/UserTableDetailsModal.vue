<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal modal-large">
      <div class="modal-header">
        <h3>Информация о пользователе</h3>
        <button @click="close" class="btn-close">✕</button>
      </div>
      
      <div class="modal-body" v-if="selectedUser">
        <div class="user-details">
          <div class="detail-section">
            <img 
              :src="selectedUser.avatar || getDefaultAvatar(selectedUser.name)" 
              :alt="selectedUser.name"
              class="avatar-large"
            />
            <h2>{{ selectedUser.name }}</h2>
            <p class="user-email">{{ selectedUser.email }}</p>
          </div>
          
          <div class="detail-section">
            <h4>Основная информация</h4>
            <div class="detail-row">
              <span class="label">ID:</span>
              <span>{{ selectedUser.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Роль:</span>
              <span :class="['role-badge', 'role-' + selectedUser.role]">
                {{ getRoleLabel(selectedUser.role) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Статус:</span>
              <span :class="['status-badge', selectedUser.status === 'active' ? 'status-active' : 'status-inactive']">
                {{ selectedUser.status === 'active' ? 'Активен' : 'Неактивен' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Дата регистрации:</span>
              <span>{{ formatDate(selectedUser.registrationDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Последняя активность:</span>
              <span>{{ formatRelativeTime(selectedUser.lastActivity) }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Статистика</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ selectedUser.loginCount || 0 }}</div>
                <div class="stat-label">Входов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ selectedUser.postsCount || 0 }}</div>
                <div class="stat-label">Постов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ selectedUser.commentsCount || 0 }}</div>
                <div class="stat-label">Комментариев</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          @click="close"
          class="btn btn-secondary"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../types';
import { getDefaultAvatar, getRoleLabel } from '../../utils/user';
import { formatRelativeTime, formatDate } from '../../utils/dateAndTime';

defineProps<{
  selectedUser: User | null
}>();

const emit = defineEmits<{
  close: [],
}>();

function close(): void {
  emit('close')
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

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  display: block;
}

.user-email {
  color: #666;
  text-align: center;
  margin: 5px 0 0 0;
}

.detail-section h2 {
  text-align: center;
  margin: 0 0 5px 0;
  font-size: 22px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}
</style>