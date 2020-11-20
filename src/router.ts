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
        path: '/open-lobbies',
        name: 'open_lobbies',
        component: require('@/views/OpenLobbies.vue').default,
    },
    {
        path: '/about',
        name: 'about',
        component: require('@/views/About.vue').default,
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
        name: 'map_base',
        component: require('@/views/Map/MapBase.vue').default,
        children: [
            {
                path: '/map/:regionId/:mapId/details',
                name: 'map_details',
                component: require('@/views/Map/MapDetails.vue').default,
            },
            {
                path: '/map/:regionId/:mapId/versions',
                name: 'map_versions',
                component: require('@/views/Map/MapVersions.vue').default,
            },
            {
                path: '/map/:regionId/:mapId/dependencies',
                name: 'map_dependencies',
                component: require('@/views/Map/MapDependencies.vue').default,
            },
            {
                path: '/map/:regionId/:mapId/stats',
                name: 'map_stats',
                component: require('@/views/Map/MapStats.vue').default,
            },
            {
                path: '/map/:regionId/:mapId/recent-lobbies',
                name: 'map_recent_lobbies',
                component: require('@/views/Map/MapLobbiesHistory.vue').default,
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
        name: 'profile_base',
        component: require('@/views/Profile/Base.vue').default,
        children: [
            {
                path: '/profile/:regionId/:realmId/:profileId/summary',
                name: 'profile_summary',
                component: require('@/views/Profile/Summary.vue').default,
            },
            {
                path: '/profile/:regionId/:realmId/:profileId/most-played',
                name: 'profile_most_played',
                component: require('@/views/Profile/MostPlayed.vue').default,
            },
            {
                path: '/profile/:regionId/:realmId/:profileId/lobbies-history',
                name: 'profile_lobbies_history',
                component: require('@/views/Profile/LobbiesHistory.vue').default,
            },
            {
                path: '/profile/:regionId/:realmId/:profileId/match-history',
                name: 'profile_match_history',
                component: require('@/views/Profile/MatchHistory.vue').default,
            },
            {
                path: '/profile/:regionId/:realmId/:profileId/maps',
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
    }
})

export default router
