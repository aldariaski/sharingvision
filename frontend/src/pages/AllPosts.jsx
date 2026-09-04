import { useEffect, useState } from "react";
import { getArticles, updateArticle } from "../services/articleApi";
import PostTable from "../components/PostTable";

const PAGE_SIZE = 10;

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("publish");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

  async function loadPosts() {
    setLoading(true);
    setError("");

    try {
      const data = await getArticles(PAGE_SIZE, page * PAGE_SIZE);

      setPosts(data);
      setHasNext(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
      setPosts([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [page]);

  const filteredPosts = posts.filter(
    (post) => post.status === tab
  );

  async function moveToTrash(post) {
    try {
      await updateArticle(post.id, {
        title: post.title,
        content: post.content,
        category: post.category,
        status: "thrash",
      });

      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  }

  function changeTab(value) {
    setTab(value);
    setPage(0);
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>All Posts</h1>
          <p>Manage published, draft, and trashed articles.</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === "publish" ? "active" : ""}
          onClick={() => changeTab("publish")}
        >
          Published
        </button>

        <button
          className={tab === "draft" ? "active" : ""}
          onClick={() => changeTab("draft")}
        >
          Drafts
        </button>

        <button
          className={tab === "thrash" ? "active" : ""}
          onClick={() => changeTab("thrash")}
        >
          Trashed
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="empty">Loading...</div>
      ) : (
        <>
          <PostTable
            posts={filteredPosts}
            onTrash={moveToTrash}
          />

          <div className="pagination">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>Page {page + 1}</span>

            <button
              disabled={!hasNext}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}