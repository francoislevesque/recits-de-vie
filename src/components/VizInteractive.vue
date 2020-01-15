<template>
  <div class="hidden relative lg:block w-full h-screen bg-blue-200">
    <div class="flex h-full">
      <div class="w-90 shadow h-full">
        <div class="p-8 px-5 border-b border-blue-300">
          <h3 class="text-xl font-bold mb-3">
            3 récits de vie
          </h3>
          <p class="text-base">
            Comment les impôts et les charges sociales, les prestations et les dépenses publiques affectent une contribuable au cours de sa vie ?
          </p>
        </div>
        <div class="py-6 px-5 border-b border-blue-300">
          <div class="mb-2">
            Âge d'Ella
          </div>
          <div class="flex -mx-2 mb-2">
            <div class="w-1/2 px-2">
              <input
                v-model="filters.age[0]"
                type="number"
                min="18"
                max="87"
                class="w-full h-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
            </div>
            <div class="w-1/2 px-2">
              <input
                v-model="filters.age[1]"
                type="number"
                min="18"
                max="87"
                class="w-full h-full shadow appearance-none border roundedpy-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
            </div>
          </div>
          <br>
          <div>
            <v-switch
              v-model="filters.showRevenu"
              color="blue"
            >
              Revenu de marché
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showPrestations"
              color="green"
            >
              Prestations
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showBenefices"
              color="teal"
            >
              Bénéfices publiques
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showPrelevements"
              color="red"
            >
              Prélèvements
            </v-switch>
          </div>
          <div>
            <v-switch
              v-model="filters.showSubstraction"
              color="purple"
              @input="onToggleSub"
            >
              Bénéfices & Prestations - Prélèvements
            </v-switch>
          </div>
        </div>
      </div>
      <div class="flex-grow">
        <viz
          :filters="vizFilters"
          @mousemove="onMouseMove"
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

export default {
	components: {
		Viz,
		Tooltip
	},
	data () {
		return {
			showTooltip: false,
			tooltip: {
				x: 100,
				y: 100,
				scenario: 0,
				year: 40
			},
			filters: {
				age: [18,87],
				showRevenu: true,
				showPrestations: true,
				showBenefices: true,
				showPrelevements: true,
				showSubstraction: false,
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
				showAmounts: true,
				showSelection: true,
				showSubstraction: this.filters.showSubstraction,
				showCumul: false,
				visible: [18,87],
				selected: this.filters.age,
				visibleCategories: categories,
				selectedCategories: categories,
				amounts: [],
				selectedScenarios: [0,1,2],
				firstAppear: false,
				tooltip: null
			};
		}
	},
	methods: {
		onMouseMove (data) {
			if (data == null) {
				this.showTooltip = false;
			} else {
				this.showTooltip = true;
				this.tooltip = data;
			}
		},
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
