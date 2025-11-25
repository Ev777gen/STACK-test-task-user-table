<template>
  <div class="pagination">
    <div class="pagination-info">
      Показано {{ paginationStart }} - {{ paginationEnd }} из {{ filteredAndSearchedUsers.length }}
    </div>
    
    <div class="pagination-controls">
      <button 
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="btn-page"
      >
        ⏮️
      </button>
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn-page"
      >
        ◀️
      </button>
      
      <button 
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="['btn-page', { active: currentPage === page }]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn-page"
      >
        ▶️
      </button>
      <button 
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="btn-page"
      >
        ⏭️
      </button>
    </div>
    
    <div class="page-size-selector">
      <label>На странице:</label>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePagination } from '../../composables/pagination';
import { useSearchAndFilters } from '../../composables/search';

const {
  currentPage,
  pageSize,
  totalPages,
  paginationStart,
  paginationEnd,
  visiblePages,

  goToPage,
  handlePageSizeChange,
} = usePagination()

const {
  filteredAndSearchedUsers,
} = useSearchAndFilters()
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.btn-page {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 36px;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-selector label {
  color: #666;
  font-size: 14px;
}

.page-size-selector select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>