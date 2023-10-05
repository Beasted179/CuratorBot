
import { config } from "dotenv";
config();
import { OpenAI, OpenAIChat } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ConversationSummaryMemory } from "langchain/memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { CombinedMemory } from "langchain/memory";
import { BufferMemory } from "langchain/memory";
import * as fs from "fs";

/* Load in the file we want to do question answering over */
const text = fs.readFileSync("./conqBladeInfo.txt", "utf8");
/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 1,
});

const docs = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
/* Create the chain */


const bufferMemory = new BufferMemory({
  memoryKey: "chat_history_lines",
  inputKey: "input",
});
const vectorStoreMemory = new VectorStoreRetrieverMemory({
  // 1 is how many documents to return, you might want to return more, eg. 4
  vectorStoreRetriever: vectorStore.asRetriever(),
  memoryKey: "history",
});
const memory = new CombinedMemory({
  memories: [bufferMemory, vectorStoreMemory],
});



  export async function handleuserinput(input) {
  
    try{
      const prompt =
      PromptTemplate.fromTemplate(`You are a Conquerors Blade Curator you know everything there is to know
    about Crafting Unit Kits, if asked about other topics make it known more will be added to your knowledge base
    but as for right now you arent sure about that topic.
    Rule of thumb: use the plural form of the unit name when looking for a kit.
      fief level is defined after the unit name.
    Context: {history}
    Current conversation:
    {chat_history_lines}
    Human: {input}
    `); 


const model = new OpenAIChat({modelName:"gpt-3.5-turbo", temperature: 0.9, verbose: true });
const chain = new ConversationChain({ llm: model, memory, prompt });

const res1 = await chain.call({ input: input });
console.log({ res1 });
return res1.response;
    }catch(e){
      console.log(e)
    }
  }