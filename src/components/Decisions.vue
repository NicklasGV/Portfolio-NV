<template>
  <section id="decisions" class="section decisions">
    <div class="container">
      <h2 class="section-title">{{ t.decisions.title }}</h2>
      <p class="decisions-subtitle">{{ t.decisions.subtitle }}</p>

      <ol class="decision-list">
        <li v-for="(record, index) in t.decisions.records" :key="record.title" class="decision">
          <div class="decision__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</div>

          <div class="decision__body">
            <h3 class="decision__title">{{ record.title }}</h3>

            <dl class="decision__rows">
              <div class="decision__row">
                <dt>{{ t.decisions.labels.context }}</dt>
                <dd>{{ record.context }}</dd>
              </div>
              <div class="decision__row">
                <dt>{{ t.decisions.labels.decision }}</dt>
                <dd>{{ record.decision }}</dd>
              </div>
              <div class="decision__row decision__row--tradeoff">
                <dt>{{ t.decisions.labels.tradeoff }}</dt>
                <dd>{{ record.tradeoff }}</dd>
              </div>
            </dl>

            <ul class="decision__tags">
              <li v-for="tag in record.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>

<style lang="scss" scoped>
.decisions {
  padding: 80px 2rem;
  background: var(--bg-primary);
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

.decisions-subtitle {
  max-width: 620px;
  margin: 0 auto 3rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  text-align: center;
}

.decision-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}

.decision {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border-left: 3px solid $primary-blue;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px var(--shadow-color-hover);
  }
}

.decision__index {
  flex-shrink: 0;
  color: rgba($primary-blue, 0.45);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
}

.decision__body {
  flex: 1;
  min-width: 0;
}

.decision__title {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
  color: var(--text-primary);
}

.decision__rows {
  margin: 0 0 1.25rem;
}

.decision__row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--bg-tertiary);

  dt {
    color: var(--text-tertiary);
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-top: 0.15rem;
  }

  dd {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  &--tradeoff dd {
    color: var(--text-primary);
  }
}

.decision__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: rgba($primary-blue, 0.12);
    color: $primary-blue;
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 0.75rem;
  }
}

@include tablet-down {
  .decisions {
    padding: 70px 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@include mobile {
  .decision {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
  }

  .decision__row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .decision:hover {
    transform: none;
  }
}
</style>
