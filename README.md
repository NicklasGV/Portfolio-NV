# Portfolio Site

A modern, responsive portfolio website showcasing my journey as a Data Technician and Web Developer, built with Vue.js 3 and Vite.

## Features

- ✨ Modern, beautiful UI with smooth animations
- 📱 Fully responsive design for all devices
- 🎨 Gradient-based color scheme
- 📊 Skills visualization with progress bars
- 📅 Education timeline
- 💼 Projects showcase
- 📧 Contact form

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

- Edit `src/components/About.vue` to update your introduction
- Modify `src/components/EducationTimeline.vue` to reflect your education journey
- Update `src/components/Skills.vue` to showcase your skills
- Add your projects in `src/components/Projects.vue`
- Update contact information in `src/components/Contact.vue`

### Styling

The color scheme uses a purple gradient. To change it, update the gradient values in:
- `src/App.vue` (background)
- Component files (buttons, cards, etc.)

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── About.vue
│   │   ├── EducationTimeline.vue
│   │   ├── Skills.vue
│   │   ├── Projects.vue
│   │   ├── Contact.vue
│   │   └── Footer.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## License

This project is open source and available for personal use.

