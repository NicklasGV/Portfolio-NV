import { ref, computed } from 'vue'
import protonedmusicImage from '../assets/images/protonedmusic.webp'
import buildabotImage from '../assets/images/buildabot.svg'
import samlinoImage from '../assets/images/samlino.png'

const currentLanguage = ref('da')

const translations = {
  en: {
    nav: {
      about: 'About',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    about: {
      title: 'About Me',
      lead: 'Welcome to my portfolio! I\'m a passionate <strong>Data Technician</strong> and <strong>Web Developer</strong> who loves transforming data into insights and building beautiful, functional web experiences.',
      text1: 'I began my journey in data technology around 2020 and completed my education in May 2025. Throughout my studies, I\'ve developed expertise in data analysis, database management, and full-stack web development.',
      text2: 'I\'m constantly learning and exploring new technologies, always striving to create solutions that are both technically sound and user-friendly. Whether it\'s cleaning and analyzing datasets or building responsive web applications, I approach every project with attention to detail and a commitment to excellence.'
    },
    education: {
      title: 'Education',
      timeline: [
        {
          year: '2020',
          title: 'Started Data Technician Education',
          description: 'Began my journey into data technology, learning the fundamentals of data analysis, database systems, and programming.'
        },
        {
          year: '2021-2024',
          title: 'Intermediate Studies',
          description: 'Expanded knowledge in advanced data processing, web development technologies, and full-stack application development.'
        },
        {
          year: 'May 2025',
          title: 'Completed Education',
          description: 'Successfully completed my data technician education, equipped with comprehensive skills in both data analysis and web development.'
        }
      ]
    },
    skills: {
      title: 'Skills',
      categories: [
        {
          title: 'Data Technologies',
          skills: [
            { name: 'SQL', level: 90 },
            { name: 'Python', level: 85 },
            { name: 'Data Analysis', level: 88 },
            { name: 'Database Design', level: 82 },
            { name: 'ETL Processes', level: 80 }
          ]
        },
        {
          title: 'Web Development',
          skills: [
            { name: 'Vue.js', level: 85 },
            { name: 'JavaScript', level: 88 },
            { name: 'HTML/CSS', level: 92 },
            { name: 'Node.js', level: 75 },
            { name: 'Responsive Design', level: 90 }
          ]
        },
        {
          title: 'Tools & Technologies',
          skills: [
            { name: 'Git', level: 85 },
            { name: 'REST APIs', level: 80 },
            { name: 'Linux', level: 75 },
            { name: 'Docker', level: 70 },
            { name: 'Cloud Services', level: 72 }
          ]
        }
      ]
    },
    projects: {
      title: 'Projects',
      items: [
        {
          title: 'Data Analytics Dashboard',
          description: 'A comprehensive dashboard for visualizing and analyzing large datasets with interactive charts and real-time updates.',
          tags: ['Python', 'SQL', 'Data Visualization', 'Dash'],
          github: '#',
          demo: '#'
        },
        {
          title: 'E-Commerce Web Application',
          description: 'Full-stack e-commerce platform with user authentication, shopping cart, and payment integration.',
          tags: ['Vue.js', 'Node.js', 'MongoDB', 'REST API'],
          github: '#',
          demo: '#'
        },
        {
          title: 'ETL Pipeline System',
          description: 'Automated ETL pipeline for processing and transforming data from multiple sources into a unified data warehouse.',
          tags: ['Python', 'ETL', 'Data Processing', 'Automation'],
          github: '#',
          demo: null
        },
        {
          title: 'Responsive Portfolio Website',
          description: 'Modern, responsive portfolio website built with Vue.js and Vite, featuring smooth animations and mobile-first design.',
          tags: ['Vue.js', 'Vite', 'CSS3', 'Responsive Design'],
          github: '#',
          demo: '#'
        }
      ],
      github: 'GitHub',
      demo: 'Live Demo'
    },
    contact: {
      title: 'Get In Touch',
      intro: 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your team.',
      email: 'Email',
      phone: 'Phone',
      linkedin: 'LinkedIn',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'your.email@example.com',
        messagePlaceholder: 'Your message...',
        submit: 'Send Message',
        success: 'Thank you for your message! I\'ll get back to you soon.'
      }
    },
    footer: {
      rights: 'All rights reserved.'
    }
  },
  da: {
    nav: {
      about: 'Om Mig',
      education: 'Uddannelse',
      skills: 'Kompetencer',
      projects: 'Projekter',
      contact: 'Kontakt'
    },
    about: {
      title: 'Om Mig',
      lead: 'Velkommen til mit portfolio! Jeg er en passioneret <strong>Datatekniker</strong> og <strong>Webudvikler</strong> der elsker at omdanne data til indsigt og bygge smukke, funktionelle weboplevelser.',
      text1: 'Jeg startede min rejse inden for datateknologi omkring 2020 og afsluttede min uddannelse i maj 2025. Gennem mine studier har jeg udviklet ekspertise inden for dataanalyse, databaseadministration og full-stack webudvikling.',
      text2: 'Jeg lærer konstant og udforsker nye teknologier og stræber altid efter at skabe løsninger, der er både tekniske solide og brugervenlige. Uanset om det er rensning og analyse af datasæt eller bygning af responsive webapplikationer, går jeg til hvert projekt med opmærksomhed på detaljer og et engagement for ekspertise.'
    },
    education: {
      title: 'Uddannelse',
      timeline: [
        {
          year: 'Marts 2020',
          title: 'Påbegyndte Datatekniker Uddannelse',
          description: 'Startede min rejse ind i datateknologi og lærte fundamenterne i dataanalyse, databasesystemer og programmering.'
        },
        {
          year: '2024-2025',
          title: 'Elevplads hos Samlino.dk',
          description: 'Arbejdede som elev hos Samlino.dk, hvor jeg udviklede mine færdigheder inden for webudvikling og dataanalyse og ETL processer.'
        },
        {
          year: 'Maj 2025',
          title: 'Afsluttet Uddannelse',
          description: 'Gennemførte min datatekniker uddannelse, udstyret med omfattende færdigheder inden for både dataanalyse, webudvikling og ETL processer. Jeg har også fået en masse erfaring med at arbejde i team og med andre udviklere.'
        }
      ]
    },
    skills: {
      title: 'Kompetencer',
      categories: [
        {
          title: 'Data Teknologier',
          skills: [
            { name: 'SQL', level: 90 },
            { name: 'Python', level: 85 },
            { name: 'Dataanalyse', level: 88 },
            { name: 'ETL Processer', level: 80 },
            { name: 'DB Performance Tuning', level: 80 }
          ]
        },
        {
          title: 'Webudvikling',
          skills: [
            { name: 'Vue.js', level: 90 },
            { name: 'Angular', level: 90 },
            { name: 'JavaScript', level: 90 },
            { name: 'HTML/CSS', level: 95 },
            { name: 'Node.js', level: 60 },
            { name: 'Responsivt Design', level: 90 }
          ]
        },
        {
          title: 'Værktøjer & Teknologier',
          skills: [
            { name: 'Git', level: 85 },
            { name: 'REST APIs', level: 80 },
            { name: 'Cursor AI', level: 75 },
            { name: 'ChatGPT', level: 70 },
            { name: 'Docker', level: 70 },
            { name: 'AWS System', level: 65 }
          ]
        }
      ]
    },
    projects: {
      title: 'Projekter',
      items: [
        {
          image: protonedmusicImage,
          title: 'Protoned Music',
          description: 'En webbaseret platform for en kundes musik produktion, hvor kunden kunne skabe events, sælge billetter, merch og andet. <br> <span class="highlight">Kunden har desværre valgt at lukke ned, og projektet er derfor ikke længere tilgængeligt.</span>',
          tags: ['Angular', 'SQL', 'C#', '.NET'],
        },
        {
          image: buildabotImage,
          title: 'Build a Bot',
          description: 'En webbaseret platform for at bygge og teste bot\'s til Discord. Dette projekt er mit og en vens. Som er lavet som et slut projekt i vores uddannelse. Det bygges stadig på her og der men står pt i dvale.',
          tags: ['Angular', 'Discord.js', 'REST API', 'C#'],
          github: 'https://github.com/NicklasGV/Build-a-Bot',
          demo: 'https://buildabot.dk/',
        },
        {
          image: samlinoImage,
          title: 'Samlino.dk',
          description: 'Er en sammenlignings platform for at sammenligne priser på hovedsageligt bil forsikringer. men også a-kasser og el. <br> <span class="highlight">Jeg har ikke lavet Samlino.dk, har arbejdet for dem som udvikler.</span>',
          tags: ['Vue.js', 'Python', 'SQL', 'REST API'],
          demo: 'https://www.samlino.dk/'
        }
      ],
      github: 'GitHub',
      demo: 'Live Site'
    },
    contact: {
      title: 'Kontakt',
      intro: 'Jeg er altid åben for at diskutere nye projekter, kreative idéer eller muligheder for at være en del af dit team.',
      email: 'E-mail',
      phone: 'Telefon',
      linkedin: 'LinkedIn',
      form: {
        name: 'Navn',
        email: 'E-mail',
        message: 'Besked',
        namePlaceholder: 'Dit navn',
        emailPlaceholder: 'din.email@eksempel.dk',
        messagePlaceholder: 'Din besked...',
        submit: 'Send Besked',
        success: 'Tak for din besked! Jeg vender tilbage snarest.'
      }
    },
    footer: {
      rights: 'Alle rettigheder forbeholdes.'
    }
  }
}

export function useLanguage() {
  const language = computed(() => currentLanguage.value)
  const t = computed(() => translations[currentLanguage.value])

  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLanguage.value === 'en' ? 'da' : 'en')
  }

  // Initialize from localStorage
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage.value = savedLanguage
  }

  return {
    language,
    t,
    setLanguage,
    toggleLanguage
  }
}

