package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func main() {
	app := pocketbase.New()

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		adminEmail := os.Getenv("PB_ADMIN_EMAIL")
		adminPassword := os.Getenv("PB_ADMIN_PASSWORD")

		log.Println("Admin email:", adminEmail)
		log.Println("Admin password:", adminPassword)

		if adminEmail == "" || adminPassword == "" {
			log.Println("PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD not set")
			return nil
		}

		// Check if admin already exists
		// _, err := app.Dao().FindAdminByEmail(adminEmail)
		// if err == nil {
		// 	log.Println("Admin already exists, skipping creation")
		// 	return nil
		// }

		// Create new admin
		admin := &models.Admin{
			Email: adminEmail,
		}
		// if err := admin.SetPassword(adminPassword); err != nil {
		// 	log.Printf("Error setting admin password: %v", err)
		// 	return err
		// }

		// if err := app.Dao().SaveAdmin(admin); err != nil {
		// 	log.Printf("Error creating admin: %v", err)
		// 	return err
		// }

		log.Println("Admin created successfully")
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}