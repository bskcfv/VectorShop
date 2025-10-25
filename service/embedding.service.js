//Importar Variables de Entorno
import dotenv from 'dotenv';
//Importar Clase InferenceClient de hugginFace
import { InferenceClient } from "@huggingface/inference";
//Cargar variables de Entorno
dotenv.config()

//Instanciamos Cliente
const client = new InferenceClient(process.env.HF_TOKEN);

//Servicio de Creación de Embedding mediante la IA
export const createEmbedding = async(data) => {
    const output = await client.featureExtraction({
        //Modelo a Usar
        model: "intfloat/multilingual-e5-large",
        //Data enviada por el cliente
        inputs: data,
        provider: "hf-inference"
    });
    //Retornar Embedding
    return output
}
