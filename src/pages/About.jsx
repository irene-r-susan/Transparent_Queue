export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(ellipse at center, #f0f4f8, rgba(0, 162, 255, 0.3), #e0f7fa)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          padding: "30px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <h1>About Us</h1>

        <p>
          Welcome to <b>Primary Health Centre</b>, where we are dedicated to
          providing quality healthcare services with care, trust, and efficiency.
        </p>

        <p>
          Our hospital offers essential medical support through departments such
          as <b>General Consultation, Cardiology, and Dentistry</b>.
        </p>

        <p>
          To improve the patient experience, we have introduced the{" "}
          <b>Transparent Queue System</b>, which helps patients view expected
          waiting times and reduces crowding.
        </p>

        <p>
          Our mission is to make healthcare more{" "}
          <b>accessible, organized, and patient-friendly</b>.
        </p>

        <p>
          Thank you for choosing <b>Primary Health Centre</b> — your health is
          our priority.
        </p>
      </div>
    </div>
  );
}
