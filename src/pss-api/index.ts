import { randomBytes } from "crypto";
import { XMLParser } from "fast-xml-parser";
import { readFile, writeFile } from "fs/promises";
import md5 from "md5";
import Pusher from "pusher-js";
import {
	AcceptBattleResult,
	AddStarbuxResult,
	BattleReport,
	ChooseShipResult,
	CollectResourcesResult,
	CreateBattleResult,
	DeviceLoginResult,
	FinaliseBattleResult,
	NewAccountResult,
	RegisterUserResult,
	SendMessageResult,
	SetGenderTypeResult,
	SetRaceTypeResult,
	SetStarshipNameResult,
	UserEmailPasswordAuthorizeResult,
	UserKeyPasswordAuthorizeResult,
} from "../types.js";
import { EMPTY_MANUALCOMMANDS, createFinaliseBattleBody } from "./finalise_battle.js";

export const libConfig = {
	logger: (str: string, o?: {}) => {},
};

export const SERVER_URL = "http://api.pixelstarships.com";
export const SSL_SERVER_URL = "https://api.pixelstarships.com";
export const CHECKSUM_KEY = "5343";

// from jupyter notebook
const FB_NUM1 = "44697";
const FB_NUM2 = "5495380";
const FB_NUM3 = "134593";

const PUSHER_APP_KEY = "258a49f843d21115d7f7";
const PUSHER_APP_CLUSTER = "mt1";

export const delay = (s: number) => new Promise((res) => setTimeout(res, s * 1000));

export const getDateString = (date: Date) => date.toISOString().slice(0, date.toISOString().lastIndexOf("."));

export const savyEncrypt = (str: string) => md5(`${str}Savvy!s0d@`);

export const checksumPassword = (str: string) => [...str.slice(0, 3)].reduce((acc, val) => acc + val.charCodeAt(0), 0);

export const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "$",
});

export async function requestJSON<T>(path: string, content: {}, ssl = false) {
	const domain = ssl ? SSL_SERVER_URL : SERVER_URL;
	const response = await fetch(domain + path, { method: "POST", body: JSON.stringify(content) });
	const xml = await response.text();
	const result = parser.parse(xml);
	const inner = Object.values(<[]>Object.values(result)[0])[0];
	libConfig.logger(`\n\n\nSent (JSON): ${domain}${path}?${new URLSearchParams(content).toString()}`);
	libConfig.logger(`Received: ${JSON.stringify(result)}`);
	return <T>inner;
}

export async function requestCustom<T>(path: string, body: string, ssl = false) {
	const domain = ssl ? SSL_SERVER_URL : SERVER_URL;
	const response = await fetch(domain + path, { method: "POST", body });
	const xml = await response.text();
	const result = parser.parse(xml);
	const inner = Object.values(<[]>Object.values(result)[0])[0];
	libConfig.logger(`\n\n\nSent (Custom): ${domain}${path} - ${body}`);
	libConfig.logger(`Received: ${JSON.stringify(result)}`);
	return <T>inner;
}

export async function requestQuery<T>(path: string, content: {}, ssl = false) {
	const domain = ssl ? SSL_SERVER_URL : SERVER_URL;
	const params = new URLSearchParams(content).toString();
	const response = await fetch(`${domain + path}?${params}`, { method: "POST", body: params });
	const xml = await response.text();
	const result = parser.parse(xml);
	const inner = Object.values(<[]>Object.values(result)[0])[0];
	libConfig.logger(`\n\n\nSent: ${domain}${path}?${new URLSearchParams(content).toString()}`);
	libConfig.logger(`Received: ${JSON.stringify(result)}`);
	return <T>inner;
}

export function generateDeviceKey() {
	return randomBytes(16).toString("hex");
}

export async function deviceLogin(deviceKey: string, refreshToken?: string) {
	const dateTime = getDateString(new Date());
	const checksum = savyEncrypt(`${deviceKey + dateTime}DeviceTypeAndroid${CHECKSUM_KEY}`);
	return await requestJSON<DeviceLoginResult>("/UserService/DeviceLogin15", {
		AppsFlyerId: "",
		Lat: false,
		DeviceKey: deviceKey,
		AdvertisingKey: "",
		ClientDateTime: dateTime,
		IsJailBroken: false,
		Checksum: checksum,
		DeviceType: 1,
		Signal: false,
		LanguageKey: "en",
		RefreshToken: refreshToken,
		UserDeviceInfo: {
			OsVersion: "Android",
			Locale: "en",
			DeviceName: "unknown",
			OSBuild: "0",
			ClientBuild: "10299",
			ClientVersion: "0.994.2",
		},
		AccessToken: "00000000-0000-0000-0000-000000000000",
	});
}

export async function registerUser(deviceKey: string, accessToken: string, email: string, password: string) {
	return await requestJSON<RegisterUserResult>("/UserService/RegisterUser4", {
		Email: email,
		Password: password,
		DeviceKey: deviceKey,
		EmailNotificationEnabled: false,
		AccessToken: accessToken,
	});
}

export async function finaliseBattle(
	battleId: string,
	attackingShipId: string,
	defendingShipId: string,
	accessToken: string,
	battleReport: BattleReport,
	attackingShipHp = "400",
	clientEndFrame = "300",
	clientOutcomeType = "1",
) {
	return await requestCustom<FinaliseBattleResult>(
		`/BattleService/FinaliseBattle11?${
			new URLSearchParams({
				battleId,
				clientOutcomeType,
				clientEndFrame,
				clientResultString: "",
				attackingShipHp,
				checksum: savyEncrypt(
					FB_NUM1 + FB_NUM2 + FB_NUM3 + battleId + attackingShipId + defendingShipId + accessToken + attackingShipHp + clientEndFrame + CHECKSUM_KEY,
				),
				accessToken,
			}).toString()}`,
		await createFinaliseBattleBody({ battleReport, manualCommands: EMPTY_MANUALCOMMANDS }),
		true,
	);
}

export async function userEmailPasswordAuthorize(deviceKey: string, accessToken: string, email: string, password: string) {
	const dateTime = getDateString(new Date());
	return await requestQuery<UserEmailPasswordAuthorizeResult>("/UserService/UserEmailPasswordAuthorize3", {
		clientDateTime: dateTime,
		checksum: savyEncrypt(deviceKey + email + dateTime + accessToken + CHECKSUM_KEY),
		deviceKey,
		email: encodeURIComponent(email),
		password: encodeURIComponent(password),
		languageKey: "en",
		accessToken,
	});
}

export async function userKeyPasswordAuthorize(deviceKey: string, password: string) {
	return await requestQuery<UserKeyPasswordAuthorizeResult>("/UserService/UserKeyPasswordAuthorize", {
		deviceKey,
		password: encodeURIComponent(password),
	});
}

export async function newAccount(deviceKey: string, accessToken: string) {
	return await requestQuery<NewAccountResult>("/UserService/NewAccount", {
		deviceKey,
		accessToken,
	});
}

// 1 = male
export async function setGenderType(genderType: number, accessToken: string) {
	return await requestQuery<SetGenderTypeResult>("/UserService/SetGenderType", {
		genderType,
		accessToken,
	});
}

// 2 = sexy
export async function setRaceType(raceType: number, accessToken: string) {
	return await requestQuery<SetRaceTypeResult>("/UserService/SetRaceType", {
		raceType,
		accessToken,
	});
}

export async function setStarshipName(starshipName: string, accessToken: string) {
	return await requestQuery<SetStarshipNameResult>("/UserService/SetStarshipName2", {
		starshipName,
		accessToken,
	});
}

// 2 = federation
export async function chooseShip(shipDesignId: number, genderType: number, raceType: number, accessToken: string) {
	return await requestQuery<ChooseShipResult>("/ShipService/ChooseShip2", {
		shipDesignId,
		genderType,
		raceType,
		accessToken,
	});
}

export async function collectResources(roomId: string, amount: number, accessToken: string) {
	const collectDate = getDateString(new Date());
	return await requestQuery<CollectResourcesResult>("/RoomService/CollectResources3", {
		roomId,
		amount,
		collectDate,
		checksum: savyEncrypt(collectDate + roomId + amount + CHECKSUM_KEY),
		accessToken,
	});
}

export async function createBattle(accessToken: string, clientHp = "400") {
	const clientDateTime = getDateString(new Date());
	return await requestQuery<CreateBattleResult>(
		"/BattleService/CreateBattle8",
		{
			clientHp,
			clientDateTime,
			checksum: savyEncrypt(clientDateTime + CHECKSUM_KEY),
			accessToken,
		},
		true,
	);
}

export async function acceptBattle(battleId: string, accessToken: string) {
	const clientDateTime = getDateString(new Date());
	return await requestQuery<AcceptBattleResult>("/BattleService/AcceptBattle4", {
		battleId,
		itemDesignId: 0,
		clientDateTime,
		checksum: savyEncrypt(accessToken + battleId + clientDateTime),
		accessToken,
	});
}

export async function setTutorialStatus(tutorialStatus: number, accessToken: string) {
	return await requestQuery<SetStarshipNameResult>("/UserService/SetTutorialStatus", {
		tutorialStatus,
		accessToken,
	});
}

export async function addStarbux(quantity: number, accessToken: string) {
	const now = new Date();
	return await requestQuery<AddStarbuxResult>("/UserService/AddStarbux2", {
		quantity,
		clientDateTime: getDateString(now),
		checksum: checksumPassword(accessToken) + now.getUTCSeconds() * now.getUTCMinutes(),
		accessToken,
	});
}

export async function sendMessage(message: string, channel: string, accessToken: string) {
	return await requestJSON<SendMessageResult>("/MessageService/SendMessage3", {
		ChannelKey: channel,
		Message: message,
		AccessToken: accessToken,
	});
}

// we ask for a deviceKey because we might need to occasionally reauthenticate
export async function initializePusher(deviceKey: string) {
	let accessToken: string | null; let
		userId: string;
	({ $accessToken: accessToken, $UserId: userId } = await deviceLogin(deviceKey));
	libConfig.logger("Got access token and uid", { accessToken, userId });

	Pusher.log = libConfig.logger;
	const pusher = new Pusher(PUSHER_APP_KEY, {
		cluster: PUSHER_APP_CLUSTER,
		channelAuthorization: {
			endpoint: null as any,
			transport: null as any,
			async customHandler({ channelName, socketId }, callback) {
				if (!accessToken) {
					accessToken = (await deviceLogin(deviceKey)).$accessToken;
				}

				const json = await fetch(`${SERVER_URL}/UserService/PusherAuth?accessToken=${accessToken}`, {
					method: "POST",
					body: new URLSearchParams({
						socket_id: socketId,
						channel_name: channelName,
					}).toString(),
				}).then((res) => res.json());
				libConfig.logger("Auth result:", json);
				callback(null, json);

				accessToken = null;
			},
		},
	});
	pusher.subscribe(`private-user-${userId}`);
	return pusher;
}

export async function getAccount() {
	const options = JSON.parse((await readFile("accounts.json")).toString());
	const { useAccount: email, accounts } = options;
	let {
		deviceKey, password, accessToken, userId, refreshToken,
	} = accounts[email];
	if (!password) throw new Error("Set a password to use for this account!");

	if (deviceKey) {
		libConfig.logger("Logging in...");
		if (!refreshToken) {
			({ $refreshToken: refreshToken } = await userKeyPasswordAuthorize(deviceKey, password));
		}
		({ $accessToken: accessToken, $UserId: userId } = await deviceLogin(deviceKey, refreshToken));

		libConfig.logger("Logged in: ", {
			accessToken, userId, deviceKey, email,
		});
		accounts[email].userId = userId;
		accounts[email].refreshToken = refreshToken;
	} else {
		libConfig.logger("Creating account...");
		deviceKey = generateDeviceKey();
		({ $accessToken: accessToken, $UserId: userId } = await deviceLogin(deviceKey));
		await setGenderType(1, accessToken);
		await setRaceType(2, accessToken);
		await setStarshipName(email.slice(0, email.firstIndexOf("@")), accessToken);
		await chooseShip(2, 1, 2, accessToken);
		await registerUser(deviceKey, accessToken, email, password);
		await setTutorialStatus(60, accessToken);

		libConfig.logger("Created account: ", {
			accessToken, userId, deviceKey, email,
		});
		accounts[email].accessToken = accessToken;
		accounts[email].deviceKey = deviceKey;
		accounts[email].userId = userId;
	}
	writeFile("accounts.json", JSON.stringify(options, null, 2));
	return {
		accessToken, userId, deviceKey, email,
	};
}
