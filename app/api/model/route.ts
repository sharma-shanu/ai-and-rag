import { Ollama } from "@langchain/ollama";
// import {StringOutputParser} from '@langchain/core/output_parsers'

export async function GET(request:Request) {

        const model = new Ollama({ model: "deepseek-r1:7b" });
      
        const response: string = await model.invoke("Name PM of India?");

        return Response.json(response)
}
