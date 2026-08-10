import logo from "../assets/SMARTLogo.png";

function SMARTLogo({ className = "" }) {
  return (
    <img
      src={logo}
      alt="SMARTLogo"
      className={className}
    />
  );
}

export default SMARTLogo;