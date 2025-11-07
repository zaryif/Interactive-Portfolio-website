// A modal component for creating and editing timeline posts.
// It includes fields for title, content, a link, and multiple file attachments.

import React, { useState, useEffect } from 'react';
import type { BlogPost, Attachment, Link } from '../types';
import { Modal } from './Modal';
import { Spinner } from './Spinner';
import { Save, Image as ImageIcon, FileText, X } from 'lucide-react';

// Defines the props for the PostEditorModal component.
interface PostEditorModalProps {
  isOpen: boolean;    // Controls whether the modal is visible.
  onClose: () => void; // A callback function to close the modal.
  // A callback function to save the post data.
  onSave: (post: Omit<BlogPost, 'id' | 'date'> & { id?: number }) => void;
  postToEdit: BlogPost | null; // The post to edit, or null if creating a new post.
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({ isOpen, onClose, onSave, postToEdit }) => {
  // State for each form field.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [currentLink, setCurrentLink] = useState<Link>({ url: '', title: '' });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // useEffect hook to populate the form when editing a post.
  useEffect(() => {
    if (isOpen) {
        if (postToEdit) {
            // If `postToEdit` is provided, fill the form with its data.
            setTitle(postToEdit.title);
            setContent(postToEdit.content);
            setLinks(postToEdit.links || []);
            setAttachments(postToEdit.attachments || []);
        } else {
            // If creating a new post, reset the form to be empty.
            setTitle('');
            setContent('');
            setLinks([]);
            setAttachments([]);
        }
        // Reset the temporary input for a new link whenever the modal is opened.
        setCurrentLink({ url: '', title: '' });
    }
  }, [postToEdit, isOpen]); // Reruns when the modal is opened or the post to edit changes.

  // Handles new file uploads for attachments.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Process each selected file.
      // FIX: Explicitly type `file` as `File` to resolve type inference issues.
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newAttachment: Attachment = {
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'pdf',
            url: reader.result as string, // The file content as a base64 data URL.
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Removes an attachment from the preview list.
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Adds the current link from the input fields to the list of links.
  const handleAddLink = () => {
    // Basic validation for the link.
    if (currentLink.url.trim() && currentLink.title.trim()) {
      setLinks(prev => [...prev, currentLink]);
      // Reset the input fields for the next link.
      setCurrentLink({ url: '', title: '' });
    }
  };

  // Removes a link from the list.
  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };


  // Handles the save button click.
  const handleSave = async () => {
    setIsSaving(true);
    
    // Call the onSave callback with the current form data.
    onSave({
      id: postToEdit?.id,
      title,
      content,
      links,
      attachments,
    });
    
    // Simulate a short delay for UX purposes.
    await new Promise(res => setTimeout(res, 300));
    setIsSaving(false);
    onClose(); // Close the modal after saving.
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={postToEdit ? 'Edit Post' : 'Create New Post'}>
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--subtle-text)] mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-800 border-transparent rounded-md px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Post title"
          />
        </div>
        {/* Content Textarea (Markdown supported) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[var(--subtle-text)] mb-1">Content*</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="