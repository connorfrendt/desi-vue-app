package main

import (
    "log"
    "os"

    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/models"
)

func main() {
    app := pocketbase.New()

    app.OnBeforeServe().Add(func(e *pocketbase.HooksEvent) error {
        email := os.Getenv("PB_ADMIN_EMAIL")
        password := os.Getenv("PB_ADMIN_PASSWORD")

        if email == "" || password == "" {
            log.Println("Admin credentials not provided in env vars.")
            return nil
        }

        if _, err := app.Dao().FindAdminByEmail(email); err == nil {
            return nil // Admin already exists
        }

        admin := &models.Admin{
            Email:    email,
            Password: password,
        }

        if err := app.Dao().SaveAdmin(admin); err != nil {
            log.Println("Failed to create admin:", err)
        } else {
            log.Println("Superadmin created.")
        }

        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}