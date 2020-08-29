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
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
