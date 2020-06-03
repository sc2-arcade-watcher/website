<template>
    <v-container class="home">
        <v-row class="text-center">
            <v-col cols="12">
                <v-img
                    :src="require('../assets/arcade-logo.png')"
                    class="my-3"
                    contain
                    height="200"
                />
            </v-col>

            <v-col class="mb-4">
                <h1 class="display-1 font-weight-bold mb-3">Unofficial StarCraft II Arcade database!</h1>
                <v-divider></v-divider>
                <v-subheader class="text-center justify-center">Under development...</v-subheader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HomeView extends Vue {
}
</script>

<style lang="scss">
.route.home {
    background: url('../assets/body-bg.jpg') no-repeat top center !important;
    background-size: cover;
    background-attachment: fixed;

    >div {
        background: rgba(#000, 0.3);
    }
}
</style>
