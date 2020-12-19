<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">Donate</h2>
                <p>
                    If you like this project, and would like to help it financially with the costs of maintenance <span class="primary--text subtitle-2">[1]</span>, and encourage further development <span class="primary--text subtitle-2">[2]</span>, that would be most appreciated. You can use one of the following options to donate.
                </p>
                <v-row class="justify-center align-center flex-wrap flex-lg-nowrap">
                    <v-col cols="12" lg="7" class="text-center">
                        <v-card tile raised class="px-1 py-1" outlined>
                            <form action="https://www.paypal.com/donate" method="post" target="_blank">
                                <input type="hidden" name="cmd" value="_donations" />
                                <input type="hidden" name="business" value="GRSJTGW43Z7QE" />
                                <input type="hidden" name="item_name" :value="paypalItemName" />
                                <input type="hidden" name="currency_code" value="EUR" />

                                <v-text-field
                                    class="mb-1"
                                    dense
                                    filled
                                    hide-details
                                    label="Your nickname (leave blank for anonymous donations)"
                                    clearable
                                    v-model="paypalNickname"
                                />
                                <v-textarea
                                    class="mb-1"
                                    dense
                                    filled
                                    hide-details
                                    label="Private message (optional)"
                                    clearable
                                    rows="1"
                                    auto-grow
                                    v-model="paypalMessage"
                                />
                                <v-btn
                                    tile
                                    block
                                    color="blue"
                                    type="submit"
                                >
                                    <v-icon left>fab fa-paypal</v-icon>
                                    Donate with PayPal
                                </v-btn>
                                <!-- <input type="image" src="https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" /> -->
                                <!-- <img alt="" border="0" src="https://www.paypal.com/en_PL/i/scr/pixel.gif" width="1" height="1" /> -->
                            </form>
                        </v-card>
                    </v-col>
                    <v-col cols="12" lg="5" class="text-center">
                        <v-btn
                            tile
                            block
                            large
                            color="red"
                            href="https://www.patreon.com/SC2ArcadeWatcher"
                            target="_blank"
                        >
                            <v-icon left>fab fa-patreon</v-icon>
                            Patreon
                        </v-btn>
                    </v-col>
                </v-row>

                <v-divider class="my-2"/>
                <div class="body-2">
                    <p>
                        <span class="primary--text">[1]</span> The cost of the primary server is about 300€ per year. Additionally there are two bare metal servers co-hosted elsewhere, specifically tailored for running custom SC2 clients.<br>
                        First instance is maintained by Talv, second one by Aduolu (thank you!). Costs of these is hard to estimate. <br>
                        Long term plan is to make necessary optimizations within SC2 client code. What will enable complete migration path to the cloud hosting at an affordable price.. currently it's simply easier &amp; cheaper to keep things this way.
                    </p>
                    <p>
                        <span class="primary--text">[2]</span> As a supporter you'll have an impact on which planned features &amp; improvements will be prioritized - if there's something you'd like to see implemented, that's the best way to push things forward :)
                    </p>
                    <p>
                        <span class="primary--text">[3]</span> Spare money (if any) will be saved for future year(s). As server costs are unlikely to decrease.
                    </p>
                </div>

                <v-divider class="my-2"/>
                <h3 class="headline">Recent donations</h3>

                <v-simple-table fixed-header dense>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th class="text-right">Amount</th>
                                <th class="text-right">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in recentDonations" :key="i">
                                <td>
                                    <span class="font-weight-light">{{ item.date }}</span>
                                </td>
                                <td>
                                    <span v-if="item.nickname" class="font-weight-medium body-2">{{ item.nickname }}</span>
                                    <span v-else class="font-italic text--secondary">Anonymous</span>
                                </td>
                                <td class="text-right">
                                    <span>{{ item.amount.toLocaleString(void 0, { style: 'currency', currency: item.currency }) }}</span>
                                </td>
                                <td class="text-right">
                                    <v-icon
                                        v-if="item.method === 'PayPal'"
                                        small
                                        color="primary"
                                    >
                                        fab fa-paypal
                                    </v-icon>
                                    <v-icon
                                        v-else-if="item.method === 'Patreon'"
                                        small
                                        color="red"
                                    >
                                        fab fa-patreon
                                    </v-icon>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SGuard } from '../../helpers';

@Component
export default class InfoDonateView extends Vue {
    private recentDonations: any[] | null = null;
    private paypalNickname: string = '';
    private paypalMessage: string = '';

    private get paypalItemName() {
        const o: string[] = [];
        o.push('sc2arcade.com');
        if (this.paypalNickname) {
            o.push(`[${this.paypalNickname}]`);
        }
        if (this.paypalMessage) {
            o.push(this.paypalMessage.replace(/\n/g, ' | '));
        }
        return o.join(' - ');
    }

    @SGuard()
    private async fetchRecentDonations() {
        this.recentDonations = (await this.$starc.getInfoDonations()).data.donations;
    }

    private created() {
        this.fetchRecentDonations();
    }
}
</script>
