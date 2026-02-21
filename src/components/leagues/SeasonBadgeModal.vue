<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';
import SpinnerLoader from 'src/components/leagues/SpinnerLoader.vue';
import ErrorState from 'src/components/shared/ErrorState.vue';
import type { ApiLeague, ApiSeason } from 'src/types/league';

interface SeasonBadgeModalProps {
  league: ApiLeague;
  isLoading: boolean;
  error: string | null;
  seasonBadge: ApiSeason | null;
}

defineProps<SeasonBadgeModalProps>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="relative w-full max-w-sm rounded-xl bg-gray-900 p-6 shadow-2xl ring-1 ring-white/10"
        >
          <button
            class="absolute top-4 right-4 rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            @click="emit('close')"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>

          <!-- League name -->
          <h2 class="pr-8 text-base font-semibold text-white">{{ league.strLeague }}</h2>
          <p class="mt-0.5 text-xs text-gray-500">{{ league.strSport }}</p>

          <!-- Content -->
          <div class="mt-5 flex items-center justify-center">
            <SpinnerLoader v-if="isLoading" />
            <ErrorState v-else-if="error" :message="error" />

            <!-- Badge found -->
            <div v-else-if="seasonBadge?.strBadge" class="flex flex-col items-center gap-3">
              <img
                :src="seasonBadge.strBadge"
                :alt="`${league.strLeague} – ${seasonBadge.strSeason} badge`"
                class="h-40 w-40 rounded-lg object-contain"
              />
              <span class="rounded-md bg-white/10 px-2.5 py-1 text-xs text-gray-300">
                {{ seasonBadge.strSeason }}
              </span>
            </div>

            <!-- No badge available -->
            <p v-else class="py-6 text-center text-sm text-gray-500">
              No season badge available for this league.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

