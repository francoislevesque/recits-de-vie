<template>
  <div class="w-full lg:flex">
    <div
      v-for="(scenario, i) in scenarios"
      :key="i"
      class="p-3 lg:p-5 lg:w-1/3"
    >
      <div class="flex justify-between leading-none">
        <div class="text-sm text-gray-500">
          Scénario {{ i + 1 }}
        </div>
        <div class="text-sm text-gray-900">
          {{ scenarioName(i) }}
        </div>
      </div>

      <band-graph
        :mobile="mobile"
        :filters="filters"
        :domain-y="domainY"
        :domain-y-translation="domainYTranslation"
        :scenario="scenario"
      />
    </div>
  </div>
</template>

<script>

import * as d3 from "d3";
import BandGraph from "./BandGraph";
import { mockData } from "../services/mock";

export default {
	components: {
		BandGraph
	},
	data () {
		return {
			domainY: [0,0],
			domainYTranslation: [0,0],
			window: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			scenarios: mockData(),
			filters: {
				visible: [18,18],
				selected: [18,75],
				category: null,
				amounts: []
			},
		};
	},
	computed: {
		mobile () {
			return this.window.width < 1024;
		}
	},
	watch: {
		"filters.visible" () {
			let oldDomainY = this.domainY;
			let newDomainY = this.calculateDomainY();
      
			this.domainY = newDomainY;
		  window.requestAnimationFrame(this.domainYTransitionStep(null, newDomainY, oldDomainY));
		}
	},
	mounted () {
		this.onResize();
		window.addEventListener("resize", this.onResize);
    
		setInterval(() => {
			this.$set(this.filters.visible, 1, this.filters.visible[1]+1);
		}, 500);
	},
	destroyed () {
		window.removeEventListener("resize", this.onResize);
	},
	created () {
		this.scenarios = mockData();
		this.domainY = this.calculateDomainY();
		this.domainYTranslation = this.domainY;
    
		this.domainYTransitionStep = (start, newDomainY, oldDomainY) => {
			return (timestamp) => {

				if (start == null) start = timestamp;
      
				let duration = 200;
				let progress = timestamp - start;
				let ratio = progress / duration;
        
				this.domainYTranslation = [
					(newDomainY[0] - oldDomainY[0]) * ratio + oldDomainY[0],
					(newDomainY[1] - oldDomainY[1]) * ratio + oldDomainY[1],
				];
        
				if (ratio < 1) {
					window.requestAnimationFrame(this.domainYTransitionStep(start, newDomainY, oldDomainY));
				} else {
					this.domainYTranslation = newDomainY;
				}
			};
		};
	},
	methods: {
		calculateDomainY () {
			let min = Number.MAX_SAFE_INTEGER;
			let max = Number.MIN_SAFE_INTEGER;
    
			this.scenarios.forEach(scenario => {
				let years = scenario.filter(d => d.year >= this.filters.visible[0] && d.year <= this.filters.visible[1]);
				let min_ = Math.min(...years.map(d => Math.min(d.prelevements.total)));
				let max_ = Math.max(...years.map(d => Math.min(d.revenu.total + d.prestations.total + d.benefices.total)));
				if (min_ < min) {
					min = min_;
				}
				if (max_ > max) {
					max = max_;
				}
			});
    
			return [min, max];
		},
		onResize () {
			this.window.width = window.innerWidth;
			this.window.height = window.innerHeight;
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