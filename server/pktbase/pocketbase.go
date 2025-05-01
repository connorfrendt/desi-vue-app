package pocketbase

import (
    "github.com/pocketbase/pocketbase"
)

// New returns a new PocketBase app instance.
func New() *pocketbase.PocketBase {
    return pocketbase.New()
}