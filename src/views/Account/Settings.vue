<template>
    <div v-if="settings">
        <!-- <h2 class="display-1">Settings</h2> -->

        <!-- <template>
            <v-card
                height="400"
                width="256"
                class="mx-auto"
            >
                <v-navigation-drawer permanent>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">
                                Application
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                subtext
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list
                        dense
                        nav
                    >
                        <v-list-item
                            v-for="item in [{ title: 'asd', icon: 'a' }]"
                            :key="item.title"
                            link
                        >
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </v-card>
        </template> -->

        <v-card class="mt-2 mx-auto" raised elevation max-width="500">
            <v-container>
                <v-form
                    @submit.prevent="onSubmit"
                >
                    <v-subheader class="my-0 overline">Map author preferences</v-subheader>
                    <p class="body-2">Following settings will apply to all maps published from this account [{{ '\xa0' }}<strong style="font-weight: 500;" class="primary--text">{{ $store.battleAccount.battleTag }}</strong>{{ '\xa0' }}].</p>

                    <span class="overline">Public maps</span>
                    <v-divider/>

                    <v-checkbox
                        v-model="settings.mapPubDownload"
                        label="Allow for downloading of public map files"
                    >
                    </v-checkbox>

                    <span class="overline">Private maps</span>
                    <v-divider/>

                    <v-checkbox
                        v-model="settings.mapPrivDownload"
                        label="Allow for downloading of private map files"
                    >
                    </v-checkbox>

                    <v-checkbox
                        v-model="settings.mapPrivDetails"
                    >
                        <template v-slot:label>
                            <span class="">Show details about the map beyond the basics (title, description, thumbnail etc.)</span>
                        </template>
                    </v-checkbox>

                    <v-checkbox
                        v-model="settings.mapPrivListed"
                    >
                        <template v-slot:label>
                            <span class="">Show listing on my profile and allow for using "search by author".</span>
                        </template>
                    </v-checkbox>

                    <div class="d-flex justify-center mt-2">
                        <v-btn
                            type="submit"
                            tile
                            width="200"
                            color="primary darken-3"
                        >
                            Save
                        </v-btn>
                    </div>
                </v-form>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class AccountSettingsView extends Vue {
    private settings: starc.MapAuthorPreferences | null = null;

    private async onSubmit() {
        await this.storeSettings();
    }

    @SGuard()
    private async storeSettings() {
        await this.$starc.saveAccontSettings(this.settings!);
        this.$toast.success('Settings updated!', {
            timeout: 3000,
            closeOnClick: true,
        });
    }

    @SGuard({
        onHttpError: function (this, err) {
            if (err.response!.status === 401) {
                this.$router.push({ name: 'account_auth' });
                return true;
            }
        }
    })
    private async pullSettings() {
        this.settings = (await this.$starc.getAccontSettings()).data;
    }

    async created() {
        await this.pullSettings();
    }
}
</script>
