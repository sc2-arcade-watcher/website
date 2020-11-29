<template>
    <v-container fluid>
        <v-divider/>
        <v-col>
            <v-row class="mt-2" align="center" justify="center">
                <span class="grey--text">Items per page</span>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            dark
                            text
                            color="primary"
                            class="ml-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <span v-if="currentPaginationParams.limit" v-html="currentPaginationParams.limit"/>
                            <span v-else v-html="itemsPerPageArray[0]"/>
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense class="py-0">
                        <v-list-item
                            v-for="(number, index) in itemsPerPageArray"
                            :key="index"
                            @click="updateItemsPerPage(number)"
                        >
                            <v-list-item-title>{{ number }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <v-btn
                    color="blue darken-4"
                    tile
                    class="mr-1"
                    :disabled="!currentPaginationResult.page.prev"
                    @click="pageGo('prev')"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                    color="blue darken-4"
                    tile
                    class="ml-1"
                    :disabled="!currentPaginationResult.page.next"
                    @click="pageGo('next')"
                >
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-row>
        </v-col>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '@/helpers';

@Component
export default class ListNavToolbar extends Vue {
    @Prop({
        required: false,
        default: () => [25, 50, 100, 200, 300, 400, 500],
    })
    readonly itemsPerPageArray!: number[];

    @Prop({
        required: true,
    })
    readonly currentPaginationParams!: starc.CursorPaginationQuery;

    @Prop({
        required: true,
    })
    readonly currentPaginationResult!: starc.CursorPaginationResult<any>;

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...this.$helpers.stringifyQueryParams(this.currentPaginationParams),
            },
        });
        this.$vuetify.goTo(this.$parent);
    }

    private updateItemsPerPage(n: number) {
        this.currentPaginationParams.limit = n;
        this.renavigate();
    }

    // private applyParamsFromRouteQuery() {
    //     this.currentPaginationParams = {
    //         before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
    //         after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
    //         limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : this.itemsPerPageArray[0],
    //     };
    // }

    private pageGo(where: 'prev' | 'next') {
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        if (where === 'next' && this.currentPaginationResult!.page.next) {
            this.currentPaginationParams.after = this.currentPaginationResult!.page.next;
        }
        else if (where === 'prev' && this.currentPaginationResult!.page.prev) {
            this.currentPaginationParams.before = this.currentPaginationResult!.page.prev;
        }
        else return;
        this.renavigate();
    }
}
</script>
