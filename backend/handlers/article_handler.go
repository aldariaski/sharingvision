package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"sharing-vision/backend/models"
)

type ArticleHandler struct {
	DB *sql.DB
}

func validatePost(req models.PostRequest) map[string]string {
	errors := make(map[string]string)

	if strings.TrimSpace(req.Title) == "" {
		errors["title"] = "title is required"
	} else if len([]rune(req.Title)) < 20 {
		errors["title"] = "title must be at least 20 characters"
	}

	if strings.TrimSpace(req.Content) == "" {
		errors["content"] = "content is required"
	} else if len([]rune(req.Content)) < 200 {
		errors["content"] = "content must be at least 200 characters"
	}

	if strings.TrimSpace(req.Category) == "" {
		errors["category"] = "category is required"
	} else if len([]rune(req.Category)) < 3 {
		errors["category"] = "category must be at least 3 characters"
	}

	if req.Status != "publish" &&
		req.Status != "draft" &&
		req.Status != "thrash" {
		errors["status"] = "status must be publish, draft, or thrash"
	}

	return errors
}

// POST /article
func (h *ArticleHandler) CreateArticle(c *gin.Context) {
	var req models.PostRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid JSON",
		})
		return
	}

	if errors := validatePost(req); len(errors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": errors,
		})
		return
	}

	result, err := h.DB.Exec(
		`INSERT INTO posts (title, content, category, status)
		 VALUES (?, ?, ?, ?)`,
		req.Title,
		req.Content,
		req.Category,
		req.Status,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create article",
		})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to get article id",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id": id,
	})
}

// GET /article/<id>
// GET /article/<limit>/<offset>
func (h *ArticleHandler) GetArticleOrPagination(c *gin.Context) {
	path := strings.TrimPrefix(c.Param("path"), "/")
	parts := strings.Split(path, "/")

	// GET /article/<id>
	if len(parts) == 1 {
		id, err := strconv.Atoi(parts[0])

		if err != nil || id <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid article id",
			})
			return
		}

		var post models.Post

		err = h.DB.QueryRow(`
			SELECT id, title, content, category, created_date, updated_date, status
			FROM posts
			WHERE id = ?`,
			id,
		).Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.Category,
			&post.CreatedDate,
			&post.UpdatedDate,
			&post.Status,
		)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "article not found",
			})
			return
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch article",
			})
			return
		}

		c.JSON(http.StatusOK, post)
		return
	}

	// GET /article/<limit>/<offset>
	if len(parts) == 2 {
		limit, err := strconv.Atoi(parts[0])

		if err != nil || limit <= 0 || limit > 100 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "limit must be between 1 and 100",
			})
			return
		}

		offset, err := strconv.Atoi(parts[1])

		if err != nil || offset < 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "offset must be zero or greater",
			})
			return
		}

		rows, err := h.DB.Query(`
			SELECT id, title, content, category, created_date, updated_date, status
			FROM posts
			ORDER BY created_date DESC
			LIMIT ? OFFSET ?`,
			limit,
			offset,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to fetch articles",
			})
			return
		}

		defer rows.Close()

		posts := make([]models.Post, 0)

		for rows.Next() {
			var post models.Post

			if err := rows.Scan(
				&post.ID,
				&post.Title,
				&post.Content,
				&post.Category,
				&post.CreatedDate,
				&post.UpdatedDate,
				&post.Status,
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "failed to read article",
				})
				return
			}

			posts = append(posts, post)
		}

		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to read articles",
			})
			return
		}

		c.JSON(http.StatusOK, posts)
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"error": "invalid article path",
	})
}

// PUT/PATCH /article/<id>
func (h *ArticleHandler) UpdateArticle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid article id",
		})
		return
	}

	var req models.PostRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid JSON",
		})
		return
	}

	if errors := validatePost(req); len(errors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": errors,
		})
		return
	}

	result, err := h.DB.Exec(`
		UPDATE posts
		SET title = ?,
		    content = ?,
		    category = ?,
		    status = ?,
		    updated_date = CURRENT_TIMESTAMP
		WHERE id = ?`,
		req.Title,
		req.Content,
		req.Category,
		req.Status,
		id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update article",
		})
		return
	}

	affected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to check updated article",
		})
		return
	}

	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "article not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

// DELETE /article/<id>
func (h *ArticleHandler) DeleteArticle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid article id",
		})
		return
	}

	result, err := h.DB.Exec(
		`DELETE FROM posts WHERE id = ?`,
		id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete article",
		})
		return
	}

	affected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to check deleted article",
		})
		return
	}

	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "article not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}