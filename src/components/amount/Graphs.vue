<template>
  <div class="h-full">
    <h2 class="text-center leading-none font-semibold">
      <b>Moyenne</b> des montants entre {{ filters.selected[0] }} et {{ filters.selected[1] }} ans
    </h2>
    <div
      ref="graph"
      class="graph-amount h-full"
    />
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