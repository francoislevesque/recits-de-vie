<template>
  <g :transform="`translate(${x} ${y})`">
    <rect 
      class="fill-current"
      :class="classes"
      :width="scales.x.bandwidth()"
      :height="height"
      :opacity="$parent.opacity"
    />
  </g>
</template>

<script>
export default {
	props: {
		amount: {
			required: true,
			type: Object
		}
	},
	computed: {
		filters () {
			return this.$parent.filters;
		},
		scales () {
			return this.$parent.scales;
		},
		category () {
			return this.$parent.category;
		},
		total () {
			return this.$parent.total;
		},
		ratio () {
			return this.amount.amount / this.total;
		},
		x () {
			return 0;
		},
		y () {
			return this.$parent.height * (this.amount.offset / this.total);
		},
		height () {
			return this.ratio * this.$parent.height;
		},
		opacity () {
			return this.$parent.opacity;
		},
		classes () {
			let year = this.$parent.year.year;
			let color = this.$parent.color;
			let dark = 700;
			if (
				year >= this.filters.visible[0] && year <= this.filters.visible[1] &&
        this.filters.amounts.includes(this.amount.name)
			) {
				let index = this.filters.amounts.findIndex((a) => a == this.amount.name);
				dark = Math.min(900, dark + index*100);
				return "text-" + color + "-" + dark;
			}
			return this.$parent.classes;
		}
	}
};
</script>
