import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import z from "zod";
import { appConfig } from "../utils/app-config";
import { vacationsMcpClient } from "./mcp-client";

class VacationAgent {

    // Agent LLM:
    private model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0,
        openAIApiKey: appConfig.openaiApiKey
    });

    // System prompt:
    private systemPrompt = `
        You are a helpful assistant that answers questions about a vacations database.
        Use the given tools to look up real data before answering - never guess numbers.
        Be concise and friendly, and answer in the same language the question was asked in.
    `;

    // Wrap every MCP tool as a LangChain tool. Each tool call goes through the
    // real MCP Client -> MCP Server round trip (in-process, via InMemoryTransport):
    private async buildTools() {
        const mcpClient = await vacationsMcpClient.getClient();
        const { tools: mcpToolList } = await mcpClient.listTools();

        return mcpToolList.map(mcpTool => tool(
            async (args: Record<string, unknown>) => {
                const result = await mcpClient.callTool({ name: mcpTool.name, arguments: args });
                const content = result.content as { type: string; text?: string }[];
                return content?.[0]?.text ?? JSON.stringify(result);
            },
            {
                name: mcpTool.name,
                description: mcpTool.description ?? mcpTool.name,
                schema: z.record(z.string(), z.any())
            }
        ));
    }

    // Run the agent:
    public async ask(question: string): Promise<string> {
        const tools = await this.buildTools();

        const agent = createAgent({
            model: this.model,
            tools,
            systemPrompt: this.systemPrompt
        });

        const result = await agent.invoke({
            messages: [{ role: "human", content: question }]
        });

        const lastMessage = result.messages[result.messages.length - 1];
        return lastMessage.content as string;
    }

}

export const vacationAgent = new VacationAgent();
