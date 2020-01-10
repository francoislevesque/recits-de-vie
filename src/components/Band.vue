<template>
  <g>
    <rect 
      class="band fill-current" 
      :style="styles"
      :class="classes"
      :x="x"
      :y="y"
      :width="scales.x.bandwidth()"
      :height="Math.abs(height)"
      :opacity="opacity"
    />
    <g
      v-if="false"
      :transform="`translate(${x} ${y})`"
    >
      <sub-band
        v-for="amount in amounts"
        :key="amount.name"
        :amount="amount"
      />
    </g>
  </g>
</template>

<script>

import SubBand from "./SubBand";

export default {
	components: {
		SubBand
	},
	props: {
		year: {
			required: true,
			type: Object
		},
		category: {
			required: true,
			type: String
		},
		color: {
			required: true,
			type: String
		},
		offsetBy: {
			default () {
				return [];
			},
			type: Array
		}
	},
	computed: {
		filters () {
			return this.$parent.filters;
		},
		scales () {
			return this.$parent.scales;
		},
		domainY () {
			return this.$parent.domainYTranslation;
		},
		distanceY () {
			return this.domainY[1] - this.domainY[0];
		},
		origin () {
			return (this.domainY[1] / this.distanceY) * this.$parent.height;
		},
		styles () {      
			/* let scale = "scale(1, 1)";
			if (this.year.year < this.filters.visible[0] || this.year.year > this.filters.visible[1]) {
				scale = "scale(1, 0)";
			} */
      
			return {
				//transform: scale,
				transformOrigin: `0px ${(this.total > 0) ? this.y + this.height : this.y}px`
			};
		},
		classes () {
			let classes = [];
			classes.push("text-" + this.color + "-500");
			return classes;
		},
		opacity () {
			if (this.year.year < this.filters.visible[0] || this.year.year > this.filters.visible[1]) {
				return 0;
			} 
			if (this.year.year < this.filters.selected[0] || this.year.year > this.filters.selected[1]) {
				return 0.1;
			}
			if (this.filters.category != null && this.category != this.filters.category) {
				return 0.1;
			}
			return 1;
		},
		categoryCount () {
			return this.year[this.category];
		},
		total () {
			return this.categoryCount.total;
		},
		x () {
			return this.scales.x(this.year.year);
		},
		y () {
			let y = this.origin;
			if (this.total > 0) {
				y -= this.height;
			}
			this.offsetBy.forEach(offset => {
				y -= this.$parent.height * (Math.abs(offset) / this.distanceY);
			});
			return y;
		},
		height () {
			return this.$parent.height * (this.total / this.distanceY);
		},
		amounts () {
			let offset = 0;
			let amounts = [];
			Object.keys(this.categoryCount).forEach(key => {
				if (key != "total") {
					let amount = this.categoryCount[key];
					amounts.push({
						offset: offset,
						amount: amount,
						name: key
					});
					offset += amount;
				}
			});
			return amounts;
		}
	}
};
</script>

<style scoped>
  .band {
    transition: opacity 0.2s;
  }
</style>