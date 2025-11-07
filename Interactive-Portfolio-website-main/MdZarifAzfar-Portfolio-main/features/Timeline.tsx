// This feature component displays a social media-style timeline of posts.
// It allows the user (as an admin on the client-side) to create, edit, and delete posts.

import React, { useState, useCallback } from 'react';
import type { ResumeData, BlogPost, Attachment, Link } from '../types';
import { PostEditorModal } from '../components/PostEditorModal';
import { Plus, Edit, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Defines the props for the main Timeline component.
interface TimelineProps {
  resumeData: ResumeData;
}

// Defines the props for the TimelinePost sub-component.
// `onDelete` now takes no arguments, as the ID will be "baked in" by the parent.
interface TimelinePostProps {
  post: BlogPost;
  profile: { name: string, imageUrl: string };
  onEdit: (post: BlogPost) => void;
  onDelete: () => void;
}


// A sub-component for rendering a single post in the timeline.
const TimelinePost: React.FC<TimelinePostProps> = ({ post, profile, onEdit, onDelete }) => {
  // Filter attachments into separate arrays for images and PDFs.
  const imageAttachments = post.attachments?.filter(a => a.type === 'image') || [];
  const pdfAttachments = post.attachments?.filter(a => a.type === 'pdf') || [];
  
  return (
    <div className="flex gap-4">
      {/* Left column: Profile Picture & Vertical connecting line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <img src={profile.imageUrl} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
        <div className="w-px flex-grow bg-amber-500/20 mt-2"></div>
      </div>

      {/* Right column: Post Content */}
      <div className="flex-1 pb-8 min-w-0">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-lg shadow-black/5 p-5">
            <div className="flex justify-between items-start">
                <div className="min-w-0">
                    <h3 className="font-bold text-[var(--text-color)] truncate">{post.title}</h3>
                    <p className="text-xs text-[var(--subtle-text)] font-mono mb-3">{new Date(post.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {/* Edit and Delete buttons - HIDDEN */}
                <div className="hidden flex items-center gap-2 flex-shrink-0 ml-2">
                    <button onClick={() => onEdit(post)} className="p-1.5 text-[var(--subtle-text)] hover:text-[var(--text-color)] hover:bg-gray-500/10 rounded-full transition-colors" aria-label="Edit post"><Edit size={16} /></button>
                    {/* The onClick now directly calls the onDelete prop, which has the ID baked in. */}
                    <button onClick={onDelete} className="p-1.5 text-[var(--subtle-text)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors" aria-label="Delete post"><Trash2 size={16} /></button>
                </div>
            </div>
            
            {/* Post content, rendered as Markdown */}
            <div className="prose prose-sm max-w-none prose-p:text-[var(--subtle-text)] prose-a:text-[var(--header-text)] mb-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
            
            {/* Image Attachments Grid */}
            {imageAttachments.length > 0 && (
              <div className="my-3 grid grid-cols-2 gap-2">
                {imageAttachments.map((img, index) => (
                  <img key={index} src={img.url} alt={img.name} className="rounded-lg object-cover w-full h-full" />
                ))}
              </div>
            )}

            {/* PDF Attachments List */}
            {pdfAttachments.length > 0 && (
              <div className="my-3 space-y-2">
                {pdfAttachments.map((pdf, index) => (
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer" key={index} className="flex items-center gap-3 p-2 bg-gray-500/5 hover:bg-gray-500/10 rounded-lg transition-colors">
                    <FileText className="w-6 h-6 text-[var(--header-text)] flex-shrink-0" />
                    <span className="text-sm text-[var(--subtle-text)] truncate">{pdf.name}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Links / Comments Section */}
            {post.links && post.links.length > 0 && (
              <div className="mt-4 border-t border-[var(--border-color)] pt-3 space-y-2">
                {post.links.map((link, index) => (
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    key={index}
                    className="flex items-start gap-3 p-2 text-sm text-[var(--subtle-text)] hover:bg-gray-500/5 rounded-lg transition-colors"
                  >
                    <LinkIcon size={16} className="text-[var(--header-text)] flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-color)]">{link.title}</p>
                      <p className="text-xs truncate">{link.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

/**
 * NOTE ON "ADMIN" FUNCTIONALITY:
 * The ability to add, edit, and delete posts is handled entirely on the client side
 * and is not protected by a real authentication system. These changes are temporary
 * and will be reset upon reloading the page. This is for demonstration purposes
 * to showcase the UI and state management capabilities of the portfolio.
 * In a real-world application, this would be connected to a secure backend with
 * user authentication to ensure only an authorized admin can make changes.
 */
const Timeline: React.FC<TimelineProps> = ({ resumeData }) => {
  // Initialize posts from props, sorted by date descending.
  const initialPosts = [...resumeData.blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  // State to hold the array of posts.
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  // State to control the visibility of the post editor modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the post currently being edited. `null` for a new post.
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);

  // Opens the modal to create a new post.
  const handleAddNew = useCallback(() => {
    setPostToEdit(null);
    setIsModalOpen(true);
  }, []);

  // Opens the modal to edit an existing post.
  const handleEdit = useCallback((post: BlogPost) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  }, []);
  
  // Deletes a post after confirmation.
  const handleDelete = useCallback((postId: number) => {
    if(window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    }
  }, []);

  // Saves a new post or updates an existing one.
  const handleSave = useCallback((postData: Omit<BlogPost, 'id' | 'date'> & { id?: number }) => {
    const { id, title, content, links, attachments } = postData;

    setPosts(prevPosts => {
      if (id !== undefined) {
          // Editing an existing post.
          return prevPosts.map(p => 
              p.id === id 
                  ? { ...p, title, content, links: links || p.links, attachments: attachments || p.attachments } 
                  : p
          );
      } else {
          // Creating a new post.
          const newPost: BlogPost = {
              id: Date.now(), // Use timestamp for a simple unique ID.
              title,
              content,
              date: new Date().toISOString(),
              links: links || [],
              attachments: attachments || [],
          };
          // Add the new post and re-sort the array by date.
          return [newPost, ...prevPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    });
  }, []);


  return (
    <section className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
            <h2 className="text-4xl font-pixel text-[var(--header-text)] border-b-2 border-amber-500/10 pb-2 sm:border-b-0 sm:pb-0">
                Timeline
            </h2>
            {/* "Add Post" button to open the editor modal - HIDDEN */}
            <button onClick={handleAddNew} className="hidden flex-shrink-0 mt-4 sm:mt-0 flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
                <Plus size={20} />
                <span>Add Post</span>
            </button>
        </div>

        {/* Informational notice about the interactive features - HIDDEN */}
        <div className="hidden mb-8 text-[var(--subtle-text)] text-sm sm:text-base bg-gray-500/5 p-4 rounded-lg border border-[var(--border-color)]">
          <p>
            <strong>Admin Demo:</strong> This timeline is fully interactive. You can <strong>add new posts</strong>, <strong>edit</strong> content, and <strong>delete</strong> entries to see the functionality in action.
          </p>
          <p className="mt-2 text-xs">
            Since this is a front-end portfolio, changes are client-side and will reset when the page is reloaded.
          </p>
        </div>

        {/* The feed of posts. */}
        <div className="relative">
             {posts.map(post => (
                <TimelinePost 
                    key={post.id} 
                    post={post}
                    profile={{ name: resumeData.name, imageUrl: resumeData.profilePictureUrl }}
                    onEdit={handleEdit}
                    // Pass an inline function that captures the correct post.id for this specific post.
                    onDelete={() => handleDelete(post.id)}
                />
            ))}
            {/* Placeholder message when there are no posts. */}
            {posts.length === 0 && (
                <div className="text-center py-16 text-[var(--subtle-text)]">
                    <p>No posts yet. Click "Add Post" to get started!</p>
                </div>
            )}
        </div>

        {/* The modal for creating/editing posts. */}
        {isModalOpen && (
            <PostEditorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                postToEdit={postToEdit}
            />
        )}
    </section>
  );
};

export default Timeline;