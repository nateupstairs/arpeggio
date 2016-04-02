/**
 * Designer
 */

import * as connection from './connection'

export async function design(config) {
  let conn = connection.getConnection()
  let database = conn.database
  let collectionData = await database.listCollections()
  let collectionList = []

  collectionData.forEach(c => {
    collectionList.push(c.name)
  })
  for (let c of config) {
    if (collectionList.indexOf(c.name) < 0) {
      let collection
      let result

      if (c.type === 'document') {
        collection = database.collection(c.name)
      }
      else {
        collection = database.edgeCollection(c.name)
      }
      result = await collection.create()
      if (c.indexes) {
        for (let i of c.indexes) {
          await collection.createIndex(i)
        }
      }
    }
  }
}
