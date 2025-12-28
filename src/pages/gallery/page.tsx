import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { awsClient } from '../../utils/aws-client';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxContent, setLightboxContent] = useState<{ src: string, type: 'image' | 'video' | 'audio' } | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'personal',
    year: new Date().getFullYear().toString(),
    relationship: '',
    description: ''
  });


  useEffect(() => {
    const fetchCustomPhotos = async () => {
      const items = await awsClient.getGalleryItems();
      setCustomPhotos(items);
    };
    fetchCustomPhotos();
  }, []);

  // Sort items by 'order' attribute if present, otherwise fallback to date
  const sortedItems = [...customPhotos].sort((a: any, b: any) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  });

  const allPhotos = sortedItems.map(p => {
    // Detect type based on key or src, but ignore the 'gallery' indexing type
    const src = p.src || '';
    const key = p.key || '';
    const path = (key || src).toLowerCase();
    
    let detectedType = p.contentType || p.type;
    if (detectedType === 'gallery') detectedType = undefined; // Reset if it's the indexing type

    if (!detectedType) {
      // If it has a youtubeId, it's definitely a video
      if (p.youtubeId) detectedType = 'video';
      else if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi') || path.endsWith('.mkv') || path.endsWith('.webm')) detectedType = 'video';
      else if (path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.m4a')) detectedType = 'audio';
      else detectedType = 'image';
    }

    return {
      ...p,
      type: detectedType,
      isYoutube: !!p.youtubeId,
      thumbnail: p.youtubeId ? `https://img.youtube.com/vi/${p.youtubeId}/mqdefault.jpg` : undefined
    };
  });

  const categories = [
    { id: 'all', name: 'All Photos', count: allPhotos.length },
    { id: 'academic', name: 'Academic Life', count: allPhotos.filter(p => p.category === 'academic').length },
    { id: 'field-work', name: 'Field Work', count: allPhotos.filter(p => p.category === 'field-work').length },
    { id: 'students', name: 'With Students', count: allPhotos.filter(p => p.category === 'students').length },
    { id: 'personal', name: 'Personal Moments', count: allPhotos.filter(p => p.category === 'personal').length }
  ];


  const filteredPhotos = selectedCategory === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === selectedCategory);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Please select a photo, video, or audio file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const uploadResponse = await awsClient.getUploadUrl(file.name, file.type);
      if (!uploadResponse) throw new Error('Could not get upload URL');

      const uploadSuccess = await awsClient.uploadToS3(uploadResponse.uploadUrl, file);
      if (!uploadSuccess) throw new Error('S3 upload failed');

      const saveSuccess = await awsClient.saveGalleryItem({
        ...uploadData,
        key: uploadResponse.key
      });

      if (saveSuccess) {
        alert('Media uploaded successfully!');
        setShowUploadForm(false);
        setUploadData({ 
          title: '', 
          category: 'personal', 
          year: new Date().getFullYear().toString(),
          relationship: '',
          description: ''
        });

        const items = await awsClient.getGalleryItems();
        setCustomPhotos(items);
      } else {
        alert('Media uploaded but metadata saving failed.');
      }
    } catch (error) {
      console.error('Upload flow error:', error);
      alert('There was an error during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.8), rgba(71, 85, 105, 0.7)), url('/assets/images/gallery-hero.jpg')`
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Photo Gallery</h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            A visual journey through the remarkable life and career of Professor Dr. R. Pavanaguru. 
            These photos capture moments of teaching, research, and the personal connections that defined his legacy.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-20">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="group cursor-pointer" onClick={() => photo.type !== 'audio' && setLightboxContent({ src: photo.src, type: photo.type })}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`relative overflow-hidden aspect-[4/3] ${photo.type === 'audio' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {photo.type === 'video' ? (
                      <div className="w-full h-full relative group">
                        {photo.thumbnail ? (
                          <img 
                            src={photo.thumbnail} 
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden text-slate-400">
                            {photo.src ? (
                              <video className="absolute inset-0 w-full h-full object-cover opacity-60">
                                <source src={photo.src} />
                              </video>
                            ) : (
                               <i className={`ri-play-circle-fill text-6xl group-hover:scale-110 transition-transform ${photo.isYoutube ? 'text-rose-500' : ''}`}></i>
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className="ri-play-circle-fill text-6xl text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                        <span className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-widest">
                          {photo.isYoutube ? 'YouTube' : 'Video'}
                        </span>
                      </div>
                    ) : photo.type === 'audio' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 p-6">
                        <i className="ri-mic-2-fill text-5xl mb-4 text-amber-500/50 group-hover:text-amber-500 transition-colors"></i>
                        <audio controls className="w-full mt-2 z-10" onClick={(e) => e.stopPropagation()}>
                           <source src={photo.src} />
                           Your browser does not support the audio element.
                        </audio>
                        <span className="text-[10px] font-bold mt-4 uppercase tracking-widest text-slate-500">Audio Memory</span>
                      </div>
                    ) : (
                      <img 
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516534775068-ba3e84589b9c?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    )}
                    {photo.type !== 'audio' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{photo.year}</span>
                            <i className={photo.type === 'video' ? "ri-play-line text-white text-xl" : "ri-zoom-in-line text-white text-xl"}></i>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-slate-800 mb-2 line-clamp-2">{photo.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3">{photo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <i className="ri-image-line text-6xl text-stone-400 mb-4"></i>
              <p className="text-xl text-stone-600">No photos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxContent && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4">
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <button 
              onClick={() => setLightboxContent(null)}
              className="absolute -top-12 md:top-4 right-0 md:-right-12 text-white hover:text-amber-200 text-4xl cursor-pointer z-[101]"
            >
              <i className="ri-close-line"></i>
            </button>
            
            {lightboxContent.type === 'video' ? (
              lightboxContent.src.includes('youtube.com') || lightboxContent.src.includes('youtu.be') || (allPhotos.find(p => p.src === lightboxContent.src)?.youtubeId) ? (
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${allPhotos.find(p => p.src === lightboxContent.src)?.youtubeId || lightboxContent.src.split('v=')[1]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <video 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                >
                  <source src={lightboxContent.src} />
                  Your browser does not support the video tag.
                </video>
              )

            ) : (
              <img 
                src={lightboxContent.src}
                alt="Enlarged photo"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-serif text-slate-800">Submit Photo or Video</h2>
                  <p className="text-sm text-slate-600 mt-1">Help us preserve memories of Professor Pavanaguru through photos or video tributes</p>
                </div>

                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <i className="ri-close-line text-3xl"></i>
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select File (Photo or Video) *
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    required
                    accept="image/*,video/*,audio/*"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-slate-50"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    Supported: JPG, PNG, MP4, MOV. Videos will be automatically processed for YouTube.
                  </p>
                </div>


                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Caption / Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm"
                    placeholder="e.g. Field trip to the Western Ghats"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={uploadData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white"
                    >
                      <option value="academic">Academic Life</option>
                      <option value="field-work">Field Work</option>
                      <option value="students">With Students</option>
                      <option value="personal">Personal Moments</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={uploadData.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="e.g. 2015"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="relationship" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Relationship *
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={uploadData.relationship}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">Select relationship</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Family Member">Other Family Member</option>
                    <option value="PhD Student">PhD Student</option>
                    <option value="Former Student">Former Student</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description / Story (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={uploadData.description}
                    onChange={handleInputChange as any}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    placeholder="Share the story behind this memory..."
                  />
                </div>


                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer shadow-md"
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i> Processing...
                      </span>
                    ) : 'Submit Media'}

                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 border-2 border-stone-300 text-stone-700 hover:bg-stone-50 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Memory Sharing Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-serif text-white mb-6">Share Photos & Videos</h2>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed">
            Do you have photos or video tributes for Professor Pavanaguru? 
            Help us preserve these cherished memories by contributing to our digital gallery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowUploadForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-upload-cloud-2-line"></i>
              Submit Photos or Videos
            </button>

            <button 
              onClick={() => window.location.href = '/tribute-wall'}
              className="border-2 border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-slate-800 px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Share Written Memories
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-xl font-serif text-white mb-4">
              "Every photograph tells a story, just as every rock formation tells the Earth's history."
            </p>
            <p className="text-stone-400">
              Forever Remembered • 1948 - 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
