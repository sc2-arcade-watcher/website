import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Lobby from '@/views/Lobby.vue'
import MapBaseView from '@/views/Map/MapBase.vue';
import MapStatsView from '@/views/Map/MapStats.vue';
import OpenLobbiesView from '@/views/OpenLobbies.vue';

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/open-lobbies',
        name: 'open_lobbies',
        component: OpenLobbiesView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
        path: '/stats',
        name: 'stats',
        component: () => import(/* webpackChunkName: "stats" */ '@/views/Stats.vue')
    },
    {
        path: '/lobby/:regionId/:bnetBucketId/:bnetRecordId',
        name: 'lobby',
        component: Lobby,
    },
    {
        path: '/map-list',
        name: 'map_list',
        component: require('@/views/Map/MapList.vue').default,
    },
    {
        path: '/map/:regionId/:mapId',
        name: 'map_base',
        component: MapBaseView,
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
                component: MapStatsView,
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
