import React from 'react';
import { Layers, Cpu, Bot, Palette, UserCheck } from 'lucide-react';

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="mb-12">
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-[var(--header-text)] mr-4" />
      <h3 className="text-3xl font-pixel text-[var(--text-color)]">{title}</h3>
    </div>
    <div className="prose prose-sm sm:prose-base max-w-none prose-p:text-[var(--subtle-text)] prose-strong:text-[var(--text-color)] prose-headings:text-[var(--text-color)] prose-blockquote:border-[var(--header-text)] prose-blockquote:text-[var(--subtle-text)] prose-code:text-amber-700 dark:prose-code:text-amber-400">
      {children}
    </div>
  </div>
);

const Documentation: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-pixel text-[var(--header-text)] mb-6 border-b-2 border-amber-500/10 dark:border-amber-500/10 pb-2">
        Project Documentation
      </h2>

      <Section title="Project Philosophy" icon={Layers}>
        <p>
          This portfolio was built from the ground up to be more than just a static online resume. My goal was to create a dynamic, interactive experience that provides tangible proof of my development skills. Instead of just listing technologies, I wanted to build a platform where you can see them in action.
        </p>
        <blockquote>
          The entire application, including the AI features, was architected and implemented by me, using a combination of modern front-end technologies and powerful third-party tools and APIs.
        </blockquote>
      </Section>

      <Section title="Core Architecture" icon={Cpu}>
        <p>
          The application is a performant <strong>Single Page Application (SPA)</strong> built with React. This architecture ensures a fast, fluid user experience without full page reloads.
        </p>
        <ul>
          <li><strong>Component-Based Design:</strong> The UI is broken down into reusable, modular components for maintainability and scalability.</li>
          <li><strong>Service Layer:</strong> All external API communication, especially for the AI features, is abstracted into a dedicated service layer. This keeps the UI components clean and focused on presentation.</li>
          <li><strong>Lazy Loading:</strong> Feature components are lazy-loaded to optimize the initial bundle size and improve load times. You only download the code for the feature you're currently using.</li>
        </ul>
      </Section>

      <Section title="The AI Playground: A Technical Deep Dive" icon={Bot}>
        <p>
          The 'AI Playground' is the centerpiece of this portfolio. Each tool is a custom-built feature that demonstrates my ability to integrate and orchestrate complex AI functionalities.
        </p>
        <h4 className="font-bold mt-6 mb-2">ZOSO AI (Assistant)</h4>
        <p>
          This is a custom conversational chat interface connected to a powerful large language model.
          Its intelligence is shaped by a carefully crafted <strong>system prompt</strong> that I wrote, grounding the AI in my personal portfolio data. This enables it to answer specific questions about my skills and projects accurately. For general knowledge questions, it leverages retrieval-augmented generation (RAG) principles by connecting to live search tools for up-to-date information.
        </p>
        <h4 className="font-bold mt-6 mb-2">Image & Video Generation</h4>
        <p>
          These tools interface with advanced generative models. I developed a user-friendly UI to abstract away complex API parameters, allowing users to simply provide text prompts and choose settings like aspect ratio. The back-end logic handles the API calls, processes the returned data (including polling for long-running video tasks), and displays the results.
        </p>
        <h4 className="font-bold mt-6 mb-2">Live Conversation</h4>
        <p>
          This feature showcases my ability to work with real-time data streams. It was implemented using the <strong>Web Audio API</strong> to capture microphone input. This raw audio is encoded, streamed to a conversational AI endpoint, which then returns a continuous stream of audio. I wrote custom decoders to handle the raw PCM data for seamless, low-latency playback in the browser.
        </p>
         <h4 className="font-bold mt-6 mb-2">Analysis & Augmentation Tools</h4>
        <p>
          Tools like the <strong>Humanizer</strong>, <strong>AI Detector</strong>, and <strong>Prompt Enhancer</strong> are built on specialized system prompts and model configurations. For the AI Detector, I configured the model to return a structured JSON response, which I then parse to display the classification, confidence score, and reasoning in the UI. This demonstrates my ability to control model output for specific use cases.
        </p>
      </Section>
      
      <Section title="Styling and UX" icon={Palette}>
          <p>
            The entire user interface is styled using <strong>Tailwind CSS</strong>, following a utility-first approach for rapid and consistent design. The aesthetic is enhanced with a dynamic theme system (Light/Dark mode) implemented with CSS variables, an animated aurora background, and custom-designed components to ensure a polished and professional look.
          </p>
      </Section>

      <Section title="A Note on 'Tools'" icon={UserCheck}>
          <p>
            In modern software development, building everything from scratch is rarely the most effective approach. A key skill is the ability to select, integrate, and orchestrate the right tools and services to build a powerful and coherent application. This project is a testament to that skill—a demonstration of how I can leverage the building blocks of modern technology to create something unique and functional. Every line of code that connects these services, manages the application state, and renders the user interface was written by me.
          </p>
      </Section>

    </div>
  );
};

export default Documentation;
