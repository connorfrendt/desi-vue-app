package main

import (
	"log"
	"os"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *pocketbase.ServeEvent) error {
		// Check if any admins exist
		admins, err := app.Dao().FindAdmin()
		if err != nil {
			return err
		}

		if len(admins) == 0 {
			email := os.Getenv("PB_ADMIN_EMAIL")
			password := os.Getenv("PB_ADMIN_PASSWORD")

			if email == "" || password == "" {
				log.Println("⚠️ No admin found, and PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD not set — cannot create admin.")
				return nil // Don't crash; just log it
			}

			admin := &models.Admin{Email: email}
			if err := admin.SetPassword(password); err != nil {
				return err
			}

			if err := app.Dao().SaveAdmin(admin); err != nil {
				return err
			}

			log.Println("✅ Admin user created from environment variables.")
		} else {
			log.Println("ℹ️ Admin user already exists. Skipping creation.")
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}