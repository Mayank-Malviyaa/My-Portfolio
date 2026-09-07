# Mayank Malviya — Full Stack Developer Portfolio

A modern, cinematic portfolio showcasing full-stack web applications, clean architecture, and disciplined engineering.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, GSAP (ScrollTrigger), Lucide React, Vanilla CSS
- **Backend**: Node.js, Express, Nodemailer, express-rate-limit, CORS, dotenv
- **Database**: None required for the portfolio website (stateless contact endpoint)
- **Deployment**: Netlify / Vercel (Frontend) + Render / Railway (Backend)

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development
Run the frontend (Vite dev server) and backend (Express server):

- **Frontend**:
  ```bash
  npm run dev
  ```
  Runs at [http://localhost:5173](http://localhost:5173). Requests to `/api/*` are proxied to the backend at port 5000.

- **Backend**:
  ```bash
  npm run server
  ```
  Runs at [http://localhost:5000](http://localhost:5000).

---

## ⚙️ Environment Variables

### Backend Configuration (`.env`)
Create a `.env` file in the project root based on `.env.example`:

```env
# Server Port (automatically set by hosting platforms like Render)
PORT=5000

# Allowed Frontend Origins for CORS (comma-separated for multiple domains)
ALLOWED_ORIGIN=http://localhost:5173,https://your-portfolio.netlify.app

# Email Delivery Configuration (Nodemailer / Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=mayank.bhadauns@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
EMAIL_TO=mayank.bhadauns@gmail.com
```

> 🔒 **Security Notice**: `.env` is ignored by Git (`.gitignore`). Never commit real credentials, passwords, or SMTP secrets to source control.

### Frontend Configuration (`VITE_API_URL`)
- **Local Development**: Leave unset. Vite automatically proxies `/api` requests to `http://localhost:5000`.
- **Production Deployment**: If the backend is hosted on a separate URL (e.g. Render), set:
  ```env
  VITE_API_URL=https://your-portfolio-backend.onrender.com
  ```
  in your Netlify / Vercel build environment variables.

---

## 📧 Contact Form & Email Delivery

The Contact form sends submissions directly to `mayank.bhadauns@gmail.com` with a dual-layer delivery mechanism:

1. **Primary (Direct Delivery via FormSubmit)**: Delivers messages without requiring local SMTP credentials.
2. **SMTP (Nodemailer with Gmail App Password)**: When `EMAIL_USER` and `EMAIL_PASSWORD` are provided in `.env`, the server automatically delivers through authenticated Gmail SMTP.

### Setting up a Gmail App Password (Optional):
1. Enable 2-Step Verification in [Google Account Security](https://myaccount.google.com/security).
2. Go to **Security → 2-Step Verification → App passwords**.
3. Create a new App Password named `Portfolio`.
4. Copy the generated 16-character password into `EMAIL_PASSWORD` in your `.env`.

---

## 📦 Production Build & Deployment

### 1. Build the Frontend
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### 2. Preview the Production Build
```bash
npm run preview
```

### 3. Deploying to Production
- **Frontend (Netlify / Vercel)**:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com` (if backend is on a separate domain)
- **Backend (Render / Railway / Heroku)**:
  - Start command: `node server.js`
  - Environment variables: `ALLOWED_ORIGIN=https://your-frontend.netlify.app`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`

---

## 📝 Extending the Portfolio

### How to Add a Project
Open `src/data/projects.js` and add an entry:
```javascript
{
  id: 2,
  title: "Your Project Title",
  category: "Full Stack Web Application",
  description: "Accurate summary of what the application does.",
  image: "https://images.unsplash.com/...",
  technologies: ["React", "Node.js", "Express", "MongoDB"],
  github: "https://github.com/Mayank-Malviyaa/your-repo", // Hidden if empty string
  live: "https://your-live-demo.app"
}
```

### How to Add Your Resume
Place your verified PDF file at:
```
public/resume.pdf
```
The "Download Resume" button in the Hero section automatically detects `resume.pdf`. If absent, it gracefully scrolls to the Contact section so visitors can request it.

### How to Add Testimonials
When genuine recommendations or client feedback are received, add them in `src/data/testimonials.js`:
```javascript
export const testimonials = [
  {
    name: "Colleague / Client Name",
    role: "Engineering Lead",
    company: "Company Name",
    quote: "Authentic testimonial feedback.",
    avatar: "optional-avatar-url.jpg"
  }
];
```
The Testimonials section automatically renders once entries exist in this array.

---

## 🔒 Security & Architecture Standards
- **Rate Limiting**: 5 submissions per 15 minutes per IP.
- **Bot Suppression**: Hidden honeypot field prevents automated spam.
- **Input Sanitization**: Server-side HTML entity escaping blocks email injection.
- **RFC-Compliant Reply-To**: Incoming emails set the visitor's address as `Reply-To` for one-click inbox replies.
- **Zero Exposed Secrets**: No client-side API keys or passwords.
