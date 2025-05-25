# 📄 Document Management System

A modern, user-friendly document management system built with Angular (frontend) and FastAPI (backend).

---

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-17+-red?logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/jk-tech-frontend.git
cd jk-tech-frontend
npm install
npm start
```

Visit [http://localhost:4200](http://localhost:4200) in your browser.

---

## ✨ Features

| Feature                    | Description                      |
| -------------------------- | -------------------------------- |
| 🔒 Authentication          | Secure login & registration      |
| 👤 Role-based Access       | Admin, Editor, Viewer roles      |
| 📁 Document Management     | Upload, edit, delete, versioning |
| 🔍 Search & Filter         | Find documents quickly           |
| 👥 User Management (Admin) | Manage users and permissions     |
| 📊 Ingestion Tracking      | Track document ingestion status  |

---

## 🛠️ Tech Stack

- **Frontend:** Angular 17+
- **Backend:** FastAPI (not included in this repo)
- **Node.js:** v18+
- **Package Manager:** npm v9+

---

## 📂 Project Structure

```
src/
├── app/
│   ├── core/           # Core services, guards, interceptors
│   ├── features/       # Feature modules (auth, documents, users, ingestions)
│   ├── shared/         # Shared components/utilities
│   └── app.module.ts   # Root module
├── assets/             # Static assets
├── environments/       # Environment configs
└── styles.css          # Global styles
```

---

## 🧑‍💻 Development

### Prerequisites

- Node.js v18 or later
- npm v9 or later
- Angular CLI v17 or later

### Scripts

- `npm start` — Start the dev server
- `npm run build` — Build for production
- `npm test` — Run unit tests

---

## 🧪 Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Coverage report:**
  ```bash
  ng test --code-coverage
  ```
  Coverage output: `coverage/`

---

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT — see the [LICENSE](LICENSE) file for details.
