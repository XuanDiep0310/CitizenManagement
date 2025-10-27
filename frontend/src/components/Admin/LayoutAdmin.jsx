import { Col, Dropdown, Layout, Menu, Row } from "antd";
const { Content, Footer, Sider } = Layout;
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { FaBars } from "react-icons/fa";

// import { callLogout } from "../../services/api.service";
// import { doLogoutAction } from "../../redux/account/accountSlice";
const LayoutAdmin = () => {
  const [current, setCurrent] = useState("");
  //   const [isModalOpenUser, setIsModalOpenUser] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const handleLogout = async () => {
    // const res = await callLogout();
    // if (res && res?.data) {
    //   dispatch(doLogoutAction());
    //   message.success("Đăng xuất thành công");
    //   navigate("/");
    // }
    console.log("logout");
  };
  const itemsMenu = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/admin/citizen">Citizen</Link>,
      key: "citizen",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/admin/household">Household</Link>,
      key: "household",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/admin/residence">Residence</Link>,
      key: "residence",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/admin/certificates">Certificates</Link>,
      key: "certificates",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/admin/reports">Reports</Link>,
      key: "reports",
      icon: <HomeOutlined />,
    },
  ];
  const items = [
    // {
    //   label: <Link to="/">Trang chủ</Link>,
    //   key: "home",
    // },
    // {
    //   label: <Link to="/history">Lịch sử mua hàng</Link>,
    //   key: "history",
    // },
    // {
    //   key: "manage",
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
          Đăng xuất
        </label>
      ),
      icon: <LogoutOutlined />,
    },
  ];
  //   const user = useSelector((state) => state.account.user);
  //   const role = user.role;
  //   const fullName = user.fullName;
  //   const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
  //     user?.avatar
  //   }`;
  const role = "ADMIN";

  const location = useLocation();

  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = [
        "citizen",
        "household",
        "residence",
        "certificates",
        "reports",
      ];
      const currentRoute = allRoutes.find((item) =>
        location.pathname.startsWith(`/admin/${item}`)
      );
      if (currentRoute) {
        setCurrent(currentRoute);
      } else {
        setCurrent("dashboard");
      }
    }
  }, [location]);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {role == "ADMIN" && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="dark"
          >
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin</h2>
            <Menu
              theme="dark"
              selectedKeys={[current]}
              // defaultSelectedKeys={["dashboard"]}
              onClick={(e) => {
                setCurrent(e.key);
              }}
              mode="inline"
              items={itemsMenu}
            />
          </Sider>
        )}

        <Layout>
          {/* <header
            style={{
              padding: "14px 0px",
              background: "#ddd",
              margin: 0,
            }}
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 30px",
              }}
              gutter={[20, 20]}
            >
              <Col>
                <FaBars
                  size={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Col>
              <Col>
                {/* <Dropdown menu={{ items }}> */}
          {/* <a onClick={(e) => e.preventDefault()}> */}
          {/* <Space>
                        <Avatar src={urlAvatar} />
                        {fullName}
                      </Space> */}
          {/* </a> */}
          {/* </Dropdown> */}
          {/* </Col> */}
          {/* </Row> */}
          {/* </header> */}

          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <Outlet />
            </div>
          </Content>
          {role == "ADMIN" && (
            <Footer style={{ textAlign: "center", background: "#ddd" }}>
              Copy right © Designed by Tial 2025
            </Footer>
          )}
        </Layout>
      </Layout>
    </>
  );
};
export default LayoutAdmin;
