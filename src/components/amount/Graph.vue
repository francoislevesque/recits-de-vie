<template>
  <div class="h-full">
    <h3
      class="text-md font-bold text-lg"
      :class="`text-${color}-500`"
    >
      {{ $t(category.name) }}
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
          <line
            :x1="0"
            :x2="0"
            :y1="0"
            :y2="height"
            stroke="#333"
            stroke-width="1"
          ></line>
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
				right: 100,
				bottom: 0,
				left: 150
			}
		};
	},
	computed: {
		filters () {
			return this.$parent.filters;
		},
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
			return this.$parent.fullWidth - this.margin.left - this.margin.right;
		},
	},
	watch: {
		"height" () {
			this.$set(this.scales, "y", this.scales.y.range([0,this.height]).copy());
		}
	},
	mounted () {    
		this.scales.y = d3.scaleBand()
			.range([0,this.height])
			.domain(this.category.amounts.map(d => d.name));
            
		this.loaded = true;
	}
};
</script>

<style>

</style>