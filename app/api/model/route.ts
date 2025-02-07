import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

const model_name = "deepseek-r1:1.5b";

export async function POST(request: Request) {
  const { topic } = await request.json();
  const template = PromptTemplate.fromTemplate("Tell me a joke on {topic}");
  const model = new Ollama({ model: model_name });
  const embeddings = new OllamaEmbeddings({ model: model_name });
  const parser = new StringOutputParser();
  const chain = RunnableSequence.from([template, model, parser]);
  const response: string = await chain.invoke({ topic });

  // could handle using structured output parsers
  return Response.json(response.replace(/<think>.*?<\/think>/gs, "").trim());
}
