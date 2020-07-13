<template>
  <div class="relative w-full h-screen overflow-y-hidden bg-blue-200 border-t border-b border-blue-300">
    <div class="flex w-full h-full">
      <div class="h-full bg-blue-100 border-r border-blue-300 w-90">
        <div class="p-8 px-5 border-b border-blue-300">
          <h3 class="mb-3 text-xl font-bold">
            3 life stories
          </h3>
          <p class="text-base">
            How do the taxes and the social charges, benefits and public spending do affect a taxpayer over the course of their life?
          </p>
        </div>
        <div class="px-5 py-6 border-b border-blue-300">
          <div class="mb-2">
            Ella's age
          </div>
          <div class="flex mb-2 -mx-2">
            <div class="w-1/2 px-2">
              <div>
                <input
                  v-model="filters.age[0]"
                  type="number"
                  min="18"
                  :max="filters.age[1]"
                  class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  @input="onMinAgeChange"
                >
                <div
                  class="text-sm text-red-800"
                  :class="{'opacity-0': minAgeError == '-'}"
                >
                  {{ minAgeError }}
                </div>
              </div>
            </div>
            <div class="w-1/2 px-2">
              <div>
                <input
                  v-model="filters.age[1]"
                  type="number"
                  :min="filters.age[0]"
                  max="87"
                  class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  @input="onMaxAgeChange"
                >
                <div
                  class="text-sm text-red-800"
                  :class="{'opacity-0': maxAgeError == '-'}"
                >
                  {{ maxAgeError }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <v-switch
              v-model="filters.showRevenu"
              color="blue"
            >
              Income
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showPrestations"
              color="green"
            >
              Benefits
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showBenefices"
              color="teal"
            >
              Public services
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showPrelevements"
              color="red"
            >
              Levies
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showSubstraction"
              color="purple"
              @input="onToggleSub"
            >
              Benefits & Public services - Levies
            </v-switch>
          </div>
        </div>
        <div class="px-5 pt-6 pb-4">
          <div class="mb-2">
            Display of amounts
          </div>
          <div class="flex">
            <button
              class="flex-1 px-3 py-1 text-base bg-white border border-gray-400 rounded-l hover:bg-gray-100"
              :class="{'bg-gray-300 hover:bg-gray-300': filters.agglomerationAverage}"
              @click="$set(filters, 'agglomerationAverage', true)"
            >
              Average
            </button>
            <button
              class="flex-1 px-3 py-1 text-base bg-white border border-l-0 border-gray-400 rounded-r hover:bg-gray-100"
              :class="{'bg-gray-300 hover:bg-gray-300': !filters.agglomerationAverage}"
              @click="$set(filters, 'agglomerationAverage', false)"
            >
              Sum
            </button>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-x-hidden">
        <viz
          ref="viz"
          :options="{transition: 300, brush: true}"
          :filters="vizFilters"
          @mousemove="onMouseMove"
          @brushed="brushed"
        />
      </div>
    </div>

    <tooltip
      v-show="showTooltip"
      class="pointer-events-none"
      :data="tooltip"
    />
  </div>
</template>

<script>

import Viz from "./Viz";
import Tooltip from "./Tooltip";
import debounce from "lodash/debounce";
import { deepCopy } from "../services/utils";

export default {
	components: {
		Viz,
		Tooltip
	},
	data () {
		return {
			minAgeError: "-",
			maxAgeError: "-",
			showTooltip: false,
			tooltip: {
				x: 100,
				y: 100,
				scenario: 0,
				year: 40
			},
			filters: {
				agglomerationAverage: true,
				age: [18,87],
				validatedAge: [18,87],
				showRevenu: true,
				showPrestations: true,
				showBenefices: true,
				showPrelevements: true,
				showSubstraction: false
			},
			oldFilters: null
		};
	},
	computed: {
		vizFilters () {
			let categories = [];
			if (this.filters.showRevenu) {
				categories.push("revenu");
			}
			if (this.filters.showPrestations) {
				categories.push("prestations");
			}
			if (this.filters.showBenefices) {
				categories.push("benefices");
			}
			if (this.filters.showPrelevements) {
				categories.push("prelevements");
			}
			return {
				agglomerationAverage: this.filters.agglomerationAverage,
				showHighlights: false,
				showAmounts: true,
				showSelection: true,
				showSubstraction: this.filters.showSubstraction,
				showCumul: false,
				visible: [18,87],
				selected: this.filters.validatedAge,
				visibleCategories: categories,
				selectedCategories: categories,
				amounts: [],
				selectedScenarios: [0,1,2],
				firstAppear: false,
				tooltip: null,
				forceHighlight: []
			};
		}
	},
	methods: {
		onResize () {
			this.$refs.viz.onResize();
		},
		onMinAgeChange (event) {
			this.minAgeError = "-";
			let age = event.target.value;
			if (!isNaN(age) && age >= 18 && age <= 87 && age <= this.filters.age[1]) {
				this.$set(this.filters.validatedAge, 0, age);
			} else {
				this.minAgeError = "Invalid value";
			}
		},
		onMaxAgeChange (event) {
			this.maxAgeError = "-";
			let age = event.target.value;
			if (!isNaN(age) && age >= 18 && age <= 87 && age >= this.filters.validatedAge[0]) {
				this.$set(this.filters.validatedAge, 1, age);
			} else {
				this.maxAgeError = "Invalid value";
			}
		},
		onMouseMove (data) {
			if (data == null) {
				this.showTooltip = false;
			} else {
				this.showTooltip = true;
				this.tooltip = data;
			}
		},
		brushed: debounce(function(data) {
			this.$set(this.filters, "age", deepCopy(data));
			this.$set(this.filters, "validatedAge", deepCopy(data));
		}, 100),
		onToggleSub (value) {
			if (value) {
				this.oldFilters = JSON.parse(JSON.stringify(this.filters));
				this.$set(this.filters, "showRevenu", false);
				this.$set(this.filters, "showPrestations", false);
				this.$set(this.filters, "showPrelevements", false);
				this.$set(this.filters, "showBenefices", false);
			} else {
				if (this.oldFilters != null) {
					this.$set(this.filters, "showRevenu", this.oldFilters.showRevenu);
					this.$set(this.filters, "showPrestations", this.oldFilters.showPrestations);
					this.$set(this.filters, "showPrelevements", this.oldFilters.showPrelevements);
					this.$set(this.filters, "showBenefices", this.oldFilters.showBenefices);
					this.oldFilters = null;
				}
			}
		}
	}
};
</script>
