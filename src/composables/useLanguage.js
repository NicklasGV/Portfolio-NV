import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { updateSEO } from '@/utils/seo'
import protonedmusicImage from '../assets/images/protonedmusic.webp'
import buildabotImage from '../assets/images/buildabotwide.svg'
import samlinoImage from '../assets/images/samlino.png'

const currentLanguage = ref('da')

const normalizeDocumentLanguage = (lang) => {
  switch (lang) {
    case 'en':
      return 'en'
    case 'da':
    default:
      return 'da-DK'
  }
}

const applyDocumentLanguage = (lang) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('lang', normalizeDocumentLanguage(lang))
}

const translations = {
  en: {
    nav: {
      about: 'About',
      education: 'Education',
      skills: 'Skills',
      workExperience: 'Work Experience',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      eyebrow: 'Data Technician & Web Developer',
      title: 'Building <span class="highlight">data-driven</span> web experiences',
      subtitle: 'I blend data insights with front-end craft to deliver fast, human-friendly products.',
      primaryCta: 'View my work',
      secondaryCta: "Let's collaborate",
      stats: [
        { value: '3+', label: 'Years exploring data & web' },
        { value: '3', label: 'Projects & initiatives delivered' },
        { value: '4', label: 'Languages I can work in' }
      ]
    },
    about: {
      title: 'About Me',
      lead: 'Welcome to my portfolio! I\'m a passionate <strong>Data Technician</strong> and <strong>Web Developer</strong> who loves transforming data into insights and building beautiful, functional web experiences.',
      text1: 'I began my journey in data technology around 2020 and completed my education in May 2025. Throughout my studies, I\'ve developed expertise in data analysis, database management, and full-stack web development.',
      text2: 'I\'m constantly learning and exploring new technologies, always striving to create solutions that are both technically sound and user-friendly. Whether it\'s cleaning and analyzing datasets or building responsive web applications, I approach every project with attention to detail and a commitment to excellence.',
      downloadLabel: 'Prefer a PDF of my CV? ',
      downloadCta: 'Grab it here',
      imageAlt: 'Portrait of Nicklas Vedeby, Data Technician and Web Developer',
    },
    education: {
      title: 'Education',
      timeline: [
        {
          year: 'May 2025',
          title: 'Completed Education',
          description: 'Completed my data technician education, equipped with comprehensive skills in data analysis, web development, and ETL processes. I have also gained a lot of experience working in teams and with other developers. <br> <span class="highlight">Proof of completion, grades and certificate can be sent upon request</span>'
        },
        {
          year: '2024-2025',
          title: 'Apprenticeship at Samlino.dk',
          description: 'Worked as an apprentice at Samlino.dk, where I developed my skills in web development, data analysis, and ETL processes.'
        },
        {
          year: 'March 2020',
          title: 'Started Data Technician Education',
          description: 'Started my journey into data technology and learned the fundamentals of data analysis, database systems, and programming.'
        }
      ]
    },
    workExperience: {
      title: 'Work Experience',
      present: 'Present',
      timeline: [
        {
          startDate: 'June 2024',
          endDate: 'Nov 2025',
          title: 'Developer',
          company: 'Samlino.dk',
          description: 'I have worked as a developer at Samlino where I have developed a lot of things in Python, but for the last 2 months I have focused a lot on the web development of the site and have therefore worked a lot with Vue.js.'
        },
        {
          startDate: 'Jan 2024',
          endDate: 'May 2025',
          title: 'Data Technician Apprentice',
          company: 'Samlino.dk',
          description: 'Worked as an apprentice at Samlino.dk, where I developed my skills in web development, data analysis, and ETL processes.'
        },
        {
          startDate: 'Dec 2021',
          endDate: 'Jan 2024',
          title: 'Closing Manager',
          company: 'Rema 1000',
          description: 'I worked as a closing manager at Rema 1000 for about 2 years, where I was responsible for leading the young workers who were there, and simultaneously managing the store and its closing.'
        },
        {
          startDate: 'Jan 2019',
          endDate: 'March 2021',
          title: 'Full-time Employee',
          company: 'Rema 1000',
          description: 'I worked in this period as a full-time employee at Rema 1000, where I was responsible for the frozen foods department, both with ordering and restocking.'
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
            { name: 'ETL Processes', level: 80 },
            { name: 'DB Performance Tuning', level: 80 }
          ]
        },
        {
          title: 'Web Development',
          skills: [
            { name: 'Vue.js', level: 90 },
            { name: 'Angular', level: 90 },
            { name: 'JavaScript', level: 90 },
            { name: 'HTML/CSS', level: 95 },
            { name: 'Node.js', level: 60 },
            { name: 'Responsive Design', level: 90 }
          ]
        },
        {
          title: 'Tools & Technologies',
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
      title: 'Projects',
      items: [
        {
          image: protonedmusicImage,
          title: 'Protoned Music',
          description: 'A web-based platform for a customer\'s music production, where the customer could create events, sell tickets, merch, and more. <br> <span class="highlight">Unfortunately, the customer has chosen to shut down, and the project is therefore no longer available.</span>',
          tags: ['Angular', 'SQL', 'C#', '.NET'],
          alt: 'Screenshot from the Protoned Music events and ticketing platform',
        },
        {
          image: buildabotImage,
          title: 'Build a Bot',
          description: 'A web-based platform for building and testing bots for Discord. This project is mine and a friend\'s, made as a final project in our education. It\'s still being worked on here and there but is currently dormant.',
          tags: ['Angular', 'Discord.js', 'REST API', 'C#'],
          github: 'https://github.com/NicklasGV/Build-a-Bot',
          demo: 'https://buildabot.dk/',
          alt: 'Preview of the Build a Bot Discord automation platform interface',
        },
        {
          image: samlinoImage,
          title: 'Samlino.dk',
          description: 'Is a comparison platform for comparing prices on mainly car insurance, but also unemployment funds and electricity. <br> <span class="highlight">I did not create Samlino.dk, I have worked for them as a developer.</span>',
          tags: ['Vue.js', 'Python', 'SQL', 'REST API'],
          demo: 'https://www.samlino.dk/',
          alt: 'Screenshot of the Samlino.dk comparison platform homepage',
        }
      ],
      github: 'GitHub',
      demo: 'Live Site'
    },
    contact: {
      title: 'Get In Touch',
      intro: 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your team.',
      email: 'Email',
      phone: 'Phone',
      linkedin: 'LinkedIn',
      downloadLabel: 'Prefer a PDF?',
      downloadLink: 'Grab my CV',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'your.email@example.com',
        messagePlaceholder: 'Your message...',
        submit: 'Send Message',
        sending: 'Sending your message...',
        success: 'Thank you for your message! I\'ll get back to you soon.',
        error: 'Something went wrong. Please try again later.'
      }
    },
    footer: {
      rights: 'All rights reserved.',
      downloadCv: 'Download CV'
    }
  },
  da: {
    nav: {
      about: 'Om Mig',
      education: 'Uddannelse',
      skills: 'Kompetencer',
      workExperience: 'Erfaring',
      projects: 'Projekter',
      contact: 'Kontakt',
      cv: 'Download CV'
    },
    hero: {
      eyebrow: 'Datatekniker & Webudvikler',
      title: 'Jeg bygger <span class="highlight">datadrevne</span> webløsninger',
      subtitle: 'Jeg kombinerer dataindsigt og moderne frontend for at skabe hurtige og menneskelige digitale oplevelser.',
      primaryCta: 'Se mine projekter',
      secondaryCta: 'Lad os tage en snak',
      stats: [
        { value: '3+', label: 'År med data og web' },
        { value: '3', label: 'Leverede projekter og initiativer' },
        { value: '4', label: 'Sprog jeg kan arbejde i' }
      ]
    },
    about: {
      title: 'Om Mig',
      lead: 'Velkommen til mit portfolio! Jeg er en passioneret <strong>Datatekniker</strong> og <strong>Webudvikler</strong> der elsker at omdanne data til indsigt og bygge smukke, funktionelle weboplevelser.',
      text1: 'Jeg startede min rejse inden for datateknologi omkring 2020 og afsluttede min uddannelse i maj 2025. Gennem mine studier har jeg udviklet ekspertise inden for dataanalyse, databaseadministration og full-stack webudvikling.',
      text2: 'Jeg lærer konstant og udforsker nye teknologier og stræber altid efter at skabe løsninger, der er både tekniske solide og brugervenlige. Uanset om det er rensning og analyse af datasæt eller bygning af responsive webapplikationer, går jeg til hvert projekt med opmærksomhed på detaljer og et engagement for ekspertise.',
      downloadLabel: 'Hvis du vil have en PDF af mit CV, ',
      downloadCta: 'kan du hente det her',
      imageAlt: 'Portræt af Nicklas Vedeby, datatekniker og webudvikler',
    },
    education: {
      title: 'Uddannelse',
      timeline: [
        {
          year: 'Maj 2025',
          title: 'Afsluttet Uddannelse',
          description: 'Gennemførte min datatekniker uddannelse, udstyret med omfattende færdigheder inden for både dataanalyse, webudvikling og ETL processer. Jeg har også fået en masse erfaring med at arbejde i team og med andre udviklere. <br> <span class="highlight">Bevis på afslutning, karakter og svendebrev kan tilsendes</span>'
        },
        {
          year: '2024-2025',
          title: 'Elevplads hos Samlino.dk',
          description: 'Arbejdede som elev hos Samlino.dk, hvor jeg udviklede mine færdigheder inden for webudvikling og dataanalyse og ETL processer.'
        },
        {
          year: 'Marts 2020',
          title: 'Påbegyndte Datatekniker Uddannelse',
          description: 'Startede min rejse ind i datateknologi og lærte fundamenterne i dataanalyse, databasesystemer og programmering.'
        },
      ]
    },
    workExperience: {
      title: 'Erfaring',
      present: 'Nuværende',
      timeline: [
        {
          startDate: 'Juni 2024',
          endDate: 'Nov 2025',
          title: 'Udvikler',
          company: 'Samlino.dk',
          description: 'Jeg har arbejdet som udvikler hos Samlino hvor jeg har udviklet en del ting i Python, men de sidste 2 måneder har jeg fokuseret meget på webudviklingen af siden og har derfor stået meget med Vue.js.'
        },
        {
          startDate: 'Jan 2024',
          endDate: 'Maj 2025',
          title: 'Datatekniker Elev',
          company: 'Samlino.dk',
          description: 'Arbejdede som elev hos Samlino.dk, hvor jeg udviklede mine færdigheder inden for webudvikling og dataanalyse og ETL processer.'
        },
        {
          startDate: 'Dec 2021',
          endDate: 'Jan 2024',
          title: 'Lukke ansvarlig',
          company: 'Rema 1000',
          description: 'Jeg arbejdede som lukke ansvarlig i Rema 1000 i ca 2 år, hvor jeg stod for at lede de ung arbejdere der var. og samtidig stå for butikken og dens lukning.'
        },
        {
          startDate: 'Jan 2019',
          endDate: 'Marts 2021',
          title: 'Fuldtidsansat',
          company: 'Rema 1000',
          description: 'Jeg arbejdede i denne periode som fuldtidsansat i Rema 1000, hvor jeg blandt andet stod for frost afdelingen, både med bestilling men også opfyldning.'
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
          description: 'Mit første "rigtige" projekt bygget sammen med nogle venner fra studiet. <br> En webbaseret platform for en kundes musik produktion, hvor kunden kunne skabe events, sælge billetter, merch og andet. <br> <span class="highlight">Kunden har desværre valgt at lukke ned, og projektet er derfor ikke længere tilgængeligt.</span>',
          tags: ['Angular', 'SQL', 'C#', '.NET'],
          github: 'https://github.com/NicklasGV/ProtonedMusic',
          alt: 'Skærmbillede af Protoned Music platformen til events og billetsalg',
        },
        {
          image: buildabotImage,
          title: 'Build a Bot',
          description: 'En webbaseret platform for at bygge og teste bot\'s til Discord. Dette projekt er mit og en vens. Som er lavet som et slut projekt i vores uddannelse. <br> <span class="highlight">Det bygges stadig på her og der men står pt i dvale.</span>',
          tags: ['Angular', 'Discord.js', 'REST API', 'C#'],
          github: 'https://github.com/NicklasGV/Build-a-Bot',
          demo: 'https://buildabot.dk/',
          alt: 'Forhåndsvisning af Build a Bot-platformen til Discord-automatisering',
        },
        {
          image: samlinoImage,
          title: 'Samlino.dk',
          description: 'Er en sammenlignings platform for at sammenligne priser på hovedsageligt bil forsikringer. men også a-kasser og el. <br> <span class="highlight">Jeg har ikke lavet Samlino.dk, har arbejdet for dem som udvikler.</span>',
          tags: ['Vue.js', 'Python', 'SQL', 'REST API'],
          demo: 'https://www.samlino.dk/',
          alt: 'Skærmbillede af Samlino.dk sammenligningsplatformens forside',
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
      downloadLabel: 'Vil du hellere have en PDF?',
      downloadLink: 'Hent mit CV',
      form: {
        name: 'Navn',
        email: 'E-mail',
        message: 'Besked',
        namePlaceholder: 'Dit navn',
        emailPlaceholder: 'din.email@eksempel.dk',
        messagePlaceholder: 'Din besked...',
        submit: 'Send Besked',
        sending: 'Sender din besked...',
        success: 'Tak for din besked! Jeg vender tilbage snarest.',
        error: 'Noget gik galt. Prøv venligst igen senere.'
      }
    },
    footer: {
      rights: 'Alle rettigheder forbeholdes.',
      downloadCv: 'Download CV'
    }
  }
}

export function useLanguage() {
  const router = useRouter()
  const language = computed(() => currentLanguage.value)
  const t = computed(() => translations[currentLanguage.value])

  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      applyDocumentLanguage(lang)
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang)
        const currentMeta = router?.currentRoute?.value?.meta ?? {}
        updateSEO({ ...currentMeta, url: window.location.href })
      }
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLanguage.value === 'en' ? 'da' : 'en')
  }

  // Initialize from localStorage
  const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage.value = savedLanguage
  }

  applyDocumentLanguage(currentLanguage.value)

  if (typeof window !== 'undefined') {
    const currentMeta = router?.currentRoute?.value?.meta ?? {}
    updateSEO({ ...currentMeta, url: window.location.href })
  }

  return {
    language,
    t,
    setLanguage,
    toggleLanguage
  }
}

