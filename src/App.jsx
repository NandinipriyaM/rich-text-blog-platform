import { Routes, Route, Link } from "react-router-dom";
import Editor from "./components/Editor";
import PostList from "./pages/PostList";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Editor</Link>
        <Link to="/posts">All Posts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/posts" element={<PostList />} />
      </Routes>
    </div>
  );
}

export default App;
