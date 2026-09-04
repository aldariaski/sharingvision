import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { getArticle, updateArticle } from "../services/articleApi";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await getArticle(id);
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadArticle();
  }, [id]);

  async function submit(data) {
    await updateArticle(id, data);
    navigate("/");
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="empty">Loading...</div>;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Edit Article</h1>
          <p>Update the article and choose Publish or Draft.</p>
        </div>
      </div>

      <PostForm
        key={post.id}
        initial={{
          title: post.title,
          content: post.content,
          category: post.category,
          status: post.status,
        }}
        onSubmit={submit}
      />
    </section>
  );
}