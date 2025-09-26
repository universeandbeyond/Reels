import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Youtube, Facebook, Instagram, Video, ExternalLink } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      name: 'TikTok',
      icon: Video,
      color: 'text-gray-900 hover:text-gray-700',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    }
  ];

  const getSocialUrl = (platform: string) => {
    switch (platform) {
      case 'YouTube': return 'https://youtube.com/@universeandbeyond';
      case 'Facebook': return 'https://facebook.com/universeandbeyond';
      case 'Instagram': return 'https://instagram.com/universeandbeyond';
      case 'TikTok': return 'https://tiktok.com/@universeandbeyond';
      default: return '#';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about my research? Found an error? Want to suggest a topic? 
            I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="correction">Report an Error</option>
                  <option value="suggestion">Topic Suggestion</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="research">Research Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Info</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">Universeandbeyond.reels@gmail.com</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                  <p className="text-gray-600">Usually within 24-48 hours</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Best For</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Research questions</li>
                    <li>• Error corrections</li>
                    <li>• Topic suggestions</li>
                    <li>• Collaboration inquiries</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow My Content</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={getSocialUrl(social.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.bgColor} p-4 rounded-xl transition-colors group`}
                  >
                    <div className="flex items-center space-x-3">
                      <social.icon className={`h-6 w-6 ${social.color}`} />
                      <div>
                        <p className="font-semibold text-gray-900">{social.name}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>Follow</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pro tip:</strong> For the fastest response to corrections or research questions, 
                  use the contact form above rather than social media DMs.
                </p>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency Commitment</h3>
              <p className="text-gray-700 mb-4">
                All corrections and significant feedback received through this contact form 
                will be reviewed and, if valid, added to the public corrections section 
                of this website.
              </p>
              <p className="text-sm text-gray-600">
                This ensures complete transparency and helps maintain the accuracy of all content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}