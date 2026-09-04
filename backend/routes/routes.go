package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	"sharing-vision/backend/handlers"
)

func Setup(router *gin.Engine, db *sql.DB) {
	handler := &handlers.ArticleHandler{
		DB: db,
	}

	// Create article
	router.POST("/article", handler.CreateArticle)

	// GET:
	// /article/<id>
	// /article/<limit>/<offset>
	router.GET("/article/*path", handler.GetArticleOrPagination)

	// Update article
	router.PUT("/article/:id", handler.UpdateArticle)
	router.PATCH("/article/:id", handler.UpdateArticle)

	// Delete article
	router.DELETE("/article/:id", handler.DeleteArticle)
}