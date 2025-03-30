// Header.jsx
import { createSignal, onMount } from "solid-js";

const Header = () => {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);
  const [isScrolled, setIsScrolled] = createSignal(false);
  
  // Handle responsive layout and scroll effects
  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  // Enhanced styles with library background image
  const headerStyles = {
    background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(30, 58, 138, 0.85)), url('https://stanforddaily.com/wp-content/uploads/2018/05/building-aisle-library-public-library-inventory-bookselling-24143-pxhere.com_.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    padding: isScrolled() ? "1rem 1.5rem" : "2rem 1.5rem",
    boxShadow: isScrolled() ? "0 4px 20px rgba(0, 0, 0, 0.25)" : "0 4px 15px rgba(0, 0, 0, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
    // position: "sticky",
    top: "0",
    zIndex: "50",
    transition: "all 0.3s ease"
  };
  
  const containerStyles = {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    flexDirection: isMobile() ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: isMobile() ? "1.5rem" : "2rem"
  };
  
  const titleContainerStyles = {
    display: "flex",
    flexDirection: "column",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  };
  
  const titleStyles = {
    fontSize: isScrolled() ? "1.75rem" : "2.25rem",
    fontWeight: "700",
    letterSpacing: "-0.025em",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease"
  };
  
  const subtitleStyles = {
    color: "#e2e8f0",
    marginTop: "0.5rem",
    fontSize: isScrolled() ? "1rem" : "1.125rem",
    transition: "all 0.3s ease",
    maxWidth: "500px"
  };
  
  const searchContainerStyles = {
    display: "flex",
    flexDirection: isMobile() ? "column" : "row",
    gap: "1rem",
    width: isMobile() ? "100%" : "auto",
    alignItems: isMobile() ? "stretch" : "center",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  };
  
  const inputContainerStyles = {
    position: "relative",
    width: "100%",
    transition: "all 0.3s ease"
  };
  
  const inputStyles = {
    padding: "0.75rem 1rem",
    paddingRight: "2.5rem",
    borderRadius: "9999px",
    color: "#1f2937",
    width: "100%",
    outline: "none",
    border: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.05)",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    backgroundColor: "rgba(255, 255, 255, 0.95)"
  };
  
  const searchIconStyles = {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
    cursor: "pointer",
    transition: "color 0.2s ease"
  };
  
  const buttonContainerStyles = {
    display: "flex",
    gap: "0.75rem",
    width: isMobile() ? "100%" : "auto",
    justifyContent: isMobile() ? "center" : "flex-start",
    flexWrap: isMobile() ? "wrap" : "nowrap"
  };
  
  const baseButtonStyles = {
    fontWeight: "600",
    padding: "0.625rem 1.25rem",
    borderRadius: "9999px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: isMobile() ? "100px" : "auto"
  };
  
  const holidayButtonStyles = {
    ...baseButtonStyles,
    backgroundColor: "#eab308",
    color: "#1f2937"
  };
  
  const adventureButtonStyles = {
    ...baseButtonStyles,
    backgroundColor: "#dc2626",
    color: "white"
  };
  
  const inspirationButtonStyles = {
    ...baseButtonStyles,
    backgroundColor: "#16a34a",
    color: "white"
  };
  
  const iconSvgStyles = {
    display: "inline-block",
    verticalAlign: "middle",
    height: isScrolled() ? "100px" : "124px",
    width: isScrolled() ? "20px" : "24px",
    marginRight: "8px",
    transition: "all 0.3s ease",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
  };
  
  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <div style={titleContainerStyles}>
          <h1 style={titleStyles}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              style={iconSvgStyles}
            >
              <path d="M12 2L7 7h10l-5 5 5 5H7l5 5" />
            </svg>
            Jewish Heritage Stories
          </h1>
          <p style={subtitleStyles}>Discover our collection of cultural and holiday tales from around the world</p>
        </div>
        
        <div style={searchContainerStyles}>
          <div style={inputContainerStyles}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.target.value)}
              style={inputStyles}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15)";
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.99)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.05)";
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
              }}
            />
            <span style={searchIconStyles}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <div style={buttonContainerStyles}>
            <button 
              style={holidayButtonStyles}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#ca8a04";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#eab308";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
              }}
            >
              Holiday
            </button>
            <button 
              style={adventureButtonStyles}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#b91c1c";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#dc2626";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
              }}
            >
              Adventure
            </button>
            <button 
              style={inspirationButtonStyles}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#15803d";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#16a34a";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
              }}
            >
              Inspiration
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;