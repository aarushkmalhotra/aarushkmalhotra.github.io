import { Metadata } from "next";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";

// Important: To make this form work, you need a Formspree account.
// 1. Create a new form on formspree.io.
// 2. Replace the placeholder URL below with your own Formspree form endpoint URL.
const FORMSPREE_URL = "https://formspree.io/f/mzzjpwwl";

export const metadata: Metadata = {
  title: "Contact – Aarush's Portfolio",
  description: "Have a project in mind, a question, or just want to say hi? Get in touch with me.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Get In Touch</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Traditional Contact Form */}
          <div className="bg-card border p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
            <form action={FORMSPREE_URL} method="POST">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  className="block w-full rounded-md border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="block w-full rounded-md border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            This form is powered by <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Formspree</a>.
          </p>
        </div>

        {/* Interactive Terminal */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Or Explore Via Terminal</h2>
          <InteractiveTerminal />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Click anywhere in the terminal and start typing commands!
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
