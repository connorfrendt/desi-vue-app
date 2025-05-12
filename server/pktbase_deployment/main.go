package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)


func main() {
	app := pocketbase.New()

	app.Bootstrap()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		adminEmail := os.Getenv("PB_ADMIN_EMAIL")
		adminPassword := os.Getenv("PB_ADMIN_PASSWORD")

		if adminEmail == "" || adminPassword == "" {
			log.Println("❌ PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD is not set.")
			return nil
		}

		// Check if admin exists
		existing, err := app.Dao().FindAdminByEmail(adminEmail)
		if err == nil && existing != nil {
			log.Println("✅ Admin already exists, skipping creation.")
			return nil
		}

		// Create new admin
		admin := &pocketbase.Admin{
			Email:    adminEmail,
			Password: adminPassword,
		}

		if err := app.Dao().SaveAdmin(admin); err != nil {
			log.Fatalf("❌ Failed to save admin: %v", err)
		}

		log.Println("✅ Admin created successfully.")
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}