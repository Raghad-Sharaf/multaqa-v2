import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-muted-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-muted py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-6 md:px-12 text-center text-sm">
          <p>© {new Date().getFullYear()} Multaqa. Your seat. Secured.</p>
        </div>
      </footer>
    </div>
  );
}
