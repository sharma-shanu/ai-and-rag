import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { DEEP_SEEK_7B, DEEP_SEEK_SMALL, strip_think } from "../utils";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const MODEL_NAME = DEEP_SEEK_7B;
const model = new Ollama({ model: MODEL_NAME });
const embeddings = new OllamaEmbeddings({ model: MODEL_NAME });

const vectorStore = new MemoryVectorStore(embeddings);

/* 
      1. Embeddings for PDF
      2. Embedding for question
      3. retriever
      4. chain 
*/
export async function POST(req: Request) {
  const body = await req.json();
  const loader = new PDFLoader("public/docs/resume.pdf", { splitPages: true });
  const pdf = await loader.load();
  await vectorStore.addDocuments(pdf);
  const retriever = vectorStore.asRetriever();

  // TODO: As an enhancement
  //const formData = body.formData;
  const questions /* :Array<string> */ = "who is shanu sharma?"; //body.questions;

  const prompt =
    PromptTemplate.fromTemplate(`Answer the question from the context provieded. 
  If you can't come up with the answers from the provided context just say "I don't know the answer."
  Context : {context}
  Question : {question}
  `);

  const parser = new StringOutputParser();

  const chain = RunnableSequence.from([
    () => {
      return retriever.invoke(questions);
    },
    (docs) => {
      return {
        context: docs.map((doc) => doc.pageContent).join("\n"),
        question: questions,
      };
    },
    prompt,
    model,
    parser,
    strip_think,
  ]);
  const response = await chain.invoke({});

  return Response.json(response);
}
