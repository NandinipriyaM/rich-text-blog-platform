import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

const CATEGORY_OPTIONS = [
  "Technology",
  "Fitness",
  "Travel",
  "Education",
  "Food",
  "Lifestyle",
];

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const dropdownRef = useRef(null);

  /* Load posts */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("allPosts") || "[]");
    setPosts(saved);
  }, []);

  /* Close category dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Toggle category */
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  /* Delete post */
  const confirmDelete = () => {
    const updated = [...posts];
    updated.splice(deleteIndex, 1);
    localStorage.setItem("allPosts", JSON.stringify(updated));
    setPosts(updated);
    setShowDeleteModal(false);
    toast.success("Post deleted");
  };

  /* Remove HTML tags for content search */
  const stripHtml = (html) =>
    html.replace(/<[^>]*>?/gm, "").toLowerCase();

  /* FILTER LOGIC (CORRECT) */
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(post.content).includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      post.categories?.some((c) => selectedCategories.includes(c));

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>All Posts</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by title or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInput}
      />

      {/* 🏷️ Category Filter Dropdown */}
      <div ref={dropdownRef} style={{ position: "relative", marginBottom: "20px" }}>
        <div
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          style={dropdownBox}
        >
          {selectedCategories.length
            ? selectedCategories.join(", ")
            : "Filter by categories"}
          <span style={{ float: "right" }}>▼</span>
        </div>

        {showCategoryDropdown && (
          <div style={dropdownMenu}>
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} style={dropdownItem}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span style={{ marginLeft: "8px" }}>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post, index) => (
          <div key={index} style={postCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{post.title}</h3>
              <button
                style={deleteBtn}
                onClick={() => {
                  setDeleteIndex(index);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: "8px" }}>
              {post.categories?.map((cat) => (
                <span key={cat} style={tagStyle}>{cat}</span>
              ))}
            </div>

            {/* Content preview */}
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{ maxHeight: "200px", overflow: "hidden" }}
            />
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post?</p>
            <button onClick={confirmDelete} style={btn("#e74c3c")}>Delete</button>
            <button onClick={() => setShowDeleteModal(false)} style={btn("#7f8c8d")}>Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

/* Styles */
const searchInput = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const dropdownBox = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  borderRadius: "4px",
  background: "#fff",
  cursor: "pointer",
};

const dropdownMenu = {
  position: "absolute",
  width: "100%",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginTop: "4px",
  zIndex: 10,
};

const dropdownItem = {
  padding: "8px 12px",
  display: "flex",
};

const postCard = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "6px",
};

const deleteBtn = {
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const tagStyle = {
  display: "inline-block",
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "12px",
  marginRight: "6px",
  fontSize: "12px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "#fff",
  padding: "20px",
  width: "300px",
  borderRadius: "6px",
};

const btn = (bg) => ({
  background: bg,
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  marginRight: "10px",
  borderRadius: "4px",
  cursor: "pointer",
});

export default PostList;

