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