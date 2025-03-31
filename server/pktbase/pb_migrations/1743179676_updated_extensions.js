/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_725658681")

  // remove field
  collection.fields.removeById("autodate510102245")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number510102245",
    "max": null,
    "min": null,
    "name": "part_num",
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
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate510102245",
    "name": "part_num",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("number510102245")

  return app.save(collection)
})
