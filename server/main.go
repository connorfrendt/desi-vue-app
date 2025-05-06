package main

import (
	"log"
	"os"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e any) error {
		admins, err := app.Dao().FindAdmins()
		if err != nil {
			return err
		}

		if len(admins) == 0 {
			log.Println("No admin users found. Creating default admin...")

			admin := &models.Admin{}
			admin.Email = os.Getenv("PB_ADMIN_EMAIL")
			admin.SetPassword(os.Getenv("PB_ADMIN_PASS"))

			if err := app.Dao().SaveAdmin(admin); err != nil {
				return err
			}
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}