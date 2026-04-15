"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  /**
   * The title for the contact section.
   */
  title?: string;
  /**
   * The subtitle or main message for the introductory part.
   */
  mainMessage?: string;
  /**
   * The contact email to display.
   */
  contactEmail?: string;
  /**
   * Array of social media links. Each object should have an 'id', 'name', 'iconSrc', and 'href'.
   */
  socialLinks?: Array<{ id: string; name: string; iconSrc: string; href: string }>;
  /**
   * Placeholder image for the background.
   */
  backgroundImageSrc?: string;
  /**
   * Callback function when the form is submitted.
   * @param data The form data.
   */
  onSubmit?: (data: any) => void;
  /**
   * Optional error message to display.
   */
  errorMessage?: string;
  /**
   * Whether the form is currently submitting.
   */
  isSubmitting?: boolean;
}

const defaultSocialLinks = [
  { id: '1', name: 'X', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/x.svg', href: '#x' },
  { id: '2', name: 'Instagram', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg', href: '#instagram' },
  { id: '3', name: 'LinkedIn', iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg', href: '#linkedin' },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "We can turn your dream project into reality",
  mainMessage = "Let's talk! 👋",
  contactEmail = "hello@pixelperfect.com",
  socialLinks = defaultSocialLinks,
  backgroundImageSrc = "https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDY0fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900",
  onSubmit,
  errorMessage,
  isSubmitting,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
    projectType: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      if (checked) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Form submitted:", formData);
  };

  const projectTypeOptions = [
    'Website', 'Mobile App', 'Web App', 'E-Commerce',
    'Brand Identity', '3D & Animation', 'Social Media Marketing',
    'Brand Strategy & Consulting', 'Other'
  ];

  return (
    <section id="contact" className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out opacity-20 grayscale"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      >
        {/* Animated Bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "100%" }}
              animate={{ 
                opacity: [0, 1, 0],
                y: "-100vh",
                x: [0, Math.random() * 100 - 50]
              }}
              transition={{ 
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
              className="absolute bg-blue-500/20 rounded-full"
              style={{
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-[100dvh] p-4 md:p-8 lg:p-12">
        {/* Main Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl px-4 py-12 rounded-xl">
          {/* Left Side: Title */}
          <div className="flex flex-col justify-center p-4 lg:p-8">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-6 flex items-center gap-2"
            >
              <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-transparent" />
              Get In Touch
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] max-w-lg mb-8"
            >
              Let&apos;s build something <span className="text-blue-500">legendary.</span>
            </motion.h1>
            <p className="text-lg text-white/40 max-w-md font-light">
              Specializing in high-performance digital solutions. 
              Drop us a line and let&apos;s turn your vision into reality.
            </p>
          </div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{mainMessage}</h2>
            {errorMessage ? (
              <p className="text-red-400 text-sm mb-8 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {errorMessage}
              </p>
            ) : (
              <p className="text-white/40 text-sm mb-8">Leave us a brief message about your project.</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Your name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Krish Bohra" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="bg-white/5 border-white/5 rounded-xl h-12 focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="hello@pixelperfect.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="bg-white/5 border-white/5 rounded-xl h-12 focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Project Idea</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your next big thing..."
                  className="min-h-[100px] bg-white/5 border-white/5 rounded-xl focus:border-blue-500/50"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-white/30 ml-1">I&apos;m looking for...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {projectTypeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={option.replace(/\s/g, '-').toLowerCase()}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={option.replace(/\s/g, '-').toLowerCase()} className="text-xs font-medium text-white/50 group-hover:text-white transition-colors cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
