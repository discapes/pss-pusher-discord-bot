import { spawn } from "child_process";
import { BattleReport } from "../types.js";
import { JSEParse, JSEStringify } from "./jseparser.js";

export function haes(mode: string, data: string): Promise<string> {
	return new Promise((res, rej) => {
		const proc = spawn("dotnet", ["run", mode, data], { cwd: "haes" });
		let output = "";
		proc.stdout.on("data", (data) => (output += data.toString()));
		proc.stderr.on("data", (data) => (output += data.toString()));
		proc.on("close", (code) => (code ? rej(`${code}: ${output}`) : res(output)));
	});
}

export function encrypt(data: string): Promise<string> {
	return haes("encrypt", data);
}

export function decrypt(data: string): Promise<string> {
	return haes("decrypt", data);
}

const roomReplace = {
	a: "roomType",
	b: "roomCategory",
	c: "damageHp",
	d: "repairedHp",
	e: "isDestroyed",
	f: "empDuration",
	g: "missilesUsed",
	h: "craftsUsed",
	i: "androidsUsed",
	j: "activations",
};

const characterReplace = {
	a: "isDead",
	b: "teleports",
	c: "damageHp",
	d: "healedHp",
	e: "collectionDesignId",
	f: "isInActiveCollection",
	g: "specialAbilityType",
	h: "abilityTriggered",
	i: "isAndroid",
};

const moduleReplace = {
	a: "isDestroyed",
	b: "damageHp",
};
const craftReplace = {
	a: "damageHp",
	b: "isDestroyed",
	c: "attacks",
};

const shipReplace = {
	shipId: "shipId",
	a: ["roomReports", { "*": roomReplace }],
	b: ["characterReports", { "*": characterReplace }],
	c: ["moduleReports", { "*": moduleReplace }],
	d: ["craftReports", { "*": craftReplace }],
	e: "cloakCount",
	f: "shieldDamage",
	g: "hullDamage",
	h: "currentShipHp",
	i: "maxShipHp",
	j: "totalStartingCrews",
	k: "missileDodges",
	l: "manualCommandCount",
};

const craftReport = {
	a: "damageHp",
	b: "isDestroyed",
	c: "attacks",
};

const schema = {
	a: ["attackingShipReport", shipReplace],
	b: ["defendingShipReport", shipReplace],
	c: "winItems",
	d: "loseItems",
	e: "battleOutcome",
	f: "lastFrame",
};

type RecursiveRecord = string | { [property: string]: RecursiveRecord };

function replace(object_: RecursiveRecord, schema: Record<string, Array<any> | string>) {
	const object = object_ as any;
	for (const [k, v] of Object.entries(schema)) {
		if (Array.isArray(v)) {
			const [newKey, subschema] = v;
			replace(object[k], subschema);
			object[newKey] = object[k];
			delete object[k];
		} else if (k == "*") {
			for (const subobj of Object.values(object)) {
				replace(subobj as any, v as any);
			}
		} else if (k != v) {
			object[v] = object[k];
			delete object[k];
		}
	}
}

function replaceBack(object: any, schema: any) {
	for (const [v, k] of <any>Object.entries(schema)) {
		if (Array.isArray(k)) {
			const [oldKey, subschema] = k;
			replaceBack(object[oldKey], subschema);
			object[v] = object[oldKey];
			delete object[oldKey];
		} else if (v == "*") {
			for (const subobj of Object.values(object)) {
				replaceBack(subobj, k);
			}
		} else if (k != v) {
			object[v] = object[k];
			delete object[k];
		}
	}
}

export const EMPTY_MANUALCOMMANDS = "<UserCommands><Commands></Commands></UserCommands>";

export function createFinaliseBattleBody(reportAndCommands: { battleReport: BattleReport; manualCommands: string }): Promise<string> {
	replaceBack(reportAndCommands.battleReport, schema);
	return encrypt(JSEStringify(reportAndCommands));
}

export async function readFinaliseBattleBody(body: string): Promise<{ battleReport: BattleReport; manualCommands: string }> {
	const reportAndCommands = JSEParse(await decrypt(body));
	replace(reportAndCommands.battleReport, schema);
	return reportAndCommands;
}

// for testing - note that order isnt preserved, so you need to (encrypt(JSEStringify(JSEParse()))) > body.txt)
// const body = (await readFile("body_test.txt")).toString();
// console.log((await createFinaliseBattleBody(await readFinaliseBattleBody(body))) == body);

// const cipher = (await readFile("body.txt")).toString();
// const body = await readFinaliseBattleBody(cipher);
// console.log(await createFinaliseBattleBody(body));
// body.battleReport.winItems[2] = 4000;
// delete body.battleReport.winItems[2];
