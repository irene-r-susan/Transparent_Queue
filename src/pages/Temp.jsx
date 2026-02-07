import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
       width: "100%",
padding: "15px",
boxSizing: "border-box",

        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        color: "white",
        position: "sticky",
        top: 0,
      }}
    >

      {/* Navigation Links */}
      <nav style={{ display: "flex", gap: "40px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            fontWeight: "600",
            color:"black",
            fontWeight:"500",
            textDecoration:"underline"
          }}
        >
          Home
        </Link>

        <Link
          to="/about"
          style={{
            textDecoration: "none",
            color: "white",
            fontWeight: "600",
            color:"black",
            fontWeight:"500",
            textDecoration:"underline"
          }}
        >
          About Us
        </Link>
      </nav>
    </header>
  );
}

export default Header;
