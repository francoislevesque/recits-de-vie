<template>
  <g
    :transform="`translate(0, ${middle})`"
  >
    <rect 
      class="band fill-current" 
      :class="`text-${color}-300`"
      :x="x"
      :y="-lineHeight/2"
      :width="width"
      :height="lineHeight"
    />
    <circle
      class="fill-current" 
      :cx="width"
      :cy="0"
      :r="7"
      :class="`text-${color}-700`"
    />
  </g>
</template>

<script>

import colors from "../../services/colors";

export default {
	props: {
		amount: {
			required: true,
			type: Object
		}
	},
	computed: {
		lineHeight () {
			return 6;
		},
		filters () {
			return this.$parent.filters;
		},
		scales () {
			return this.$parent.scales;
		},
		domainX () {
			return this.$parent.domainXTranslation;
		},
		color () {
			return colors[this.$parent.category.name];
		},
		distanceX () {
			return this.domainX[1] - this.domainX[0];
		},
		middle () {
			return this.y + this.scales.y.bandwidth()/2 + this.lineHeight/2;
		},
		classes () {
			let classes = [];
			classes.push("text-" + this.color + "-500");
			return classes;
		},
		total () {
			return Math.abs(this.amount.value);
		},
		y () {
			return this.scales.y(this.amount.name);
		},
		x () {
			return 0;
		},
		width () {
			return this.$parent.width * (this.total / this.distanceX);
		}
	}
};
</script>

<style scoped>
</style>