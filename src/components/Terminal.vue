<template>
  <section id="terminal" class="section terminal-section">
    <div class="container">
      <h2 class="section-title">{{ t.terminal.title }}</h2>
      <p class="terminal-subtitle">{{ t.terminal.subtitle }}</p>

      <div
        ref="shellEl"
        class="shell"
        :class="{ 'is-focused': isFocused }"
        @click="focusInput"
      >
        <div class="shell__bar">
          <span class="dot dot--red"></span>
          <span class="dot dot--amber"></span>
          <span class="dot dot--green"></span>
          <span class="shell__title">{{ t.terminal.windowTitle }}</span>
          <button
            type="button"
            class="shell__action"
            :aria-label="t.terminal.clearLabel"
            :title="t.terminal.clearLabel"
            @click.stop="clearScreen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          </button>
        </div>

        <div ref="bodyEl" class="shell__body">
          <div
            v-for="(line, index) in lines"
            :key="index"
            class="line"
            :class="line.cls"
          >
            <span v-if="line.html" v-html="line.text"></span>
            <template v-else>{{ line.text }}</template>
          </div>

          <div v-if="!isBooting" class="line line--entry">
            <span class="prompt">{{ promptLabel }}</span>
            <span class="entry">
              <input
                ref="inputEl"
                v-model="currentInput"
                type="text"
                class="entry__input"
                :aria-label="t.terminal.inputLabel"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @keydown="handleKeydown"
                @keyup="syncCaret"
                @click="syncCaret"
                @input="syncCaret"
              />
              <span class="entry__mirror" aria-hidden="true">
                <span>{{ beforeCaret }}</span>
                <span class="caret" :class="{ 'caret--blur': !isFocused }">{{ caretChar }}</span>
                <span>{{ afterCaret }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="suggestions">
        <span class="suggestions__label">{{ t.terminal.tryLabel }}</span>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="chip"
          @click="submitCommand(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useDarkMode } from '../composables/useDarkMode'
import { useMatrixRain } from '../composables/useMatrixRain'
import { useCommandPalette } from '../composables/useCommandPalette'
import cvUrl from '../assets/pdfs/CV_nicklas_vedeby.pdf?url'

const { t, language, setLanguage } = useLanguage()
const { isDarkMode, toggleDarkMode } = useDarkMode()
const { toggle: toggleMatrix } = useMatrixRain()
const { open: openPalette } = useCommandPalette()

const shellEl = ref(null)
const bodyEl = ref(null)
const inputEl = ref(null)

const lines = ref([])
const currentInput = ref('')
const caretPos = ref(0)
const isFocused = ref(false)
const isBooting = ref(true)
const history = ref([])
const historyIndex = ref(-1)

const suggestions = ['help', 'whoami', 'experience', 'skills', 'neofetch', 'sudo hire-me']
const promptLabel = 'visitor@nicklasvedeby:~$'
const CAREER_START = new Date('2020-03-01')

const beforeCaret = computed(() => currentInput.value.slice(0, caretPos.value))
const afterCaret = computed(() => currentInput.value.slice(caretPos.value + 1))
const caretChar = computed(() => currentInput.value.charAt(caretPos.value) || ' ')

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const print = (entries) => {
  const list = Array.isArray(entries) ? entries : [entries]
  list.forEach((entry) => {
    lines.value.push(typeof entry === 'string' ? { text: entry } : entry)
  })
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (bodyEl.value) {
      bodyEl.value.scrollTop = bodyEl.value.scrollHeight
    }
  })
}

const focusInput = () => {
  if (!isBooting.value) {
    inputEl.value?.focus()
  }
}

const syncCaret = () => {
  caretPos.value = inputEl.value?.selectionStart ?? currentInput.value.length
}

const formatRange = (item) =>
  item.endDate ? `${item.startDate} - ${item.endDate}` : `${item.startDate} - ${t.value.workExperience.present}`

const stripHtml = (value) => String(value).replace(/<[^>]*>/g, '')

const bar = (level) => {
  const filled = Math.round(level / 5)
  return `${'█'.repeat(filled)}${'░'.repeat(20 - filled)}`
}

const uptime = () => {
  const now = new Date()
  let months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth())
  const years = Math.floor(months / 12)
  months %= 12
  return t.value.terminal.uptime.replace('{years}', years).replace('{months}', months)
}

const NEOFETCH_ART = [
  ' ███╗   ██╗██╗   ██╗',
  ' ████╗  ██║██║   ██║',
  ' ██╔██╗ ██║██║   ██║',
  ' ██║╚██╗██║╚██╗ ██╔╝',
  ' ██║ ╚████║ ╚████╔╝ ',
  ' ╚═╝  ╚═══╝  ╚═══╝  '
]

const FILES = ['about.md', 'experience.json', 'skills.yaml', 'projects/', 'education.log', 'contact.vcf', 'cv.pdf', '.secrets']

const buildWhoami = () => [
  { text: stripHtml(t.value.about.lead), cls: 'line--bright' },
  { text: '' },
  { text: t.value.about.text1 },
  { text: '' },
  { text: t.value.about.text2 }
]

const buildExperience = () => {
  const output = []

  t.value.workExperience.timeline.forEach((item, index) => {
    output.push({ text: formatRange(item), cls: 'line--accent' })
    output.push({
      html: true,
      text: `  <strong>${esc(item.title)}</strong> <span class="dim">@</span> ${esc(item.company)}`
    })
    output.push({ text: `  ${item.description}`, cls: 'line--dim' })
    if (index < t.value.workExperience.timeline.length - 1) {
      output.push({ text: '' })
    }
  })

  return output
}

const buildSkills = (filter) => {
  const categories = t.value.skills.categories.filter(
    (category) => !filter || category.title.toLowerCase().includes(filter.toLowerCase())
  )

  if (!categories.length) {
    return [{ text: t.value.terminal.noSkillCategory.replace('{name}', filter), cls: 'line--error' }]
  }

  const output = []

  categories.forEach((category, index) => {
    output.push({ text: `${category.title}`, cls: 'line--accent' })
    category.skills.forEach((skill) => {
      output.push({ text: `  ${skill.name.padEnd(20)}${bar(skill.level)} ${String(skill.level).padStart(3)}%` })
    })
    if (index < categories.length - 1) {
      output.push({ text: '' })
    }
  })

  return output
}

const buildProjects = () => {
  const output = []

  t.value.projects.items.forEach((project, index) => {
    output.push({ text: project.title, cls: 'line--accent' })
    output.push({ text: `  ${stripHtml(project.description)}`, cls: 'line--dim' })
    output.push({ text: `  [${project.tags.join('] [')}]` })

    if (project.demo) {
      output.push({ html: true, text: `  <a href="${esc(project.demo)}" target="_blank" rel="noopener noreferrer">${esc(project.demo)}</a>` })
    }
    if (project.github) {
      output.push({ html: true, text: `  <a href="${esc(project.github)}" target="_blank" rel="noopener noreferrer">${esc(project.github)}</a>` })
    }
    if (index < t.value.projects.items.length - 1) {
      output.push({ text: '' })
    }
  })

  return output
}

const buildEducation = () =>
  t.value.education.timeline.flatMap((item, index) => {
    const block = [
      { text: item.year, cls: 'line--accent' },
      { text: `  ${item.title}`, cls: 'line--bright' },
      { text: `  ${stripHtml(item.description)}`, cls: 'line--dim' }
    ]
    return index < t.value.education.timeline.length - 1 ? [...block, { text: '' }] : block
  })

const buildContact = () => [
  { html: true, text: `email     <a href="mailto:nvedeby@gmail.com">nvedeby@gmail.com</a>` },
  { html: true, text: `phone     <a href="tel:+4560524647">+45 60 52 46 47</a>` },
  { html: true, text: `linkedin  <a href="https://www.linkedin.com/in/nicklas-vedeby-3155351b7/" target="_blank" rel="noopener noreferrer">linkedin.com/in/nicklas-vedeby</a>` },
  { html: true, text: `github    <a href="https://github.com/NicklasGV" target="_blank" rel="noopener noreferrer">github.com/NicklasGV</a>` },
  { text: '' },
  { text: t.value.terminal.contactHint, cls: 'line--dim' }
]

const buildNeofetch = () => {
  const current = t.value.workExperience.timeline[0]
  const info = [
    { label: '', value: promptLabel.replace('$', '') },
    { label: '', value: '─'.repeat(26) },
    { label: t.value.terminal.neofetch.host, value: 'Nicklas Vedeby' },
    { label: t.value.terminal.neofetch.role, value: current.title },
    { label: t.value.terminal.neofetch.company, value: current.company },
    { label: t.value.terminal.neofetch.location, value: 'Brøndby, Denmark' },
    { label: t.value.terminal.neofetch.uptime, value: uptime() },
    { label: t.value.terminal.neofetch.shell, value: 'nv-sh 2.0.0' },
    { label: t.value.terminal.neofetch.stack, value: 'Vue · Nuxt · TypeScript · Python · C#' },
    { label: t.value.terminal.neofetch.editor, value: 'VS Code · Cursor' },
    { label: t.value.terminal.neofetch.theme, value: isDarkMode.value ? 'Dark' : 'Light' },
    { label: t.value.terminal.neofetch.languages, value: 'Dansk · English' }
  ]

  const rows = Math.max(NEOFETCH_ART.length, info.length)

  return Array.from({ length: rows }, (_, index) => {
    const art = NEOFETCH_ART[index] ?? ''
    const entry = info[index]
    const artCell = esc(art.padEnd(22))

    if (!entry) {
      return { html: true, text: `<span class="art">${artCell}</span>` }
    }

    const label = entry.label ? `<span class="dim">${esc(entry.label)}</span> ` : ''
    return { html: true, text: `<span class="art">${artCell}</span>${label}${esc(entry.value)}` }
  })
}

const buildHelp = () => {
  const output = [{ text: t.value.terminal.help.title, cls: 'line--accent' }, { text: '' }]

  Object.entries(t.value.terminal.commands).forEach(([name, description]) => {
    output.push({
      html: true,
      text: `  <span class="cmd">${esc(name.padEnd(16))}</span><span class="dim">${esc(description)}</span>`
    })
  })

  output.push({ text: '' })
  output.push({ text: t.value.terminal.help.footer, cls: 'line--dim' })

  return output
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

const scrollToSection = (id) => {
  const target = document.getElementById(id)
  if (!target) {
    return false
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

const clearScreen = () => {
  lines.value = []
  focusInput()
}

const SECTION_ALIASES = {
  about: 'about',
  experience: 'work-experience',
  work: 'work-experience',
  references: 'references',
  skills: 'skills',
  education: 'education',
  projects: 'projects',
  contact: 'contact',
  terminal: 'terminal',
  top: 'hero',
  hero: 'hero'
}

const commandHandlers = {
  help: buildHelp,
  whoami: buildWhoami,
  experience: buildExperience,
  exp: buildExperience,
  skills: (args) => buildSkills(args[0]),
  projects: buildProjects,
  education: buildEducation,
  contact: buildContact,
  neofetch: buildNeofetch,

  cv: () => {
    downloadCv()
    return [{ text: t.value.terminal.cvDownloading, cls: 'line--success' }]
  },

  ls: () => [{ html: true, text: FILES.map((file) => `<span class="file">${esc(file)}</span>`).join('  ') }],

  cat: (args) => {
    const file = args[0]

    if (!file) {
      return [{ text: t.value.terminal.catUsage, cls: 'line--error' }]
    }

    const map = {
      'about.md': buildWhoami,
      'experience.json': buildExperience,
      'skills.yaml': () => buildSkills(),
      'education.log': buildEducation,
      'contact.vcf': buildContact,
      'cv.pdf': () => commandHandlers.cv([])
    }

    if (file === '.secrets') {
      return [{ text: t.value.terminal.secrets, cls: 'line--error' }]
    }

    if (file === 'projects/') {
      return [{ text: t.value.terminal.isDirectory.replace('{name}', file), cls: 'line--error' }]
    }

    const handler = map[file]
    return handler
      ? handler()
      : [{ text: t.value.terminal.noSuchFile.replace('{name}', file), cls: 'line--error' }]
  },

  goto: (args) => {
    const target = args[0]

    if (!target) {
      return [{ text: t.value.terminal.gotoUsage, cls: 'line--error' }]
    }

    const sectionId = SECTION_ALIASES[target.toLowerCase()]

    if (!sectionId || !scrollToSection(sectionId)) {
      return [{ text: t.value.terminal.noSuchSection.replace('{name}', target), cls: 'line--error' }]
    }

    return [{ text: t.value.terminal.jumping.replace('{name}', target), cls: 'line--success' }]
  },

  theme: (args) => {
    const requested = args[0]?.toLowerCase()

    if (requested && !['dark', 'light'].includes(requested)) {
      return [{ text: t.value.terminal.themeUsage, cls: 'line--error' }]
    }

    const shouldBeDark = requested ? requested === 'dark' : !isDarkMode.value

    if (shouldBeDark !== isDarkMode.value) {
      toggleDarkMode()
    }

    return [{ text: t.value.terminal.themeSet.replace('{name}', shouldBeDark ? 'dark' : 'light'), cls: 'line--success' }]
  },

  lang: (args) => {
    const requested = args[0]?.toLowerCase()

    if (!requested) {
      return [{ text: t.value.terminal.langCurrent.replace('{name}', language.value), cls: 'line--dim' }]
    }

    if (!['da', 'en'].includes(requested)) {
      return [{ text: t.value.terminal.langUsage, cls: 'line--error' }]
    }

    setLanguage(requested)
    return [{ text: t.value.terminal.langSet.replace('{name}', requested), cls: 'line--success' }]
  },

  matrix: () => {
    const active = toggleMatrix()
    return [{ text: active ? t.value.terminal.matrixOn : t.value.terminal.matrixOff, cls: 'line--success' }]
  },

  palette: () => {
    openPalette()
    return [{ text: t.value.terminal.paletteOpened, cls: 'line--success' }]
  },

  echo: (args) => [{ text: args.join(' ') }],

  history: () =>
    history.value.length
      ? history.value.map((entry, index) => ({ text: `  ${String(index + 1).padStart(3)}  ${entry}` }))
      : [{ text: t.value.terminal.historyEmpty, cls: 'line--dim' }],

  date: () => [{ text: new Date().toLocaleString(language.value === 'da' ? 'da-DK' : 'en-GB') }],

  pwd: () => [{ text: '/home/visitor/nicklas-vedeby' }],

  clear: () => {
    clearScreen()
    return []
  },

  exit: () => [{ text: t.value.terminal.exit, cls: 'line--dim' }],

  sudo: (args) => {
    const target = args.join(' ').toLowerCase()

    if (target === 'hire-me' || target === 'hire me') {
      scrollToSection('contact')
      return [
        { text: t.value.terminal.hire.granted, cls: 'line--success' },
        { text: '' },
        { text: t.value.terminal.hire.body },
        { text: '' },
        { html: true, text: `  <a href="mailto:nvedeby@gmail.com">nvedeby@gmail.com</a>  ·  <a href="tel:+4560524647">+45 60 52 46 47</a>` }
      ]
    }

    return [{ text: t.value.terminal.sudoDenied, cls: 'line--error' }]
  }
}

const commandNames = () => [...Object.keys(commandHandlers), 'sudo hire-me']

const runCommand = (raw) => {
  const input = raw.trim()

  if (!input) {
    return
  }

  const [name, ...args] = input.split(/\s+/)
  const handler = commandHandlers[name.toLowerCase()]

  if (!handler) {
    print({
      html: true,
      text: t.value.terminal.unknown.replace('{cmd}', `<span class="cmd">${esc(name)}</span>`)
    })
    return
  }

  print(handler(args) ?? [])
}

const submitCommand = (raw) => {
  const input = raw.trim()

  print({ html: true, text: `<span class="prompt">${esc(promptLabel)}</span> ${esc(input)}`, cls: 'line--echo' })

  if (input) {
    history.value.push(input)
    historyIndex.value = history.value.length
  }

  runCommand(input)

  currentInput.value = ''
  caretPos.value = 0
  focusInput()
}

const autocomplete = () => {
  const typed = currentInput.value.trim().toLowerCase()

  if (!typed) {
    return
  }

  const matches = commandNames().filter((name) => name.startsWith(typed))

  if (!matches.length) {
    return
  }

  if (matches.length === 1) {
    currentInput.value = `${matches[0]} `
    caretPos.value = currentInput.value.length
    return
  }

  print({ html: true, text: matches.map((match) => `<span class="cmd">${esc(match)}</span>`).join('  ') })
}

const recallHistory = (delta) => {
  if (!history.value.length) {
    return
  }

  const next = Math.min(Math.max(historyIndex.value + delta, 0), history.value.length)
  historyIndex.value = next
  currentInput.value = history.value[next] ?? ''

  nextTick(() => {
    caretPos.value = currentInput.value.length
    inputEl.value?.setSelectionRange(caretPos.value, caretPos.value)
  })
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    submitCommand(currentInput.value)
    return
  }

  if (event.key === 'Tab') {
    event.preventDefault()
    autocomplete()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    recallHistory(-1)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    recallHistory(1)
    return
  }

  if (event.ctrlKey && event.key.toLowerCase() === 'l') {
    event.preventDefault()
    clearScreen()
    return
  }

  if (event.ctrlKey && event.key.toLowerCase() === 'c') {
    event.preventDefault()
    print({ html: true, text: `<span class="prompt">${esc(promptLabel)}</span> ${esc(currentInput.value)}^C`, cls: 'line--echo' })
    currentInput.value = ''
    caretPos.value = 0
  }
}

const boot = async () => {
  const bootLines = t.value.terminal.boot
  const instant = prefersReducedMotion()

  for (const line of bootLines) {
    print({ text: line, cls: 'line--dim' })
    if (!instant) {
      await new Promise((resolve) => setTimeout(resolve, 260))
    }
  }

  print({ text: '' })
  isBooting.value = false
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer?.disconnect()
        observer = null
        boot()
      }
    },
    { threshold: 0.25 }
  )

  if (shellEl.value) {
    observer.observe(shellEl.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style lang="scss" scoped>
.terminal-section {
  padding: 80px 2rem;
  background: var(--bg-secondary);
  transition: background-color 0.3s;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.terminal-subtitle {
  max-width: 620px;
  margin: 0 auto 2.5rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  text-align: center;
}

.shell {
  border-radius: 14px;
  overflow: hidden;
  background: #0b1120;
  border: 1px solid rgba($primary-blue, 0.35);
  box-shadow: 0 18px 60px rgba(2, 6, 23, 0.35);
  transition: border-color 0.3s, box-shadow 0.3s;

  &.is-focused {
    border-color: rgba($accent-blue, 0.75);
    box-shadow: 0 18px 70px rgba(37, 99, 235, 0.35);
  }
}

.shell__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  background: #111c33;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;

  &--red {
    background: #ff5f57;
  }
  &--amber {
    background: #febc2e;
  }
  &--green {
    background: #28c840;
  }
}

.shell__title {
  flex: 1;
  color: #94a3b8;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.82rem;
  text-align: center;
}

.shell__action {
  display: flex;
  padding: 0.25rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  &:hover {
    color: #e2e8f0;
    background: rgba(148, 163, 184, 0.15);
  }
}

.shell__body {
  height: 420px;
  overflow-y: auto;
  padding: 1.25rem;
  background: #0b1120;
  color: #cbd5e1;
  font-family: 'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace;
  font-size: 0.88rem;
  line-height: 1.65;
  cursor: text;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.4) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.35);
    border-radius: 999px;
  }
}

.line {
  white-space: pre-wrap;
  word-break: break-word;

  &--dim {
    color: #7c8aa0;
  }

  &--bright {
    color: #f1f5f9;
  }

  &--accent {
    color: $accent-blue;
    font-weight: 600;
  }

  &--success {
    color: #4ade80;
  }

  &--error {
    color: #f87171;
  }

  &--echo {
    color: #e2e8f0;
  }

  :deep(a) {
    color: $accent-blue;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: $accent-blue-light;
    }
  }

  :deep(.dim) {
    color: #7c8aa0;
  }

  :deep(.cmd) {
    color: #7dd3fc;
    font-weight: 600;
  }

  :deep(.file) {
    color: #a5b4fc;
  }

  :deep(.art) {
    color: $accent-blue;
    font-weight: 700;
  }

  :deep(strong) {
    color: #f1f5f9;
    font-weight: 600;
  }
}

.line--entry {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.prompt {
  color: #4ade80;
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
}

.entry {
  position: relative;
  flex: 1;
  min-width: 0;
}

.entry__input {
  position: absolute;
  inset: 0;
  width: 100%;
  border: none;
  padding: 0;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font: inherit;

  &:focus {
    outline: none;
  }
}

.entry__mirror {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e2e8f0;
  min-height: 1.65em;
  pointer-events: none;
}

.caret {
  display: inline-block;
  background: $accent-blue;
  color: #0b1120;
  animation: caret-blink 1.05s steps(1) infinite;
  white-space: pre;

  &--blur {
    background: transparent;
    outline: 1px solid rgba(148, 163, 184, 0.6);
    outline-offset: -1px;
    color: #e2e8f0;
    animation: none;
  }
}

@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.15;
  }
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.suggestions__label {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.chip {
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba($primary-blue, 0.35);
  border-radius: 999px;
  background: var(--bg-primary);
  color: $primary-blue;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.82rem;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s, color 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
    color: $text-white;
    box-shadow: 0 6px 18px $shadow-color-button;
  }
}

@include tablet-down {
  .terminal-section {
    padding: 70px 1.25rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@include mobile {
  .shell__body {
    height: 340px;
    padding: 1rem;
    font-size: 0.78rem;
  }

  .entry__input {
    // Keeps iOS from zooming the viewport when the field receives focus.
    font-size: 16px;
  }

  .shell__title {
    font-size: 0.72rem;
  }

  .suggestions {
    gap: 0.45rem;
  }

  .chip {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }

  .chip:hover {
    transform: none;
  }
}
</style>
