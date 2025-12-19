import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./PostList.css";

const CATEGORY_OPTIONS = [
  "Technology", "Fitness", "Travel", "Education", "Food", "Lifestyle",
];

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("allPosts") || "[]");
    setPosts(saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const confirmDelete = () => {
    const updated = [...posts];
    updated.splice(deleteIndex, 1);
    localStorage.setItem("allPosts", JSON.stringify(updated));
    setPosts(updated);
    setShowDeleteModal(false);
    toast.success("Post deleted");
  };

  const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "").toLowerCase();

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
    <div className="postlist-container">
      <h2>All Posts</h2>

      <input
        type="text"
        placeholder="Search by title or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div ref={dropdownRef} className="category-wrapper">
        <div className="category-box" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
          {selectedCategories.length ? selectedCategories.join(", ") : "Filter by categories"}
          <span>▼</span>
        </div>
        {showCategoryDropdown && (
          <div className="category-menu">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="category-item">
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="post-header">
              <h3>{post.title}</h3>
              <button className="delete-btn" onClick={() => { setDeleteIndex(index); setShowDeleteModal(true); }}>Delete</button>
            </div>
            <div className="post-categories">
              {post.categories?.map((cat) => (
                <span key={cat} className="tag">{cat}</span>
              ))}
            </div>
            <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-actions">
               <button onClick={confirmDelete} className="btn red">Delete</button>
               <button onClick={() => setShowDeleteModal(false)} className="btn gray">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default PostList;