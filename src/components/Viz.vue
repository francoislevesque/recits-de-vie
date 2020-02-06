<template>
  <div class="max-w-8xl mx-auto h-full overflow-hidden lg:flex lg:px-5">
    <div
      v-for="(scenario, i) in scenarios"
      :key="i"
      ref="scenario"
      class="p-5 pb-0 h-1/3 lg:h-auto lg:px-1 xl:p-4 lg:pb-5 lg:w-1/3 lg:flex lg:flex-col overflow-hidden"
    >
      <div
        ref="graph-container"
        class="flex flex-col h-full lg:h-4/10 band-graph"
        :style="{transform: `translateY(${graphOffset}px)`}"
      >
        <div class="flex align-baseline justify-between mb-4 lg:mb-2">
          <div class="text-sm text-gray-800 font-bold lg:text-base">
            Scénario {{ i + 1 }}
          </div>
          <img
            :src="require(`@/assets/${i+1}.svg`)"
            :alt="`Scénario ${ i + 1 }`"
            class="inline h-3 w-auto opacity-75 mr-3"
          >
        </div>

        <band-graph
          ref="graph"
          class="flex-grow overflow-hidden"
          :class="{'opacity-25': !filters.selectedScenarios.includes(i)}"
          :filters="filters"
          :domain-y="domainGraph"
          :scenario="scenario"
          :subs="scenarioSubs[i]"
          :cumuls="scenarioCumuls[i]"
          :options="options"
          @mousemove="onMouseMove($event, i)"
          @brushed="brushed"
        />
      </div>

      <div
        v-show="filters.showAmounts"
        class="lg:h-6/10"
      >
        <div
          v-if="!mobile"
          class="h-full pt-4"
          :class="{'opacity-25': !filters.selectedScenarios.includes(i)}"
        >
          <amount-graphs
            ref="graphAmount"
            :options="options"
            :filters="filters"
            :domain-x="domainAmount"
            :data="scenarioAmounts[i]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from "d3";
import BandGraph from "./band/Graph.vue";
import AmountGraphs from "./amount/Graphs.vue";
import { mockData } from "../services/mock";
import { amounts, scenarios, substractions, cumul } from "../services/format";
import { isMobile } from "../services/responsive";

export default {
	components: {
		BandGraph,
		AmountGraphs
	},
	props: {
		options: {
			default () {
				return {};
			},
			type: Object
		},
		filters: {
			required: true,
			type: Object
		}
	},
	data () {
		return {
			mobile: isMobile(),
			graphOffset: 0,
			domainGraph: [0,0],
			domainAmount: [0,0],
			scenarios: [],
			scenarioSubs: [],
			scenarioCumuls: [],
			scenarioAmounts: [],
		};
	},
	watch: {
		"filters.showAmounts" () {
			this.checkOffset();
		},
		"filters.showSubstraction" () {
			this.redrawGraphs();
		},
		"filters.showCumul" () {
			this.redrawGraphs();
		},
		"filters.selected" () {
			this.updateAmountsData();
			this.calculateDomains();
      
			this.redrawGraphs();
			this.redrawAmountGraphs();
		},
		"filters.agglomerationAverage" () {
			this.updateAmountsData();
			this.calculateDomains();
      
			this.redrawAmountGraphs();
		},
	},
	created () {
		this.scenarios = scenarios();
		this.scenarioSubs = substractions(this.scenarios);
		this.scenarioCumuls = cumul(this.scenarios);
    
		this.scenarioSubsDomainY = d3.extent(this.scenarioSubs.map(s => d3.extent(s, s => s.value)).flat());
		this.scenarioCumulsDomainY = d3.extent(this.scenarioCumuls.map(s => d3.extent(s, s => s.value)).flat());

		this.updateAmountsData();
		this.calculateDomains();
	},
	methods: {
		calculateDomains () {

			let min = Number.MAX_SAFE_INTEGER;
			let maxSum = Number.MIN_SAFE_INTEGER;
      
			if (this.filters.showSubstraction) {
				this.domainGraph = this.scenarioSubsDomainY;
			} else if (this.filters.showCumul) {
				this.domainGraph = this.scenarioCumulsDomainY;
			} else {    
				this.scenarios.forEach(scenario => {
					let years = scenario.filter(d => d.year >= this.filters.visible[0] && d.year <= this.filters.visible[1]);
					let min_ = Math.min(...years.map(d => d.categories.prelevements.total));
					let maxSum_ = Math.max(...years.map(d => d.categories.revenu.total + d.categories.prestations.total + d.categories.benefices.total));
					if (min_ < min) {
						min = min_;
					}
					if (maxSum_ > maxSum) {
						maxSum = maxSum_;
					}
				});

				this.domainGraph =  [min, maxSum];
			}

			let maxAbsolute = 0;

			this.scenarioAmounts.forEach(scenario => {
				let maxAbsolute_ = Math.max(...scenario.map(category => Math.max(...category.amounts.map(a => a.value))));
				if (maxAbsolute_ > maxAbsolute) {
					maxAbsolute = maxAbsolute_;
				}
			});
      
			this.domainAmount = [0, maxAbsolute];
		},
		updateAmountsData () {
			this.scenarioAmounts = amounts(this.scenarios, this.filters);
		},
		scenarioName (i) {
			let names = [
				"Ella reste seule",
				"Ella forme un couple avec 2 enfants",
				"Ella est monoparentale avec 1 enfant"
			];
			return names[i];
		},
		onResize () {
			this.mobile = isMobile();
			this.checkOffset();
			this.redrawGraphs();
			this.redrawAmountGraphs();
		},
		checkOffset () {
			if (this.filters.showAmounts || isMobile()) {
				this.graphOffset = 0;
			} else {
				let el = this.$refs["graph-container"][0];
				this.graphOffset = (this.$refs["scenario"][0].clientHeight / 2) - (el.clientHeight / 2);
			}
		},
		redrawGraphs () {
			this.$refs.graph.forEach((g, i) => g.redraw(this.domainGraph, this.filters));
		},
		redrawAmountGraphs () {
			// Does not exists on mobile
			if (this.$refs.graphAmount) {
				this.$refs.graphAmount.forEach((g, i) => g.redraw(this.domainAmount, this.scenarioAmounts[i], this.filters));
			}
		},
		onMouseMove (data, i) {
			let data_ = data;
			if (data != null) {
				data_.scenario = i;
			}
			this.$emit("mousemove", data_);
		},
		brushed (data) {
			this.$emit("brushed", data);
		}
	}
};
</script>

<style lang="scss">
.band-graph {
  transition: transform ease-in-out 0.4s;
}
</style>