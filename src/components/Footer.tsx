import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-volcanic text-parchment-300 mt-auto">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-xl text-parchment mb-3">
              Mt Tabor Bulb Society
            </h3>
            <p className="text-parchment-400 italic mb-4">
              Growing Community / Community Grows
            </p>
            <p className="text-sm text-parchment-500 max-w-md">
              Fostering bulb exchanges between neighbors, supporting native and heirloom
              bulb species, and sharing knowledge through experimental test plots and
              community education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-parchment mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-daffodil transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-daffodil transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-daffodil transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:text-daffodil transition-colors">
                  Get Involved
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Pillars */}
          <div>
            <h4 className="font-semibold text-parchment mb-4">Our Pillars</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-daffodil rounded-full"></span>
                Community
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-moss rounded-full"></span>
                Conservation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-crocus rounded-full"></span>
                Education
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-volcanic-600 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-parchment-500">
          <p>&copy; {new Date().getFullYear()} Mt Tabor Bulb Society. Portland, Oregon.</p>
          <p>
            Made with care for the Mt Tabor community
          </p>
        </div>
      </div>
    </footer>
  );
}
