/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "autodate2679586167",
    "name": "extension",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "autodate2679586167",
    "name": "extension",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
})
