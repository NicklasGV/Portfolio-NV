<template>
  <div v-if="isSnowSeason" class="snowfall" :class="{ 'snowfall-behind': behind }">
    <div
      v-for="flake in flakes"
      :key="flake.id"
      class="snowflake"
      :style="{
        left: `${flake.left}%`,
        animationDelay: `${flake.delay}s`,
        animationDuration: `${flake.duration}s`,
        opacity: flake.opacity,
        transform: `scale(${flake.scale})`,
      }"
    >
      ❄
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 50,
  },
  behind: {
    type: Boolean,
    default: true,
  },
  startDay: {
    type: Number,
    default: 1,
  },
  endDay: {
    type: Number,
    default: 26,
  },
  month: {
    type: Number,
    default: 11,
  },
})

const flakes = ref([])

const isSnowSeason = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentDay = now.getDate()

  if (currentMonth === props.month && currentDay >= props.startDay && currentDay <= props.endDay) {
    return true
  }

  return false
})

const createFlake = (id) => ({
  id,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
  opacity: 0.3 + Math.random() * 0.7,
  scale: 0.5 + Math.random() * 0.5,
})

const initializeFlakes = () => {
  flakes.value = Array.from({ length: props.count }, (_, i) => createFlake(i))
}

onMounted(() => {
  if (isSnowSeason.value) {
    initializeFlakes()
  }
})

onBeforeUnmount(() => {
  flakes.value = []
})
</script>

<style lang="scss" scoped>
.snowfall {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;

  &.snowfall-behind {
    z-index: 1;
  }
}

.snowflake {
  position: absolute;
  top: -10px;
  color: white;
  font-size: 1.5em;
  user-select: none;
  animation: fall linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) translateX(20px) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .snowflake {
    font-size: 1.2em;
  }
}
</style>

