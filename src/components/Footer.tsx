export function Footer() {
    return (
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SourceCraft. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Add social links here if needed */}
          </div>
        </div>
      </footer>
    );
  }
  