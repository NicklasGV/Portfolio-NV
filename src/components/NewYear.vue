<template>
  <div v-if="isNewYear" class="new-year">
    <!-- Confetti -->
    <div
      v-for="confetti in confettiPieces"
      :key="confetti.id"
      class="confetti"
      :style="{
        left: `${confetti.left}%`,
        animationDelay: `${confetti.delay}s`,
        animationDuration: `${confetti.duration}s`,
        backgroundColor: confetti.color,
      }"
    ></div>

    <!-- New Year Message -->
    <div class="new-year-message">
      <div class="message-content">
        <h2 class="year">{{ currentYear }}</h2>
        <p class="greeting">Happy New Year! 🎉</p>
      </div>
    </div>

    <!-- Fireworks -->
    <div
      v-for="firework in fireworks"
      :key="firework.id"
      class="firework"
      :style="{
        left: `${firework.left}%`,
        top: `${firework.top}%`,
        animationDelay: `${firework.delay}s`,
      }"
    >
      <div class="explosion">
        <div
          v-for="i in 12"
          :key="i"
          class="particle"
          :style="{
            '--angle': `${(i - 1) * 30}deg`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  startDay: {
    type: Number,
    default: 30,
  },
  endDay: {
    type: Number,
    default: 2,
  },
  startMonth: {
    type: Number,
    default: 11,
  },
  endMonth: {
    type: Number,
    default: 0,
  },
})

const confettiPieces = ref([])
const fireworks = ref([])
const currentYear = ref(new Date().getFullYear())

const isNewYear = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  if (month === props.startMonth && day >= props.startDay) {
    return true
  }

  if (month === props.endMonth && day <= props.endDay) {
    return true
  }

  return false
})

const createConfetti = (id) => ({
  id,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
  color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][
    Math.floor(Math.random() * 7)
  ],
})

const createFirework = (id) => ({
  id,
  left: 20 + Math.random() * 60,
  top: 10 + Math.random() * 30,
  delay: Math.random() * 5,
})

onMounted(() => {
  if (isNewYear.value) {
    confettiPieces.value = Array.from({ length: 50 }, (_, i) => createConfetti(i))
    fireworks.value = Array.from({ length: 5 }, (_, i) => createFirework(i))
  }
})
</script>

<style lang="scss" scoped>
.new-year {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  border-radius: 2px;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.new-year-message {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 1000;
  animation: message-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

.message-content {
  text-align: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.year {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: year-glow 1.5s ease-in-out infinite alternate;
}

.greeting {
  font-size: 1rem;
  margin: 0.5rem 0 0;
  color: #2d3748;
  font-weight: 600;
}

@keyframes message-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes year-glow {
  0% {
    filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(69, 183, 209, 0.8));
  }
}

.firework {
  position: absolute;
  width: 4px;
  height: 4px;
  pointer-events: none;
}

.explosion {
  position: relative;
  width: 100%;
  height: 100%;
  animation: firework-explode 1s ease-out forwards;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #ffd700 0%, #ff6b6b 100%);
  border-radius: 50%;
  left: 0;
  top: 0;
  transform-origin: center;
  animation: particle-fly 1s ease-out forwards;
}

.particle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

@keyframes firework-explode {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes particle-fly {
  0% {
    transform: rotate(var(--angle)) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateX(100px) scale(0);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .new-year-message {
    top: 90px;
    right: 15px;
    scale: 0.8;
  }

  .year {
    font-size: 2rem;
  }

  .greeting {
    font-size: 0.9rem;
  }

  .message-content {
    padding: 1.2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .new-year-message {
    top: 80px;
    right: 10px;
  }

  .year {
    font-size: 1.5rem;
  }

  .greeting {
    font-size: 0.8rem;
  }

  .message-content {
    padding: 1rem 1.2rem;
  }
}
</style>

