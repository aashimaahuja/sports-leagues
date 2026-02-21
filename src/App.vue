<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-[#141414] text-white">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>
