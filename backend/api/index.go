package api

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"sharing-vision/backend/config"
	"sharing-vision/backend/routes"
)

func Handler() *gin.Engine {
	// Connect to database
	db, err := config.ConnectDatabase()
	if err != nil {
		panic("database connection failed: " + err.Error())
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5173",
			"https://sharingvision-frontend.vercel.app",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
		},
	}))

	routes.Setup(router, db)

	return router
}