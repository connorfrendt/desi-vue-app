package main

import (
    "log"

    "github.com/pocketbase/pocketbase"
)

func main() {
    // Create PocketBase app with custom data directory
    app := pocketbase.NewWithConfig(pocketbase.Config{
        DataDir: "./pb_data", // This ensures data is stored in a known, clean location
    })

    // Start the app and log fatal error if startup fails
    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}