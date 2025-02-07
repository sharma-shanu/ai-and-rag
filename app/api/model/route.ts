import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Ollama } from "@langchain/ollama";

const model_name = "deepseek-r1:1.5b";
const model = new Ollama({ model: model_name });

export async function POST(request: Request) {
  const { topic } = await request.json();
  const template = PromptTemplate.fromTemplate("Tell me a joke on {topic}");
  const parser = new StringOutputParser();
  const chain = RunnableSequence.from([template, model, parser]);
  const response: string = await chain.invoke({ topic });

  // could handle using structured output parsers
  return Response.json(response.replace(/<think>.*?<\/think>/gs, "").trim());
}
