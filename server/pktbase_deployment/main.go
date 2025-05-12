package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		admins, err := app.Dao().FindAdmin()
		if err != nil || len(admins) == 0 {
			email := os.Getenv("PB_ADMIN_EMAIL")
			password := os.Getenv("PB_ADMIN_PASSWORD")

			admin := &models.Admin{}
			admin.Email = email
			admin.SetPassword(password)

			if err := app.Dao().SaveAdmin(admin); err != nil {
				log.Fatalf("Failed to create admin user: %v", err)
			}

			log.Println("✅ Admin user created")
		}
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}