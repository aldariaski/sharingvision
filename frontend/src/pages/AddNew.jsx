import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createArticle } from "../services/articleApi";

export default function AddNew() {
  const navigate = useNavigate();

  async function submit(data) {
    await createArticle(data);
    navigate("/");
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Add New</h1>
          <p>Create an article and publish it or save it as a draft.</p>
        </div>
      </div>

      <PostForm onSubmit={submit} />
    </section>
  );
}