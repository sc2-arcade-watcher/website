import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface MapStatData {
    date: string[];
    lobbiesHosted: number[];
    lobbiesStarted: number[];
    participantsTotal: number[];
    participantsUniqueTotal: number[];
}

enum DocumentType {
    Map = 'map',
    ExtensionMod = 'extension_mod',
    DependencyMod = 'dependency_mod',
}

interface MapCategory {
    name: string;
    description: string;
}

export interface Document {
    regionId: number;
    bnetId: number;
    type: DocumentType;
    isArcade: boolean;
    name: string;
    category: MapCategory;
    currentMajorVersion: number;
    currentMinorVersion: number;
    iconHash: string;
}

export interface DocumentVersion {
    document: Document;
    majorVersion: number;
    minorVersion: number;
    iconHash: string;
}

interface Profile {
    updatedAt: Date;
    regionId: number;
    realmId: number;
    profileId: number;
    name: string;
    discriminator: number;
}

interface GameLobbyPlayerJoin {
    profile: Profile;
    joinedAt: Date;
    leftAt: Date;
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
    currentMajorVersion: number;
    currentMinorVersion: number;
}

export interface GameLobbyData {
    regionId: number;
    bnetBucketId: number;
    bnetRecordId: number;
    createdAt: Date;
    closedAt: Date;
    status: GameLobbyStatus;

    mapBnetId: number;
    mapMajorVersion: number;
    mapMinorVersion: number;
    extModBnetId: number;
    extModMajorVersion: number;
    extModMinorVersion: number;
    multiModBnetId: number;
    multiModMajorVersion: number;
    multiModMinorVersion: number;
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

export enum StatsPeriodKind {
    'daily',
    'weekly',
    'monthly',
}

export type StatsQueryOptions = {
    kind?: keyof typeof StatsPeriodKind;
}

export type GameListQueryOptions = {
    regionId?: number;
    type?: string;
    name?: string;
}

export type DefaultPaginationQueryOptions = {
    offset?: number;
    limit?: number;
}

export type DefaultPaginationResult<T> = {
    count: number;
    results: T[];
}

export type MapListResponse = AxiosResponse<DefaultPaginationResult<Document>>;

export class StarcAPI {
    axios: AxiosInstance;

    constructor(config: AxiosRequestConfig = {}) {
        this.axios = Axios.create(Object.assign({
            baseURL: process.env.VUE_APP_STARC_WEBAPI_URL ?? 'https://sc2arcade.talv.space/api',
        }, config));
    }

    bnetDepotImage(hash: string) {
        return `//sc2arcade.talv.space/bnet/${hash}.jpg`;
    }

    getMapList(opts?: GameListQueryOptions & DefaultPaginationQueryOptions) {
        return this.axios.get<DefaultPaginationResult<Document>>(`maps`, { params: opts });
    }

    getMapInfo(regionId: number, mapId: number) {
        return this.axios.get<Document>(`maps/${regionId}/${mapId}`);
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

    getMapLobbiesHistory(regionId: number, mapId: number) {
        return this.axios.get(`lobbies/history/map/${regionId}/${mapId}`);
    }

    getStatsRegions(params?: StatsQueryOptions) {
        return this.axios.get<StatsRegionsData>(`stats/regions`, { params: params });
    }
}
