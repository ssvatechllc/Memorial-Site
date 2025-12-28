import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { awsClient, type GalleryItem, type Tribute } from '../../utils/aws-client';

export default function Home() {
  const [familyMedia, setFamilyMedia] = useState<GalleryItem[]>([]);
  const [featuredTribute, setFeaturedTribute] = useState<Tribute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxContent, setLightboxContent] = useState<{ src: string, id?: string, youtubeId?: string } | null>(null);

  useEffect(() => {
    const loadFamilyContent = async () => {
      setIsLoading(true);
      try {
        const [gallery, tributes] = await Promise.all([
          awsClient.getGalleryItems(),
          awsClient.getTributes()
        ]);

        const familyRelationships = ['Son', 'Daughter', 'Grandchild', 'Spouse', 'Family Member', 'Other Family Member'];
        
        // Process gallery items and detect types/thumbnails
        const processedGallery = gallery.map(p => {
          const src = p.src || '';
          const key = p.key || '';
          const path = (key || src).toLowerCase();
          
          let detectedType = (p as any).contentType || (p as any).type;
          if (detectedType === 'gallery') detectedType = undefined;

          if (!detectedType) {
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

        const filteredMedia = processedGallery.filter(item => 
          familyRelationships.includes(item.relationship)
        ).slice(0, 4);

        const filteredTributes = tributes.filter(item => 
          familyRelationships.includes(item.relationship)
        );

        setFamilyMedia(filteredMedia);
        if (filteredTributes.length > 0) {
          setFeaturedTribute(filteredTributes[0]);
        }
      } catch (error) {
        console.error('Error loading home content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navbar />

      {/* Hero Section - Redesigned with Text on the Right */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-900">
        {/* Background Layer - Photo on the Left/Center, text area on the Right */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-[center_left_20%] md:bg-[center_left_10%] transition-all duration-1000"
            style={{
              backgroundImage: `url('/assets/images/nanna-hero.jpg')`,
              filter: 'brightness(0.75)'
            }}
          />
          {/* Subtle gradient from right-to-left to ensure text readability without making the whole photo dark */}
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-end">
            <div className="max-w-xl text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-600/30 text-amber-300 text-[10px] font-bold tracking-[0.1em] uppercase mb-6 animate-fade-in shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Forever In Our Hearts
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif text-white mb-6 leading-tight animate-fade-in whitespace-nowrap drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
                Dr. R. Pavanaguru
              </h1>
              
              <p className="text-lg md:text-xl font-serif italic text-slate-100 mb-10 leading-relaxed font-light animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.4s' }}>
                "The Earth speaks to those who listen with patience and observe with wonder."
              </p>

              <div className="flex justify-end flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <a href="/biography" className="group bg-amber-600 hover:bg-amber-510 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-amber-600/30">
                  Explore His Journey
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                </a>
                <button 
                  onClick={() => document.getElementById('family-memories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 rounded-full font-medium transition-all duration-300"
                >
                  View Tributes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Details */}
        <div className="absolute bottom-10 left-10 hidden lg:flex flex-col gap-4 text-white/60 font-serif italic text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
           <div className="flex items-center gap-3">
             <div className="w-12 h-px bg-white/30"></div>
             <span>1948 — 2025</span>
           </div>
           <div className="pl-15">Emeritus Professor of Geology</div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-slate-100 rounded-full blur-3xl -z-10"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                <img 
                  src="/assets/images/nanna-casual.jpg"
                  alt="Professor Pavanaguru"
                  className="w-full h-[600px] object-cover object-top"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
              </div>
              
              <div className="absolute bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block">
                <i className="ri-award-fill text-3xl text-amber-600 mb-2"></i>
                <p className="text-slate-800 font-bold leading-tight">40+ Years of Academic Excellence</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-4 block">Our Inspiration</span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">A Life of Purpose and Dedication</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
                <p>
                  Professor Dr. R. Pavanaguru was more than an educator; he was a titan in the field of geology whose passion for the earth was matched only by his love for teaching.
                </p>
                <p>
                  Across four decades at Osmania University, he mentored generations of geologists, leaving an indelible mark on the scientific community through his groundbreaking research and standard-setting textbooks.
                </p>
                <p className="italic border-l-4 border-amber-500 pl-6 my-10 text-slate-800">
                  "Knowledge is like the strata of the earth—it builds upon itself, each layer revealing a deeper truth about our existence."
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <div className="text-3xl font-serif text-slate-900 mb-1">150+</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-slate-900 mb-1">47</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest">PhD Mentees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Memories Section */}
      <section id="family-memories" className="py-24 bg-white border-y border-stone-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Family Memories</h2>
              <p className="text-lg text-slate-500 font-light">
                Cherished moments from children, grandchildren, and extended family.
              </p>
            </div>
            <a href="/gallery" className="text-amber-600 font-bold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b-2 border-amber-600/10 hover:border-amber-600">
              View Full Gallery <i className="ri-arrow-right-line"></i>
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Media Items */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-6">
                  {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-stone-100 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : familyMedia.length === 0 ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                   <i className="ri-camera-lens-line text-5xl text-stone-300 mb-4"></i>
                   <p className="text-stone-500 italic">No family memories shared yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-8">
                  {familyMedia.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                      onClick={() => setLightboxContent({ src: item.src || '', id: item.id, youtubeId: item.youtubeId })}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full relative">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                              <video className="absolute inset-0 w-full h-full object-cover opacity-50"><source src={item.src} /></video>
                              <i className="ri-play-circle-line text-6xl text-white/30 group-hover:text-white/80 transition-colors relative z-10"></i>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold tracking-widest uppercase">
                             {item.isYoutube ? 'YouTube' : 'Video'}
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={item.src || '/assets/images/placeholder.jpg'} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">{item.relationship}</p>
                        <h4 className="text-white text-2xl font-serif mb-4">{item.title}</h4>
                        <div className="w-10 h-1 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Quote / Action Card */}
            <div className="space-y-12">
               {featuredTribute && (
                 <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl group-hover:bg-amber-600/20 transition-all duration-1000"></div>
                    <i className="ri-double-quotes-l text-8xl text-white/5 absolute -top-4 -left-4"></i>
                    
                    <div className="relative z-10">
                      <p className="text-amber-500 font-bold tracking-widest text-[10px] uppercase mb-8">Featured Tribute</p>
                      <blockquote className="text-2xl font-serif italic leading-relaxed mb-10 text-slate-100">
                        "{featuredTribute.message}"
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-amber-500 font-serif border border-white/10">
                          {featuredTribute.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-wide">{featuredTribute.name}</p>
                          <p className="text-slate-400 text-xs">{featuredTribute.relationship}</p>
                        </div>
                      </div>
                    </div>
                 </div>
               )}

               <div className="bg-stone-50 rounded-3xl p-10 border border-stone-100 text-center shadow-sm">
                  <h3 className="text-2xl font-serif text-slate-800 mb-4">Join the Tribute</h3>
                  <p className="text-slate-500 mb-8 font-light text-sm">Share your own memories and stories of Dr. Pavanaguru.</p>
                  <a href="/tribute-wall" className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl w-full">
                    Share a Memory
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxContent && (
        <div className="fixed inset-0 bg-slate-950/98 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="relative max-w-6xl w-full">
            <button 
              onClick={() => setLightboxContent(null)}
              className="absolute -top-16 right-0 text-white/60 hover:text-white text-5xl transition-colors"
            >
              <i className="ri-close-line"></i>
            </button>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              {lightboxContent.youtubeId ? (
                <div className="aspect-video w-full">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${lightboxContent.youtubeId}?autoplay=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                </div>
              ) : lightboxContent.src.toLowerCase().match(/\.(mp4|mov|avi)$/) ? (
                <video controls autoPlay className="max-w-full max-h-[80vh] mx-auto">
                  <source src={lightboxContent.src} />
                </video>
              ) : (
                <img src={lightboxContent.src} className="max-w-full max-h-[85vh] mx-auto object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <h3 className="text-white font-serif text-2xl mb-6">Dr. R. Pavanaguru</h3>
              <p className="max-w-md leading-relaxed font-light">
                Celebrating a life of academic excellence, dedicated mentorship, and geological discovery. Forever remembered by family, students, and peers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/biography" className="hover:text-amber-500 transition-colors">Biography</a></li>
                <li><a href="/academic-legacy" className="hover:text-amber-500 transition-colors">Legacy</a></li>
                <li><a href="/gallery" className="hover:text-amber-500 transition-colors">Gallery</a></li>
                <li><a href="/tribute-wall" className="hover:text-amber-500 transition-colors">Tribute Wall</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Memorial</h4>
              <button className="bg-amber-600/10 text-amber-500 border border-amber-600/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 hover:text-white transition-all">
                Scholarship Foundation
              </button>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2025 Dr. R. Pavanaguru Memorial Library</p>
            <p className="italic text-slate-600">Rest In Peace • 1948 — 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
