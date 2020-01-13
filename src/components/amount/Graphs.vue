<template>
  <div
    ref="graph"
    class="graph-amount h-full"
  />
</template>

<script>

import { Graphs } from "./graphs.js";

export default {
	props: {
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
		this.graphs = new Graphs(this.$refs.graph, this.data, this.domainX, this.filters);
	},
	methods: {
		redraw (domainX, data, filters) {
			this.graphs.redraw(domainX, data, filters);
		}
	}
};
</script>

<style lang="scss">
.graph-amount {
  .axis {
    &.axis-x {
      & > path {
        display: none;
      }
    }
  }
}
</style>