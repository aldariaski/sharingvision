package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"sharing-vision/backend/config"
	"sharing-vision/backend/routes"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println(".env not found; using environment variables")
	}

	// Connect to database
	db, err := config.ConnectDatabase()
	if err != nil {
		log.Fatal("database connection failed:", err)
	}
	defer db.Close()

	// Create Gin router
	router := gin.Default()

	// CORS configuration for React frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5173",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
		},
	}))

	// Register routes
	routes.Setup(router, db)

	// Server port
	port := os.Getenv("PORT")

	if port == "" {
		port = os.Getenv("SERVER_PORT")
	}

	if port == "" {
		port = "8080"
	}

	log.Println("server running on port", port)

	// Start server
	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}