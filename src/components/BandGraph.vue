<template>
  <div
    ref="graph"
    class="w-full"
  >
    <svg
      v-if="loaded"
      :height="height + margin.top + margin.bottom"
      :width="width + margin.left + margin.right"
    >
      <g :transform="`translate(${margin.left},${margin.top})`">

        <!-- Axis -->
        <g
          ref="axisX"
          class="axis axis-x"
          :transform="`translate(0 ${(mobile) ? height + 18 : 0})`"
        ></g>
        <g
          ref="axisY"
          class="axis axis-y"
        ></g>

        <!-- Bands -->

        <g
          v-for="year in scenario"
          :key="year.year"
          class="year"
        >          
          <band
            category="revenu"
            color="blue"
            :year="year"
          ></band>

          <band
            category="benefices"
            color="green"
            :year="year"
            :offset-by="[year.revenu.total]"
          ></band>

          <band
            category="prestations"
            color="teal"
            :year="year"
            :offset-by="[year.revenu.total, year.benefices.total]"
          ></band>

          <band
            category="prelevements"
            color="red"
            :year="year"
          ></band>
        </g>

        <!-- Top Line -->
        <line
          v-if="!mobile"
          :x1="scales.x(filters.selected[0])"
          :x2="scales.x(filters.selected[1]) + scales.x.bandwidth()"
          :y1="0"
          :y2="0"
          stroke="#000"
          :stroke-width="(mobile) ? 1 : 2"
        ></line> 

        <!-- 0 Line -->
        <line
          :x1="scales.x(0)"
          :x2="scales.x(scenario[scenario.length - 1].year) + scales.x.bandwidth()"
          :y1="scales.y(0)"
          :y2="scales.y(0)"
          stroke="#999"
        ></line> 
        <line
          v-if="!mobile"
          :x1="scales.x(filters.selected[0])"
          :x2="scales.x(filters.selected[1]) + scales.x.bandwidth()"
          :y1="scales.y(0)"
          :y2="scales.y(0)"
          stroke="#000"
          stroke-width="2"
        ></line> 

        <!-- Bezier -->
        <path
          v-if="!mobile"
          :d="`M ${scales.x(filters.selected[0])} 0 L ${scales.x(filters.selected[0])} ${height - bezierCurve} q 0 ${bezierCurve} -${bezierCurve} ${bezierCurve} L 0 ${height}`"
          stroke="#a1a1a1"
          stroke-dasharray="4"
          fill="transparent"
        />
        <path
          v-if="!mobile"
          :d="`M ${scales.x(filters.selected[1]) + scales.x.bandwidth()} 0 L ${scales.x(filters.selected[1]) + scales.x.bandwidth()} ${height - bezierCurve} q 0 ${bezierCurve} ${bezierCurve} ${bezierCurve} L ${width} ${height}`"
          stroke="#a1a1a1"
          stroke-dasharray="4"
          fill="transparent"
        />
      </g>
    </svg>
  </div>
</template>

<script>

import * as d3 from "d3";
import Band from "./Band";

const PADDING_LEFT = 5;
const TICK_PADDING = 8;

export default {
	components: {
		Band
	},
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
		domainYTranslation: {
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
			containerWidth: 0,
			bezierCurve: 10,
			loaded: false,
			scales: {
				x: null,
				y: null
			},
			axis: {
				x: null,
				y: null
			}
		};
	},
	computed: {
		margin () {
			let margin = {
				top: (this.mobile) ? 8 : 24,
				bottom: (this.mobile) ? 11 : 0,
				left: 52,
				right: 2
			};
			return margin;
		},
		width () {
			if (!this.loaded) {
				return 0;
			}
			return this.containerWidth - this.margin.left - this.margin.right;
		},
		height () {
			return (this.mobile) ? this.$parent.window.height/3 - 60 : this.width / 1.4;
		}
	},
	watch: {
		domainY (newValue, oldValue) {
			this.yAxisTransition(newValue, oldValue);
		},
		width() {
			this.$set(this.scales, "x", this.scales.x.rangeRound([PADDING_LEFT, this.width]).copy());
			this.xAxisUpdate();
		},
		height () {
			this.$set(this.scales, "y", this.scales.y.range([this.height, 0]).copy());
			this.yAxisUpdate();
		}
	},
	destroyed () {
		window.removeEventListener("resize", this.onResize);
	},
	mounted () {
		this.onResize();
		window.addEventListener("resize", this.onResize);
    
		this.scales.x = d3.scaleBand()
			.domain(this.scenario.map(d => d.year))
			.range([PADDING_LEFT, this.width])
			.padding(0.1);

		this.scales.y = d3.scaleLinear()
			.domain(this.domainY)
			.range([this.height, 0]);
      
		this.axis.x = d3.axisTop(this.scales.x)
			.tickSize(0)
			.ticks(1)
			.tickPadding(TICK_PADDING);
      
		this.axis.y = d3.axisLeft(this.scales.y)
			.tickSize(-this.width)
			.ticks(5)
			.tickFormat((d) => (+d).priceFormat())
			.tickPadding(TICK_PADDING);
    
		this.loaded = true;
    
		this.$nextTick(() => {
			d3.select(this.$refs.axisX).call(this.axis.x);
			d3.select(this.$refs.axisY).call(this.axis.y);  
		});
	},
	methods: {
		onResize () {
			this.containerWidth = this.$refs.graph.clientWidth;
		},
		yAxisTransition () {
			this.$set(this.scales, "y", this.scales.y.domain(this.domainY).copy());
			this.axis.y = this.axis.y.scale(this.scales.y);
			d3.select(this.$refs.axisY).transition().call(this.axis.y);
		},
		yAxisUpdate () {
			this.axis.y = this.axis.y.scale(this.scales.y);
			d3.select(this.$refs.axisY).call(this.axis.y);
		},
		xAxisUpdate () {
			this.axis.x = this.axis.x.scale(this.scales.x);
			d3.select(this.$refs.axisX).call(this.axis.x);
		}
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