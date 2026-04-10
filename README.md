# 🚀 Interactive AI Portfolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzaryif%2FInteractive-Portfolio-website)

**Live Demo:** [https://www.mdzarifazfar.me](https://www.mdzarifazfar.me)

An interactive, AI-powered portfolio template crafted with React, TypeScript, Tailwind CSS, and the Google Gemini API. This portfolio transcends a static resume, offering a dynamic "AI Playground" where guests can interact with specialized AI tools to see your capabilities firsthand.

## ✨ Features

- **🧠 AI Playground**: Includes an AI Chatbot, Image Generator, Problem Solver, Payload Analyzer, and more.
- **🎨 Modern Design**: Built with Tailwind CSS, supporting dark/light mode and engaging micro-animations.
- **📱 Fully Responsive**: Delivers an optimal experience across desktop, tablet, and mobile devices.
- **⚡ Fast & Lightweight**: Developed with Vite for lightning-fast build times.
- **📄 Extensible**: Driven entirely by a single data file (`portfolio-data.json`), making it incredibly easy to customize.

---

## 📁 Project Structure

Here's a brief overview of the project's directory structure to help you navigate:

- `portfolio-data.json`: The single source of truth for all your personal data (resume, projects, timeline).
- `types.ts`: TypeScript interfaces ensuring data consistency across the app.
- `/components`: Reusable UI building blocks (e.g., Headers, Modals, specific resume sections).
- `/features`: Larger, self-contained views representing primary tabs and interactive AI tools (e.g., Resume, AI Playgrounds, Contact).
- `/services`: Abstractions for external API communications, like `geminiService.ts` for Google AI Studio.
- `App.tsx` & `index.tsx`: Main React application entry points containing layout and routing.
- `.github/workflows/`: Contains the CI/CD pipeline for GitHub Pages automated deployment.

---
## 🛠️ Getting Started 

Want to use this portfolio for yourself? Follow these simple steps!

### 1. Prerequisite Checklist

- **Node.js** (v18 or higher) installed on your machine.
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### 2. Customizing with Your Data

All your personal details, projects, education, and links are managed in a single file. You never need to touch the actual UI code to update your resume!

1. Open `portfolio-data.json`.
2. Replace the placeholder data with your own information:
   - `name`, `summary`, and `contact` information.
   - `resumePdfUrl`: Upload your resume as a PDF to Google Drive. Change the sharing permissions to **"Anyone with the link can view"**, and paste the link here.
   - Fill in your `projects`, `education`, and `activities`.

### 3. Setting Up Your GitHub Feed

To display your live GitHub repositories in the "Projects" tab:
1. Open `features/Projects.tsx`.
2. Locate `<GitHubProjects username="zaryif" />` and replace `"zaryif"` with your own GitHub username.

### 4. Setting up the Contact Form

If you want the "Contact" tab to send emails directly to you:
1. Open `features/Contact.tsx`.
2. Find the form endpoint URL (`https://formsubmit.co/ajax/your_email@gmail.com`) and replace the email address with your own using [FormSubmit](https://formsubmit.co/).

---

## 💻 Running the App Locally

1. Clone the repository and install the dependencies:
   ```bash
   npm install
   ```
2. Create a file named `.env.local` in the root directory.
3. Add your Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY=your_gen_ai_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment Options

You can host this project on any modern static file hosting provider effortlessly.

### Option 1: GitHub Pages (Easiest)

This repository includes a built-in automated workflow to deploy to GitHub Pages.

1. Go to your GitHub repository **Settings** -> **Pages**.
2. Under "Build and deployment", change the **Source** to **GitHub Actions**.
3. Next, navigate to your repository's **Settings** -> **Secrets and variables** -> **Actions**.
4. Click **New repository secret** to create a secret named `GEMINI_API_KEY` and paste your API key as the value.
5. Push any changes to the `main` branch, and the build will automatically compile and deploy your code to your `<username>.github.io` domain!

> **Note**: To utilize a custom domain like `www.yourdomain.com`, update the `public/CNAME` file to include your domain before you push the changes.

### Option 2: Vercel / Netlify

Given this is a standard Vite built React application, deploying it on Vercel or Netlify is straightforward:
1. Import your repository into the Vercel or Netlify dashboard.
2. In the "Environment Variables" section of your host configuration, add a new variable named `GEMINI_API_KEY` and set your API key as the value.
3. Keep the default build command (`npm run build`) and output directory (`dist`), and hit Deploy!

---

*Architected and developed by Zaryif. Enjoy showcasing your work!*
