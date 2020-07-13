<template>
  <div
    class="fixed top-0 left-0 z-10 hidden p-5 pt-3 bg-white rounded shadow-lg lg:block"
    :style="{transform: `translate(${x}px, ${data.y + 1}px)`, width: width + 'px'}"
  >
    <div class="mb-2 font-bold">
      {{ data.year }} years old
    </div>
    <div
      v-for="category in scenario"
      :key="category.category"
      class="mb-2"
    >
      <div
        class="mb-1 text-sm font-bold text-gray-700 uppercase"
        :class="category.category"
      >
        {{ $t(category.category) }}
      </div>
      <div>
        <div
          v-for="amount in category.amounts"
          :key="amount.name"
          class="flex justify-between w-full mb-1 text-sm leading-none"
        >
          <div class="pr-1 font-medium">
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