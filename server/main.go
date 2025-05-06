package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()

	app.App().OnBeforeServe().Add(func(e any) error {
		admins, err := app.Dao().FindAdmins()
		if err != nil {
			return err
		}

		if len(admins) == 0 {
			log.Println("No admin users found. Creating default admin...")

			admin := app.NewAdmin()
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