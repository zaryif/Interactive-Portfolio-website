// This feature component serves as the main view for the "Projects" tab.
// It composes two sub-components: the "Project Deep Dive" (Research) and the list of GitHub projects.

import React from 'react';
import type { ResumeData } from '../types';
import { GitHubProjects } from './GitHubProjects';
import { Research } from './Research';

// Defines the props for the Projects component.
interface ProjectsProps {
  resumeData: ResumeData;
}

const Projects: React.FC<ProjectsProps> = ({ resumeData }) => {
  return (
    // The `animate-fade-in` class provides a simple fade-in animation on load.
    <div className="space-y-12 animate-fade-in">
      {/* The Research component displays a detailed look at the portfolio project itself. */}
      <Research resumeData={resumeData} />
      {/* The GitHubProjects component fetches and displays other projects from GitHub. */}
      <GitHubProjects username="zaryif" />
    </div>
  );
};

export default Projects;
