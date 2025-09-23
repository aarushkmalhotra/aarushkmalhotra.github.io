"use client";

import { useState } from "react";

interface ContactFormProps {
  action: string;
}

export function ContactForm({ action }: ContactFormProps) {
  const [message, setMessage] = useState("");
  const maxLen = 2000;

  return (
    <form action={action} method="POST" className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            maxLength={80}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary text-sm"
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoComplete="email"
            maxLength={120}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-xs font-medium text-foreground mb-1.5">
            Subject <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            required
            maxLength={100}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary text-sm"
            placeholder="Project Inquiry"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-xs font-medium text-foreground mb-1.5">
            Message <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <textarea
              name="message"
              id="message"
              required
              rows={4}
              minLength={10}
              maxLength={maxLen}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px] text-foreground shadow-sm focus:border-primary focus:ring-primary text-sm"
              placeholder="Your message..."
              aria-describedby="message-counter"
            ></textarea>
            <div id="message-counter" className="mt-1 text-[11px] text-muted-foreground text-right">
              {message.length}/{maxLen}
            </div>
          </div>
        </div>
        <div className="pt-1">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Send Message
          </button>
        </div>
      </div>
    </form>
  );
}
