import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    { icon: "fab fa-github", href: "https://github.com", label: "GitHub" },
    { icon: "fab fa-linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "fab fa-twitter", href: "https://twitter.com", label: "Twitter" },
    { icon: "fab fa-dribbble", href: "https://dribbble.com", label: "Dribbble" },
  ];

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-gradient"
            data-testid="footer-logo"
          >
            App Sanity Customs
          </motion.div>

          <div className="flex gap-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label={link.label}
                data-testid={`social-link-${link.label.toLowerCase()}`}
              >
                <i className={link.icon}></i>
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-8 text-muted-foreground"
        >
          <p data-testid="footer-copyright">
            &copy; 2025 App Sanity Customs. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
