<template>
  <div class="relative h-full">
    <h2 class="text-center leading-none font-semibold">
      <span v-if="filters.selected[0] != filters.selected[1]">
        <span v-if="filters.agglomerationAverage">Montants <b>moyens</b> annuels entre {{ filters.selected[0] }} et {{ filters.selected[1] }} ans</span>
        <span v-else><b>Cumul</b> des montants entre {{ filters.selected[0] }} et {{ filters.selected[1] }} ans</span>
      </span>
      <span v-else><b>Montants annuels</b> à {{ filters.selected[0] }} ans</span>
    </h2>
    <div
      ref="graph"
      class="graph-amount h-full"
    />
    <div class="absolute bottom-0 text-xs w-full leading-tight text-gray-700">
      Une valeur positive correspond à un montant reçu tandis qu’une valeur négative correspond à un prélèvement assumé.
    </div>
  </div>
</template>

<script>

import { Graphs } from "./graphs.js";

export default {
	props: {
		options: {
			default () {
				return {};
			},
			type: Object
		},
		data: {
			required: true,
			type: Array
		},
		domainX: {
			required: true,
			type: Array
		},
		filters: {
			required: true,
			type: Object
		}
	},
	data () {
		return {
			graphs: null
		};
	},
	mounted () {
		this.graphs = new Graphs(this.$refs.graph, this.data, this.domainX, this.filters, this.options);
	},
	methods: {
		redraw (domainX, data, filters) {
			this.graphs.redraw(domainX, data, filters);
		}
	}
};
</script>

<style lang="scss">

@keyframes pop {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.6);
    }
}

.graph-amount {
  .axis {
    &.axis-x {
      & > path {
        display: none;
      }
    }
  }

  circle.highlight {
    animation: pop 0.5s ease-in-out infinite alternate;
  }
}
</style>