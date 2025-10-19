import { Users, Home, FileText, BarChart3, ArrowRight } from "lucide-react";
import "../../assets/styles/homePage.scss";
const HomePage = () => {
  const features = [
    {
      icon: <Users className="feature-icon" />,
      title: "Citizen Management",
      description:
        "Register and manage citizen records with complete information",
    },
    {
      icon: <Home className="feature-icon" />,
      title: "Household Records",
      description: "Track household information and member relationships",
    },
    {
      icon: <FileText className="feature-icon" />,
      title: "Vital Certificates",
      description: "Issue and manage birth and death certificates",
    },
    {
      icon: <BarChart3 className="feature-icon" />,
      title: "Reports & Analytics",
      description: "Generate comprehensive reports and statistics",
    },
  ];
  return (
    <>
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">Government Citizen Management System</h1>
          <p className="hero-description">
            Comprehensive solution for managing citizen records,
            <br />
            households, vital certificates, and administrative data
          </p>
          <button className="get-started-btn">
            Get Started <ArrowRight size={20} />
          </button>
        </div>

        <div className="features-section">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-content">
                {feature.icon}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
export default HomePage;
