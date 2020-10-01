import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const availableCategories: MapCategory[] = [
    {
        id: 1,
        code: "Custom",
        name: "Other",
        description: "Unclassified game type.",
        isMelee: false
    },
    {
        id: 2,
        code: "Melee",
        name: "Melee",
        description: "Standard melee games against other players",
        isMelee: true
    },
    {
        id: 3,
        code: "Coop",
        name: "Co-op VS A.I.",
        description: "Games played cooperatively against the A.I.",
        isMelee: true
    },
    {
        id: 4,
        code: "TowerDefense",
        name: "Tower Defense",
        description: "Build towers to defend against waves of enemies.",
        isMelee: false
    },
    {
        id: 5,
        code: "TugOfWar",
        name: "Tug Of War",
        description: "Build structures which send units to attack the enemy base.",
        isMelee: false
    },
    {
        id: 6,
        code: "Misc",
        name: "Miscellaneous",
        description: "Miscellaneous game types",
        isMelee: true
    },
    {
        id: 7,
        code: "Training",
        name: "Training",
        description: "Games designed for learning and practicing",
        isMelee: true
    },
    {
        id: 8,
        code: "Observer",
        name: "Melee Spectator",
        description: "Melee games with spectating functionality",
        isMelee: true
    },
    {
        id: 9,
        code: "HeroBattle",
        name: "Hero Battle",
        description: "Teams of heroes join in constant assaults on the enemy stronghold.",
        isMelee: false
    },
    {
        id: 10,
        code: "Puzzle",
        name: "Puzzle",
        description: "Test your ingenuity with puzzle-based gameplay.",
        isMelee: false
    },
    {
        id: 11,
        code: "RPG",
        name: "RPG",
        description: "Level up and explore in roleplaying games.",
        isMelee: false
    },
    {
        id: 12,
        code: "Monobattle",
        name: "Monobattle",
        description: "Melee games where each player may only build a single unit type",
        isMelee: true
    },
    {
        id: 13,
        code: "Arena",
        name: "Arena",
        description: "Evenly matched groups of units face off in arena combat.",
        isMelee: false
    },
    {
        id: 14,
        code: "Action",
        name: "Action",
        description: "Games which focus on quick action-packed gameplay.",
        isMelee: false
    },
    {
        id: 15,
        code: "Strategy",
        name: "Strategy",
        description: "Games which focus on strategic planning.",
        isMelee: false
    },
    {
        id: 16,
        code: "Survival",
        name: "Survival",
        description: "Stay alive as long as possible among hordes of enemies.",
        isMelee: false
    },
    {
        id: 17,
        code: "Tandem",
        name: "Archon",
        description: "Share control as an Archon against other players",
        isMelee: true
    },
    {
        id: 18,
        code: "Single_Player",
        name: "Single Player",
        description: "Games designed specifically for one player.",
        isMelee: false
    },
    {
        id: 19,
        code: "TandemCoop",
        name: "Archon Co-op VS A.I.",
        description: "Share control as an Archon cooperatively against the A.I.",
        isMelee: true
    },
    {
        id: 20,
        code: "Campaign",
        name: "Campaign",
        description: "Story-driven campaigns that usually spans across multiple maps.",
        isMelee: false
    }
];

export const regionsList = [
    {
        id: 1,
        code: 'US',
        name: 'Americas',
    },
    {
        id: 2,
        code: 'EU',
        name: 'Europe',
    },
    {
        id: 3,
        code: 'KR',
        name: 'Asia',
    },
    {
        id: 5,
        code: 'CN',
        name: 'China',
    },
];

export interface MapStatData {
    date: string[];
    lobbiesHosted: number[];
    lobbiesStarted: number[];
    participantsTotal: number[];
    participantsUniqueTotal: number[];
}

export enum MapType {
    MeleeMap = 'melee_map',
    ArcadeMap = 'arcade_map',
    ExtensionMod = 'extension_mod',
    DependencyMod = 'dependency_mod',
}

export interface MapCategory {
    id: number;
    name: string;
    code: string;
    description: string;
    isMelee: boolean;
}

export interface MapHeader {
    regionId: number;
    bnetId: number;
    majorVersion: number;
    minorVersion: number;
    headerHash: string | null;
    isPrivate: boolean;
    isExtensionMod: boolean;
    archiveHash: string | null;
    archiveSize: number;
    uploadedAt: string;
}

export interface Map {
    regionId: number;
    bnetId: number;
    author: Profile | null;
    type: MapType;
    mainLocale: GameLocale;
    mainLocaleHash: string | null;
    iconHash: string;
    name: string;
    description: string;
    website: string;
    mainCategory: MapCategory;
    mainCategoryId: number;
    maxPlayers: number;
    updatedAt: string;
    publishedAt: string;
    currentVersion: MapHeader;
}

// ===
// ===

export enum GameRegion {
    US = 1,
    EU = 2,
    KR = 3,
    CN = 5,
}

export enum GameLocale {
    deDE = 'deDE',
    enGB = 'enGB',
    esES = 'esES',
    frFR = 'frFR',
    itIT = 'itIT',
    plPL = 'plPL',
    ptPT = 'ptPT',
    ruRU = 'ruRU',
    zhCN = 'zhCN',
    zhTW = 'zhTW',
    koKR = 'koKR',
    enSG = 'enSG',
    enUS = 'enUS',
    esMX = 'esMX',
    ptBR = 'ptBR',
}

export type DepotRegion = 'us' | 'eu' | 'kr' | 'cn';

export type MapTags = 'BLIZ'
    | 'TRIL'
    | 'FEAT'
    | 'PRGN'
    | 'HotS'
    | 'LotV'
    | 'WoL'
    | 'WoLX'
    | 'HoSX'
    | 'LoVX'
    | 'HerX'
    | 'Desc'
    | 'Glue'
    | 'Blnc'
    | 'PREM'
;

export interface MapScreenshot<ET, MI> {
    picture: MI;
    caption: ET;
}

export enum ContentListTypeKind {
    Bulleted = 0,
    Numbered = 1,
    None     = 2,
}

export interface ContentSection<ET> {
    title: ET;
    listType: ContentListTypeKind;
    subtitle: ET | null;
    items: ET[];
}

export interface DocumentInstance {
    id: number;
    version: number;
}

export interface DepotFileHandle {
    type: string;
    region: DepotRegion;
    hash: string;
}

export interface LocaleTable<DF> {
    locale: GameLocale;
    stringTable: DF[];
}

export interface MapSize {
    horizontal: number;
    vertical: number;
}

export interface PremiumInfo {
    license: number;
}

export interface AttributeInstance {
    namespace: number;
    id: number;
}

export interface AttributeValue {
    index: number;
}

export interface AttributeDefault {
    attribute: AttributeInstance;
    value: AttributeValue | AttributeValue[];
}

export interface AttributeLocked {
    attribute: AttributeInstance;
    lockedScopes: number;
}

export interface AttributeVisibility {
    attribute: AttributeInstance;
    hidden: number;
}

export interface AttributeVisual<ET, MI> {
    text: ET | null;
    tip: ET | null;
    art: MI | null;
}

export interface AttributeValueDefinition<ET, MI> {
    value: string;
    visual: AttributeVisual<ET, MI>;
}

export enum AttributeArbitrationKind {
    Always = 0,
    FCFS   = 1,
}

export enum AttributeRestrictionKind {
    None   = 0,
    Self   = 1,
    Host   = 2,
    All    = 3,
}

export enum AttributeOptionsFlag {
    Unknown          = 0x01,
    LockedWhenPublic = 0x02,
    Hidden           = 0x04,
}

export interface AttributeDefinition<ET, MI> {
    instance: AttributeInstance;
    values: AttributeValueDefinition<ET, MI>[];
    // TODO: requirements
    arbitration: AttributeArbitrationKind;
    visibility: AttributeRestrictionKind;
    access: AttributeRestrictionKind;
    options: AttributeOptionsFlag;
    default: AttributeValue | AttributeValue[];
    sortOrder: number;
}

export interface Variant<ET> {
    categoryId: number;
    modeId: number;
    categoryName: ET;
    modeName: ET;
    categoryDescription: ET;
    modeDescription: ET;
    attributeDefaults: AttributeDefault[];
    lockedAttributes: AttributeLocked[];
    maxTeamSize: number;
    attributeVisibility?: AttributeVisibility[];
    achievementTags?: string[];
    maxHumanPlayers?: number | null;
    maxOpenSlots?: number | null;
    premiumInfo?: PremiumInfo | null;
    teamNames?: ET[];
}

export interface WorkingSet<ET, MI, DF> {
    name: ET;
    description: ET;
    thumbnail: MI | null;
    bigMap: MI | null;
    maxPlayers: number;
    instances: AttributeDefault[];
    visualFiles: DF[];
    localeTable: LocaleTable<DF>[];
}

export interface PermissionEntry {
    name: string;
    id: number;
}

export interface TutorialLink {
    variantIndex: number;
    speed: string;
    map: DocumentInstance;
}

export interface ArcadeInfo<ET, MI> {
    gameInfoScreenshots: MapScreenshot<ET, MI>[];
    howToPlayScreenshots: MapScreenshot<ET, MI>[];
    howToPlaySections: ContentSection<ET>[];
    patchNoteSections: ContentSection<ET>[];
    mapIcon: MI | null;
    tutorialLink: TutorialLink | null;
    matchmakerTags: string[];
    website: ET | null;
}

export interface MapHeaderData<ET = string | null, MI = MapImage, DF = string> {
    header: DocumentInstance;
    filename: string;
    archiveHandle: DF;
    mapNamespace: number;
    workingSet: WorkingSet<ET, MI, DF>;
    attributes: AttributeDefinition<ET, MI>[];
    localeTable: LocaleTable<DF>[];
    mapSize: MapSize | null;
    tileset: ET | null;
    defaultVariantIndex: number;
    variants: Variant<ET>[];
    extraDependencies?: DocumentInstance[];
    addDefaultPermissions?: boolean;
    relevantPermissions?: PermissionEntry[];
    specialTags: MapTags[];
    arcadeInfo?: ArcadeInfo<ET, MI> | null;
    addMultiMod?: boolean;
}

export interface MapImage {
    hash: string;
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface MapImageResolved extends MapImage {
    url: string;
}

export interface MapDetails extends MapHeader {
    info: {
        meta: {
            region: DepotRegion;
            locale: GameLocale;
        }
    } & MapHeaderData;
}

// ===
// ===

export interface MapVersionHistory {
    regionId: number;
    bnetId: number;
    versions: MapHeader[];
}

// ===
// ===

export interface MapDependencyEntry {
    map: Map;
    mapHeader: MapHeader;
    requestedVersion: number;
    tags: MapTags[];
}

export interface MapDependencyInfo {
    regionId: number;
    bnetId: number;
    list: MapDependencyEntry[];
}

// ===
// ===

export interface Profile {
    nameUpdatedAt: Date | null;
    regionId: number;
    realmId: number;
    profileId: number;
    name: string | null;
    discriminator: number | null;
    deleted: boolean;
    avatarURL: string | null;
}

interface GameLobbyPlayerJoin {
    profile: Profile;
    joinedAt: string;
    leftAt: string;
}

enum GameLobbySlotKind {
    Open = 'open',
    AI = 'ai',
    Human = 'human',
}

export interface GameLobbySlot {
    slotNumber: number;
    team: number;
    kind: GameLobbySlotKind;
    profile: Profile;
    joinInfo?: GameLobbyPlayerJoin;
    name: string;
}

enum GameLobbyStatus {
    Open = 'open',
    Started = 'started',
    Abandoned = 'abandoned',
    Unknown = 'unknown',
}

export interface GameLobbyDocument {
    regionId: number;
    bnetId: number;
    name: string;
    iconHash: string;
}

export interface GameLobbyData {
    regionId: number;
    bnetBucketId: number;
    bnetRecordId: number;
    createdAt: Date;
    closedAt: Date;
    status: GameLobbyStatus;

    mapBnetId: number;
    extModBnetId: number;
    multiModBnetId: number;
    mapVariantIndex: number;
    mapVariantMode: string;

    map?: GameLobbyDocument;
    extMod?: GameLobbyDocument;

    lobbyTitle: string;
    hostName: string;
    slots?: GameLobbySlot[];
    joinHistory?: GameLobbyPlayerJoin[];
}

export type GameLobbyQueryParams = {
    includeMapInfo?: boolean;
    includeSlots?: boolean;
    includeSlotsJoinInfo?: boolean;
    includeJoinHistory?: boolean;
    recentlyClosedThreshold?: number;
}

export interface StatsRegionsData {
    date: string[];
    // lobbiesHosted: number[];
    // lobbiesStarted: number[];
    // participantsTotal: number[];
    // participantsUniqueTotal: number[];
}

abstract class StarcAPIModule {
    constructor(protected axios: AxiosInstance) {
    }
}

export interface MapDetailsParams {
    majorVersion?: number;
    minorVersion?: number;
    locale?: GameLocale;
}

export enum StatsPeriodKind {
    'daily',
    'weekly',
    'monthly',
}

export type StatsQueryOptions = {
    kind?: keyof typeof StatsPeriodKind;
}

export type MapListQuery = {
    authorHandle?: string;
    regionId?: number;
    type?: MapType;
    name?: string;
    mainCategoryId?: number;
    showPrivate?: boolean;
    orderDirection?: string;
    orderBy?: string;
}

// ===
// ===

export interface AccountAuthBnetParams {
    redirectUri: string;
    code: string;
}

export interface AccountAuthResponse {
    accessToken: string;
    battleAccount: AccountBattleInfo;
}

export interface AccountInfoResponse {
    battleAccount: AccountBattleInfo;
}

export interface AccountBattleInfo {
    id: number;
    battleTag: string;
    profiles: Profile[];
}

export interface MapAuthorPreferences {
    mapPubDownload: boolean | null;
    mapPrivDownload: boolean | null;
    mapPrivDetails: boolean | null;
    mapPrivListed: boolean | null;
}

// ===
// ===

export type DefaultPaginationQueryOptions = {
    offset?: number;
    limit?: number;
}

export type DefaultPaginationResult<T> = {
    count: number;
    results: T[];
}

export type CursorPaginationQuery = {
    before?: string;
    after?: string;
    limit?: number;
}

export type CursorPaginationResult<T> = {
    page: {
        prev: string | null;
        next: string | null;
    },
    results: T[];
}

export type MapListResponse = CursorPaginationResult<Map>;

export class StarcAPI {
    axios: AxiosInstance;

    constructor(config: AxiosRequestConfig = {}) {
        this.axios = Axios.create(Object.assign({
            baseURL: process.env.VUE_APP_STARC_WEBAPI_URL ?? 'https://sc2arcade.talv.space/api',
        }, config));
    }

    bnetDepotImage(hash: string) {
        return `${process.env.VUE_APP_STARC_WEBAPI_URL ?? '//sc2arcade.talv.space'}/bnet/${hash}.jpg`;
    }

    depotImage(img: MapImage | string, region: DepotRegion | number): MapImageResolved {
        if (typeof region === 'number') {
            region = GameRegion[region].toLowerCase() as DepotRegion;
        }
        if (typeof img === 'string') {
            img = {
                hash: img,
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            };
        }
        return {
            ...img,
            url: `${process.env.VUE_APP_STARC_WEBAPI_URL ?? '//sc2arcade.talv.space'}/depot/${region}/${img.hash}.jpg`,
        };
    }

    battleMapLink(regionId: number, mapId: number) {
        return `battlenet:://starcraft/map/${regionId}/${mapId}`;
    }

    profileHandle(profile: { regionId: number, realmId: number, profileId: number }) {
        return `${profile.regionId}-S2-${profile.realmId}-${profile.profileId}`;
    }

    encodeMapVersion(majorVersion: number, minorVersion: number) {
        return ((majorVersion & 0xFFFF) << 16) | minorVersion & 0xFFFF;
    }

    decodeMapVersion(version: number) {
        return [(version >> 16) & 0xFFFF, (version) & 0xFFFF];
    }

    depotLink(hash: string, filetype: string, region: DepotRegion | number) {
        if (typeof region === 'number') {
            region = GameRegion[region].toLowerCase() as DepotRegion;
        }
        if (region === 'cn') {
            return `http://${region}.depot.battlenet.com.cn:1119/${hash}.${filetype}`;
        }
        else {
            return `http://${region}.depot.battle.net:1119/${hash}.${filetype}`;
        }
    }

    accountAuthBnet(params: AccountAuthBnetParams) {
        return this.axios.post<AccountAuthResponse>(`account/auth/bnet`, params);
    }

    accountLogout() {
        return this.axios.get(`account/logout`);
    }

    accountInfo() {
        return this.axios.get<AccountInfoResponse>(`account/info`);
    }

    getAccontSettings() {
        return this.axios.get<MapAuthorPreferences>(`account/settings`);
    }

    saveAccontSettings(settings: MapAuthorPreferences) {
        return this.axios.post(`account/settings`, settings);
    }

    getMapList(opts?: MapListQuery & CursorPaginationQuery) {
        return this.axios.get<MapListResponse>(`maps`, { params: opts });
    }

    getProfile(params: { regionId: number, realmId: number, profileId: number }) {
        return this.axios.get<Profile>(`profiles/${params.regionId}/${params.realmId}/${params.profileId}`);
    }

    getMapInfo(regionId: number, mapId: number) {
        return this.axios.get<Map>(`maps/${regionId}/${mapId}`);
    }

    getMapDetails(regionId: number, mapId: number, params?: MapDetailsParams) {
        return this.axios.get<MapDetails>(`maps/${regionId}/${mapId}/details`, { params: params });
    }

    getMapVersionHistory(regionId: number, mapId: number) {
        return this.axios.get<MapVersionHistory>(`maps/${regionId}/${mapId}/versions`);
    }

    getMapDependencies(regionId: number, mapId: number) {
        return this.axios.get<MapDependencyInfo>(`maps/${regionId}/${mapId}/dependencies`);
    }

    getMapStats(regionId: number, mapId: number, params?: StatsQueryOptions) {
        return this.axios.get<MapStatData>(`maps/${regionId}/${mapId}/stats`, { params: params });
    }

    getLobbiesActive(params?: GameLobbyQueryParams) {
        return this.axios.get<GameLobbyData[]>(`lobbies/active`, { params: params });
    }

    getLobbyDetails(regionId: number, bnetBucketId: number, bnetRecordId: number) {
        return this.axios.get<GameLobbyData>(`lobbies/${regionId}/${bnetBucketId}/${bnetRecordId}`);
    }

    getMapLobbiesHistory(regionId: number, mapId: number, params?: CursorPaginationQuery) {
        return this.axios.get(`lobbies/history/map/${regionId}/${mapId}`, { params: params });
    }

    getStatsRegions(params?: StatsQueryOptions) {
        return this.axios.get<StatsRegionsData>(`stats/regions`, { params: params });
    }
}
