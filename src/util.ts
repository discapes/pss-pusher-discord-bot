import { WriteStream, createWriteStream } from "fs";

export function formatTime(d: Date) {
	const date = d.toISOString().slice(0, "2023-03-06".length);
	const hours = d.getUTCHours().toString().padStart(2, "0");
	const minutes = d.getUTCMinutes().toString().padStart(2, "0");

	return `${date} ${hours}:${minutes}`;
}

export function formatLogMessage(message: string, data?: unknown) {
	const timestamp = formatTime(new Date());
	const dataString = data !== undefined ? JSON.stringify(data, null, 2) : "";

	return `${timestamp}: ${message} ${dataString}\n`;
}

let logStream: WriteStream | null = null;
export function logToFile(message: string, data?: unknown) {
	if (!logStream) logStream = createWriteStream("log.txt", { flags: "a" });
	logStream.write(formatLogMessage(message, data));
}

export function logToConsole(message: string, data?: unknown) {
	console.log(formatLogMessage(message, data));
}

export function log(message: string, data?: unknown) {
	logToConsole(message, data);
	logToFile(message, data);
}
