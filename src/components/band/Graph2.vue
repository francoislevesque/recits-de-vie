<template>
  <div
    ref="graph"
    class="h-full"
  />
</template>

<script>

import { Graph } from "./graph";

export default {
	props: {
		mobile: {
			required: true,
			type: Boolean
		},
		scenario: {
			required: true,
			type: Array
		},
		domainY: {
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
			graph: {}
		};
	},
	watch: {
		"filters.visible" () {
			this.graph.redraw(this.domainY, this.filters);
		},
		"filters.selected" () {
			this.graph.redraw(this.domainY, this.filters);
		}
	},
	mounted () {
		this.graph = new Graph(this.$refs.graph, this.scenario, this.domainY, this.filters);
	}
};
</script>

<style lang="scss">
.axis {
  &.axis-y {
    & > path {
      display: none;
    }
    .tick {
      line {
        stroke: #d1d1d1;
      }
    }
  }
  &.axis-x {
    & > path {
      color: #e1e1e1;
      stroke-width: 2;
      @media only screen and (max-width: 1024px) {
        display: none;
      }
    }
    .tick {
      opacity: 0;
      &:nth-child(5n - 1) {
        opacity: 1;
      }
    }
  }
}
</style>