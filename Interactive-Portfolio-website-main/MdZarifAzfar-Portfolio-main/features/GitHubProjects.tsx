// This feature component fetches and displays a list of public repositories
// from a specified GitHub user's profile.

import React, { useState, useEffect } from 'react';
import type { GitHubRepo } from '../types';
import { Spinner } from '../components/Spinner';
import { Star, GitFork, ExternalLink, AlertTriangle } from 'lucide-react';

// Defines the props for the main component.
interface GitHubProjectsProps {
  username: string; // The GitHub username to fetch repositories for.
}

// A sub-component for rendering a single repository as a clickable card.
const ProjectCard: React.FC<{ repo: GitHubRepo }> = ({ repo }) => (
    <a 
        href={repo.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-5
                   backdrop-blur-lg
                   hover:border-amber-500/20 dark:hover:border-amber-500/20
                   transition-all duration-300 group flex flex-col h-full shadow-lg shadow-black/5"
    >
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-bold text-[var(--text-color)] pr-4">{repo.name}</h3>
            <ExternalLink size={18} className="text-[var(--subtle-text)] group-hover:text-[var(--header-text)] transition-colors flex-shrink-0" />
        </div>
        <p className="text-sm text-[var(--subtle-text)] flex-grow mb-4">
            {repo.description || 'No description provided.'}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 font-mono">
            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                <span>{repo.language || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <Star size={14} /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                    <GitFork size={14} /> {repo.forks_count}
                </span>
            </div>
        </div>
    </a>
);

export const GitHubProjects: React.FC<GitHubProjectsProps> = ({ username }) => {
  // State to store the fetched repositories.
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  // State to track the loading status.
  const [isLoading, setIsLoading] = useState(true);
  // State to store any errors that occur during fetching.
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data from the GitHub API when the component mounts.
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch repositories, sorted by the last pushed date.
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed`);
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub projects.');
        }
        const data: GitHubRepo[] = await response.json();
        // Filter out forked repositories and sort the remaining ones by the number of stars.
        const sortedRepos = data.filter(repo => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
        setRepos(sortedRepos);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
  }, [username]); // The effect depends on the username prop.

  return (
    <section>
      <h2 className="text-4xl font-pixel text-[var(--header-text)] mb-6 border-b-2 border-amber-500/10 dark:border-amber-500/10 pb-2">
        More on GitHub
      </h2>
       {/* Display a spinner while data is being fetched. */}
       {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      )}
      {/* Display an error message if the fetch fails. */}
      {error && (
        <div className="flex flex-col items-center justify-center h-40 bg-red-500/10 text-red-400 rounded-lg p-4">
            <AlertTriangle size={32} className="mb-2" />
            <p className="font-semibold">Error loading projects</p>
            <p className="text-sm">{error}</p>
        </div>
      )}
      {/* Display the project cards once data is loaded successfully. */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display up to the first 6 repositories. */}
          {repos.slice(0, 6).map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
};
