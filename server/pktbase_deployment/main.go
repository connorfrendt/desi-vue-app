package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		email := os.Getenv("PB_ADMIN_EMAIL")
		password := os.Getenv("PB_ADMIN_PASSWORD")

		// Check if admin exists
		existing, err := app.Dao().FindAdminByEmail(email)
		if err == nil && existing != nil {
			log.Println("✅ Admin already exists")
			return nil
		}

		// Create admin via the internal REST API handler
		admin, err := app.NewAdmin(email, password)
		if err != nil {
			log.Fatalf("❌ Failed to create admin: %v", err)
		}

		if err := app.Dao().SaveAdmin(admin); err != nil {
			log.Fatalf("❌ Failed to save admin: %v", err)
		}

		log.Println("✅ Admin user created successfully")
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}