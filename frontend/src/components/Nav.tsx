import { createSignal } from "solid-js";
import { CSSProperties } from "./Tag";

export default function NavBar() {
  const [isActive, setIsActive] = createSignal<string>("courses");
  
  // Inline styles as objects with type annotations
  const styles: { [key: string]: CSSProperties } = {
    navWrapper: {
      position: "sticky",
      top: "4px",
      "z-index": "100000000",
    },
    navbar: {
      display: "flex",
      "align-items": "center",
      "justify-content": "space-between",
      padding: "0.5rem 2rem",
      background: "black",
      color: "white",
      "font-family": "'Arial', sans-serif"
    },
    logo: {
      "font-size": "1.5rem",
      "font-weight": "bold",
      "text-decoration": "none",
      color: "white"
    },
    logoAccent: {
        "color": 'green',
        "font-style": "italic"
    },
    navLinks: {
      display: "flex",
      gap: "2rem"
    },
    navLink: {
      color: "white",
      "text-decoration": "none",
      padding: "0.5rem 0"
    },
    activeNavLink: {
      color: "white",
      "text-decoration": "none",
      padding: "0.5rem 0",
      "font-weight": "bold",
      "border-bottom": "2px solid white"
    },
    navButtons: {
      display: "flex",
      "align-items": "center",
      gap: "1rem"
    },
    searchBtn: {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer"
    },
    ctaButton: {
      background: "rgb(0, 170, 180)",
      "background": 'green',

      color: "black",
      "text-decoration": "none",
      padding: "0.5rem 1.5rem",
      "border-radius": "50px",
      "font-weight": "bold"
    },
    loginLink: {
      color: "white",
      "text-decoration": "none"
    }
  };

  // Helper function to handle navigation clicks
  const handleNavClick = (e: MouseEvent, navItem: string) => {
    e.preventDefault();
    setIsActive(navItem);
  };

  return (
    <div style={styles.navWrapper}>
      <header>
        <nav style={styles.navbar}>
          <div>
            <a href="/" style={styles.logo}>
              <span>Frontend</span>
              <span style={styles.logoAccent}>Masters</span>
            </a>
          </div>
          <div style={styles.navLinks}>
            <a 
              href="/features" 
              style={isActive() === "features" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "features")}
            >
              Features
            </a>
            <a 
              href="/learn" 
              style={isActive() === "learn" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "learn")}
            >
              Learn
            </a>
            <a 
              href="/courses" 
              style={isActive() === "courses" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "courses")}
            >
              Courses
            </a>
            <a 
              href="/tutorials" 
              style={isActive() === "tutorials" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "tutorials")}
            >
              Tutorials
            </a>
            <a 
              href="/blog" 
              style={isActive() === "blog" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "blog")}
            >
              Blog
            </a>
            <a 
              href="/pricing" 
              style={isActive() === "pricing" ? styles.activeNavLink : styles.navLink}
              onClick={(e) => handleNavClick(e, "pricing")}
            >
              Pricing
            </a>
          </div>
          <div style={styles.navButtons}>
            <button style={styles.searchBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"/>
              </svg>
            </button>
            <a href="/join-now" style={styles.ctaButton}>Join Now</a>
            <a href="/login" style={styles.loginLink}>Login</a>
          </div>
        </nav>
      </header>
    </div>
  );
};

