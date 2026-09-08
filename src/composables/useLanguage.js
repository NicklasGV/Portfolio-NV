import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { updateSEO } from '@/utils/seo'
import protonedmusicImage from '../assets/images/protonedmusic.webp'
import buildabotImage from '../assets/images/buildabotwide.svg'
import samlinoImage from '../assets/images/samlino.png'
import martinRecommendationPdf from '../assets/pdfs/Nicklas-Vedeby-Anbefaling-Martin.pdf'

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
      workExperience: 'Work Experience',
      references: 'References',
      skills: 'Skills',
      education: 'Education',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      eyebrow: 'Fullstack Developer',
      title: 'Building <span class="highlight">modern</span> web experiences',
      subtitle: 'I use data insights and modern frontend technologies to create user-friendly and fast web experiences.',
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
      lead: 'Welcome to my portfolio! I\'m a passionate <strong>Fullstack Developer</strong> who loves building beautiful, functional web experiences from the frontend all the way through the backend.',
      text1: 'I began my journey in data technology around 2020 and completed my Data Technician education, specializing in programming, in May 2025. As an apprentice and later developer at Samlino, I worked with Nuxt and the Storyblok CMS on the frontend, and with Python on the backend. I\'ve also built my own site from scratch using Angular with a C# API backend.',
      text2: 'I\'m always eager to learn new ways of building for the web, whether that\'s frontend styling and UX or getting deeper into databases and backend architecture. I approach every project with attention to detail and a genuine drive to figure out the best way to build it.',
      downloadLabel: 'Prefer a PDF of my CV? ',
      downloadCta: 'Grab it here',
      imageAlt: 'Portrait of Nicklas Vedeby, Fullstack Developer',
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
          startDate: 'Sep 2026',
          endDate: null,
          title: 'Fullstack Developer',
          company: 'Tribe Happiness',
          description: 'I work as a fullstack developer at Tribe Happiness, where I build and maintain both ends of the stack, from UI components and styling in the frontend through to APIs, backend logic and data.'
        },
        {
          startDate: 'Apr 2026',
          endDate: 'Aug 2026',
          title: 'Junior Product Developer',
          company: 'Sophisticated GEEK',
          description: 'I worked with product development and concept development, and helped maintain websites running on Shopify.'
        },
        {
          startDate: 'June 2025',
          endDate: 'Nov 2025',
          title: 'Junior Developer',
          company: 'Samlino.dk',
          description: 'During this period I worked mostly frontend-focused. I worked on several of our components, both streamlining them and updating them to fit our CMS system.'
        },
        {
          startDate: 'Feb 2024',
          endDate: 'May 2025',
          title: 'Data Technician Apprentice',
          company: 'Samlino.dk',
          description: 'Completed my Data Technician education specializing in programming here. I worked with languages like Java, JavaScript, TypeScript, HTML, CSS and Python, and with frameworks such as Angular and Nuxt.'
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
    references: {
      title: 'Recommendations',
      subtitle: 'What colleagues say about working with me',
      contactLabels: {
        email: 'Email',
        phone: 'Phone'
      },
      items: [
        {
          quote: 'Nicklas approaches every assignment with a positive, solution-oriented mindset and has grown rapidly as a developer. I give him my full recommendation and wish we could have kept him at Samlino.',
          name: 'Martin Fjordvald',
          role: 'Group CTO, Samlino Group',
          contact: {
            email: 'martin@samlinogroup.com',
            phone: '+351910092830'
          },
          document: {
            href: martinRecommendationPdf,
            label: 'Read full recommendation (PDF)'
          },
          date: '19 Nov 2025'
        }
      ],
      otherTitle: 'Other colleague references',
      others: [
        {
          name: 'Jeppe T. Poulsen',
          role: 'Head of Analytics, Samlino.dk',
          email: 'jeppe.poulsen@samlino.dk'
        },
        {
          name: 'Kenneth Berle',
          role: 'Fullstack Developer at Samlino.dk, CEO of Fenrir Games Studios',
          email: 'light@fenrirgamestudio.dk',
          phone: '+4540711759',
          personalEmail: 'kenneth@berle.eu',
          linkedin: 'https://www.linkedin.com/in/kennethberle/'
        }
      ]
    },
    skills: {
      title: 'Skills',
      subtitle: 'Grouped by how much real mileage I have on each, rather than a percentage I assigned to myself.',
      groups: [
        {
          title: 'In production',
          description: 'Used on work that shipped and that I kept maintaining afterwards.',
          items: ['Vue.js', 'Nuxt', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SCSS', 'Python', 'SQL', 'REST APIs', 'Storyblok CMS', 'Shopify', 'Git', 'UI/UX']
        },
        {
          title: 'Built with',
          description: 'Used to build and finish my own projects and coursework.',
          items: ['Angular', 'C#', '.NET', 'Node.js', 'Vite', 'Discord.js', 'Docker', 'ETL pipelines', 'Database tuning']
        },
        {
          title: 'Exploring',
          description: 'On my desk right now, and genuinely still learning these.',
          items: ['AWS', 'Automated testing', 'PRINCE2']
        },
        {
          title: 'Languages',
          description: 'Written and spoken.',
          items: ['Danish (native)', 'English (professional)']
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
    terminal: {
      title: 'Terminal',
      subtitle: 'Prefer a keyboard? This portfolio ships with a shell. Type a command, hit Enter, and explore my CV the developer way.',
      windowTitle: 'nicklas@portfolio: ~',
      clearLabel: 'Clear terminal',
      inputLabel: 'Terminal command input',
      tryLabel: 'Try:',
      boot: [
        'nv-sh 2.0.0 (portfolio build 2026.09)',
        'Loading modules: vue@3 · vite@5 · scss ................ ok',
        'Mounting /home/visitor/nicklas-vedeby ................. ok',
        "Ready. Type 'help' to see what I can do."
      ],
      help: {
        title: 'Available commands:',
        footer: 'Tip: ↑/↓ walks your history, Tab autocompletes, Ctrl+L clears, Ctrl+K opens the command palette.'
      },
      commands: {
        help: 'Show this list of commands',
        whoami: 'Who am I, in short',
        experience: 'My work history',
        skills: 'What I work with, grouped by real experience',
        projects: 'Things I have built',
        education: 'My education timeline',
        decisions: 'Engineering calls I made, and the trade-offs',
        contact: 'How to reach me',
        cv: 'Download my CV as PDF',
        neofetch: 'System info, developer style',
        ls: 'List the files in this directory',
        cat: 'Read a file (try: cat about.md)',
        goto: 'Jump to a section (try: goto projects)',
        theme: 'Switch theme (theme dark | theme light)',
        lang: 'Switch language (lang da | lang en)',
        play: 'Open the arcade (try: play stack-overflow)',
        palette: 'Open the command palette',
        echo: 'Print some text back',
        history: 'Show the commands you have run',
        date: 'Show current date and time',
        clear: 'Clear the screen',
        'sudo hire-me': 'The most important command'
      },
      unknown: "command not found: {cmd}. Type 'help' for the list.",
      uptime: '{years} years, {months} months (since March 2020)',
      neofetch: {
        host: 'Host......:',
        role: 'Role......:',
        company: 'Company...:',
        location: 'Location..:',
        uptime: 'Uptime....:',
        shell: 'Shell.....:',
        stack: 'Stack.....:',
        editor: 'Editor....:',
        theme: 'Theme.....:',
        languages: 'Languages.:'
      },
      contactHint: 'Or scroll down to the contact form. It lands straight in my inbox.',
      cvDownloading: 'Downloading CV_nicklas_vedeby.pdf ...',
      catUsage: 'usage: cat <file>. Run ls to see what is here.',
      secrets: 'cat: .secrets: permission denied (nice try though)',
      isDirectory: 'cat: {name}: is a directory. Try: projects',
      noSuchFile: 'cat: {name}: no such file or directory',
      gotoUsage: 'usage: goto <section>. Try: about, experience, skills, projects, contact',
      noSuchSection: 'goto: {name}: no such section',
      jumping: 'Jumping to {name} ...',
      themeUsage: 'usage: theme dark | theme light',
      themeSet: 'Theme set to {name}.',
      langCurrent: 'Current language: {name}. Usage: lang da | lang en',
      langUsage: 'usage: lang da | lang en',
      langSet: 'Language set to {name}.',
      launchingArcade: 'Opening the arcade. Three games in there:',
      launchingGame: 'Booting {name} ...',
      noSuchGame: 'play: {name}: no such game. Run play on its own to see the list.',
      paletteOpened: 'Command palette opened. Try typing a section name.',
      historyEmpty: 'No commands in history yet.',
      exit: "There is no exit. But there is a contact form, so try 'goto contact'.",
      sudoDenied: "visitor is not in the sudoers file. This incident will be reported. (try: sudo hire-me)",
      noSkillCategory: 'skills: {name}: no such category',
      hire: {
        granted: '[sudo] password for visitor: ******  ✓ access granted',
        body: 'Excellent choice. I am a fullstack developer who likes shipping clean, fast interfaces and the backends behind them, and I learn new stacks quickly.'
      }
    },
    palette: {
      label: 'Command palette',
      openLabel: 'Open command palette',
      placeholder: 'Jump to a section, switch theme, download CV ...',
      empty: 'No matching commands.',
      footerNavigate: 'navigate',
      footerSelect: 'select',
      footerClose: 'close',
      groups: {
        navigate: 'Navigate',
        actions: 'Actions',
        links: 'Links'
      },
      actions: {
        darkMode: 'Switch to dark mode',
        lightMode: 'Switch to light mode',
        switchToDanish: 'Switch language to Danish',
        switchToEnglish: 'Switch language to English',
        downloadCv: 'Download CV (PDF)',
        arcade: 'Open the arcade',
        sendEmail: 'Send me an email'
      }
    },
    decisions: {
      title: 'Engineering Decisions',
      subtitle: 'A portfolio is easy to make look finished. These are the calls behind this one: the constraint, what I chose, and what it cost me.',
      labels: {
        context: 'Constraint',
        decision: 'Decision',
        tradeoff: 'Trade-off'
      },
      records: [
        {
          title: 'A working contact form with no server to run',
          context: 'I had the form working against my own Express and Nodemailer backend. Then I checked the hosting properly: the plan serves static files over FTP and will not run Node without moving to a more expensive tier.',
          decision: 'I deleted the backend and moved the form to a client-side form API. The submit handler posts straight from the browser, and the mail still lands in my inbox.',
          tradeoff: 'I gave up control of the mail templating and took on a third-party dependency. In exchange the feature shipped on hosting I already pay for, with no server to patch, monitor or keep alive.',
          tags: ['Node.js', 'Express', 'Nodemailer', 'Web3Forms']
        },
        {
          title: 'Deploying to shared hosting from CI',
          context: 'The host gives me FTP and nothing else: no containers, no build step on the server, no deploy hooks.',
          decision: 'A GitHub Actions workflow builds the site and uploads dist/ over FTP, triggered by pushing a semver tag rather than by every commit to main.',
          tradeoff: 'No preview environments and no one-click rollback. But releases are deliberate and versioned: main can move freely, and only a tag ships.',
          tags: ['GitHub Actions', 'CI/CD', 'FTP', 'SemVer']
        },
        {
          title: 'Two languages without an i18n library',
          context: 'The whole site has to exist in Danish and English, including anything I add to it later.',
          decision: 'One reactive translation store in a composable. Components never hold copy; they read it from t, and the language toggle swaps the object underneath them.',
          tradeoff: 'No pluralisation or locale-aware formatting for free, and all copy lives in one large file. The upside is no dependency, no bundle cost, and every feature bilingual by construction, including the terminal on the front page.',
          tags: ['Vue 3', 'Composition API', 'i18n']
        },
        {
          title: 'Fixing the jank instead of adding more polish',
          context: 'The page felt heavy to scroll and it was not obvious why.',
          decision: 'Three real causes: a fixed-attachment background repainting the full page on every scroll frame, ~30 skill bars animating width and so forcing layout every frame, and decorative animations running for the entire visit. The bars moved to transform, the fixed attachment went, and the decoration now sits behind prefers-reduced-motion.',
          tradeoff: 'The background no longer parallaxes, and viewers who ask for reduced motion get a calmer page than I originally designed. Both were worth losing.',
          tags: ['Performance', 'Rendering', 'Accessibility']
        }
      ]
    },
    arcade: {
      eyebrow: 'Arcade',
      title: 'The Arcade',
      subtitle: 'Three small games, all written from scratch: no game engine, no image files, no dependencies. Pick one and lose a few minutes.',
      back: 'Back to the portfolio',
      backToArcade: 'Back to the arcade',
      play: 'Play',
      score: 'Score',
      best: 'Best',
      wave: 'Wave',
      health: 'Health',
      newBest: 'New personal best!',
      start: 'Start game',
      resume: 'Resume',
      again: 'Play again',
      pausedTitle: 'Paused',
      pausedBody: 'Take your time.',
      overTitle: 'Game over',
      controls: {
        pause: 'Pause'
      },
      games: {
        bugHunt: {
          name: 'Bug Hunt',
          tagline: 'A top-down shooter. Bugs close in from every edge, so squash them before they reach you.',
          builtWith: 'Canvas 2D · sprites drawn from text maps · rendered at 480×320 and scaled up.'
        },
        stackOverflow: {
          name: 'Stack Overflow',
          tagline: 'Falling blocks. Clear lines, survive the rising speed, and do not let the stack overflow.',
          builtWith: 'Canvas 2D · 7-bag randomiser · wall kicks, ghost piece, hold slot and a gravity curve.'
        },
        mergeSort: {
          name: 'Merge Sort',
          tagline: 'Slide tiles, merge matching pairs, chase 2048. Easy to start, hard to put down.',
          builtWith: 'No canvas here. Reactive DOM with CSS transforms, so tiles keep their identity and slide.'
        }
      },
      bugHunt: {
        canvasLabel: 'Bug Hunt game area',
        readyTitle: 'Bug Hunt',
        readyBody: 'The bugs are coming for you. Squash them before they reach you.',
        overBody: 'You made it to wave {wave}.',
        touchHint: 'On a touch screen: drag to move, and you fire automatically.',
        controls: {
          move: 'Move',
          aim: 'Aim',
          shoot: 'Shoot',
          mouseKey: 'Mouse',
          clickKey: 'Click'
        }
      },
      stackOverflow: {
        title: 'Stack Overflow',
        readyBody: 'Clear lines to score. Every ten lines the gravity gets meaner.',
        overBody: 'The stack overflowed.',
        canvasLabel: 'Stack Overflow playing field',
        lines: 'Lines',
        level: 'Level',
        next: 'Next',
        hold: 'Hold',
        controls: {
          move: 'Move',
          rotate: 'Rotate',
          soft: 'Soft drop',
          hard: 'Hard drop',
          hold: 'Hold piece'
        }
      },
      mergeSort: {
        boardLabel: 'Merge Sort board',
        undo: 'Undo',
        newGame: 'New game',
        hint: 'Arrow keys or WASD to slide. On touch, swipe. Equal tiles merge into their sum.',
        wonTitle: 'You hit 2048',
        wonBody: 'That is the target. You can stop here or keep merging for a bigger score.',
        lostBody: 'No moves left. The board is full and nothing else can merge.',
        keepGoing: 'Keep going'
      }
    },
    seo: {
      home: {
        title: 'Nicklas Vedeby | Fullstack Developer',
        description: 'Fullstack developer in Greater Copenhagen. Experienced with Vue, Nuxt, TypeScript, Python and SQL. See my projects and references, and get in touch.'
      },
      arcade: {
        title: 'Arcade | Nicklas Vedeby',
        description: 'Three browser games written from scratch in Vue: a pixel shooter, a falling-block puzzle and a sliding-tile puzzle. No game engine, no image files.'
      },
      notFound: {
        title: 'Page not found | Nicklas Vedeby',
        description: 'That page does not exist. Head back to the front page for projects, experience and contact details.'
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
      workExperience: 'Erfaring',
      references: 'Referencer',
      skills: 'Kompetencer',
      education: 'Uddannelse',
      projects: 'Projekter',
      contact: 'Kontakt',
      cv: 'Download CV'
    },
    hero: {
      eyebrow: 'Fullstackudvikler',
      title: 'Jeg bygger <span class="highlight">moderne</span> webløsninger',
      subtitle: 'Jeg bruger dataindsigt og moderne frontend-teknologier til at skabe brugervenlige og hurtige weboplevelser.',
      primaryCta: 'Se mine projekter',
      secondaryCta: 'Lad os tage en snak',
      stats: [
        { value: '3+', label: 'Års erfaring med data og web' },
        { value: '3', label: 'Leveret projekter og initiativer' },
        { value: '4', label: 'Sprog jeg arbejder i' }
      ]
    },
    about: {
      title: 'Om Mig',
      lead: 'Velkommen til mit portfolio! Jeg er en passioneret <strong>Fullstackudvikler</strong>, der elsker at bygge smukke, funktionelle weboplevelser - fra frontend og hele vejen igennem backend.',
      text1: 'Jeg startede min rejse inden for datateknologi omkring 2020 og afsluttede min datatekniker uddannelse med speciale i programmering i maj 2025. Som elev og senere udvikler hos Samlino har jeg siddet med Nuxt og Storyblok CMS i frontend, og arbejdet med Python i backend. Jeg har også selv lavet en side fra bunden med Angular og en C# API-backend.',
      text2: 'Jeg er altid klar på at lære nye måder at webudvikle på, uanset om det er styling og udseende i frontend, eller at dykke dybere ned i databaser og backend-arkitektur. Jeg går til hvert projekt med opmærksomhed på detaljer og en oprigtig lyst til at finde den bedst mulige løsning.',
      downloadLabel: 'Hvis du vil have en PDF af mit CV, ',
      downloadCta: 'kan du hente det her',
      imageAlt: 'Portræt af Nicklas Vedeby, fullstackudvikler',
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
          startDate: 'Sep. 2026',
          endDate: null,
          title: 'Fullstack Udvikler',
          company: 'Tribe Happiness',
          description: 'Jeg arbejder som fullstack udvikler hos Tribe Happiness, hvor jeg både bygger og vedligeholder frontend og backend, fra UI-komponenter og styling til API\'er, backend-logik og data.'
        },
        {
          startDate: 'Apr. 2026',
          endDate: 'Aug. 2026',
          title: 'Junior Produkt Udvikler',
          company: 'Sophisticated GEEK',
          description: 'Jeg arbejdede med produktudvikling og konceptudvikling. Jeg hjalp også med at holde hjemmesider vedlige, som kørte på Shopify.'
        },
        {
          startDate: 'Jun. 2025',
          endDate: 'Nov. 2025',
          title: 'Junior Udvikler',
          company: 'Samlino.dk',
          description: 'Jeg arbejdede i denne periode mest frontend-fokuseret. Jeg sad med en del af de forskellige komponenter, både med at få dem streamlinet, men også opdateret til at passe til vores CMS-system.'
        },
        {
          startDate: 'Feb. 2024',
          endDate: 'Maj 2025',
          title: 'Datatekniker Elev',
          company: 'Samlino.dk',
          description: 'Her færdiggjorde jeg min uddannelse indenfor Datatekniker med speciale i programmering. Jeg har været igennem sprog som Java, JavaScript, TypeScript, HTML, CSS og Python, og arbejdet med frameworks som Angular og Nuxt.'
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
    references: {
      title: 'Referencer',
      subtitle: 'Hvad tidligere kolleger siger om at arbejde med mig',
      contactLabels: {
        email: 'E-mail',
        phone: 'Telefon'
      },
      items: [
        {
          quote: 'Nicklas favner bredt og har taget imod samtlige opgavetyper med positiv og løsningsorienteret attitude, hvilket har gjort, at han tydeligt har udviklet sig som udvikler. Jeg giver derfor Nicklas min klare anbefaling og ville ønske, vi kunne have beholdt ham i virksomheden.',
          name: 'Martin Fjordvald',
          role: 'Group CTO, Samlino Group',
          contact: {
            email: 'martin@samlinogroup.com',
            phone: '+351910092830'
          },
          document: {
            href: martinRecommendationPdf,
            label: 'Læs anbefalingen (PDF)'
          },
          date: '19. november 2025'
        }
      ],
      otherTitle: 'Andre kollegers referencer',
      others: [
        {
          name: 'Jeppe T. Poulsen',
          role: 'Head of Analytics, Samlino.dk',
          email: 'jeppe.poulsen@samlino.dk'
        },
        {
          name: 'Kenneth Berle',
          role: 'Fullstack Developer at Samlino.dk, CEO of Fenrir Games Studios',
          email: 'light@fenrirgamestudio.dk',
          phone: '+4540711759',
          personalEmail: 'kenneth@berle.eu',
          linkedin: 'https://www.linkedin.com/in/kennethberle/'
        }
      ]
    },
    skills: {
      title: 'Kompetencer',
      subtitle: 'Grupperet efter hvor mange rigtige kilometer jeg har på hver enkelt, i stedet for en procent jeg selv har fundet på.',
      groups: [
        {
          title: 'I produktion',
          description: 'Brugt på arbejde der er gået live, og som jeg har vedligeholdt bagefter.',
          items: ['Vue.js', 'Nuxt', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SCSS', 'Python', 'SQL', 'REST APIs', 'Storyblok CMS', 'Shopify', 'Git', 'UI/UX']
        },
        {
          title: 'Bygget med',
          description: 'Brugt til at bygge og gøre mine egne projekter og skoleprojekter færdige.',
          items: ['Angular', 'C#', '.NET', 'Node.js', 'Vite', 'Discord.js', 'Docker', 'ETL-pipelines', 'Database tuning']
        },
        {
          title: 'Under oplæring',
          description: 'Det jeg sidder med lige nu, og stadig er i gang med at lære.',
          items: ['AWS', 'Automatiseret test', 'PRINCE2']
        },
        {
          title: 'Sprog',
          description: 'Skriftligt og mundtligt.',
          items: ['Dansk (modersmål)', 'Engelsk (professionelt niveau)']
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
    terminal: {
      title: 'Terminal',
      subtitle: 'Foretrækker du tastaturet? Dette portfolio har sin egen shell. Skriv en kommando, tryk Enter, og udforsk mit CV på udvikler-manér.',
      windowTitle: 'nicklas@portfolio: ~',
      clearLabel: 'Ryd terminal',
      inputLabel: 'Terminal kommandofelt',
      tryLabel: 'Prøv:',
      boot: [
        'nv-sh 2.0.0 (portfolio build 2026.09)',
        'Indlæser moduler: vue@3 · vite@5 · scss ............... ok',
        'Monterer /home/visitor/nicklas-vedeby ................. ok',
        "Klar. Skriv 'help' for at se hvad jeg kan."
      ],
      help: {
        title: 'Tilgængelige kommandoer:',
        footer: 'Tip: ↑/↓ går gennem din historik, Tab autoudfylder, Ctrl+L rydder, Ctrl+K åbner kommandopaletten.'
      },
      commands: {
        help: 'Vis denne liste af kommandoer',
        whoami: 'Hvem jeg er, kort fortalt',
        experience: 'Min joberfaring',
        skills: 'Hvad jeg arbejder med, grupperet efter erfaring',
        projects: 'Ting jeg har bygget',
        education: 'Min uddannelse',
        decisions: 'Tekniske valg jeg har truffet, og afvejningerne',
        contact: 'Sådan får du fat i mig',
        cv: 'Hent mit CV som PDF',
        neofetch: 'System-info, udvikler-stil',
        ls: 'Vis filerne i denne mappe',
        cat: 'Læs en fil (prøv: cat about.md)',
        goto: 'Hop til en sektion (prøv: goto projects)',
        theme: 'Skift tema (theme dark | theme light)',
        lang: 'Skift sprog (lang da | lang en)',
        play: 'Åbn arkaden (prøv: play stack-overflow)',
        palette: 'Åbn kommandopaletten',
        echo: 'Skriv en tekst tilbage',
        history: 'Vis de kommandoer du har kørt',
        date: 'Vis dato og klokkeslæt',
        clear: 'Ryd skærmen',
        'sudo hire-me': 'Den vigtigste kommando'
      },
      unknown: "kommando ikke fundet: {cmd}. Skriv 'help' for listen.",
      uptime: '{years} år, {months} måneder (siden marts 2020)',
      neofetch: {
        host: 'Host......:',
        role: 'Rolle.....:',
        company: 'Firma.....:',
        location: 'Lokation..:',
        uptime: 'Oppetid...:',
        shell: 'Shell.....:',
        stack: 'Stack.....:',
        editor: 'Editor....:',
        theme: 'Tema......:',
        languages: 'Sprog.....:'
      },
      contactHint: 'Eller scroll ned til kontaktformularen. Den lander direkte i min indbakke.',
      cvDownloading: 'Henter CV_nicklas_vedeby.pdf ...',
      catUsage: 'brug: cat <fil>. Kør ls for at se hvad der er her.',
      secrets: 'cat: .secrets: adgang nægtet (godt forsøgt)',
      isDirectory: 'cat: {name}: er en mappe. Prøv: projects',
      noSuchFile: 'cat: {name}: ingen sådan fil eller mappe',
      gotoUsage: 'brug: goto <sektion>. Prøv: about, experience, skills, projects, contact',
      noSuchSection: 'goto: {name}: ingen sådan sektion',
      jumping: 'Hopper til {name} ...',
      themeUsage: 'brug: theme dark | theme light',
      themeSet: 'Tema sat til {name}.',
      langCurrent: 'Nuværende sprog: {name}. Brug: lang da | lang en',
      langUsage: 'brug: lang da | lang en',
      langSet: 'Sprog sat til {name}.',
      launchingArcade: 'Åbner arkaden. Tre spil derinde:',
      launchingGame: 'Starter {name} ...',
      noSuchGame: 'play: {name}: intet spil med det navn. Kør play alene for at se listen.',
      paletteOpened: 'Kommandopaletten er åben. Prøv at skrive et sektionsnavn.',
      historyEmpty: 'Ingen kommandoer i historikken endnu.',
      exit: "Der er ingen udgang. Men der er en kontaktformular, så prøv 'goto contact'.",
      sudoDenied: 'visitor er ikke i sudoers-filen. Hændelsen bliver rapporteret. (prøv: sudo hire-me)',
      noSkillCategory: 'skills: {name}: ingen sådan kategori',
      hire: {
        granted: '[sudo] adgangskode for visitor: ******  ✓ adgang godkendt',
        body: 'Fremragende valg. Jeg er fullstack udvikler og kan lide at levere rene, hurtige brugerflader, og de backends der ligger bag. Og jeg lærer nye stacks hurtigt.'
      }
    },
    palette: {
      label: 'Kommandopalet',
      openLabel: 'Åbn kommandopalet',
      placeholder: 'Hop til en sektion, skift tema, hent CV ...',
      empty: 'Ingen kommandoer matcher.',
      footerNavigate: 'naviger',
      footerSelect: 'vælg',
      footerClose: 'luk',
      groups: {
        navigate: 'Naviger',
        actions: 'Handlinger',
        links: 'Links'
      },
      actions: {
        darkMode: 'Skift til mørkt tema',
        lightMode: 'Skift til lyst tema',
        switchToDanish: 'Skift sprog til dansk',
        switchToEnglish: 'Skift sprog til engelsk',
        downloadCv: 'Hent CV (PDF)',
        arcade: 'Åbn arkaden',
        sendEmail: 'Send mig en mail'
      }
    },
    decisions: {
      title: 'Tekniske valg',
      subtitle: 'Det er nemt at få et portfolio til at se færdigt ud. Her er valgene bag dette: begrænsningen, hvad jeg valgte, og hvad det kostede.',
      labels: {
        context: 'Begrænsning',
        decision: 'Valg',
        tradeoff: 'Afvejning'
      },
      records: [
        {
          title: 'En kontaktformular der virker, uden en server at drive',
          context: 'Jeg havde formularen kørende mod min egen Express- og Nodemailer-backend. Så kiggede jeg ordentligt på hostingen: planen serverer statiske filer over FTP og kører ikke Node uden at skifte til en dyrere pakke.',
          decision: 'Jeg slettede backenden og flyttede formularen til et client-side form-API. Submit-handleren poster direkte fra browseren, og mailen lander stadig i min indbakke.',
          tradeoff: 'Jeg gav kontrollen over mail-templating fra mig og tog en tredjeparts-afhængighed ind. Til gengæld kom funktionen live på den hosting jeg allerede betaler for, uden en server der skal patches, overvåges og holdes i live.',
          tags: ['Node.js', 'Express', 'Nodemailer', 'Web3Forms']
        },
        {
          title: 'Deployment til shared hosting fra CI',
          context: 'Hosten giver mig FTP og ikke andet: ingen containere, intet build-step på serveren, ingen deploy hooks.',
          decision: 'Et GitHub Actions-workflow bygger siden og uploader dist/ over FTP, udløst af et semver-tag frem for hvert commit på main.',
          tradeoff: 'Ingen preview-miljøer og ingen rollback med ét klik. Til gengæld er releases bevidste og versionerede: main må gerne bevæge sig, og kun et tag går live.',
          tags: ['GitHub Actions', 'CI/CD', 'FTP', 'SemVer']
        },
        {
          title: 'To sprog uden et i18n-bibliotek',
          context: 'Hele siden skal findes på dansk og engelsk, også alt det jeg tilføjer senere.',
          decision: 'Ét reaktivt oversættelses-store i en composable. Komponenterne indeholder aldrig tekst; de læser den fra t, og sprogskifteren bytter objektet ud under dem.',
          tradeoff: 'Ingen gratis pluralisering eller lokal formatering, og al tekst ligger i én stor fil. Til gengæld ingen afhængighed, ingen bundle-omkostning, og hver ny funktion er tosproget by design, også terminalen på forsiden.',
          tags: ['Vue 3', 'Composition API', 'i18n']
        },
        {
          title: 'At fjerne hakkene i stedet for at pynte mere',
          context: 'Siden føltes tung at scrolle, og det var ikke tydeligt hvorfor.',
          decision: 'Tre reelle årsager: en fixed baggrund der gentegnede hele siden ved hver scroll-frame, ~30 kompetence-bars der animerede width og dermed tvang layout hver frame, og dekorative animationer der kørte hele besøget. Bar’erne bruger nu transform, den fixed baggrund er væk, og dekorationen ligger bag prefers-reduced-motion.',
          tradeoff: 'Baggrunden parallakser ikke længere, og besøgende der beder om mindre bevægelse får en roligere side end den jeg oprindeligt designede. Begge dele var det værd.',
          tags: ['Performance', 'Rendering', 'Tilgængelighed']
        }
      ]
    },
    arcade: {
      eyebrow: 'Arkade',
      title: 'Arkaden',
      subtitle: 'Tre små spil, alle skrevet fra bunden: ingen game engine, ingen billedfiler, ingen afhængigheder. Vælg et og brug et par minutter.',
      back: 'Tilbage til portfolioet',
      backToArcade: 'Tilbage til arkaden',
      play: 'Spil',
      score: 'Score',
      best: 'Bedste',
      wave: 'Bølge',
      health: 'Liv',
      newBest: 'Ny personlig rekord!',
      start: 'Start spillet',
      resume: 'Fortsæt',
      again: 'Spil igen',
      pausedTitle: 'På pause',
      pausedBody: 'Tag dig bare god tid.',
      overTitle: 'Game over',
      controls: {
        pause: 'Pause'
      },
      games: {
        bugHunt: {
          name: 'Bug Hunt',
          tagline: 'En top-down shooter. Bug’s kommer ind fra alle kanter, så klem dem, før de når frem.',
          builtWith: 'Canvas 2D · sprites tegnet ud fra tekstkort · renderet i 480×320 og skaleret op.'
        },
        stackOverflow: {
          name: 'Stack Overflow',
          tagline: 'Faldende klodser. Ryd linjer, overlev den stigende fart, og lad ikke stakken løbe over.',
          builtWith: 'Canvas 2D · 7-bag randomizer · wall kicks, ghost-brik, hold-plads og en tyngdekurve.'
        },
        mergeSort: {
          name: 'Merge Sort',
          tagline: 'Skub brikker, flet ens par sammen, jagt 2048. Nemt at gå i gang med, svært at lægge fra sig.',
          builtWith: 'Ingen canvas her. Reaktivt DOM med CSS-transforms, så brikkerne beholder deres identitet og glider.'
        }
      },
      bugHunt: {
        canvasLabel: 'Bug Hunt spilleområde',
        readyTitle: 'Bug Hunt',
        readyBody: 'Bug’sene er på vej mod dig. Klem dem, før de når frem.',
        overBody: 'Du nåede til bølge {wave}.',
        touchHint: 'På touchskærm: træk for at bevæge dig, og du skyder automatisk.',
        controls: {
          move: 'Bevæg dig',
          aim: 'Sigt',
          shoot: 'Skyd',
          mouseKey: 'Mus',
          clickKey: 'Klik'
        }
      },
      stackOverflow: {
        title: 'Stack Overflow',
        readyBody: 'Ryd linjer for at score. For hver ti linjer bliver tyngdekraften hårdere.',
        overBody: 'Stakken løb over.',
        canvasLabel: 'Stack Overflow spillebræt',
        lines: 'Linjer',
        level: 'Niveau',
        next: 'Næste',
        hold: 'Hold',
        controls: {
          move: 'Flyt',
          rotate: 'Rotér',
          soft: 'Blødt fald',
          hard: 'Hårdt fald',
          hold: 'Gem brik'
        }
      },
      mergeSort: {
        boardLabel: 'Merge Sort bræt',
        undo: 'Fortryd',
        newGame: 'Nyt spil',
        hint: 'Piletaster eller WASD for at skubbe. På touch: swipe. Ens brikker flettes til deres sum.',
        wonTitle: 'Du ramte 2048',
        wonBody: 'Det var målet. Du kan stoppe her eller blive ved med at flette for en større score.',
        lostBody: 'Ingen træk tilbage. Brættet er fyldt, og intet kan flettes.',
        keepGoing: 'Spil videre'
      }
    },
    seo: {
      home: {
        title: 'Nicklas Vedeby | Fullstack Udvikler',
        description: 'Fullstack udvikler i Storkøbenhavn. Erfaring med Vue, Nuxt, TypeScript, Python og SQL. Se mine projekter og referencer, og skriv hvis du søger en udvikler.'
      },
      arcade: {
        title: 'Arkade | Nicklas Vedeby',
        description: 'Tre browserspil skrevet fra bunden i Vue: en pixel-shooter, et puslespil med faldende klodser og et med glidende brikker. Ingen game engine, ingen billedfiler.'
      },
      notFound: {
        title: 'Siden blev ikke fundet | Nicklas Vedeby',
        description: 'Siden findes ikke. Gå tilbage til forsiden for projekter, erfaring og kontaktoplysninger.'
      }
    },
    footer: {
      rights: 'Alle rettigheder forbeholdes.',
      downloadCv: 'Download CV'
    }
  }
}

// Title and description come from the translations, so the tags a crawler
// renders always match the language the page is actually showing. Routes say
// which entry they want via meta.seoKey.
export const applyRouteSEO = (meta = {}, url) => {
  if (typeof window === 'undefined') {
    return
  }

  const copy = translations[currentLanguage.value]
  const routeSeo = copy?.seo?.[meta.seoKey] ?? {}

  updateSEO({
    ...meta,
    ...routeSeo,
    locale: currentLanguage.value === 'en' ? 'en_US' : 'da_DK',
    url: url ?? window.location.href
  })
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
        applyRouteSEO(router?.currentRoute?.value?.meta ?? {})
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

  applyRouteSEO(router?.currentRoute?.value?.meta ?? {})

  return {
    language,
    t,
    setLanguage,
    toggleLanguage
  }
}

