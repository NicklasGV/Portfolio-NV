<template>
  <div class="app">
    <Header />
    <About />
    <EducationTimeline />
    <Skills />
    <WorkExperience />
    <Projects />
    <Contact />
    <Footer />
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import About from '../components/About.vue'
import EducationTimeline from '../components/EducationTimeline.vue'
import Skills from '../components/Skills.vue'
import Projects from '../components/Projects.vue'
import WorkExperience from '../components/workExperience.vue'
import Contact from '../components/Contact.vue'
import Footer from '../components/Footer.vue'
</script>

<style lang="scss">
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  background-attachment: fixed;
  transition: background 0.3s;
}

:root.dark .app {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
</style>

