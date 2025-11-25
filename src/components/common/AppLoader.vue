<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>Загрузка данных...</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isLoading: boolean
}>(), {
  isLoading: false,
});
</script>

<style scoped>
.loading-overlay {
  background: white;
  padding: 60px 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>