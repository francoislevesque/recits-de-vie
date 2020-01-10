<template>
  <div
    ref="graphs"
    class="h-full"
  >
    <div
      v-for="category in data"
      :key="category.name"
    >
      <graph
        :category="category"
        :domain-x="domainX"
        :domain-x-translation="domainXTranslation"
      />
    </div>
  </div>
</template>

<script>

import * as d3 from "d3";
import Graph from "./Graph";

export default {
	components: {
		Graph
	},
	props: {
		data: {
			required: true,
			type: Array
		},
		filters: {
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
			fullHeight: 0
		};
	},
	computed: {
		numberOfBars () {
			return this.data.reduce((acc, category) => acc += category.amounts.length, 0);
		},
		barHeight () {
			return Math.round(this.fullHeight / this.numberOfBars) - 10;
		}
	},
	destroyed () {
		window.removeEventListener("resize", this.onResize);
	},
	mounted () {
		this.onResize();
		window.addEventListener("resize", this.onResize);
	},
	methods: {
		onResize () {
			this.fullHeight = this.$refs.graphs.clientHeight;
		}
	}
};
</script>

<style>

</style>