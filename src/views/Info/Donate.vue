<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">Donate</h2>
                <p>
                    If you like this project, and would like to help it financially with the costs of maintenance<em>[1]</em> and further development<em>[2]</em> that would be most appreciated. You can use one of the following options to donate.
                </p>
                <v-row>
                    <v-col xs="12" md="12" lg="6" class="text-center">
                        <form action="https://www.paypal.com/donate" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="GRSJTGW43Z7QE" />
                            <input type="hidden" name="item_name" :value="paypalItemName" />
                            <input type="hidden" name="currency_code" value="EUR" />

                            <v-text-field
                                dense
                                solo
                                hide-details
                                label="Message (optional)"
                                clearable
                                v-model="paypalMessage"
                            />
                            <v-btn
                                tile
                                block
                                large
                                color="blue"
                                type="submit"
                            >
                                <v-icon left>fab fa-paypal</v-icon>
                                Donate with PayPal
                            </v-btn>
                            <!-- <input type="image" src="https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" /> -->
                            <!-- <img alt="" border="0" src="https://www.paypal.com/en_PL/i/scr/pixel.gif" width="1" height="1" /> -->
                        </form>
                    </v-col>
                    <v-col xs="12" md="12" lg="6" class="text-center">
                        <v-btn
                            tile
                            block
                            large
                            color="red"
                            href="https://www.patreon.com/SC2ArcadeWatcher"
                            target="_blank"
                        >
                            <v-icon left>fab fa-patreon</v-icon>
                            patreon.com/SC2ArcadeWatcher
                        </v-btn>
                    </v-col>
                </v-row>

                <v-divider class="my-2"/>
                <div class="body-2">
                    <p>
                        <em>[1]</em> The cost of the primary server is about 300€ per year. Additionally there are two bare metal servers co-hosted elsewhere, specifically tailored for running custom SC2 clients.<br>
                        First instance is maintained by Talv, second one by Aduolu (thank you!). Costs of these is hard to estimate. <br>
                        Long term plan is to make necessary optimizations within SC2 client code. What will enable complete migration path to the cloud hosting at an affordable price.. currently it's simply easier &amp; cheaper to keep things this way.
                    </p>
                    <p>
                        <em>[2]</em> As a supporter you'll have an impact on which planned features &amp; improvements will be prioritized - if there's something you'd like to see implemented, that's the best way to push things forward :)
                    </p>
                </div>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class InfoDonateView extends Vue {
    private paypalMessage: string = '';

    private get paypalItemName() {
        const o: string[] = [];
        o.push('sc2arcade.com');
        if (this.paypalMessage) {
            o.push(this.paypalMessage);
        }
        return o.join(' - ');
    }
}
</script>
