/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // remove field
  collection.fields.removeById("autodate2679586167")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2679586167",
    "max": null,
    "min": null,
    "name": "extension",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // add field
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

  // remove field
  collection.fields.removeById("number2679586167")

  return app.save(collection)
})
