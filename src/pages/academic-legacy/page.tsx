import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function AcademicLegacy() {
  const [selectedCategory, setSelectedCategory] = useState('publications');

  const researchDocuments = [
    {
      id: 1,
      title: "A note on the occurrence of landslides in Araku valley and its environs, Visakhapatnam district, Andhra Pradesh, India",
      authors: "R. Pavanaguru, Venkat Reddy",
      journal: "ResearchGate",
      year: "Published Research",
      type: "Research Paper",
      description: "Comprehensive study on landslide occurrences in the Araku valley region, analyzing geological factors and environmental conditions contributing to slope instability in Visakhapatnam district.",
      link: "https://www.researchgate.net/profile/Venkat-Reddy/publication/288101903_A_note_on_the_occurrence_of_landslides_in_Araku_valley_and_its_environs_Visakhapatnam_district_Andhra_Pradesh_India/links/5ac2e77aaca27222c75cf361/A-note-on-the-occurrence-of-landslides-in-Araku-valley-and-its-environs-Visakhapatnam-district-Andhra-Pradesh-India.pdf",
      platform: "ResearchGate",
      category: "Geological Hazards"
    },
    {
      id: 2,
      title: "Geological and Environmental Research Publication",
      authors: "R. Pavanaguru et al.",
      journal: "Journal of the Geological Society of India",
      year: "2015",
      type: "Research Article",
      description: "Published research article in the prestigious Journal of the Geological Society of India, contributing to the advancement of geological sciences and environmental studies.",
      link: "https://link.springer.com/article/10.1007/s12594-015-0263-y",
      platform: "Springer",
      category: "Geological Research"
    },
    {
      id: 3,
      title: "Geological Studies and Research Contributions",
      authors: "R. Pavanaguru",
      journal: "Google Books Academic Collection",
      year: "Published Research",
      type: "Book Chapter",
      description: "Comprehensive book chapter contribution on geological research and studies, available through Google Books academic collection, showcasing extensive research in geological sciences.",
      link: "https://books.google.com/books?hl=en&lr=&id=XtJjEQAAQBAJ&oi=fnd&pg=PA299&dq=pavanaguru+r&ots=Q9oJOgLEvv&sig=CASfNtU3H7d7rxkU1qARElN-K0Q#v=onepage&q=pavanaguru%20r&f=false",
      platform: "Google Books",
      category: "Geological Research"
    },
    {
      id: 4,
      title: "Scholarly Research Publication",
      authors: "R. Pavanaguru et al.",
      journal: "EBSCO Academic Database",
      year: "Published Research",
      type: "Research Article",
      description: "Peer-reviewed scholarly article published in academic database, contributing to the body of geological knowledge and research methodologies in earth sciences.",
      link: "https://openurl.ebsco.com/EPDB%3Agcd%3A3%3A19105699/detailv2?sid=ebsco%3Aplink%3Ascholar&id=ebsco%3Agcd%3A22197769&crl=c&link_origin=scholar.google.com",
      platform: "EBSCO",
      category: "Earth Sciences"
    },
    {
      id: 5,
      title: "Energy and Geological Research Publication",
      authors: "R. Pavanaguru",
      journal: "OSTI - Office of Scientific and Technical Information",
      year: "Published Research",
      type: "Research Document",
      description: "Research document published through the Office of Scientific and Technical Information, focusing on energy-related geological studies and technical research contributions.",
      link: "https://www.osti.gov/etdeweb/biblio/22256580",
      platform: "OSTI",
      category: "Energy Research"
    },
    {
      id: 6,
      title: "A new genetic model for Bandalamottu Pb deposit, Agnigundala, Guntur district, Andhra Pradesh, India",
      authors: "R. Pavanaguru, Asoori Latha",
      journal: "ResearchGate",
      year: "Published Research",
      type: "Research Paper",
      description: "Groundbreaking research presenting a new genetic model for lead deposits in Bandalamottu, Agnigundala region. This study provides innovative insights into the formation and characteristics of lead mineralization in Andhra Pradesh.",
      link: "https://www.researchgate.net/profile/Asoori-Latha/publication/305618385_A_new_genetic_model_for_Bandalamottu_Pb_deposit_Agnigundala_Guntur_district_Andhra_Pradesh_India/links/5a8a90d0458515b8af951098/A-new-genetic-model-for-Bandalamottu-Pb-deposit-Agnigundala-Guntur-District-Andhra-Pradesh-India.pdf",
      platform: "ResearchGate",
      category: "Mineralogy & Deposits"
    },
    {
      id: 7,
      title: "REE composition of dolostone and its implications on lead mineralization, Bandalamottu, Guntur District, Andhra Pradesh",
      authors: "R. Pavanaguru, Asoori Latha",
      journal: "ResearchGate",
      year: "Published Research",
      type: "Research Paper",
      description: "Detailed study examining the Rare Earth Element (REE) composition of dolostone formations and their significant implications for understanding lead mineralization processes in the Bandalamottu region of Andhra Pradesh.",
      link: "https://www.researchgate.net/profile/Asoori-Latha/publication/308966157_Ree_composition_of_dolostone_and_its_implications_on_lead_mineralization_Bandalamottu_Guntur_District_Andhra_Pradesh/links/57fb174408ae886b89862d0a/Ree-composition-of-dolostone-and-its-implications-on-lead-mineralization-Bandalamottu-Guntur-District-Andhra-Pradesh.pdf",
      platform: "ResearchGate",
      category: "Geochemistry"
    },
    {
      id: 8,
      title: "Geological Research Contributions - Journal of Geological Society of India",
      authors: "R. Pavanaguru, D.P.S. Rathore",
      journal: "Journal of the Geological Society of India",
      year: "Published Research",
      type: "Research Article",
      description: "Significant research contribution published in the Journal of Geological Society of India, advancing understanding in geological sciences and earth system processes.",
      link: "https://www.researchgate.net/profile/Dps-Rathore/post/What-is-your-deepest-desire/attachment/5a029d1cb53d2f10b0ba785a/AS%3A558298705678337%401510120192656/download/ReminderJGSI261017.doc",
      platform: "JGSI",
      category: "Geological Research"
    },
    {
      id: 9,
      title: "Geochemical Characteristics of Bandalamottu Lead Deposit, Guntur District, Andhra Pradesh",
      authors: "Dr. Narayan Sangam, Dr. R. Pavanaguru",
      journal: "International Journal of Modern Engineering Technology and Management Research",
      year: "September 2014",
      type: "Research Paper",
      description: "Comprehensive geochemical analysis of the Bandalamottu lead deposit, examining chemical composition, mineralization patterns, and geological characteristics of this significant mineral deposit in Guntur District.",
      link: "http://www.ijmetmr.com/olseptember2014/DrNarayanSangam-DrRPavanaguru-1.pdf",
      platform: "IJMETMR",
      category: "Geochemistry"
    },
    {
      id: 10,
      title: "Industrial Development and Geological Resources Research",
      authors: "R. Pavanaguru et al.",
      journal: "UNIDO Publications",
      year: "Published Research",
      type: "Technical Report",
      description: "Technical research publication through the United Nations Industrial Development Organization (UNIDO), focusing on geological resources and their role in industrial development and economic growth.",
      link: "https://www.unido.org/publications/ot/9655478/pdf",
      platform: "UNIDO",
      category: "Industrial Geology"
    },
    {
      id: 11,
      title: "Geological Research and Earth Sciences Study",
      authors: "R. Pavanaguru",
      journal: "International Journal of Scientific and Research Publications",
      year: "February 2013",
      type: "Research Paper",
      description: "Peer-reviewed research paper published in the International Journal of Scientific and Research Publications, contributing to the advancement of geological knowledge and earth science research methodologies.",
      link: "https://www.ijsrp.org/research-paper-0213/ijsrp-p1469.pdf",
      platform: "IJSRP",
      category: "Earth Sciences"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative py-32 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(20, 83, 45, 0.75), rgba(180, 83, 9, 0.65)), url('/assets/images/academic-hero-geology.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30">
            <span className="text-amber-200 font-medium text-sm tracking-wide">Four Decades of Excellence</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl">Academic Legacy</h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Groundbreaking research, influential publications, and transformative contributions to geological sciences that continue to inspire scholars worldwide.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 bg-gradient-to-r from-white via-amber-50/50 to-teal-50/50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('publications')}
              className={`flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap shadow-md ${
                selectedCategory === 'publications'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50 hover:shadow-lg'
              }`}
            >
              <i className="ri-book-line mr-2 text-lg"></i>
              Publications & Research
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Publications Section */}
          {selectedCategory === 'publications' && (
            <section className="mb-16">
              
              {/* Citations & Academic Impact Section - MOVED TO TOP */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-serif text-slate-800 mb-4">Citations & Academic Impact</h3>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Professor Pavanaguru's research has been widely cited and referenced by scholars worldwide, demonstrating the lasting impact of his contributions to geological sciences.
                  </p>
                </div>

                {/* Citation Metrics */}
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-2xl p-8 border-2 border-emerald-300/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <i className="ri-quote-text text-white text-3xl"></i>
                    </div>
                    <div className="text-4xl font-bold text-emerald-800 mb-3">Multiple</div>
                    <div className="text-sm text-emerald-700 font-semibold mb-2">Research Citations</div>
                    <p className="text-xs text-emerald-600">Cited by scholars worldwide</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-100 via-teal-50 to-sky-100 rounded-2xl p-8 border-2 border-cyan-300/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <i className="ri-global-line text-white text-3xl"></i>
                    </div>
                    <div className="text-4xl font-bold text-cyan-800 mb-3">International</div>
                    <div className="text-sm text-cyan-700 font-semibold mb-2">Research Reach</div>
                    <p className="text-xs text-cyan-600">Global academic influence</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-2xl p-8 border-2 border-amber-300/50 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <i className="ri-team-line text-white text-3xl"></i>
                    </div>
                    <div className="text-4xl font-bold text-amber-800 mb-3">40+ Years</div>
                    <div className="text-sm text-amber-700 font-semibold mb-2">Research Legacy</div>
                    <p className="text-xs text-amber-600">Continuous contributions</p>
                  </div>
                </div>

                {/* Google Scholar Profile */}
                <div className="bg-gradient-to-r from-slate-100 via-amber-50 to-teal-100 rounded-2xl p-10 border-2 border-slate-300/70 mb-10 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-teal-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                      <i className="ri-graduation-cap-fill text-white text-4xl"></i>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-2xl font-semibold text-slate-800 mb-3">Google Scholar Profile</h4>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        Explore all citations, references, and academic impact of Professor Pavanaguru's research work through his Google Scholar profile.
                      </p>
                      <a
                        href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C47&q=pavanaguru+r&oq="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-teal-700 hover:from-slate-800 hover:to-teal-800 text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl"
                      >
                        <i className="ri-external-link-line text-lg"></i>
                        View Google Scholar Profile
                      </a>
                    </div>
                  </div>
                </div>

                {/* Research Impact Areas */}
                <div className="bg-white rounded-2xl p-10 border-2 border-amber-200/50 shadow-xl mb-10">
                  <h4 className="text-2xl font-semibold text-slate-800 mb-8 text-center">Research Impact Areas</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-landscape-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Geological Hazards</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Research on landslides and slope stability has been referenced in environmental geology studies and disaster management research.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-copper-diamond-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Mineralogy & Deposits</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Pioneering work on lead deposits and genetic models has influenced mineral exploration and economic geology research.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-leaf-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Environmental Conservation</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Studies on rock formations and biodiversity have contributed to conservation strategies and environmental protection policies.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-flask-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Geochemistry</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Research on REE composition and dolostone formations has advanced understanding of geochemical processes and mineralization.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-earth-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Regional Geology</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Extensive work on Andhra Pradesh geology has become foundational reference material for regional geological studies.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <i className="ri-book-open-line text-white text-xl"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Academic Mentorship</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">Research scholars and students continue to build upon his methodologies and findings in their own academic work.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Citation Note */}
                <div className="bg-gradient-to-r from-slate-700 via-teal-800 to-slate-700 rounded-2xl p-8 text-center shadow-xl">
                  <p className="text-amber-100 italic leading-relaxed text-lg">
                    "The true measure of academic excellence is not just in the research published, but in how that research continues to inspire and guide future generations of scholars. Professor Pavanaguru's work lives on through every citation, every reference, and every student who builds upon his foundations."
                  </p>
                </div>
              </div>

              {/* Featured Article */}
              <div className="bg-gradient-to-br from-slate-800 via-teal-900 to-slate-800 rounded-2xl p-10 mb-12 border-2 border-amber-500/30 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="ri-article-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-amber-300 mb-2">Featured Research Article</h3>
                    <p className="text-amber-200/80 text-sm">Published on Society to Save Rocks</p>
                  </div>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-8 bg-slate-900/30 rounded-r-xl py-6 pr-6">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    "A note on the significance of rock sites and the associated biodiversity - A novel approach by the Society to Save Rocks"
                  </h4>
                  <p className="text-amber-200 mb-4 text-sm">
                    By Prof. R. Pavanaguru, Emeritus Professor, Geology Department, Osmania University, Hyderabad
                  </p>
                  
                  <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed">
                    <p className="mb-4">
                      "Our planet is dynamic and the interactions of lithosphere, hydrosphere and atmosphere producing the geometrical 
                      architecture is the reminder of lively and special environment we inhabit from the geological past."
                    </p>
                    
                    <p className="mb-4">
                      This groundbreaking research explores the complex features of rock formations and their role in sustaining 
                      ecosystem equilibrium. Professor Pavanaguru's work with the Society to Save Rocks focused on identifying 
                      and protecting architectural rock forms developed through natural deformation and denudation processes.
                    </p>
                    
                    <div className="bg-gradient-to-br from-teal-900/50 to-slate-900/50 rounded-xl p-6 my-6 border border-teal-700/30">
                      <h5 className="text-amber-300 font-semibold mb-4 text-base">Key Research Findings:</h5>
                      <ul className="space-y-3 text-slate-200">
                        <li className="flex items-start gap-3">
                          <i className="ri-check-line text-teal-400 mt-1 flex-shrink-0 text-lg"></i>
                          <span>Comprehensive study covering over 12,000 sq.km in Medak district</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <i className="ri-check-line text-teal-400 mt-1 flex-shrink-0 text-lg"></i>
                          <span>Identification of 13 distinct geologically controlled landforms</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <i className="ri-check-line text-teal-400 mt-1 flex-shrink-0 text-lg"></i>
                          <span>Documentation of 175 species of flora including medicinal plants</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <i className="ri-check-line text-teal-400 mt-1 flex-shrink-0 text-lg"></i>
                          <span>Cataloging of 204 bird species across 17 orders and 49 families</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <i className="ri-check-line text-teal-400 mt-1 flex-shrink-0 text-lg"></i>
                          <span>Classification of 40 mammal species and 27 reptile/amphibian species</span>
                        </li>
                      </ul>
                    </div>
                    
                    <p className="mb-4">
                      The research emphasized the importance of landforms as potential sites for environmental protection 
                      and biodiversity conservation. Professor Pavanaguru's work demonstrated how geological formations 
                      serve not only as aesthetic landmarks but also as crucial habitats for diverse fauna and flora.
                    </p>
                    
                    <blockquote className="border-l-4 border-amber-500 pl-6 italic text-amber-100 my-6 py-2">
                      "The niceties of the complex features of rock formations and the nature of rocks are marvellous-a science in itself. 
                      The dwellers among these abiotic systems are utilising the abnormal carvings and help to sustain the equilibrium of the ecosystem."
                    </blockquote>
                    
                    <p className="mb-4">
                      This pioneering work contributed significantly to understanding the relationship between geological 
                      structures and biodiversity, establishing frameworks for educational, recreational, and cultural 
                      heritage development in the Deccan plateau region.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <a 
                      href="https://saverocks.org/Topics.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl"
                    >
                      <i className="ri-external-link-line"></i>
                      Read Full Article
                    </a>
                    <div className="inline-flex items-center gap-2 text-amber-200 text-sm">
                      <i className="ri-calendar-line"></i>
                      <span>Published by Society to Save Rocks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Documents & Publications Section */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-serif text-slate-800 mb-4">Research Documents & Publications</h3>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Access Professor Pavanaguru's published research papers and academic contributions available online.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {researchDocuments.map((doc) => (
                    <div key={doc.id} className="bg-gradient-to-br from-white via-amber-50/30 to-teal-50/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-amber-200/50 hover:border-amber-400/70 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <i className="ri-file-pdf-line text-2xl text-white"></i>
                          </div>
                          <div>
                            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
                              {doc.type}
                            </span>
                            <p className="text-xs text-teal-700 mt-2 font-medium">{doc.category}</p>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-lg font-serif text-slate-800 mb-4 leading-snug">
                        {doc.title}
                      </h4>

                      <div className="space-y-3 mb-5">
                        <p className="text-sm text-slate-700 flex items-center">
                          <i className="ri-user-line mr-2 text-teal-600"></i>
                          <strong className="mr-1">Authors:</strong> {doc.authors}
                        </p>
                        <p className="text-sm text-slate-700 flex items-center">
                          <i className="ri-book-line mr-2 text-teal-600"></i>
                          <strong className="mr-1">Journal:</strong> {doc.journal}
                        </p>
                        <p className="text-sm text-slate-700 flex items-center">
                          <i className="ri-calendar-line mr-2 text-teal-600"></i>
                          <strong className="mr-1">Year:</strong> {doc.year}
                        </p>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed mb-6">
                        {doc.description}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t-2 border-amber-200/50">
                        <span className="text-xs text-slate-600 flex items-center font-medium">
                          <i className="ri-global-line mr-1.5"></i>
                          {doc.platform}
                        </span>
                        <a
                          href={doc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg"
                        >
                          <i className="ri-download-line"></i>
                          View Paper
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-300/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <i className="ri-information-line text-white text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-3 text-lg">Access Research Publications</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        These research papers represent a portion of Professor Pavanaguru's extensive academic contributions. 
                        Click "View Paper" to access the full documents on their respective platforms. Additional publications 
                        and research materials may be available through academic databases and institutional repositories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emeritus Professor Section */}
              <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-2xl p-10 mb-8 border-2 border-amber-300/50 shadow-xl">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="ri-graduation-cap-fill text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-amber-800 mb-2">Emeritus Professor</h3>
                    <p className="text-amber-700 text-sm font-medium">Geology Department, Osmania University, Hyderabad</p>
                    <p className="text-amber-600 text-sm font-semibold mt-1">June 2011 - March 2025</p>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-xl p-8 shadow-md">
                  <h4 className="text-xl font-semibold text-slate-800 mb-6">Continued Contributions</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <i className="ri-check-line text-teal-600 mt-1 flex-shrink-0 text-lg"></i>
                        <span className="text-slate-700">Member in professional bodies connected with R&D activities</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <i className="ri-check-line text-teal-600 mt-1 flex-shrink-0 text-lg"></i>
                        <span className="text-slate-700">Active participation in University and Government bodies</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <i className="ri-check-line text-teal-600 mt-1 flex-shrink-0 text-lg"></i>
                        <span className="text-slate-700">Visiting Professor for Earth Sciences</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <i className="ri-check-line text-teal-600 mt-1 flex-shrink-0 text-lg"></i>
                        <span className="text-slate-700">Professional Consultant for Earth Sciences</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-amber-100/70 to-orange-100/70 rounded-xl border border-amber-300/30">
                    <p className="text-slate-700 italic leading-relaxed">
                      "Throughout his emeritus years, Professor Pavanaguru continued to contribute actively to the geological community, 
                      sharing his vast knowledge and experience with new generations of earth scientists until his passing in March 2025."
                    </p>
                  </div>
                </div>
              </div>

            </section>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-slate-800 via-teal-800 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/assets/images/cta-bg-pattern.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-serif text-white mb-6">Continue His Legacy</h2>
          <p className="text-xl text-amber-100 mb-10 leading-relaxed">
            Professor Pavanaguru's academic contributions continue to inspire new generations of geologists. Share your memories of his teaching and research impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.location.href = '/tribute-wall'}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Share Academic Memories
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="border-2 border-amber-300 text-amber-100 hover:bg-amber-100 hover:text-slate-800 px-10 py-4 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              Return to Memorial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-amber-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-2xl font-serif text-white mb-4">
              "Knowledge shared is knowledge multiplied, and wisdom passed on becomes eternal."
            </p>
            <p className="text-amber-200/80">
              Academic Legacy • 1948 - 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
