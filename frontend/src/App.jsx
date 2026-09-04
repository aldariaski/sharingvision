import { NavLink, Route, Routes } from "react-router-dom";
import AllPosts from "./pages/AllPosts";
import AddNew from "./pages/AddNew";
import EditPost from "./pages/EditPost";
import Preview from "./pages/Preview";

function Layout({ children }) {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">Sharing Vision</div>

        <nav>
          <NavLink to="/" end>
            All Posts
          </NavLink>

          <NavLink to="/add">
            Add New
          </NavLink>

          <NavLink to="/preview">
            Preview
          </NavLink>
        </nav>
      </header>

      <main className="container">
        {children}
      </main>

      <footer className="footer">
        &copy; 2026 Yusuf Fakhri Aldrian (
        <a
          href="https://github.com/aldariaski"
          target="_blank"
          rel="noopener noreferrer"
        >
          aldariaski
        </a>
        ) made for Sharing Vision
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AllPosts />} />
        <Route path="/add" element={<AddNew />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </Layout>
  );
}