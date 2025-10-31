import { chatAI, extractDescription, generateDescription } from "../service/generateTxt.service.js";
import { vectorSearch } from "../service/mongo.service.js";
import { createEmbedding } from "../service/embedding.service.js";

export const chat = {
    miniBot : async(request) => {
        try {
            //Crear Embedding de la Solicitud del Usuario
            const embeddingRequest = await createEmbedding(request);
            //Realizar Consulta Mediante el Servicio de VectorSearch
            const result = await vectorSearch(embeddingRequest);
            //Enviar Datos Necesarios al Modelo para responder
            await chatAI(result, request);
        } catch (error) {
            console.log('Error en miniBot.chatAI.controller: ', error)
        }
    },
    generateDescrip: async(tittleProduct) => {
        try {
            //Servicio de Generacion de Descripcion en base al Titulo
            const description = await generateDescription(tittleProduct);
            //Retornar Resultado
            return description;
        } catch (error) {
            console.log("Error en generateDescrip.chat.controller: ", error)
        }
    },
    extractDescrip: async(request) => {
        try {
            //Servicio de extraccion de Descripcion en base a la solicitud del usuario
            const description = await extractDescription(request);
            //Retornar Resultado
            return description;
        } catch (error) {
            console.log("Error en extractDescrip.chat.controller: ", error)
        }
    }
}