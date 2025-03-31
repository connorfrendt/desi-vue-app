/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // remove field
  collection.fields.removeById("number2679586167")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2679586167",
    "max": 0,
    "min": 0,
    "name": "extension",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

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

  // remove field
  collection.fields.removeById("text2679586167")

  return app.save(collection)
})
