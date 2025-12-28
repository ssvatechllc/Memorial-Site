/**
 * AWS API Client for Nanna Memorial Site
 * 
 * This utility handles all communication with the AWS backend,
 * including S3 uploads via pre-signed URLs and DynamoDB operations via Lambda.
 */

const API_BASE_URL = import.meta.env.VITE_AWS_API_URL || '';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || '';

// Token storage helpers
const TOKEN_KEY = 'admin_session_token';
const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

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
  relationship: string;
  description?: string;
  src?: string;
  key?: string;
  status?: 'pending' | 'approved';
  isYoutube?: boolean;
  thumbnail?: string;
  videoStatus?: 'processing' | 'processed';
  youtubeId?: string;
}

export interface UploadResponse {
  uploadUrl: string;
  key: string;
}

class AWSClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    
    // Add Authorization header if token exists
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (ADMIN_KEY) {
      // Legacy/Fallback support
      headers.set('x-admin-key', ADMIN_KEY);
    }

    if (options.body && !headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearToken();
      }
      throw new Error(`API Request failed: ${response.statusText} (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const result: any = await this.request('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (result.token) {
        setToken(result.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  }

  logout() {
    clearToken();
  }

  isLoggedIn(): boolean {
    return !!getToken();
  }

  async getTributes(): Promise<Tribute[]> {
    try {
      const data = await this.request('/tributes');
      return data as Tribute[];
    } catch (error) {
      console.error('Error fetching tributes:', error);
      return [];
    }
  }

  async submitTribute(tribute: Tribute): Promise<boolean> {
    try {
      await this.request('/tributes', {
        method: 'POST',
        body: JSON.stringify({ ...tribute, status: 'pending' }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting tribute:', error);
      return false;
    }
  }

  async getUploadUrl(fileName: string, fileType: string): Promise<UploadResponse | null> {
    try {
      return await this.request('/upload-url', {
        method: 'POST',
        body: JSON.stringify({ fileName, fileType }),
      });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      return null;
    }
  }

  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      return response.ok;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      return false;
    }
  }

  async saveGalleryItem(item: GalleryItem): Promise<boolean> {
    try {
      await this.request('/gallery', {
        method: 'POST',
        body: JSON.stringify({ ...item, status: 'pending' }),
      });
      return true;
    } catch (error) {
      console.error('Error saving gallery item:', error);
      return false;
    }
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const data = await this.request('/gallery');
      return data as GalleryItem[];
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }
  }

  async getPendingContent(): Promise<{ tributes: Tribute[], gallery: GalleryItem[] }> {
    try {
      return await this.request('/admin/pending');
    } catch (error) {
      console.error('Error fetching pending content:', error);
      return { tributes: [], gallery: [] };
    }
  }

  async updateContentStatus(type: 'tributes' | 'gallery', idOrIds: string | string[], status: 'approved' | 'deleted'): Promise<boolean> {
    const body = Array.isArray(idOrIds) 
      ? { type, ids: idOrIds, status }
      : { type, id: idOrIds, status };

    try {
      await this.request('/admin/status', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      return true;
    } catch (error) {
      console.error('Error updating content status:', error);
      return false;
    }
  }

  async getApprovedContent(): Promise<{ tributes: Tribute[], gallery: GalleryItem[] }> {
    try {
      return await this.request('/admin/approved');
    } catch (error) {
      console.error('Error fetching approved content:', error);
      return { tributes: [], gallery: [] };
    }
  }

  async deleteApprovedContent(id: string): Promise<boolean> {
    try {
      await this.request(`/admin/content?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: String(id) }),
      });
      return true;
    } catch (error) {
      console.error('Error deleting approved content:', error);
      return false;
    }
  }

  async reorderGallery(items: { id: string, order: number }[]): Promise<boolean> {
    try {
      await this.request('/admin/gallery/order', {
        method: 'PATCH',
        body: JSON.stringify({ items }),
      });
      return true;
    } catch (error) {
      console.error('Error reordering gallery:', error);
      return false;
    }
  }

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<boolean> {
    try {
      await this.request('/admin/gallery/item', {
        method: 'PATCH',
        body: JSON.stringify({ id, updates }),
      });
      return true;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return false;
    }
  }

  async seedGallery(items: any[]): Promise<boolean> {
    try {
      await this.request('/admin/seed', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
      return true;
    } catch (error) {
      console.error('Error seeding gallery:', error);
      return false;
    }
  }
}

export const awsClient = new AWSClient(API_BASE_URL);
