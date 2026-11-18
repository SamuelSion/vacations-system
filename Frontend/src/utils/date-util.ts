// Formats an ISO date from the server as day/month/year, e.g. 05/10/2026:
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
}
