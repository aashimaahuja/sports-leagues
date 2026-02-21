<script setup lang="ts">
interface ErrorStateProps {
  message: string;
}

defineProps<ErrorStateProps>();
</script>

<template>
  <p class="py-6 text-center text-sm text-red-400">{{ message }}</p>
</template>
