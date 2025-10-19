import { Users, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <Users size={20} />
          </div>
          <span className="logo-text">Citizen Management System</span>
        </div>
        <div className="header-actions">
          <button className="login-btn" onClick={handleLogin}>
            <LogIn size={18} />
            Login
          </button>
          <button className="access-btn">Access System</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
