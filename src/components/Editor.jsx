import { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Editor.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

const CATEGORY_OPTIONS = [
  "Technology",
  "Fitness",
  "Travel",
  "Education",
  "Food",
  "Lifestyle",
];

function Editor() {
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Save modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  // Category dropdown
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Hyperlink modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");

  const quillRef = useRef(null);

  /* Load Draft */
  useEffect(() => {
    const savedContent = localStorage.getItem("draftContent");
    const savedCategories = localStorage.getItem("draftCategories");
    if (savedContent) setContent(savedContent);
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  /* Auto-save (30s of inactivity) */
  useEffect(() => {
    if (!content && categories.length === 0) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem("draftContent", content);
        localStorage.setItem("draftCategories", JSON.stringify(categories));
        toast.info("Draft auto-saved", {
          autoClose: 1200,
          toastId: "autosave",
        });
      } catch {
        toast.error("Failed to auto-save draft");
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [content, categories]);

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

  /* Image & Link Handlers */
  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();

            input.onchange = () => {
              const file = input.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);

                let progress = 0;
                setUploadProgress(1);

                const timer = setInterval(() => {
                  progress += 10;
                  setUploadProgress(progress);

                  if (progress >= 100) {
                    clearInterval(timer);
                    quill.insertEmbed(range.index, "image", reader.result);
                    quill.setSelection(range.index + 1);
                    toast.success("Image uploaded!");
                    setTimeout(() => setUploadProgress(0), 400);
                  }
                }, 100);
              };
              reader.readAsDataURL(file);
            };
          },
          link: () => {
            setLinkURL("");
            setLinkText("");
            setShowLinkModal(true);
          },
        },
      },
    }),
    []
  );

  /* Category toggle */
  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  /* Save Post */
  const handleSavePost = () => {
    if (!postTitle.trim()) {
      toast.error("Post title is required");
      return;
    }

    try {
      const posts = JSON.parse(localStorage.getItem("allPosts") || "[]");

      posts.push({
        title: postTitle.trim(),
        content,
        categories,
        date: new Date().toISOString(),
      });

      localStorage.setItem("allPosts", JSON.stringify(posts));
      localStorage.removeItem("draftContent");
      localStorage.removeItem("draftCategories");

      setPostTitle("");
      setShowSaveModal(false);
      toast.success("Post saved successfully!");
    } catch {
      toast.error("Failed to save post");
    }
  };

const handleInsertLink = () => {
  if (!linkURL.trim()) {
    toast.error("URL is required");
    return;
  }

  // Ensure protocol
  let url = linkURL.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const quill = quillRef.current.getEditor();
  const range = quill.getSelection(true);
  const text = linkText.trim() || url;
  quill.insertText(range.index, text, "link", url);
  setShowLinkModal(false);
  toast.success("Link inserted!");
};

  return (
    <div className="editor-container">
      {/* Buttons */}
      <div className="editor-actions">
        <button onClick={() => setIsPreview(!isPreview)} className="btn primary">
          {isPreview ? "Edit Mode" : "Preview Mode"}
        </button>
        <button onClick={() => setShowSaveModal(true)} className="btn success">
          Save Post
        </button>
      </div>

      {/* Category Dropdown */}
      <div ref={dropdownRef} className="category-wrapper">
        <div
          className="category-box"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          {categories.length ? categories.join(", ") : "Select categories"}
          <span>▼</span>
        </div>

        {showCategoryDropdown && (
          <div className="category-menu">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="category-item">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {/* Editor / Preview */}
      {isPreview ? (
        <div className="preview-pane" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className="editor-quill"
        />
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter Post Title</h3>
            <input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title"
            />
            <div className="modal-actions">
              <button onClick={handleSavePost} className="btn success">
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn danger"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Insert Link</h3>
            <input
              placeholder="Enter URL"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
            />
            <input
              placeholder="Display Text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleInsertLink} className="btn success">
                Insert
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="btn danger"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Editor;
