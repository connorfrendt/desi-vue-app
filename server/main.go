package main

import (
    "log"
    "github.com/pocketbase/pocketbase"
)

func main() {
	port := os.Getenv("PORT")
	if port != "" {
		app.SetAddress(":" + port)
	}
    app := pocketbase.New()

    // app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
    //     admins, err := app.Dao().FindAdmins()
    //     if err != nil {
    //         return err
    //     }

    //     if len(admins) == 0 {
    //         log.Println("No admin users found. Creating default admin...")

    //         admin := app.NewAdmin()
    //         admin.Email = os.Getenv("PB_ADMIN_EMAIL")
    //         admin.SetPassword(os.Getenv("PB_ADMIN_PASS"))

    //         if err := app.Dao().SaveAdmin(admin); err != nil {
    //             return err
    //         }
    //     }

    //     return nil
    // })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}