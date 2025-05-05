package main

import (
    "log"
    "os"

    "github.com/pocketbase/pocketbase"
)

func main() {
    app := pocketbase.New()

    app.OnBeforeServe().Add(func(e *pocketbase.HooksEvent) error {
        email := os.Getenv("PB_ADMIN_EMAIL")
        password := os.Getenv("PB_ADMIN_PASSWORD")

        if email == "" || password == "" {
            log.Println("Admin credentials not provided.")
            return nil
        }

        // Check if the admin already exists
        existing, _ := app.Dao().FindAdminByEmail(email)
        if existing != nil {
            log.Println("Admin already exists.")
            return nil
        }

        // Create a new admin
        admin, err := app.NewAdmin(email, password)
        if err != nil {
            log.Println("Error creating admin:", err)
            return err
        }

        if err := app.Dao().SaveAdmin(admin); err != nil {
            log.Println("Failed to save admin:", err)
            return err
        }

        log.Println("Superadmin created.")
        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}