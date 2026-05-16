import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      {/* ZNN Logo */}
      <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg tracking-tight group-hover:bg-neutral-800 transition-colors">
        ZNN
      </div>
      
      {/* Product Architecture Text */}
      <span className="text-xl font-light tracking-tight group-hover:opacity-60 transition-opacity">
        Product Architecture
      </span>
    </Link>
  );
}
