import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'home',
        component: require('@/views/Home.vue').default,
    },
    {
        path: '/info',
        name: 'info',
        component: require('@/views/Info/Base.vue').default,
        children: [
            {
                path: 'about',
                name: 'info_about',
                component: require('@/views/Info/About.vue').default,
            },
            {
                path: 'donate',
                name: 'info_donate',
                component: require('@/views/Info/Donate.vue').default,
            },
            {
                path: 'discord-bot',
                name: 'info_discord_bot',
                component: require('@/views/Info/DiscordBot.vue').default,
            },
            {
                path: 'contact',
                name: 'info_contact',
                component: require('@/views/Info/Contact.vue').default,
            },
        ],
    },
    {
        path: '/open-lobbies',
        name: 'open_lobbies',
        component: require('@/views/OpenLobbies.vue').default,
    },
    {
        path: '/account',
        name: 'account_info',
        component: require('@/views/Account/Info.vue').default,
    },
    {
        path: '/account/auth',
        name: 'account_auth',
        component: require('@/views/Account/Auth.vue').default,
    },
    {
        path: '/account/settings',
        name: 'account_settings',
        component: require('@/views/Account/Settings.vue').default,
    },
    {
        path: '/stats',
        name: 'stats',
        component: require('@/views/Stats.vue').default,
    },
    {
        path: '/lobby/:regionId/:bnetBucketId/:bnetRecordId',
        name: 'lobby',
        component: require('@/views/Lobby.vue').default,
    },
    {
        path: '/map-list',
        name: 'map_list',
        component: require('@/views/Map/MapList.vue').default,
    },
    {
        path: '/map/:regionId/:mapId',
        component: require('@/views/Map/MapBase.vue').default,
        children: [
            {
                path: '',
                name: 'map_details',
                component: require('@/views/Map/MapDetails.vue').default,
            },
            {
                path: 'versions',
                name: 'map_versions',
                component: require('@/views/Map/MapVersions.vue').default,
            },
            {
                path: 'dependencies',
                name: 'map_dependencies',
                component: require('@/views/Map/MapDependencies.vue').default,
            },
            {
                path: 'reviews',
                name: 'map_reviews',
                component: require('@/views/Map/MapReviews.vue').default,
            },
            {
                path: 'stats',
                name: 'map_stats',
                component: require('@/views/Map/MapStats.vue').default,
            },
            {
                path: 'player-base',
                name: 'map_player_base',
                component: require('@/views/Map/PlayerBase.vue').default,
            },
            {
                path: 'lobbies-history',
                name: 'map_lobbies_history',
                component: require('@/views/Map/MapLobbiesHistory.vue').default,
            },
            {
                path: 'match-history',
                name: 'map_match_history',
                component: require('@/views/Map/MatchHistory.vue').default,
            },
        ],
    },
    {
        path: '/profile-list',
        name: 'profile_list',
        component: require('@/views/Profile/List.vue').default,
    },
    {
        path: '/profile/:regionId/:realmId/:profileId',
        component: require('@/views/Profile/Base.vue').default,
        children: [
            {
                path: '',
                name: 'profile_summary',
                component: require('@/views/Profile/Summary.vue').default,
            },
            {
                path: 'most-played',
                name: 'profile_most_played',
                component: require('@/views/Profile/MostPlayed.vue').default,
            },
            {
                path: 'lobbies-history',
                name: 'profile_lobbies_history',
                component: require('@/views/Profile/LobbiesHistory.vue').default,
            },
            {
                path: 'match-history',
                name: 'profile_match_history',
                component: require('@/views/Profile/MatchHistory.vue').default,
            },
            {
                path: 'maps',
                name: 'profile_published_maps',
                component: require('@/views/Profile/PublishedMaps.vue').default,
            },
        ],
    },
]

const router = new VueRouter({
    mode: 'history',
    fallback: false,
    base: process.env.BASE_URL,
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
    },
});

const DEFAULT_TITLE = 'StarCraft II Arcade database';
router.afterEach((to, from) => {
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    Vue.nextTick(() => {
        document.title = to.meta?.title ?? DEFAULT_TITLE;
    });
});

export default router
