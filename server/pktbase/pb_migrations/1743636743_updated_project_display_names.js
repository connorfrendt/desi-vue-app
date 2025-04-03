/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_882077732")

  // remove field
  collection.fields.removeById("number2917964473")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_484305853",
    "hidden": false,
    "id": "relation2917964473",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "phone_list_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_882077732")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number2917964473",
    "max": null,
    "min": null,
    "name": "phone_list_id",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("relation2917964473")

  return app.save(collection)
})
