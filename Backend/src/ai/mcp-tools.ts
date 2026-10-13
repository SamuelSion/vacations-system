// Tools to be used by the MCP server.
// Each tool answers a specific, well-defined question about the vacations database.

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { FilterQuery } from "mongoose";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { LikeModel } from "../models/like-model";

function toResult(data: unknown): CallToolResult {
    return {
        content: [{
            type: "text",
            text: JSON.stringify(data)
        }]
    };
}

class McpTools {

    // Returns every vacation with its full details (destination, dates, price):
    public async getAllVacationsTool(): Promise<CallToolResult> {
        console.log("Using tool: getAllVacationsTool");
        const vacations = await VacationModel.find().sort({ startDate: 1 }).exec();
        const data = vacations.map(vacation => ({
            destination: vacation.destination,
            description: vacation.description,
            startDate: vacation.startDate.toISOString().substring(0, 10),
            endDate: vacation.endDate.toISOString().substring(0, 10),
            price: vacation.price
        }));
        return toResult(data);
    }

    // Returns vacations filtered by their date status relative to today:
    public async getVacationsByStatusTool(args: { status: "active" | "future" | "past" }): Promise<CallToolResult> {
        console.log("Using tool: getVacationsByStatusTool", args);
        const now = new Date();
        let query: FilterQuery<IVacationModel> = {};
        if (args.status === "active") query = { startDate: { $lte: now }, endDate: { $gte: now } };
        else if (args.status === "future") query = { startDate: { $gt: now } };
        else if (args.status === "past") query = { endDate: { $lt: now } };

        const vacations = await VacationModel.find(query).sort({ startDate: 1 }).exec();
        const data = vacations.map(vacation => ({
            destination: vacation.destination,
            startDate: vacation.startDate.toISOString().substring(0, 10),
            endDate: vacation.endDate.toISOString().substring(0, 10),
            price: vacation.price
        }));
        return toResult(data);
    }

    // Returns the count of vacations, optionally filtered by status:
    public async getVacationCountTool(args: { status?: "active" | "future" | "past" }): Promise<CallToolResult> {
        console.log("Using tool: getVacationCountTool", args);
        const now = new Date();
        let query: FilterQuery<IVacationModel> = {};
        if (args.status === "active") query = { startDate: { $lte: now }, endDate: { $gte: now } };
        else if (args.status === "future") query = { startDate: { $gt: now } };
        else if (args.status === "past") query = { endDate: { $lt: now } };

        const count = await VacationModel.countDocuments(query).exec();
        return toResult({ count });
    }

    // Returns the average price across all vacations:
    public async getAveragePriceTool(): Promise<CallToolResult> {
        console.log("Using tool: getAveragePriceTool");
        const vacations = await VacationModel.find().exec();
        const average = vacations.length
            ? vacations.reduce((sum, vacation) => sum + vacation.price, 0) / vacations.length
            : 0;
        return toResult({ averagePrice: Math.round(average * 100) / 100 });
    }

    // Returns vacations whose destination text contains a given country/region keyword:
    public async getVacationsByCountryTool(args: { country: string }): Promise<CallToolResult> {
        console.log("Using tool: getVacationsByCountryTool", args);
        const regex = new RegExp(args.country, "i");
        const vacations = await VacationModel.find({ destination: regex }).sort({ startDate: 1 }).exec();
        const data = vacations.map(vacation => ({
            destination: vacation.destination,
            startDate: vacation.startDate.toISOString().substring(0, 10),
            endDate: vacation.endDate.toISOString().substring(0, 10),
            price: vacation.price
        }));
        return toResult(data);
    }

    // Returns the number of likes a specific destination has received:
    public async getLikesForDestinationTool(args: { destination: string }): Promise<CallToolResult> {
        console.log("Using tool: getLikesForDestinationTool", args);
        const regex = new RegExp(args.destination, "i");
        const vacation = await VacationModel.findOne({ destination: regex }).exec();
        if (!vacation) return toResult({ error: "Destination not found." });
        const likes = await LikeModel.countDocuments({ vacationId: vacation._id }).exec();
        return toResult({ destination: vacation.destination, likes });
    }

}

export const mcpTools = new McpTools();
