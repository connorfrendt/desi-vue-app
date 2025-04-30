package main

// module github.com/pocketbase/pocketbase

// go 1.24

import (
    "log"
    "os"
    "github.com/pocketbase/pocketbase"
)

func main() {
    app := pocketbase.New()

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    if err := app.Start("0.0.0.0:" + port); err != nil {
        log.Fatal(err)
    }

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}