<template>
  <div
    class="fixed z-10 top-0 left-0 rounded shadow-lg pt-3 p-5 hidden lg:block bg-white"
    :style="{transform: `translate(${x}px, ${data.y + 1}px)`, width: width + 'px'}"
  >
    <div class="font-bold mb-2">
      {{ data.year }} ans
    </div>
    <div
      v-for="category in scenario"
      :key="category.category"
      class="mb-2"
    >
      <div
        class="font-bold text-sm uppercase text-gray-700 mb-1"
        :class="category.category"
      >
        {{ $t(category.category) }}
      </div>
      <div>
        <div
          v-for="amount in category.amounts"
          :key="amount.name"
          class="flex justify-between text-sm leading-none w-full mb-1"
        >
          <div class="font-medium pr-1">
            {{ $t(amount.name) }}
          </div>
          <div class="w-32 text-right">
            {{ amount.value.priceFormat() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { scenarios } from "../services/format";
export default {
	props: {
		data: {
			required: true,
			type: Object
		}
	},
	data () {
		return {
			scenarios: scenarios(),
			width: 380
		};
	},
	computed: {
		x () {
			if (this.data.x + this.width > window.innerWidth) {
				return this.data.x - this.width - 1;
			}
			return this.data.x + 1;
		},
		scenario () {
			let data = [];
			let categories = this.scenarios[this.data.scenario].find(s => s.year == this.data.year).categories;
			Object.keys(categories).forEach(category => {
				let amounts = categories[category];
				data.push({
					category: category,
					amounts: Object.keys(amounts)
						.filter(key => key != "total" && amounts[key] != 0)
						.map(key => {
							return {
								name: key, value: amounts[key]
							};
						})
				});
			});
			return data;
		}
	}
};
</script>

<style>

</style>