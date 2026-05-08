import Link from 'next/link';
import { Activity } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Activity size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                PulseOps
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Services
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
