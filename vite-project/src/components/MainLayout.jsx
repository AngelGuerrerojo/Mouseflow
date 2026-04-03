import { Outlet } from "react-router";
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function MainLayout({ withFooter = false }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TopNav />
      <main style={{ paddingTop: "84px" }}>
        <Outlet />
      </main>
      {withFooter && <Footer />}
    </div>
  );
}
