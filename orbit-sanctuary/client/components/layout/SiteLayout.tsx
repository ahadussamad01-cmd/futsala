import { Link, Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            futsal
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#rules">rules</a>
            <a href="#contact">contact</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-3xl px-4 py-12 text-xs text-muted-foreground">
        <div className="flex items-center justify-between border-t border-border pt-6">
          <span>© {new Date().getFullYear()} futsal booking</span>
          <a id="contact" href="mailto:bookings@example.com">bookings@example.com</a>
        </div>
      </footer>
    </div>
  );
}
