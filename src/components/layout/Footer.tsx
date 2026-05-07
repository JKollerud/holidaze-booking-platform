import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com', icon: <FaXTwitter /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://facebook.com', icon: <FaFacebook /> },
];

const CONTACT = [
  {
    label: 'holidaze@example.com',
    href: 'mailto:holidaze@example.com',
    icon: <FiMail />,
  },
  { label: '+99 00 00 00 00', href: 'tel:+99000000', icon: <FiPhone /> },
  { label: 'Holidaze street 1', href: undefined, icon: <FiMapPin /> },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <span className="font-heading font-extrabold text-white text-xl">
            Holidaze
          </span>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-between gap-6 sm:gap-10 mb-6">
          {CONTACT.map(({ label, href, icon }) => {
            const inner = (
              <div className="flex flex-col items-center gap-2 text-white/70">
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>
                <span className="font-body text-xs text-center leading-tight">
                  {label}
                </span>
              </div>
            );
            return href ? (
              <a
                key={label}
                href={href}
                className="flex justify-center hover:text-white transition-colors"
              >
                {inner}
              </a>
            ) : (
              <div key={label} className="flex justify-center">
                {inner}
              </div>
            );
          })}

          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-2xl" aria-hidden="true">
                {icon}
              </span>
              <span className="font-body text-xs">{label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-3 font-body text-xs text-white/30">
        © {new Date().getFullYear()} Holidaze. All rights reserved.
      </div>
    </footer>
  );
}
