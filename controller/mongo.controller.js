import { insertDoc, vectorSearch } from "../service/mongo.service.js";
import { createEmbedding } from "../service/embedding.service.js";



export const doc = {
    /*
    Objetivo -> Insertar Un documento con su Respecto 'Embedding' en su Descripcion
    */
    insert : async(nombre, descripcion, stock) => {
        try {
            //Crear Embedding en base a la descripcion del producto
            const embedding_value = await createEmbedding(descripcion);
            //Insertar Documento
            const result = await insertDoc(nombre, descripcion, stock, embedding_value)
            //Verificar resultado
            console.log(`Producto con id ${result} ha sido insertado Exitosamente`)
        } catch (error) {
            console.log(error)
        }
    },
    /*
    Objetivo -> Realizar Una Busqueda por medio un embedding y vectorsearch de MongoAtlas
    */
    smartSearch : async(descripcion) => {
        try {
            //Crear Embedding de Busqueda
            const embedding_value = await createEmbedding(descripcion);
            //Llamar Servicio de Busqueda
            const result = await vectorSearch(embedding_value);
            //Visualizar Resultados:
            console.log(result)
        } catch (error) {
            console.log("Error en smartsearch.mongo.controller: ", error)
        }
    }
}