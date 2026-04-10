import Link from 'next/link';

export const metadata = {
  title: 'Gravitiq - Authentication',
  description: 'Sign in or create your Gravitiq account',
};

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel - hidden on mobile */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              animation: 'pulse 8s ease-in-out infinite alternate',
            }}
          />
        </div>

        {/* Branding content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Gravitiq</span>
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Pull your business
              <br />
              into orbit.
            </h1>
            <p className="max-w-md text-lg text-indigo-100">
              Streamline your workflows, accelerate growth, and unlock your
              team&apos;s full potential with Gravitiq.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            &copy; {new Date().getFullYear()} Gravitiq. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - form content */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile logo */}
        <div className="px-6 pt-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Gravitiq
            </span>
          </Link>
        </div>

        {/* Centered form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
