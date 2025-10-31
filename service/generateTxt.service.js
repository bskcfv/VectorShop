import { InferenceClient } from "@huggingface/inference";

export const chatAI = async(jsondoc, request) => {
      const client = new InferenceClient(process.env.HF_TOKEN)

      const output = await client.chatCompletion({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
            { 
              role: "system", 
              content: `
                  You are a friendly, professional, and helpful **sales assistant** at **VectorShop**, 
                  an online pet store. Your role is to assist customers by describing and recommending 
                  products based on a JSON document containing the available products and a customer request.

                  Always follow these rules and response structure:

                  ---

                  **Response Format:**

                  1. **Greeting:** Start by warmly greeting the customer.
                  2. **Availability Message:** Say “At the moment, we have these products available”.
                  3. **Product List:** Show the available products using clear bullet points (-), 
                    including name, and description if possible. For example:

                    Hello  
                    At the moment we have these products available:

                    - Apple - Description :  red fruit that contains seeds inside
                    - Banana -  Description : yellow fruit with black spots

                  4. **Closing:** End the message with a friendly closing line like 
                    “Is there anything else I can help you with?” or “Would you like me to recommend something else?”

                  ---

                  **Important Behavior Rules:**
                  - Always respond in a **friendly and natural tone**.
                  - Do **not** repeat the JSON or code.
                  - Focus on **interpreting** the data, not listing raw fields.
                  - Use **only the data from the JSON** to decide which products are available.
                  - If the customer request is unclear, **ask a short follow-up question**.
                  - Keep the answer **concise but informative** (around 3-6 lines total).

                  ---
                  `
            },
            { 
              role: "User", 
              content: `
                Here is the JSON with the available products: \n ${JSON.stringify(jsondoc)}
                \n\n Customers request: ${request}`,
            },
        ],
    });


  console.log(output.choices[0].message.content);

}

export const generateDescription = async(tittleProduct) => {
  const client = new InferenceClient(process.env.HF_TOKEN);

  const output = await client.chatCompletion({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages:[
      {
        role:"System",
        content:`
          You will receive the name of an object.  
          Your task is to generate a single, detailed description of that object — around 30 words long.  

          The description should include:
          - Key characteristics (appearance, material, function, or where it's found)
          - Natural, human-like phrasing
          - No repetition of the object's name unless necessary

          Output format rule:
          Return **only** the description text.  
          Do not include introductions, labels, lists, or any other text.

          Example:
          Input: "Apple"  
          Output: A round, red fruit with a sweet taste, growing on trees and commonly eaten fresh or used in desserts.

        `
      },
      {
        role:"User",
        content:`
          Input: "${tittleProduct}"
        `
      }
    ]
  })

  return output.choices[0].message.content;

}

export const extractDescription = async(request) => {
  const client = new InferenceClient(process.env.HF_TOKEN);
  const output = await client.chatCompletion({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages: [
      {
        role:'System',
        content: `
          You are an intent extraction assistant.  
          Your task is to read a customer's message and extract only the essential product or concept they are asking about.

          Guidelines:
          - Ignore greetings, filler words, or politeness.
          - Focus only on the product or service the customer wants, including any adjectives or features mentioned (e.g., “fast motorcycle”, “red laptop”, “wireless headphones”).
          - Output a short, clear phrase (3 to 7 words) summarizing the request.
          - Do not include any explanation, punctuation, or extra text — only the extracted phrase.

          Example:
          Input: "Hello, how are you? I would like to ask if you have any fast, modern, or sporty motorcycle available at the moment."
          Output: sporty motorcycle

          Input: "Hey, do you sell black running shoes for men?"
          Output: black running shoes for men
        `
      },
      {
        role:'User',
        content:`Input ${request}`
      }
    ]
  })
  return output.choices[0].message.content;
}