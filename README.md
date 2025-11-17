# Portfolio Website

Welcome to my personal portfolio site—a modern, responsive showcase of my journey as a Data Technician and Web Developer.

## 🚀 About

This website is built using Vue.js 3 and Vite, and it reflects my professional path: combining data-oriented systems work with full-stack web development. It features a clean, visually engaging design, smooth animations, and a focus on usability across devices.

## ✨ Features

Modern UI with subtle, smooth animations

Fully responsive layout for desktop, tablet, and mobile

Gradient-based color scheme for a cohesive visual identity

Skills section with progress bars to visualize my competencies

Education timeline to highlight my learning journey

Projects gallery showcasing my web development work

Contact form for direct outreach

## 🛠 Tech Stack

Vue.js 3 – A progressive JavaScript framework for building UI

Vite – Fast, next-generation build tool for frontend projects

CSS3 – Modern styling: gradients, animations, and responsive design

(Optional) Backend/API for contact form (if applicable)

## 🧰 Getting Started
Prerequisites

Node.js v16 or higher

npm or yarn

Installation
npm install


Start development server:

npm run dev


If using a separate contact-form API, start it in a new terminal:

npm run server


Open your browser and navigate to:

http://localhost:5173

Build for Production
npm run build


The production-ready files will appear in the dist/ directory.
To preview the production build locally:

npm run preview

## 🔧 Customization
Update Personal Information

In src/components/About.vue: update your bio/introduction

In src/components/EducationTimeline.vue: update your education timeline entries

In src/components/Skills.vue: list and adjust your skills and progress values

In src/components/Projects.vue: add or update project entries (title, description, links)

In src/components/Contact.vue: update email or contact form handling

Styling / Theme

The site uses a purple-based gradient for its main accent colour. To change the theme:

Edit background gradient in src/App.vue

Update button/card colours in individual component styles or global CSS

## 📁 Project Structure
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

## 🎯 Why This Project

This portfolio is more than just a web project—it’s a representation of my combined expertise in data systems and web development. It acts as both a personal brand asset and a practical demonstration of my technical and design capabilities.

## 📝 License

This project is open-source and available for personal use. Feel free to fork or adapt it for your own portfolio.
