import { Link } from "react-router-dom";

export default function PostTable({ posts, onTrash }) {
  if (!posts.length) {
    return (
      <div className="empty">
        No articles in this tab.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.title}</td>

            <td>{post.category}</td>

            <td className="table-actions">
              <Link
                className="icon-button"
                title="Edit"
                to={`/edit/${post.id}`}
              >
                ✏️
              </Link>

              {post.status !== "thrash" && (
                <button
                  type="button"
                  className="icon-button"
                  title="Move to Trash"
                  onClick={() => onTrash(post)}
                >
                  🗑️
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}