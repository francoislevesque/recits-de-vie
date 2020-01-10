<template>
  <div class="h-full">
    <h3
      class="text-md font-bold text-lg"
      :class="`text-${color}-500`"
    >
      {{ category.name }}
    </h3>
    <div
      ref="graph"
      class="h-full"
    >
      <svg
        v-if="loaded"
        :height="height + margin.top + margin.bottom"
        :width="width + margin.left + margin.right"
      >
        <g :transform="`translate(${margin.left},${margin.top})`">
          <g class="bars">
            <g
              v-for="d in category.amounts"
              :key="d.name"
            >
              <band :amount="d"></band>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>

import * as d3 from "d3";
import colors from "../../services/colors";
import Band from "./Band";

export default {
	components: {
		Band
	},
	props: {
		category: {
			required: true,
			type: Object
		},
		domainX: {
			required: true,
			type: Array
		},
		domainXTranslation: {
			required: true,
			type: Array
		}
	},
	data () {
		return {
			containerWidth: 0,
			loaded: false,
			scales: {
				y: null
			},
			margin: {
				top: 0,
				right: 25,
				bottom: 0,
				left: 60
			}
		};
	},
	computed: {
		color () {
			return colors[this.category.name];
		},
		numberOfBars () {
			return this.category.amounts.length;
		},
		height () {
			return this.$parent.barHeight * this.numberOfBars;
		},
		width () {
			return this.containerWidth - this.margin.left - this.margin.right;
		},
	},
	destroyed () {
		window.removeEventListener("resize", this.onResize);
	},
	mounted () {
		window.addEventListener("resize", this.onResize);
      
		this.scales.y = d3.scaleBand()
			.range([0,this.height])
			.domain(this.category.amounts.map(d => d.name));
      
		this.onResize();
      
		this.loaded = true;
	},
	methods: {
		onResize () {
			this.containerWidth = this.$refs.graph.clientWidth;
			this.$set(this.scales, "y", this.scales.y.range([0,this.height]).copy());
		}
	}
};
</script>

<style>

</style>