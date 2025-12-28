import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    alert("Thank you for your message. We will get back to you soon.");
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.8), rgba(71, 85, 105, 0.7)), url('/assets/images/contact-hero.jpg')`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Reach out to the family members for inquiries about the memorial or
            to share additional memories.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-serif text-slate-800 mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                {/* Family Contact */}
                <div className="bg-white rounded-lg p-8 shadow-lg border border-stone-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="ri-heart-line text-xl text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-800 mb-2">
                        Family Contact
                      </h3>
                      <p className="text-slate-600 mb-4">
                        To share personal memories, condolences, or for
                        family-related memorial matters.
                      </p>
                      <div className="space-y-4 text-sm">
                        <p className="flex items-center text-slate-700">
                          <i className="ri-mail-line mr-2 text-blue-600"></i>
                          family@drpavanaguru.org
                        </p>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                          <p className="text-blue-800 font-medium mb-1 flex items-center">
                            <i className="ri-message-3-line mr-2"></i>
                            Send a Message
                          </p>
                          <p className="text-blue-600 text-xs">
                            Please use the contact form on this page to reach us
                            directly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 border border-stone-200">
                <h3 className="text-3xl font-serif text-slate-800 mb-6">
                  Send a Message
                </h3>
                <p className="text-slate-600 mb-8">
                  Share your thoughts, memories, or inquiries with us. We value
                  every message from those whose lives were touched by Professor
                  Pavanaguru.
                </p>

                {!formSubmitted ? (
                  <form
                    id="contact-form"
                    method="POST"
                    encType="application/x-www-form-urlencoded"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="first-name"
                          name="first_name"
                          required
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="last-name"
                          name="last_name"
                          required
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="relationship"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Your Relationship to Professor Pavanaguru
                      </label>
                      <select
                        id="relationship"
                        name="relationship"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm cursor-pointer"
                      >
                        <option value="">Please select...</option>
                        <option value="former-student">Former Student</option>
                        <option value="colleague">Colleague</option>
                        <option value="family-friend">Family Friend</option>
                        <option value="research-collaborator">
                          Research Collaborator
                        </option>
                        <option value="admirer">Admirer of his work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="Brief description of your message"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        maxLength={500}
                        placeholder="Share your thoughts, memories, inquiries, or condolences..."
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-1">
                        Maximum 500 characters
                      </p>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        name="privacy_consent"
                        value="yes"
                        required
                        className="mt-1 mr-3 cursor-pointer"
                      />
                      <label
                        htmlFor="privacy"
                        className="text-sm text-slate-600 cursor-pointer"
                      >
                        I consent to having this memorial website store and
                        process my submitted information for the purpose of
                        responding to my inquiry. *
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-2xl font-serif text-slate-800 mb-4">
                      Message Sent Successfully
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Thank you for reaching out. Your message has been received
                      and we will respond within 2-3 business days.
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setError("");
                      }}
                      className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>

              {/* Office Hours */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <i className="ri-time-line mr-2"></i>
                  Response Times
                </h4>
                <div className="text-sm text-amber-700 space-y-2">
                  <p>
                    <strong>Response Time:</strong> 1-2 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Residence */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-slate-800 mb-8">
            Family Residence
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            The house of Professor Pavanaguru in Secunderabad, Telangana.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-stone-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-xl font-serif text-slate-800 mb-4">
                  Residence Address
                </h3>
                <div className="space-y-3 text-slate-700">
                  <p className="flex items-start">
                    <i className="ri-map-pin-line text-amber-600 mr-3 mt-1"></i>
                    <span>
                      GuruLakshmi Residency,
                      <br />
                      Maruthi Apartment, Vishnupuri Extn,
                      <br />
                      Sri Rama Nagar, Malkajgiri,
                      <br />
                      Secunderabad, Telangana 500047, India
                    </span>
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="https://www.google.com/maps/place/GuruLakshmi+Residency/@17.4531458,78.5397426,115m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3bcb9b0a5d40f2e1:0x12ab9b27e008b7de!2sGuruLakshmi+Residency!8m2!3d17.4532573!4d78.5400992!16s%2Fg%2F11q22bjjsm!3m5!1s0x3bcb9b0a5d40f2e1:0x12ab9b27e008b7de!8m2!3d17.4532573!4d78.5400992!16s%2Fg%2F11q22bjjsm?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    View on Google Maps
                  </a>
                </div>
              </div>
              <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Image placeholder or actual map embed if preferred, but for now just showing it's a map location */}
                <i className="ri-map-2-line text-6xl text-slate-400"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-serif text-white mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed">
            Join our mailing list to receive updates about memorial events,
            scholarship opportunities, and ways to honor Professor Pavanaguru's
            legacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/tribute-wall")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Share Your Memory
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="border-2 border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-slate-800 px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Return to Memorial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-xl font-serif text-white mb-4">
              "Communication is the bridge between confusion and clarity."
            </p>
            <p className="text-stone-400">Contact Us • 1948 - 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
