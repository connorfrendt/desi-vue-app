/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3560657851")

  // remove field
  collection.fields.removeById("number30643714")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3560657851")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number30643714",
    "max": null,
    "min": null,
    "name": "ext",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
