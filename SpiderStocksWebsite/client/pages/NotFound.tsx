import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[15%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/40 p-10 text-center backdrop-blur">
        <span className="text-sm uppercase tracking-[0.46em] text-slate-200/70">
          404
        </span>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
          This page drifted off the market
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
          We couldn&apos;t locate the screen you&apos;re looking for. It may have been
          moved, or you might want to return to the dashboard to navigate to the
          latest intelligence.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90"
          >
            <ArrowLeft size={18} /> Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
