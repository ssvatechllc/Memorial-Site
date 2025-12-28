import { useState, useEffect, useMemo } from 'react';
import { awsClient, type Tribute, type GalleryItem } from '../../utils/aws-client';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(awsClient.isLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'tributes' | 'gallery' | 'manage'>('tributes');
  const [pendingTributes, setPendingTributes] = useState<Tribute[]>([]);
  const [pendingGallery, setPendingGallery] = useState<GalleryItem[]>([]);
  const [approvedGallery, setApprovedGallery] = useState<GalleryItem[]>([]);
  const [approvedTributes, setApprovedTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Legacy items to migrate
  const LEGACY_PHOTOS = [
    { id: 'l1', category: 'academic', title: 'Delivering Keynote at International Conference', description: 'Professor Pavanaguru presenting his research on sedimentary formations at the 2018 International Geology Conference.', year: '2018', src: '/assets/images/keynote-speech.jpg' },
    { id: 'l2', category: 'field-work', title: 'Geological Survey in Western Ghats', description: 'Leading a field expedition to study rock formations in the Western Ghats mountain range.', year: '2015', src: '/assets/images/nanna-casual.jpg' },
    { id: 'l3', category: 'personal', title: 'Family Gathering', description: 'A cherished moment during a family gathering.', year: '2019', src: '/assets/images/nanna-formal.jpg' },
    { id: 'l4', category: 'academic', title: 'In His Laboratory', description: 'Working in his geology laboratory, examining rock specimens under microscope.', year: '2020', src: '/assets/images/laboratory-work.jpg' },
    { id: 'l5', category: 'students', title: 'Field Trip with Undergraduate Class', description: 'Leading undergraduate students on an educational field trip to study local geological formations.', year: '2017', src: '/assets/images/nanna-casual.jpg' },
    { id: 'l6', category: 'personal', title: 'Family Celebration', description: 'Enjoying a family gathering with children and grandchildren during his 70th birthday celebration.', year: '2018', src: '/assets/images/nanna-casual.jpg' },
    { id: 'l21', category: 'personal', title: 'Reading to Grandchildren', description: 'Sharing his love of science by reading geology picture books to his young grandchildren.', year: '2021', src: '/assets/images/nanna-casual.jpg' },
    { id: 'l23', category: 'students', title: 'Final Lecture', description: 'Delivering his final lecture before retirement, with a packed auditorium of students and colleagues.', year: '2022', src: '/assets/images/dr-pavanaguru-portrait.jpg' },
    { id: 'l24', category: 'academic', title: 'Legacy Portrait', description: 'Official university portrait for the geology department hall of fame.', year: '2022', src: '/assets/images/nanna-formal.jpg' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'manage') {
        loadApprovedContent();
      } else {
        loadPendingContent();
      }
    }
  }, [isAuthenticated, activeTab]);

  const loadPendingContent = async () => {
    setIsLoading(true);
    try {
      const { tributes, gallery } = await awsClient.getPendingContent();
      setPendingTributes(tributes);
      setPendingGallery(gallery);
      setSelectedIds([]);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const loadApprovedContent = async () => {
    setIsLoading(true);
    try {
      const { gallery, tributes } = await awsClient.getApprovedContent();
      setApprovedGallery(gallery);
      setApprovedTributes(tributes || []);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await awsClient.login(username, password);
    if (success) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid username or password');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    awsClient.logout();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleAction = async (type: 'tributes' | 'gallery', id: string, status: 'approved' | 'deleted') => {
    if (activeTab === 'manage' && status === 'deleted') {
      if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
      
      const success = await awsClient.deleteApprovedContent(id);
      if (success) {
        if (type === 'tributes') setApprovedTributes(prev => prev.filter(t => t.id !== id));
        else setApprovedGallery(prev => prev.filter(g => g.id !== id));
      } else alert('Failed to delete item');
      return;
    }

    const success = await awsClient.updateContentStatus(type, id, status);
    if (success) {
      if (type === 'tributes') setPendingTributes(prev => prev.filter(t => t.id !== id));
      else setPendingGallery(prev => prev.filter(g => g.id !== id));
      setSelectedIds(prev => prev.filter(sId => sId !== id));
    } else alert('Failed to update status');
  };

  const handleBulkAction = async (status: 'approved' | 'deleted') => {
    if (selectedIds.length === 0) return;
    
    setIsLoading(true);
    const success = await awsClient.updateContentStatus(activeTab === 'tributes' ? 'tributes' : 'gallery', selectedIds, status);
    if (success) {
      if (activeTab === 'tributes') setPendingTributes(prev => prev.filter(t => !selectedIds.includes(t.id!)));
      else setPendingGallery(prev => prev.filter(g => !selectedIds.includes(g.id!)));
      setSelectedIds([]);
    } else alert(`Failed to bulk ${status} items`);
    setIsLoading(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredItems = useMemo(() => {
    let base: any[] = [];
    if (activeTab === 'tributes') base = pendingTributes;
    else if (activeTab === 'gallery') base = pendingGallery;
    else base = [...approvedTributes, ...approvedGallery];

    return base.filter(item => {
      const nameOrTitle = (item.name || item.title || '').toLowerCase();
      const messageOrDesc = (item.message || item.description || '').toLowerCase();
      const matchesSearch = searchTerm === '' || nameOrTitle.includes(searchTerm.toLowerCase()) || messageOrDesc.includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, pendingTributes, pendingGallery, approvedTributes, approvedGallery, searchTerm, categoryFilter]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <i className="ri-shield-user-line text-5xl text-amber-600 mb-4 inline-block"></i>
            <h1 className="text-3xl font-serif text-slate-800">Admin Portal</h1>
            <p className="text-slate-600">Please enter credentials to access moderation tools</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center"
            >
              {isLoading ? <i className="ri-loader-4-line animate-spin mr-2"></i> : 'Access Dashboard'}
            </button>
          </form>
          <div className="mt-8 text-center text-slate-500">
            <a href="/" className="hover:text-amber-600 transition-colors"><i className="ri-arrow-left-line mr-1"></i> Back to Memorial</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-slate-800 text-white py-4 px-10 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <i className="ri-shield-check-line text-amber-500 text-2xl"></i>
          <div>
            <h1 className="text-xl font-serif font-bold">Admin Moderation</h1>
            <p className="text-slate-400 text-xs">Dr. Pavanaguru Memorial</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-slate-400">Moderator Access</span>
          <button onClick={handleLogout} className="bg-amber-700/20 hover:bg-amber-700/40 text-amber-200 px-3 py-1.5 rounded-lg text-xs border border-amber-700/50 transition-colors">Logout</button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-stone-200">
            {[
              { id: 'tributes', label: 'Tributes', count: pendingTributes.length },
              { id: 'gallery', label: 'Media', count: pendingGallery.length },
              { id: 'manage', label: 'Manage All', count: approvedGallery.length + approvedTributes.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSelectedIds([]); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="field-work">Field Work</option>
              <option value="students">Students</option>
              <option value="personal">Personal</option>
            </select>
            <button 
              onClick={activeTab === 'manage' ? loadApprovedContent : loadPendingContent}
              disabled={isLoading}
              className="bg-white hover:bg-slate-50 border border-stone-200 p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[44px]"
            >
              <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-6 flex items-center justify-between bg-amber-600 text-white p-4 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center gap-4">
              <span className="font-bold">{selectedIds.length} items selected</span>
              <button onClick={() => setSelectedIds([])} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">Clear</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkAction('approved')} className="bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg text-xs font-bold transition-all">Approve Selected</button>
              <button onClick={() => handleBulkAction('deleted')} className="bg-rose-500 text-white hover:bg-rose-400 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-rose-400">Delete Selected</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-stone-200">
                  <th className="p-4 w-12 text-center">
                    <button onClick={() => {
                        if (selectedIds.length === filteredItems.length && filteredItems.length > 0) setSelectedIds([]);
                        else setSelectedIds(filteredItems.map(i => i.id!));
                    }}>
                        <i className={selectedIds.length > 0 && selectedIds.length === filteredItems.length ? "ri-checkbox-fill text-amber-600" : "ri-checkbox-blank-line text-slate-300"}></i>
                    </button>
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Details</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <i className="ri-loader-4-line text-4xl text-slate-300 animate-spin mb-2 inline-block"></i>
                      <p className="text-slate-500">Loading catalog...</p>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <p className="text-slate-400 italic">No items found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className={`border-b border-stone-100 hover:bg-stone-50/50 transition-colors ${selectedIds.includes(item.id!) ? 'bg-amber-50/50' : ''}`}>
                      <td className="p-4 text-center">
                         <button onClick={() => toggleSelection(item.id!)}>
                            <i className={selectedIds.includes(item.id!) ? "ri-checkbox-fill text-amber-600" : "ri-checkbox-blank-line text-slate-300"}></i>
                         </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {(item.src || item.youtubeId) && (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-stone-200">
                                {item.youtubeId ? (
                                    <img src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} className="w-full h-full object-cover" alt="Thumb" />
                                ) : item.src ? (
                                    <img src={item.src} className="w-full h-full object-cover" alt="Image" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><i className="ri-message-3-line text-slate-400"></i></div>
                                )}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800 text-sm truncate max-w-xs">{item.name || item.title}</p>
                            <p className="text-slate-500 text-xs line-clamp-1 max-w-sm">{item.message || item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-amber-700">{item.relationship || item.year}</p>
                        <p className="text-slate-400 text-[10px]">{item.date ? item.date.split('T')[0] : (item.year ? 'Gallery' : 'Tribute')}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          item.category === 'academic' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-stone-50 text-stone-600 border-stone-100'
                        }`}>
                          {item.category || 'Tribute'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab === 'manage' ? (
                            <button onClick={() => handleAction(item.name ? 'tributes' : 'gallery', item.id!, 'deleted')} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleAction(item.name ? 'tributes' : 'gallery', item.id!, 'approved')}
                                disabled={item.key?.toLowerCase().endsWith('.mp4') && !item.youtubeId}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-1"
                              >
                                {item.key?.toLowerCase().endsWith('.mp4') && !item.youtubeId ? 'Processing' : 'Approve'}
                              </button>
                              <button onClick={() => handleAction(item.name ? 'tributes' : 'gallery', item.id!, 'deleted')} className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-lg transition-colors">Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {activeTab === 'manage' && (
          <div className="mt-12 p-8 border-2 border-dashed border-stone-200 rounded-2xl text-center bg-white/50">
            <h3 className="text-lg font-serif text-slate-800 mb-2">Admin Tools</h3>
            <p className="text-sm text-slate-500 mb-6">Advanced operations for catalog management</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => { if(confirm(`Migrate ${LEGACY_PHOTOS.length} items?`)) awsClient.seedGallery(LEGACY_PHOTOS); }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2"
              >
                <i className="ri-database-2-line"></i> Legacy Migration
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
