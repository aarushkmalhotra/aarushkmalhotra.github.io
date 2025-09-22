// Important: To make this form work, create a form on formspree.io and replace the placeholder URL.
const FORMSPREE_URL = "https://formspree.io/f/your_form_id";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Get In Touch</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="bg-card border p-8 rounded-lg shadow-sm">
          <form action={FORMSPREE_URL} method="POST">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="block w-full rounded-md border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-primary"
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
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
            This form is powered by Formspree.
        </p>
      </div>
    </div>
  );
}
