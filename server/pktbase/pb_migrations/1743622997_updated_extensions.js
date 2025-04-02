/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // update collection data
  unmarshal({
    "name": "phones"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // update collection data
  unmarshal({
    "name": "extensions"
  }, collection)

  return app.save(collection)
})
