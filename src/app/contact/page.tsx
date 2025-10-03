import { Metadata } from "next";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { ContactForm } from "./ContactForm";
import { config } from "@/lib/config";

// Important: To make this form work, you need a Formspree account.
// 1. Create a new form on formspree.io.
// 2. Add your Formspree URL to your .env.local file as NEXT_PUBLIC_FORMSPREE_URL
const FORMSPREE_URL = config.formspreeUrl;

export const metadata: Metadata = {
  title: `Contact – ${config.siteName}`,
  description: "Have a project in mind, a question, or just want to say hi? Get in touch with me.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Get In Touch</h1>
          <p className="text-base md:text-lg text-muted-foreground mt-2.5">
            Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Traditional Contact Form */}
          <div className="bg-card border p-5 md:p-6 rounded-lg shadow-sm">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Send a Message</h2>
            <ContactForm action={FORMSPREE_URL} />
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            This form is powered by <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Formspree</a>.
          </p>
        </div>

        {/* Interactive Terminal */}
        <div>
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Or Explore Via Terminal</h2>
          <InteractiveTerminal />
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            Click anywhere in the terminal and start typing commands!
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
