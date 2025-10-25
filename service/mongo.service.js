import clientPromise from "../lib/db.js";

export const insertDoc = async(nombre, descripcion, stock, embedding) => {
    try {
        const client = await clientPromise;
        const db = client.db('MongoTienda');
        const result = await db.collection('Producto').insertOne({
            nombre,
            descripcion,
            stock,
            embedding
        });
        return result.insertedId;        
    } catch (error) {
        console.log("Error en insertDoc")
    }

}

export const vectorSearch = async(embedding) => {
    try {
        const client = await clientPromise;
        const db = client.db('MongoTienda');
        const result = await db.collection('Producto').aggregate([
            {
                "$vectorSearch": {
                    "index": "vectorPlotIndex",
                    "path": "embedding",
                    "queryVector": embedding,
                    "numCandidates": 100,
                    "limit": 3
                }
            },
            {
                "$project": {
                    "nombre": 1,
                    "descripcion": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]).toArray();
        return result;
    } catch (error) {
        console.log("Error en vectorSearch.mongo.service: ", error)
    }
}