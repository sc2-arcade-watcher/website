<template>
    <div class="map-review-item">
        <div class="author">
            <profile-item :profile="review.author" show-discriminator="true"/>
        </div>
        <div class="inner">
            <div class="content">{{ review.body }}</div>
            <div class="meta">
                <div class="rating">
                    <v-rating
                        readonly
                        color="primary"
                        background-color="grey"
                        length="5"
                        size="20"
                        hover
                        :value="review.rating"
                    ></v-rating>
                </div>

                <div class="helpful">
                    <span class="text--secondary">
                        <strong>{{ review.helpfulCount }}</strong> helpfuls
                    </span>
                </div>

                <div class="date">
                    <v-tooltip top transition="fade-transition">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                ~ {{ $dfns.formatDistanceStrict(new Date(review.createdAt), new Date(), {
                                    addSuffix: true,
                                    roundingMethod: 'floor'}) }}
                            </span>
                        </template>
                        <span>
                            {{ $dfns.formatISO9075(new Date(review.createdAt), { representation: 'complete' }) }}
                        </span>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import ProfileItem from '@/components/ProfileItem.vue';

@Component({
    components: {
        ProfileItem,
    },
})
export default class MapReviewItem extends Vue {
    @Prop({
        required: true,
    })
    readonly review!: starc.MapUserReview;

    created() {
    }
}
</script>

<style lang="scss">
.map-review-item {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    padding: 0;

    &:not(:last-child) {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px dashed rgba(#fff, 0.05);
    }

    .author {
        display: flex;
        width: 200px;
        min-width: 200px;
        padding: 0.5rem 0;

        text-align: center;
        align-items: flex-start;
        justify-content: center;
    }

    .player-link {
        .v-avatar {
            width: 80px !important;
            height: 80px !important;
        }

        .avatar-img {
            height: 80px !important;
        }

        span {
            display: block;
            margin-left: 0;
            margin-top: 0.2rem;
        }
    }

    .inner {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        max-width: 100%;
        overflow-x: auto;

        >.content {
            flex-grow: 1;
            padding: 0.5rem;
            background: rgba(#fff, 0.025);
            white-space: pre-wrap;
        }

        >.meta {
            display: flex;
            width: 100%;
            padding: 0 0.5rem;
            align-content: center;
            justify-content: space-between;
            margin-top: 0.5rem;
        }
    }

    .meta {
        line-height: 36px;

        .helpful {
            font-size: 0.9em;
        }

        .date {
            color: map-get($blue, 'darken-1');
            font-style: italic;
        }
    }

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
        flex-wrap: wrap;

        .author {
            flex-grow: 1;
            width: 100%;
            min-width: none;
        }
    }
}
</style>
