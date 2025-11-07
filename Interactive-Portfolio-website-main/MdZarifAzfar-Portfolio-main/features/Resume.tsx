// This feature component serves as the main view for the "Resume" tab.
// It assembles all the individual resume sections (Summary, Education, etc.)
// and provides buttons to view or download the resume PDF.

import React from 'react';
import type { ResumeData } from '../types';
import { Education } from '../components/Education';
import { Activities } from '../components/Activities';
import { AdditionalInfo } from '../components/AdditionalInfo';
import { Download, Eye } from 'lucide-react';
import { Summary } from '../components/Summary';

// Defines the props for the Resume component.
interface ResumeProps {
  resumeData: ResumeData;
}

const Resume: React.FC<ResumeProps> = ({ resumeData }) => {
  // Logic to construct a direct download link from a Google Drive preview/embed URL.
  // Google Drive links for viewing are different from direct download links.
  let downloadUrl = resumeData.resumePdfUrl;
  try {
    const urlParts = resumeData.resumePdfUrl.split('/d/');
    if (urlParts.length > 1) {
        const fileId = urlParts[1].split('/')[0];
        // This is the standard format for a direct Google Drive download link.
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  } catch(e) {
    // If parsing fails, fall back to the original URL.
    console.error("Could not construct download URL, falling back to original URL.", e);
  }


  return (
      <div className="space-y-12 animate-fade-in">
        <section>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
              <h2 className="text-4xl font-pixel text-[var(--header-text)]">
                  Resume
              </h2>
              {/* Action buttons for viewing and downloading the PDF. */}
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <a 
                    href={resumeData.resumePdfUrl} // The preview/embed link.
                    target="_blank" // Opens in a new tab.
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm bg-gray-500/10 hover:bg-gray-500/20 px-4 py-2 rounded-md transition-colors"
                  >
                      <Eye size={16} /> View PDF
                  </a>
                  <a 
                    href={downloadUrl} // The constructed direct download link.
                    download="MD_ZARIF_AZFAR_Resume.pdf" // Specifies the default filename for the downloaded file.
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm bg-amber-600/10 hover:bg-amber-600/20 text-[var(--header-text)] px-4 py-2 rounded-md transition-colors"
                  >
                      <Download size={16} /> Download
                  </a>
              </div>
          </div>
          {/* Container for all the resume content sections. */}
          <div className="border-t-2 border-amber-500/10 dark:border-amber-500/10 pt-8 space-y-12">
              <Summary summary={resumeData.summary} profilePictureUrl={resumeData.profilePictureUrl} />
              <Education education={resumeData.education} />
              <Activities activities={resumeData.activities} />
              <AdditionalInfo info={resumeData.additionalInfo} />
          </div>
        </section>
      </div>
  );
};

export default Resume;
