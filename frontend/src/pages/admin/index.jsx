import {
  Users,
  Home,
  FileText,
  MapPin,
  Plus,
  Search,
  Download,
  User,
} from "lucide-react";
import CountUp from "react-countup";
import "../../assets/styles/dashboard.scss";
const AdminPage = () => {
  const stats = [
    {
      title: "Total Citizens",
      value: 12543,
      change: "+2.5% from last month",
      icon: <Users size={24} />,
      iconBg: "#e6f4ff",
      iconColor: "#1890ff",
    },
    {
      title: "Households",
      value: 3842,
      change: "+1.2% from last month",
      icon: <Home size={24} />,
      iconBg: "#e6fffb",
      iconColor: "#13c2c2",
    },
    {
      title: "Certificates",
      value: 8291,
      change: "+5.1% from last month",
      icon: <FileText size={24} />,
      iconBg: "#f9f0ff",
      iconColor: "#722ed1",
    },
    {
      title: "Temp Residence",
      value: 456,
      change: "+0.8% from last month",
      icon: <MapPin size={24} />,
      iconBg: "#fff7e6",
      iconColor: "#fa8c16",
    },
  ];

  const quickActions = [
    {
      icon: <Plus size={20} />,
      title: "Add Citizen",
      description: "Register a new citizen",
    },
    {
      icon: <Plus size={20} />,
      title: "New Household",
      description: "Create household record",
    },
    {
      icon: <Search size={20} />,
      title: "Search Records",
      description: "Find citizen information",
    },
    {
      icon: <Download size={20} />,
      title: "Export Data",
      description: "Generate reports",
    },
  ];

  const activities = [
    {
      icon: <User size={20} />,
      iconBg: "#e6f4ff",
      iconColor: "#1890ff",
      title: "New citizen registered",
      description: "Nguyen Van A",
      time: "2 hours ago",
    },
    {
      icon: <Home size={20} />,
      iconBg: "#e6fffb",
      iconColor: "#13c2c2",
      title: "Household updated",
      description: "Household #HH-2025-001",
      time: "4 hours ago",
    },
    {
      icon: <FileText size={20} />,
      iconBg: "#f9f0ff",
      iconColor: "#722ed1",
      title: "Birth certificate issued",
      description: "Certificate #BC-2025-0542",
      time: "1 day ago",
    },
    {
      icon: <MapPin size={20} />,
      iconBg: "#fff7e6",
      iconColor: "#fa8c16",
      title: "Temp residence registered",
      description: "Tran Thi B",
      time: "2 days ago",
    },
    {
      icon: <User size={20} />,
      iconBg: "#e6f4ff",
      iconColor: "#1890ff",
      title: "Citizen record updated",
      description: "Le Van C",
      time: "3 days ago",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <div className="stat-label">{stat.title}</div>
                <div className="stat-value">
                  <CountUp end={stat.value} separator="," />
                </div>
                <div className="stat-change">{stat.change}</div>
              </div>
              <div
                className="stat-icon"
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="quick-actions-card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
            <p className="card-subtitle">Common tasks</p>
          </div>
          <div className="actions-list">
            {quickActions.map((action, index) => (
              <button key={index} className="action-item">
                <div className="action-icon">{action.icon}</div>
                <div className="action-text">
                  <div className="action-title">{action.title}</div>
                  <div className="action-description">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <p className="card-subtitle">Latest system activities</p>
          </div>
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div
                  className="activity-icon"
                  style={{
                    background: activity.iconBg,
                    color: activity.iconColor,
                  }}
                >
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">
                    {activity.description}
                  </div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
