import { Renumber } from "./jseparser";

export interface DeviceLoginResult {
  User: User;
  $accessToken: string;
  $PreviousLastLoginDate: string;
  $UserId: string;
}

export interface UserKeyPasswordAuthorizeResult {
  User: User;
  $refreshToken: string;
  $RequireReload: string;
  $UserId: string;
}

export interface SendMessageResult {
  Message: Message;
}

export interface ChooseShipResult {
  Ship: Ship;
  Achievements: Achievements;
}

export interface FinaliseBattleResult {
  Ship: Ship;
  User: User;
  Tasks: Tasks;
  Achievements: Achievements;
}

export interface CollectResourcesResult {
  Room: Room;
  Item: Item;
}

export interface AcceptBattleResult {
  Battle: Battle;
}

export interface CreateBattleResult {
  $ChanceToFindStarBattles: string;
  Battle: Battle;
}

export type SetRaceTypeResult = { user: User };
export type SetGenderTypeResult = { user: User };
export type SetStarshipNameResult = { user: User };
export type RegisterUserResult = { user: User };
export type SetTutorialStatusResult = { user: User };

export type UserEmailPasswordAuthorizeResult = unknown;
export type AddStarbuxResult = unknown;
export type NewAccountResult = unknown;

// -//////////

export interface BattleReport {
  attackingShipReport: ShipReport;
  defendingShipReport: ShipReport;
  winItems: Record<string, number>;
  loseItems: Record<string, number>;
  battleOutcome: number;
  lastFrame: number;
}

export interface ShipReport {
  shipId: number;
  roomReports: Record<string, RoomReport>;
  characterReports: Record<string, CharacterReport>;
  moduleReports: Record<string, unknown>;
  craftReports: Record<string, unknown>;
  cloakCount: number;
  shieldDamage: Renumber;
  hullDamage: Renumber;
  currentShipHp: Renumber;
  maxShipHp: Renumber;
  totalStartingCrews: number;
  missileDodges: number;
  manualCommandCount: number;
}

export interface CharacterReport {
  isDead: boolean;
  teleports: number;
  damageHp: Renumber;
  healedHp: Renumber;
  collectionDesignId: number;
  isInActiveCollection: boolean;
  specialAbilityType: number;
  abilityTriggered: boolean;
  isAndroid: boolean;
}

export interface RoomReport {
  roomType: number;
  roomCategory: number;
  damageHp: Renumber;
  repairedHp: Renumber;
  isDestroyed: boolean;
  empDuration: number;
  missilesUsed: number;
  craftsUsed: number;
  androidsUsed: number;
  activations: number;
}

export interface Tasks {
  Task: Task[];
}

export interface Task {
  $TaskId: string;
  $TaskDesignId: string;
  $UserId: string;
  $ProgressValue: string;
  $Collected: string;
}

export interface Battle {
  $BattleId: string;
  $AttackingShipId: string;
  $DefendingShipId: string;
  $RandomSeed: string;
  $AttackingShipXml: string;
  $DefendingShipXml: string;
  $Commands: string;
  $OutcomeType: string;
  $WinTrophyResult: string;
  $WinMineralsResult: string;
  $WinGasResult: string;
  $LoseTrophyResult: string;
  $LoseMineralsResult: string;
  $LoseGasResult: string;
  $ClientOutcomeType: string;
  $BattleEndFrame: string;
  $ClientEndFrame: string;
  $AttackingUserXml: string;
  $DefendingUserXml: string;
  $ServerOutcomeType: string;
  $Rewards: string;
  $AttackingUserId: string;
  $DefendingUserId: string;
  $AttackingShipName: string;
  $DefendingShipName: string;
  $BattleType: string;
  $DefendingClientOutcomeType: string;
  $DefendingClientEndFrame: string;
  $StationRoomDesignIds: string;
  $AdventureXml: string;
  $AttackingAllianceName: string;
  $DefendingAllianceName: string;
  $AttackingAllianceSpriteId: string;
  $DefendingAllianceSpriteId: string;
  $IsStarBattle: string;
  $AttackerWinRewards: string;
  $AttackerLoseRewards: string;
  $DefenderWinRewards: string;
  $DefenderLoseRewards: string;
  $IsOnlineBattle: string;
  $AttackerBaseWinRewards: string;
  $LeagueType: string;
  $AttackingAllianceId: string;
  $DefendingAllianceId: string;
  $AttackingUserTrophy: string;
  $DefendingUserTrophy: string;
  $BattleDate: string;
  $BattleEndDate: string;
  $ChallengeDesignId: string;
  $AllianceWarId: string;
  $MissionEventId: string;
  $MissionDesignId: string;
  $StationShipDesignId: string;
  $BackgroundId: string;
  $WinRewards: string;
  $LoseRewards: string;
  $StarSystemMarkerId: string;
  Missiles: any[];
  Crafts: any[];
}

export interface RoomActions {
  RoomAction: RoomAction[];
}

export interface RoomAction {
  $RoomActionId: string;
  $RoomId: string;
  $RoomActionIndex: string;
  $ConditionTypeId: string;
  $ActionTypeId: string;
}

export interface Ship {
  Items: Items;
  Characters: string;
  Rooms: Rooms;
  Lifts: string;
  UserStarSystems: string;
  $ShipId: string;
  $ShipDesignId: string;
  $Hp: string;
  $ShipStatus: string;
  $StandardCharacterDraws: string;
  $UniqueCharacterDraws: string;
  $BrightnessValue: string;
  $SaturationValue: string;
  $HueValue: string;
  $StickerString: string;
  $ShipLevel: string;
  $PowerScore: string;
  $StarSystemId: string;
  $FromStarSystemId: string;
  $NextStarSystemId: string;
  $OriginStarSystemId: string;
  $OriginNextStarSystemId: string;
  $Tags: string;
  $SkinOpacityValue: string;
  $StarSystemArrivalDate: string;
  $UpdateDate: string;
  $StatusStartDate: string;
  $UpgradeStartDate: string;
  $UserId: string;
  $OriginalRaceId: string;
  $SkinItemDesignId: string;
  $UpgradeShipDesignId: string;
  $ImmunityDate: string;
  $ShipName: string;
  $Shield: string;
  $TopLeftX: string;
  $TopLeftY: string;
  $CenterX: string;
  $CenterY: string;
  $NextAndroidCharacterId: string;
  $SalvageArgument: string;
}

export interface Items {
  Item: Item;
}

export interface Item {
  $ItemId: string;
  $ShipId: string;
  $ItemDesignId: string;
  $Quantity: string;
  $IsNew: string;
  $BattleHp: string;
  $ActionFrame: string;
}

export interface Rooms {
  Room: Room[];
}

export interface Room {
  $RoomId: string;
  $RoomDesignId: string;
  $ShipId: string;
  $RoomStatus: string;
  $Row: string;
  $Column: string;
  $Manufactured: string;
  $RandomSeed: string;
  $CapacityUsed: string;
  $ItemIds: string;
  $SalvageString: string;
  $ManufactureString: string;
  $TargetManufactureString: string;
  $TargetRoomId: string;
  $TargetCraftId: string;
  $AssignedPower: string;
  $SystemPower: string;
  $TotalDamage: string;
  $Progress: string;
  $PowerGenerated: string;
  $TopLeftX: string;
  $TopLeftY: string;
  $CenterX: string;
  $CenterY: string;
  $RunRoomAction: string;
  $CurrentCapacity: string;
  $ManufactureStartDate: string;
  $ConstructionStartDate: string;
  $UpgradeRoomDesignId: string;
  $CurrentSkinKey: string;
  $PreviousSkinKey: string;
  $IsPowerAIActive: string;
  $IsTargetAIActive: string;
  $IsSetItemAIActive: string;
  $ProtectRoomFrame: string;
  $DisableCount: string;
}

export interface Achievements {
  Achievement: Achievement;
}

export interface Achievement {
  $AchievementId: string;
  $AchievementDesignId: string;
  $UserId: string;
  $ProgressValue: string;
  $Collected: string;
}

export interface Message {
  $MessageId: string;
  $UserId: string;
  $Message: string;
  $UserName: string;
  $UserSpriteId: string;
  $MessageType: string;
  $ChannelId: string;
  $ActivityType: string;
  $ActivityArgument: string;
  $Argument: string;
  $AllianceName: string;
  $AllianceSpriteId: string;
  $AllianceId: string;
  $MessageDate: string;
  $Trophy: string;
  $ShipDesignId: string;
}

export interface User {
  UserSeason: UserSeason;
  $Id: string;
  $FacebookToken: string;
  $LastAlertDate: string;
  $UserType: string;
  $GenderType: string;
  $RaceType: string;
  $Credits: string;
  $ProfileImageUrl: string;
  $Trophy: string;
  $GameCenterName: string;
  $CompletedMissionDesigns: string;
  $LanguageKey: string;
  $TutorialStatus: string;
  $IconSpriteId: string;
  $TipStatus: string;
  $AllianceMembership: string;
  $CrewDonated: string;
  $CrewReceived: string;
  $FreeStarbuxReceivedToday: string;
  $DailyRewardStatus: string;
  $HeroBonusChance: string;
  $GameCenterFriendCount: string;
  $CompletedMissionEventIds: string;
  $UnlockedShipDesignIds: string;
  $UnlockedCharacterDesignIds: string;
  $Status: string;
  $LastCatalogPurchaseDate: string;
  $VipExpiryDate: string;
  $ChallengeWins: string;
  $ChallengeLosses: string;
  $LoadingPercentage: string;
  $AllianceSupplyDonation: string;
  $TotalSupplyDonation: string;
  $DailyMissionsAttempted: string;
  $PurchaseRewardPoints: string;
  $UsedRewardPoints: string;
  $GooglePlayName: string;
  $TournamentRewardPoints: string;
  $AllianceScore: string;
  $ChampionshipScore: string;
  $DailyChallengeWinStreak: string;
  $DrawsUsedToday: string;
  $ActivatedPromotions: string;
  $PVPAttackWins: string;
  $PVPAttackLosses: string;
  $PVPAttackDraws: string;
  $PVPDefenceDraws: string;
  $PVPDefenceWins: string;
  $PVPDefenceLosses: string;
  $HighestTrophy: string;
  $ChatAppearance: string;
  $AuthenticationType: string;
  $DailyPVPAttacks: string;
  $ExploredStarSystemIds: string;
  $TournamentBonusScore: string;
  $SituationOccurrencesToday: string;
  $Flags: string;
  $EmailVerificationStatus: string;
  $BoostAmount: string;
  $PassPoints: string;
  $TaskRerollCount: string;
  $LeagueType: string;
  $DailyPvPDefence: string;
  $TrophyGained: string;
  $UnlockedSkinKeys: string;
  $RewardsCollectable: string;
  $IsUnderAge: string;
  $MatchingStatus: string;
  $ShipDesignId: string;
  $AllianceSpriteId: string;
  $Ranking: string;
  $TournamentResetDate: string;
  $AllianceJoinDate: string;
  $LastPurchaseDate: string;
  $LastHeartBeatDate: string;
  $LastRewardActionDate: string;
  $CooldownExpiry: string;
  $FacebookTokenExpiryDate: string;
  $CreationDate: string;
  $LastLoginDate: string;
  $LastVipClaimDate: string;
  $AllianceId: string;
  $ChallengeDesignId: string;
  $LastChallengeDesignId: string;
  $CaptainCharacterDesignId: string;
  $AllianceQualifyDivisionDesignId: string;
  $BlockAuthAttemptsUntilDate: string;
  $BoostEndDate: string;
  $LastBoostDate: string;
  $UpdateDate: string;
  $OwnerUserId: string;
  $GooglePlayAccessTokenExpiryDate: string;
}

export interface UserSeason {
  $UserSeasonId: string;
  $SeasonDesignId: string;
  $UserId: string;
  $Points: string;
  $UnlockedRewardDesignIds: string;
  $PurchaseVIPDate: string;
  $PurchaseVIPStatus: string;
}
