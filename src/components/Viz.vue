<template>
  <div class="w-full h-screen overflow-hidden lg:flex">
    <div
      v-for="(scenario, i) in scenarios"
      :key="i"
      class="p-4 h-1/3 lg:h-auto lg:p-5 lg:w-1/3 lg:flex lg:flex-col overflow-hidden"
    >
      <div class="flex flex-col h-full lg:h-4/10">
        <div class="flex justify-between leading-none mb-6 lg:block lg:mb-4 lg:leading-tight">
          <div class="text-sm text-gray-500">
            Scénario {{ i + 1 }}
          </div>
          <div class="text-sm text-gray-900 lg:text-base lg:font-semibold">
            {{ scenarioName(i) }}
          </div>
        </div>

        <band-graph
          class="flex-grow overflow-hidden"
          :class="{'opacity-25': !filters.selectedScenarios.includes(i)}"
          :mobile="mobile"
          :filters="filters"
          :domain-y="domainGraph"
          :scenario="scenario"
        />
      </div>

      <div class="lg:h-6/10">
        <div
          v-if="!mobile"
          class="h-full pt-10"
          :class="{'opacity-25': !filters.selectedScenarios.includes(i)}"
        >
          <amount-graphs
            ref="graphAmount"
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
import { amounts, scenarios } from "../services/format";

export default {
	components: {
		BandGraph,
		AmountGraphs
	},
	props: {
		filters: {
			required: true,
			type: Object
		}
	},
	data () {
		return {
			domainGraph: [0,0],
			domainAmount: [0,0],
			window: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			scenarios: [],
			scenarioAmounts: [],
		};
	},
	computed: {
		mobile () {
			return this.window.width < 1024;
		}
	},
	watch: {
		"filters.selected" () {
			this.updateAmountsData();
			this.calculateDomains();
      
			this.$refs.graphAmount.forEach((g, i) => g.redraw(this.domainAmount, this.scenarioAmounts[i], this.filters));
		}
	},
	created () {
		this.scenarios = scenarios();
		this.updateAmountsData();
		this.calculateDomains();
	},
	methods: {
		calculateDomains () {
			let min = Number.MAX_SAFE_INTEGER;
			let maxSum = Number.MIN_SAFE_INTEGER;
    
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

			let maxAbsolute = 0;

			this.scenarioAmounts.forEach(scenario => {
				let maxAbsolute_ = Math.max(...scenario.map(category => Math.max(...category.amounts.map(a => a.value))));
				if (maxAbsolute_ > maxAbsolute) {
					maxAbsolute = maxAbsolute_;
				}
			});
      
			this.domainGraph =  [min, maxSum];
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
		}
	}
};
</script>

<style lang="scss">

</style>