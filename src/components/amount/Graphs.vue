<template>
  <div class="relative h-full">
    <h2 class="mb-4 font-semibold leading-none text-center">
      <span v-if="filters.selected[0] != filters.selected[1]">
        <span v-if="filters.agglomerationAverage"><b>Average yearly amounts</b> between {{ filters.selected[0] }} and {{ filters.selected[1] }} years old</span>
        <span v-else><b>Cumulative</b> amounts between {{ filters.selected[0] }} and {{ filters.selected[1] }} years old</span>
      </span>
      <span v-else><b>Yearly amounts</b> at {{ filters.selected[0] }} years old</span>
    </h2>
    <div
      ref="graph"
      class="h-full graph-amount"
    />
    <div class="absolute bottom-0 w-full text-xs leading-tight text-gray-700">
      A positive value refers to a perceived amount while a negative value refers to an paid charge.
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