<template>
  <!-- Explicit duration: never wait on a transitionend that a throttled tab may not fire. -->
  <Transition name="palette" :duration="200">
    <div
      v-if="isOpen"
      class="palette-backdrop"
      @click.self="close"
    >
      <div
        class="palette"
        role="dialog"
        aria-modal="true"
        :aria-label="t.palette.label"
      >
        <div class="palette__search">
          <span class="palette__prompt" aria-hidden="true">&gt;</span>
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            class="palette__input"
            :placeholder="t.palette.placeholder"
            :aria-label="t.palette.label"
            autocomplete="off"
            spellcheck="false"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="runActive"
            @keydown.esc.prevent="close"
          />
          <kbd class="palette__esc">esc</kbd>
        </div>

        <div ref="listEl" class="palette__list" role="listbox">
          <template v-for="group in groupedResults" :key="group.title">
            <p class="palette__group">{{ group.title }}</p>
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="palette__item"
              :class="{ 'is-active': item.index === activeIndex }"
              role="option"
              :aria-selected="item.index === activeIndex"
              :data-index="item.index"
              @click="run(item)"
              @mousemove="activeIndex = item.index"
            >
              <span class="palette__icon" aria-hidden="true" v-html="item.icon"></span>
              <span class="palette__label">{{ item.label }}</span>
              <span v-if="item.hint" class="palette__hint">{{ item.hint }}</span>
            </button>
          </template>

          <p v-if="!results.length" class="palette__empty">
            {{ t.palette.empty }}
          </p>
        </div>

        <div class="palette__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> {{ t.palette.footerNavigate }}</span>
          <span><kbd>↵</kbd> {{ t.palette.footerSelect }}</span>
          <span><kbd>esc</kbd> {{ t.palette.footerClose }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { useDarkMode } from '../composables/useDarkMode'
import { useCommandPalette } from '../composables/useCommandPalette'
import cvUrl from '../assets/pdfs/CV_nicklas_vedeby.pdf?url'

const { t, language, toggleLanguage, localePath } = useLanguage()
const { isDarkMode, toggleDarkMode } = useDarkMode()
const { isOpen, open, close, toggle } = useCommandPalette()
const router = useRouter()
const route = useRoute()

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref(null)
const listEl = ref(null)
let lastFocused = null

const ICONS = {
  jump: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  theme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  lang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 17l6-5-6-5M12 19h8"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>',
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>'
}

// Sections only exist on the home page, so from anywhere else go there first.
const scrollToSection = async (id) => {
  if (route.name !== 'home') {
    await router.push(localePath())
    await nextTick()
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const downloadCv = () => {
  const link = document.createElement('a')
  link.href = cvUrl
  link.download = 'CV_nicklas_vedeby.pdf'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const openExternal = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const commands = computed(() => {
  const nav = t.value.nav
  const palette = t.value.palette

  return [
    { id: 'about', group: palette.groups.navigate, label: nav.about, icon: ICONS.jump, keywords: 'about om mig bio', action: () => scrollToSection('about') },
    { id: 'experience', group: palette.groups.navigate, label: nav.workExperience, icon: ICONS.jump, keywords: 'work experience jobs erfaring', action: () => scrollToSection('work-experience') },
    { id: 'references', group: palette.groups.navigate, label: nav.references, icon: ICONS.jump, keywords: 'references anbefalinger referencer', action: () => scrollToSection('references') },
    { id: 'skills', group: palette.groups.navigate, label: nav.skills, icon: ICONS.jump, keywords: 'skills stack kompetencer tech', action: () => scrollToSection('skills') },
    { id: 'education', group: palette.groups.navigate, label: nav.education, icon: ICONS.jump, keywords: 'education uddannelse school', action: () => scrollToSection('education') },
    { id: 'projects', group: palette.groups.navigate, label: nav.projects, icon: ICONS.jump, keywords: 'projects projekter work', action: () => scrollToSection('projects') },
    { id: 'decisions', group: palette.groups.navigate, label: t.value.decisions.title, icon: ICONS.jump, keywords: 'decisions beslutninger architecture engineering tradeoffs', action: () => scrollToSection('decisions') },
    { id: 'terminal', group: palette.groups.navigate, label: t.value.terminal.title, icon: ICONS.terminal, keywords: 'terminal shell console cli', action: () => scrollToSection('terminal') },
    { id: 'contact', group: palette.groups.navigate, label: nav.contact, icon: ICONS.jump, keywords: 'contact kontakt email mail hire', action: () => scrollToSection('contact') },

    {
      id: 'theme',
      group: palette.groups.actions,
      label: isDarkMode.value ? palette.actions.lightMode : palette.actions.darkMode,
      icon: ICONS.theme,
      keywords: 'theme dark light mode tema mørk lys',
      action: toggleDarkMode
    },
    {
      id: 'language',
      group: palette.groups.actions,
      label: language.value === 'en' ? palette.actions.switchToDanish : palette.actions.switchToEnglish,
      icon: ICONS.lang,
      keywords: 'language sprog dansk english da en',
      action: toggleLanguage
    },
    { id: 'cv', group: palette.groups.actions, label: palette.actions.downloadCv, icon: ICONS.download, keywords: 'cv resume pdf download hent', action: downloadCv },
    { id: 'arcade', group: palette.groups.actions, label: palette.actions.arcade, icon: ICONS.game, keywords: 'game arcade play spil games', action: () => router.push(localePath('/arcade')) },
    { id: 'bug-hunt', group: palette.groups.actions, label: t.value.arcade.games.bugHunt.name, icon: ICONS.game, keywords: 'game shooter bugs arcade spil', action: () => router.push(localePath('/arcade/bug-hunt')) },
    { id: 'stack-overflow', group: palette.groups.actions, label: t.value.arcade.games.stackOverflow.name, icon: ICONS.game, keywords: 'game blocks tetris puzzle arcade spil', action: () => router.push(localePath('/arcade/stack-overflow')) },
    { id: 'merge-sort', group: palette.groups.actions, label: t.value.arcade.games.mergeSort.name, icon: ICONS.game, keywords: 'game 2048 tiles puzzle arcade spil', action: () => router.push(localePath('/arcade/merge-sort')) },

    { id: 'github', group: palette.groups.links, label: 'GitHub', icon: ICONS.link, hint: 'github.com/NicklasGV', keywords: 'github code repo source', action: () => openExternal('https://github.com/NicklasGV') },
    { id: 'linkedin', group: palette.groups.links, label: 'LinkedIn', icon: ICONS.link, hint: 'nicklas-vedeby', keywords: 'linkedin social network', action: () => openExternal('https://www.linkedin.com/in/nicklas-vedeby-3155351b7/') },
    { id: 'email', group: palette.groups.links, label: palette.actions.sendEmail, icon: ICONS.link, hint: 'nvedeby@gmail.com', keywords: 'email mail contact skriv', action: () => openExternal('mailto:nvedeby@gmail.com') }
  ]
})

// Subsequence matching, the way editors do it: "wex" matches "Work Experience".
const fuzzyScore = (haystack, needle) => {
  if (!needle) {
    return 1
  }

  const target = haystack.toLowerCase()
  const search = needle.toLowerCase()

  if (target.includes(search)) {
    return 1000 - target.indexOf(search)
  }

  let score = 0
  let cursor = 0

  for (const char of search) {
    const found = target.indexOf(char, cursor)
    if (found === -1) {
      return 0
    }
    score += found === cursor ? 2 : 1
    cursor = found + 1
  }

  return score
}

const results = computed(() => {
  const needle = query.value.trim()

  return commands.value
    .map((command) => ({
      command,
      score: Math.max(
        fuzzyScore(command.label, needle),
        fuzzyScore(command.keywords ?? '', needle) * 0.9
      )
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry.command, index }))
})

const groupedResults = computed(() => {
  const groups = []

  results.value.forEach((item) => {
    const existing = groups.find((group) => group.title === item.group)
    if (existing) {
      existing.items.push(item)
    } else {
      groups.push({ title: item.group, items: [item] })
    }
  })

  return groups
})

const move = (delta) => {
  if (!results.value.length) {
    return
  }

  const next = (activeIndex.value + delta + results.value.length) % results.value.length
  activeIndex.value = next

  nextTick(() => {
    listEl.value
      ?.querySelector(`[data-index="${next}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  })
}

const run = (item) => {
  close()
  // Let the overlay unmount before scrolling or toggling, so focus and paint settle first.
  nextTick(() => item.action())
}

const runActive = () => {
  const item = results.value[activeIndex.value]
  if (item) {
    run(item)
  }
}

const handleGlobalKeydown = (event) => {
  const isPaletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

  if (isPaletteShortcut) {
    event.preventDefault()
    toggle()
    return
  }

  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

watch(isOpen, async (nowOpen) => {
  if (nowOpen) {
    lastFocused = document.activeElement
    query.value = ''
    activeIndex.value = 0
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputEl.value?.focus()
  } else {
    document.body.style.overflow = ''
    lastFocused?.focus?.()
    lastFocused = null
  }
})

watch(query, () => {
  activeIndex.value = 0
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.body.style.overflow = ''
})

defineExpose({ open })
</script>

<style lang="scss" scoped>
.palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 1rem 1rem;
  // A viewport-sized backdrop-filter has to re-blur everything underneath on
  // every frame; a slightly darker flat scrim reads the same and costs nothing.
  background: rgba(2, 6, 23, 0.72);
}

.palette {
  width: 100%;
  max-width: 620px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--overlay-medium);
  border: 1px solid rgba($primary-blue, 0.25);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(2, 6, 23, 0.45);
}

.palette__search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--bg-tertiary);
}

.palette__prompt {
  color: var(--accent);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-weight: 700;
}

.palette__input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1.05rem;
  font-family: inherit;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
}

.palette__esc {
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--bg-tertiary);
  border-radius: 6px;
  color: var(--text-tertiary);
  font-size: 0.7rem;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
}

.palette__list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.palette__group {
  margin: 0.75rem 0 0.35rem;
  padding: 0 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.palette__item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.7rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.98rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  &.is-active {
    background: linear-gradient(135deg, rgba($gradient-start, 0.16) 0%, rgba($gradient-end, 0.16) 100%);
    color: var(--accent);
  }
}

.palette__icon {
  display: flex;
  flex-shrink: 0;
  color: currentColor;
  opacity: 0.8;

  :deep(svg) {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
}

.palette__label {
  flex: 1;
}

.palette__hint {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
}

.palette__empty {
  margin: 0;
  padding: 2rem 1rem;
  color: var(--text-tertiary);
  text-align: center;
}

.palette__footer {
  display: flex;
  gap: 1.25rem;
  padding: 0.7rem 1.25rem;
  border-top: 1px solid var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.78rem;

  kbd {
    display: inline-block;
    min-width: 18px;
    margin-right: 0.3rem;
    padding: 0.1rem 0.35rem;
    border: 1px solid var(--bg-tertiary);
    border-radius: 5px;
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 0.72rem;
    text-align: center;
  }
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.18s ease;

  .palette {
    transition: transform 0.18s ease;
  }
}

// A leaving overlay must never keep swallowing clicks.
.palette-leave-active {
  pointer-events: none;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;

  .palette {
    transform: translateY(-12px) scale(0.98);
  }
}

@include mobile {
  .palette-backdrop {
    padding: 6vh 0.75rem 0.75rem;
  }

  .palette {
    max-height: 80vh;
  }

  .palette__footer {
    gap: 0.85rem;
    font-size: 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .palette-enter-active,
  .palette-leave-active {
    transition: none;

    .palette {
      transition: none;
    }
  }
}
</style>
