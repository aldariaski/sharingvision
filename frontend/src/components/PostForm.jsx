import { useState } from "react";

export default function PostForm({
  initial = {
    title: "",
    content: "",
    category: "",
    status: "draft",
  },
  onSubmit,
}) {
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [category, setCategory] = useState(initial.category || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(status) {
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        status,
      });
    } catch (err) {
      const validationErrors = Object.entries(
        err.details || {}
      )
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ");

      setError(validationErrors || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="form-card"
      onSubmit={(e) => e.preventDefault()}
    >
      {error && <div className="error">{error}</div>}

      <label htmlFor="title">Title</label>

      <input
        id="title"
        type="text"
        value={title}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Minimal 20 karakter"
        disabled={loading}
      />

      <label htmlFor="content">Content</label>

      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Minimal 200 karakter"
        rows={12}
        disabled={loading}
      />

      <label htmlFor="category">Category</label>

      <input
        id="category"
        type="text"
        value={category}
        maxLength={100}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Minimal 3 karakter"
        disabled={loading}
      />

      <div className="actions">
        <button
          type="button"
          className="primary"
          onClick={() => submit("publish")}
          disabled={loading}
        >
          {loading ? "Saving..." : "Publish"}
        </button>

        <button
          type="button"
          onClick={() => submit("draft")}
          disabled={loading}
        >
          Draft
        </button>
      </div>
    </form>
  );
}