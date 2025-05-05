package main

import (
    "log"

    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/models"
    "github.com/pocketbase/pocketbase/tools/security"
)

func main() {
    app := pocketbase.New()

    app.OnBeforeServe().Add(func(e *pocketbase.HooksEvent) error {
        admins, _ := app.Dao().FindAdminByEmail("admin@example.com")
        if admins == nil {
            admin := &models.Admin{
                Email:    "admin@example.com",
                Password: "supersecret", // Or use: security.NewPassword("supersecret")
            }
            err := app.Dao().SaveAdmin(admin)
            if err != nil {
                log.Println("Failed to create admin:", err)
            } else {
                log.Println("Superadmin created.")
            }
        }

        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}