import { useEffect, useState } from "react";
import { getArticles } from "../services/articleApi";

const PAGE_SIZE = 5;

export default function Preview() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getArticles(
          PAGE_SIZE,
          page * PAGE_SIZE
        );

        const published = data.filter(
          (post) => post.status === "publish"
        );

        setPosts(published);
        setHasNext(data.length === PAGE_SIZE);
      } catch (err) {
        setError(err.message);
        setPosts([]);
        setHasNext(false);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Preview</h1>
          <p>Published articles displayed as a blog.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="empty">Loading...</div>
      ) : (
        <>
          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.id}>
                <span className="category">
                  {post.category}
                </span>

                <h2>{post.title}</h2>

                <p>{post.content}</p>

                <small>
                  {new Date(
                    post.created_date
                  ).toLocaleDateString()}
                </small>
              </article>
            ))}
          </div>

          {!posts.length && (
            <div className="empty">
              No published articles on this page.
            </div>
          )}

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