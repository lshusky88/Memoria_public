
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Memoria. All rights reserved.
        </p>
        <div className="flex items-center space-x-1">
          <p className="text-sm text-muted-foreground">
            Made with
          </p>
          <Heart className="h-4 w-4 text-destructive" />
          <p className="text-sm text-muted-foreground">
            for families everywhere
          </p>
        </div>
        <nav className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
