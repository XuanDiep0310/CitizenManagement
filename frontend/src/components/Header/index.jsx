import { Users, LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { callLogout } from "../../services/api.service";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { Dropdown, message } from "antd";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const fullName = user.fullName;

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const res = await callLogout();
    console.log(res);
    if (res) {
      dispatch(doLogoutAction());
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };
  const items = [
    {
      key: "HomePage",
      label: <Link to="/profile">Home Page</Link>,
    },
    // {
    //   key: "manageUser",
    //   label: (
    //     <label
    //       style={{ cursor: "pointer" }}
    //       onClick={() => setIsModalOpenUser(true)}
    //     >
    //       Quản lý tài khoản
    //     </label>
    //   ),
    // },

    {
      key: "logout",
      label: (
        <label style={{ cursor: "pointer" }} onClick={handleLogout}>
          Logout
        </label>
      ),
      // icon: <IoLogOutOutline />,
    },
  ];
  if (user?.role === "Admin") {
    items.unshift({
      label: <Link to="/admin">Page Manage</Link>,
      key: "admin",
    });
  }

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
          {isAuthenticated === true ? (
            <></>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              <LogIn size={18} />
              Login
            </button>
          )}
          {isAuthenticated === true ? (
            <div style={{ cursor: "pointer" }}>
              <Dropdown menu={{ items }}>
                <button
                  className="access-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Access System
                </button>
              </Dropdown>
            </div>
          ) : (
            <button className="access-btn">Access System</button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
