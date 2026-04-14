"use client";

import { ContactSection } from "./ui/contact";
import emailjs from "@emailjs/browser";
import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (data: any) => {
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing.");
      }

      const projectTypes = data.projectType.join(", ");
      
      const emailParams = {
        user_name: data.name,
        user_email: data.email,
        message: `${data.message}\n\nLooking for: ${projectTypes}`,
      };

      await emailjs.send(serviceId, templateId, emailParams, publicKey);

      setStatus("success");
      // Reset status after some time
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Form Submission Error:", error);
      setStatus("error");
      
      // If error is an object (like from EmailJS), extract message or stringify
      let detail = "Something went wrong. Please try again later.";
      if (typeof error === 'string') detail = error;
      else if (error?.text) detail = error.text; // EmailJS often returns { text: "..." }
      else if (error?.message) detail = error.message;
      else detail = JSON.stringify(error);

      setErrorMessage(detail);
    }
  };

  const getMessage = () => {
    switch (status) {
      case "sending": return "Sending Message...";
      case "success": return "Message Sent! ✨";
      case "error": return "Error Sending Message";
      default: return "Let's Talk! 👋";
    }
  };

  return (
    <ContactSection 
      onSubmit={handleFormSubmit}
      title={status === "success" ? "We'll be in touch soon!" : "Ready to build your masterpiece?"}
      mainMessage={getMessage()}
      errorMessage={errorMessage}
      isSubmitting={status === "sending"}
    />
  );
}
