<template>
  <div
    ref="graph"
    class="h-full text-gray-500 graph-band"
  />
</template>

<script>

import { Graph } from "./graph.js";

export default {
	props: {
		options: {
			default () {
				return {};
			},
			type: Object
		},
		scenario: {
			required: true,
			type: Array
		},
		subs: {
			required: true,
			type: Array
		},
		cumuls: {
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
	mounted () {
		this.graph = new Graph(this.$refs.graph, this.scenario, this.subs, this.cumuls, this.domainY, this.filters, {
			mousemove: this.onMouseMove,
			brushed: this.brushed,
		}, this.options);
	},
	methods: {
		onMouseMove (data) {
			this.$emit("mousemove", data);
		},
		brushed (data) {
			this.$emit("brushed", data);
		},
		redraw (domainY, filters) {
			this.graph.redraw(domainY, filters);
		}
	}
};
</script>

<style lang="scss">
.graph-band {

  .axis {
    &.axis-y {
      & > path {
        display: none;
      }
      .tick {
        line {
          stroke: #374151;
        }
      }
    }
    &.axis-x {
      & > path {
        color: #374151;
        stroke-width: 1;
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
  .brush {
    .selection {
      stroke: none;
      fill-opacity: 0;
      fill: transparent;
    }
  }
}
</style>