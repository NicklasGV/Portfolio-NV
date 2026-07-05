# Portfolio-NV  
A clean and responsive personal portfolio built with Vue.js and Vite.

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Hostinger](https://img.shields.io/badge/hostinger-%23673DE6.svg?style=for-the-badge&logo=hostinger&logoColor=white)
<br>
![CI](https://github.com/NicklasGV/Portfolio-NV/actions/workflows/deploy.yml/badge.svg)
![Last Commit](https://img.shields.io/github/last-commit/NicklasGV/Portfolio-NV.svg)

---

## Overview  
Portfolio-NV is a portfolio site designed to present my experience as a **Fullstack Developer**. The project focuses on clean design, performance, accessibility, and responsiveness across all devices.

The site includes dedicated sections for skills, education, projects, and direct contact, providing a clear and structured overview of my background and technical capabilities.

---

## Features  
- Modern and minimal user interface  
- Fully responsive layout  
- Gradient-based visual theme  
- Skills visualization and categorization  
- Education and certification timeline  
- Project showcase with descriptions  
- Integrated contact section  

---

## Tech Stack  
- **Vue.js 3** – Component-driven front-end framework  
- **Vite** – Fast development server and bundler  
- **JavaScript (ES6+)**  
- **CSS3** – Custom styling, layout, and animations  

---

## Getting Started  

### Prerequisites  
- Node.js 16 or higher  
- npm or yarn  

### Installation  
```bash
npm install
```

### Development server  
```bash
npm run dev
```

### Production build  
```bash
npm run build
```

### Preview production build  
```bash
npm run preview
```

---

## Purpose  
This project serves as both a professional portfolio and a demonstration of my front-end development skills. It reflects my experience working with modern web technologies and building clean, maintainable interfaces.

---

## Contact  
- Website: https://nicklasvedeby.com
- Gmail: nvedeby@gmail.com
- LinkedIn: [Nicklas Vedeby](https://www.linkedin.com/in/nicklas-vedeby-3155351b7/)

---

## Deployment

This project uses **GitHub Actions** to automatically deploy tagged releases.

### Creating a deployment

1. Commit and push your changes to the desired branch.
2. Create a new Git tag following semantic versioning:

```bash
git tag v1.0.0
```

3. Push the tag to GitHub:

```bash
git push origin v1.0.0
```

Once the tag is pushed, the GitHub Actions deployment workflow will automatically build and deploy the application.

### Updating an existing tag

If you need to redeploy using the same tag (not recommended for releases), delete the local and remote tag first:

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

Then recreate and push it:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Recommended versioning

Use Semantic Versioning (SemVer):

- `v1.0.0` – Major release
- `v1.1.0` – New features
- `v1.1.1` – Bug fixes

---

## License  
This project is open-source and available for personal use.
