import { useState } from "react";
import { Users, ArrowLeft } from "lucide-react";
import "../../assets/styles/loginPage.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Login attempt:", { email, password });
    alert(`Login with: ${email}`);
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-icon">
            <Users size={32} />
          </div>
        </div>

        <h1 className="login-title">Citizen Management System</h1>
        <p className="login-subtitle">Sign in to access the system</p>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} className="sign-in-btn">
            Sign In
          </button>
        </div>

        <button className="back-link">
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};
export default LoginPage;
