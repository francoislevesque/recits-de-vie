<template>
  <div>
    <div class="p-10">
      <div class="container max-w-xl">
        <img
          class="mx-auto mb-20"
          src="@/assets/logo.png"
          alt="Logo chaire de recherche en fiscalité et finances publiques de l'Université de Sherbrooke"
        >
        <p class="text-2xl leading-snug mb-10">
          Comment les <b>impôts</b> et les <b>charges sociales</b>, les <b>prestations</b> et les <b>dépenses publiques</b> affectent une contribuable au cours de sa vie ?
        </p>
        <p class="mb-10 text-center">
          ***
        </p>
        <p class="text-2xl text-center leading-snug mb-10">
          Nous allons suivre la vie d'Ella, à compter de <b>18 ans</b> jusqu’à son décès à <b>87 ans</b>. Ella présente les caractéristiques représentative d’une femme québécoise, pour <b>3 scénarios de vie distincts</b> :
        </p>
      </div>
      <div class="container max-w-xl">
        <div class="mb-10">
          <div class="text-center mb-16">
            <img
              src="@/assets/1.png"
              alt="Scénario 1"
              class="inline mb-5"
            >
            <h2 class="text-xl font-bold">
              Scénario 1
            </h2>
            <p class="">
              Ella vit seule, sans enfant, durant toute sa vie.
            </p>
          </div>
          <div class="text-center mb-16">
            <img
              src="@/assets/2.png"
              alt="Scénario 2"
              class="inline mb-5"
            >
            <h2 class="text-xl font-bold">
              Scénario 2
            </h2>
            <p class="">
              Ella forme un couple à l’âge de 27 ans, a deux enfants et demeure en couple jusqu’à 82 ans, son âge lors du décès de son conjoint.
            </p>
          </div>
          <div class="text-center mb-16">
            <img
              src="@/assets/3.png"
              alt="Scénario 3"
              class="inline mb-5"
            >
            <h2 class="text-xl font-bold">
              Scénario 3
            </h2>
            <p class="">
              Ella forme un couple, a un seul enfant et se sépare de son conjoint à 40 ans. Ella conserve la garde exclusive de son enfant mineur par la suite, tout en demeurant célibataire pour le reste de sa vie. 
            </p>
          </div>
        </div>
        <div>
          <p class="mb-10 text-center">
            ***
          </p>
          <p class="text-2xl text-center mb-10">
            Le <span class="revenu">revenu</span>, les <span class="prelevements">prélèvements</span>, les <span class="prestations">prestations financières</span> et la valeur des <span class="benefices">services publics</span> reçus sont présentés sur une <b>base annuelle</b> et représentent ce qui est payé et obtenu par Ella et, s’il y a lieu, son conjoint Luis et ses enfants mineurs.
          </p>
        </div>
      </div>
    </div>
    <Scrollama
      :offset="0.9"
      @step-enter="stepEnterHandler"
    >
      <notice
        data-max="20"
        data-category="revenu"
        push-bottom
      >
        À <b>18 ans</b>, Ella habite chez ses parents, poursuit des études collégiales et travaille à temps partiel. Ella n’a pas encore formé de couple. Dans tous les scénarios, son <span class="revenu">revenu</span> est identique, soit près de <b>7 500 $</b>.
      </notice>
      <div
        slot="graphic"
        class="h-screen"
      >
        <viz :filters="filters" />
      </div> 
      
      <notice
        data-max="20"
        data-category="prelevements"
        push-bottom
      >
        Pendant ces premières années, les <span class="prelevements">prélèvements</span> s'élèvent à environ <b>1 500 $</b>.
      </notice>
      <notice
        data-max="20"
        data-category="prelevements"
        push-bottom
      >
        Ils sont à <b>76%</b> composés de <span class="prelevements">taxes à la consommation</span>.
      </notice>
      <notice
        data-max="20"
        data-category="prestations"
        push-bottom
      >
        En contrepartie, Ella reçoit également près de 600$ en <span class="prestations">Crédit de solidarité</span> et  <span class="prestations">Crédit de TPS.</span>
      </notice>
      <notice
        data-max="20"
        data-category="benefices"
        push-bottom
      >
        La valeur des <span class="benefices">services publics</span> s'élève à plus de <b>14 000 $</b>. Comme Ella va au cégep, la majorité de cette valeur provient des <b>services d'enseignement supérieur</b>.
      </notice>
      <notice
        data-min="21"
        data-max="26"
        data-category="revenu"
        push-bottom
      >
        À 21 ans, Ella quitte le domicile de ses parents et commence à travailler à temps plein. Son <span class="revenu">salaire</span> initial est d’un peu plus de <b>35 000 $</b> et augmente progressivement.
      </notice>
      <notice
        data-min="21"
        data-max="26"
        data-category="prelevements"
        push-bottom
      >
        Les <span class="prelevements">prélèvements fiscaux</span> augmentent également. Ceux-ci, composés des <span class="prelevements">impôts</span>, des <span class="prelevements">cotisations sociales</span> et <span class="prelevements">taxes à la consommation</span> totalisent environ <b>8 500 $</b> au début de la vie active d’Ella.
      </notice>
      <notice
        data-min="21"
        data-max="26"
        data-category="prelevements"
        push-bottom
      >
        <span class="prelevements">L’impôt fédéral et du Québec</span> constituent alors <b>un peu plus de la moitié</b> des prélèvements. 
      </notice>
      <notice
        data-min="21"
        data-max="26"
        data-category="prestations"
        push-bottom
      >
        Un peu plus de la moitié <span class="prestations">prestations monétaires (crédit pour TPS et crédit pour solidarité)</span> qui totalisent plus de <b>1 000 $</b>. Ces montants diminuent lorsque le salaire d’Ella augmente.
      </notice>
      <notice
        data-min="21"
        data-max="26"
        data-category="benefices"
        push-bottom
      >
        La valeur des <span class="benefices">services publics</span> de <span class="benefices">soins de santé</span> reçus est d’environ <b>2 000 $</b> par année. 
      </notice>
      <notice
        data-min="27"
        data-max="28"
        data-category="revenu"
        data-scenarios="1,2"
        push-bottom
      >
        C'est à <b>27 ans</b>, que Ella forme un couple avec Luis. En conséquence les scénarios 2 et 3 prennent en compte le <span class="revenu">revenu du ménage</span> de plus de <b>93 000$</b> à la formation du couple. 
      </notice>
      <notice
        data-min="27"
        data-max="28"
        data-category="prelevements"
        data-scenarios="1,2"
        push-bottom
      >
        Les <span class="prelevements">prélèvements</span> assumés par Ella et Luis sont de près de <b>27 000$</b> à la formation du couple.
      </notice>
      <notice
        data-min="27"
        data-max="28"
        data-category="benefices,prestations"
        data-scenarios="1,2"
        push-bottom
      >
        Le couple ne bénéficie au départ d’aucune <span class="prestations">prestation financière</span>. La valeur des <span class="benefices">services publics</span> reçus, composé exclusivement des <span class="benefices">soins de santé</span>, est d’un peu plus de <b>4 000 $</b>. 
      </notice>
      <notice
        data-min="29"
        data-max="29"
        data-category="revenu"
        data-scenarios="1,2"
        push-bottom
      >
        À la naissance de son premier enfant, Ella cesse de travailler pendant 1 an dans les scénarios 2 et 3. Le <span class="revenu">revenu de salaire</span> du ménage diminue alors de moitié.
      </notice>
      <notice
        data-min="29"
        data-max="29"
        data-category="prelevements"
        data-scenarios="1,2"
        push-bottom
      >
        Les <span class="prelevements">prélèvements</span> passent à environ <b>20 000 $</b>.
      </notice>
      <notice
        data-min="29"
        data-max="29"
        data-category="prestations"
        data-scenarios="1,2"
        push-bottom
      >
        Les nouveaux parents touchent des <span class="prestations">prestations</span> du <span class="prestations">Régime québécois d’assurance parentale</span> s’élevant à près de <b>31 000 $</b>. Des <span class="prestations">prestations financières pour la famille</span> d’environ <b>5 000 $</b> sont également touchées.
      </notice>
      <notice
        data-min="29"
        data-max="29"
        data-category="benefices"
        data-scenarios="1,2"
        push-bottom
      >
        La valeur des <span class="benefices">soins de santé</span> reçus par la famille l’année de l’arrivée de l’enfant est d’environ <b>14 000$</b>.  
      </notice>
      <div data-step="end">
        <span class="text-transparent">.</span>
      </div>
    </Scrollama>
  </div>
</template>

<script>
import "intersection-observer";
import Scrollama from "vue-scrollama";
import Notice from "@/components/Notice";
import Viz from "@/components/Viz";

export default {
	components: {
		Scrollama,
		Notice,
		Viz
	},
	data () {
		return {
			filters: {
				visible: [18,18],
				selected: [18,20],
				visibleCategories: [],
				selectedCategories: [],
				amounts: [],
				selectedScenarios: [0,1,2],
				firstAppear: true
			}
		};
	},
	methods: {
		stepEnterHandler ({element, index, direction}) {

			if (element.getAttribute("data-step") === "end") {
				return;
			}

			let min = parseInt(element.getAttribute("data-min") || 18);
			let max = parseInt(element.getAttribute("data-max"));
      
			let selectedScenarios = element.getAttribute("data-scenarios") || "";
			selectedScenarios = selectedScenarios.split(",").filter(d => d != "").map(d => parseInt(d));
			if (selectedScenarios.length == 0) {
				selectedScenarios= [0,1,2];
			}
      
			let selectedCategories = element.getAttribute("data-category") || "";
			selectedCategories = selectedCategories.split(",").filter(d => d != "");
      
			let visibleCategories = this.filters.visibleCategories;
			selectedCategories.forEach(c => {
				if (visibleCategories.indexOf(c) === -1) {
					visibleCategories.push(c);
				}
			});

			this.filters.firstAppear = false;
			this.filters.visible = [18,max];
			this.filters.selected = [min,max];
			this.$set(this.filters, "selectedScenarios", selectedScenarios);
			this.$set(this.filters, "visibleCategories", visibleCategories);
			this.$set(this.filters, "selectedCategories", selectedCategories);
		}
	}
};
</script>

<style>

</style>
