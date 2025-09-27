'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              Twisted Torus
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/visualization" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/visualization' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Single Object
            </Link>
        <Link
          href="/dual-objects"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/dual-objects'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Dual Objects
        </Link>
        <Link
          href="/dual-objects-3d"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/dual-objects-3d'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          3D Objects
        </Link>
        <Link
          href="/blog"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/blog'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Blog
        </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

