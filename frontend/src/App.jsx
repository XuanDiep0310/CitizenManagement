// import reactLogo from "./assets/react.svg";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import "./App.css";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import AdminPage from "./pages/admin";
import NotFound from "./components/NotFound";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import CitizensTable from "./components/Admin/Citizens/CitizensTable";

const Layout = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Header />
        <div
          style={{
            flex: "1",
            // background: "red",
          }}
        >
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <AdminPage /> },
        { path: "citizen", element: <CitizensTable /> },
        { path: "household", element: <div>household</div> },
        { path: "residence", element: <div>residence</div> },
        { path: "certificates", element: <div>certificates</div> },
        { path: "reports", element: <div>reports</div> },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
  return (
    <>
      {/* <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a> */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
