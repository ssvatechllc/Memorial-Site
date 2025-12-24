/**
 * AWS API Client for Nanna Memorial Site
 * 
 * This utility handles all communication with the AWS backend,
 * including S3 uploads via pre-signed URLs and DynamoDB operations via Lambda.
 */

const API_BASE_URL = import.meta.env.VITE_AWS_API_URL || '';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || '';

export interface Tribute {
  id?: string;
  name: string;
  relationship: string;
  message: string;
  email?: string;
  date?: string;
  status?: 'pending' | 'approved';
}

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  year: string;
  src?: string;
  key?: string;
  status?: 'pending' | 'approved';
  youtubeId?: string;
  videoStatus?: 'processing' | 'processed' | 'failed';
}

export interface UploadResponse {
  uploadUrl: string;
  key: string;
}

export const awsClient = {
  /**
   * Fetch approved tributes from DynamoDB
   */
  async getTributes(): Promise<Tribute[]> {
    if (!API_BASE_URL) return [];
    
    try {
      const response = await fetch(`${API_BASE_URL}/tributes`);
      if (!response.ok) throw new Error('Failed to fetch tributes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tributes:', error);
      return [];
    }
  },

  /**
   * Submit a new tribute for review
   */
  async submitTribute(tribute: Tribute): Promise<boolean> {
    if (!API_BASE_URL) {
      console.warn('AWS_API_URL not configured. Tribute not submitted.');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...tribute, status: 'pending' }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error submitting tribute:', error);
      return false;
    }
  },

  /**
   * Get a pre-signed S3 URL for uploading media
   */
  async getUploadUrl(fileName: string, fileType: string): Promise<UploadResponse | null> {
    if (!API_BASE_URL) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileType }),
      });
      
      if (!response.ok) throw new Error('Failed to get upload URL');
      return await response.json();
    } catch (error) {
      console.error('Error getting upload URL:', error);
      return null;
    }
  },

  /**
   * Upload a file directly to S3 using a pre-signed URL
   */
  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      return response.ok;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      return false;
    }
  },

  /**
   * Save gallery item metadata (title, category, etc.)
   */
  async saveGalleryItem(item: { title: string, category: string, year: string, key: string }): Promise<boolean> {
    if (!API_BASE_URL) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...item, status: 'pending' }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving gallery item:', error);
      return false;
    }
  },

  /**
   * Fetch gallery items from DynamoDB
   */
  async getGalleryItems(): Promise<GalleryItem[]> {
    if (!API_BASE_URL) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/gallery`);
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }
  },

  /**
   * ADMIN: Fetch pending content for moderation
   */
  async getPendingContent(): Promise<{ tributes: Tribute[], gallery: GalleryItem[] }> {
    if (!API_BASE_URL || !ADMIN_KEY) return { tributes: [], gallery: [] };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pending`, {
        headers: { 'x-admin-key': ADMIN_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch pending content');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending content:', error);
      return { tributes: [], gallery: [] };
    }
  },

  /**
   * ADMIN: Update content status (bulk support)
   */
  async updateContentStatus(type: 'tributes' | 'gallery', idOrIds: string | string[], status: 'approved' | 'deleted'): Promise<boolean> {
    if (!API_BASE_URL || !ADMIN_KEY) return false;

    const body = Array.isArray(idOrIds) 
      ? { type, ids: idOrIds, status }
      : { type, id: idOrIds, status };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY 
        },
        body: JSON.stringify(body),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating content status:', error);
      return false;
    }
  },

  /**
   * ADMIN: Fetch approved content for management
   */
  async getApprovedContent(): Promise<{ tributes: Tribute[], gallery: GalleryItem[] }> {
    if (!API_BASE_URL || !ADMIN_KEY) return { tributes: [], gallery: [] };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/approved`, {
        headers: { 'x-admin-key': ADMIN_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch approved content');
      return await response.json();
    } catch (error) {
      console.error('Error fetching approved content:', error);
      return { tributes: [], gallery: [] };
    }
  },

  /**
   * ADMIN: Delete approved content
   */
  async deleteApprovedContent(id: string): Promise<boolean> {
    if (!API_BASE_URL || !ADMIN_KEY) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/content?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY 
        },
        body: JSON.stringify({ id: String(id) }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting approved content:', error);
      return false;
    }
  },

  /**
   * ADMIN: Reorder gallery items
   */
  async reorderGallery(items: { id: string, order: number }[]): Promise<boolean> {
    if (!API_BASE_URL || !ADMIN_KEY) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery/order`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY 
        },
        body: JSON.stringify({ items }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error reordering gallery:', error);
      return false;
    }
  },

  /**
   * ADMIN: Seed legacy gallery items
   */
  async seedGallery(items: any[]): Promise<boolean> {
    if (!API_BASE_URL || !ADMIN_KEY) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/seed`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY 
        },
        body: JSON.stringify({ items }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error seeding gallery:', error);
      return false;
    }
  }
};
