import { describe, expect, it } from "vitest";
import { formatDate } from "./date-util";

describe("DateUtil", () => {

    it("should format an ISO date as day/month/year", () => {
        expect(formatDate("2026-11-10T12:00:00.000Z")).toBe("10/11/2026");
    });

    it("should keep leading zeros in day and month", () => {
        expect(formatDate("2026-03-05T12:00:00.000Z")).toBe("05/03/2026");
    });

});
