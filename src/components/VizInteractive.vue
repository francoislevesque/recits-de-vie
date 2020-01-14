<template>
  <div class="hidden lg:block w-full h-screen">
    <div class="flex h-full">
      <div class="w-90 shadow h-full">
        <div class="py-8 px-5 border-b border-gray-200">
          <h3 class="text-xl font-bold mb-3">
            Explorer les données!
          </h3>
          <p class="text-base">
            Vous pouvez à présent explorer les données comme bon vous semble.
          </p>
        </div>
        <div class="py-8 px-5 border-b border-gray-200">
          <div class="flex -m-2">
            <input
              v-model="filters.age[0]"
              type="number"
              min="18"
              max="87"
              class="w-1/2 m-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
            <input
              v-model="filters.age[1]"
              type="number"
              min="18"
              max="87"
              class="w-1/2 m-2 shadow appearance-none border roundedpy-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
          </div>
          <b-field>
            <b-slider
              v-model="filters.age"
              :min="18"
              :max="87"
              :step="1"
              type="is-black"
            />
          </b-field>
          <br>
          <b-field>
            <b-switch v-model="filters.showRevenu">
              Revenu de marché
            </b-switch>
          </b-field>
          <b-field>
            <b-switch
              v-model="filters.showPrestations"
              type="is-success"
            >
              Prestations
            </b-switch>
          </b-field>
          <b-field>
            <b-switch
              v-model="filters.showBenefices"
              type="is-info"
            >
              Bénéfices publiques
            </b-switch>
          </b-field>
          <b-field>
            <b-switch
              v-model="filters.showPrelevements"
              type="is-danger"
            >
              Prélèvements
            </b-switch>
          </b-field>
          <b-field>
            <b-switch
              v-model="filters.showSubstraction"
              type="is-primary"
              @input="onToggleSub"
            >
              Bénéfices & Prestations - Prélèvements
            </b-switch>
          </b-field>
        </div>
      </div>
      <div class="flex-grow">
        <viz :filters="vizFilters" />
      </div>
    </div>
  </div>
</template>

<script>

import Viz from "./Viz";

export default {
	components: {
		Viz
	},
	data () {
		return {
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
				firstAppear: false
			};
		}
	},
	methods: {
		onToggleSub (value) {
			if (value) {
				this.oldFilters = JSON.parse(JSON.stringify(this.filters));
				this.filters.showRevenu = false;
				this.filters.showPrestations = false;
				this.filters.showPrelevements = false;
				this.filters.showBenefices = false;
			} else {
				if (this.oldFilters != null) {
					this.filters.showRevenu = this.oldFilters.showRevenu;
					this.filters.showPrestations = this.oldFilters.showPrestations;
					this.filters.showPrelevements = this.oldFilters.showPrelevements;
					this.filters.showBenefices = this.oldFilters.showBenefices;
					this.oldFilters = null;
				}
			}
		}
	}
};
</script>
