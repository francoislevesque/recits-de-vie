<template>
  <div>
    <br>
    <br>
    <br>
    <br>
    <viz />
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
        <p class="text-2xl leading-snug mb-10">
          Nous allons suivre la vie d'Ella, une femme ayant un salaire moyen d'environ <b>50 000$</b>, selon <b>3 scénarios distincts</b>
        </p>
      </div>
      <div class="container max-w-xl">
        <div class="">
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
              Ella forme un couple, a deux enfants et demeure en couple jusqu’au décès de son conjoint.
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
              Ella forme un couple, a un enfant, se sépare de son conjoint et conserve la garde exclusive de son enfant par la suite tout en demeurant célibataire pour le reste de sa vie.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Scrollama
      :offset="0.9"
      @step-enter="stepEnterHandler"
    >
      <div
        slot="graphic"
        class="h-screen"
      >
        <img
          src="@/assets/logo.png"
          alt=""
        >
      </div> 
      <notice
        data-step="a"
        push-bottom
      >
        À <b>18 ans</b>, elles sont aux études et ont toutes le même <span class="income">revenu</span>, soit près de <b>7 000 $</b>.
      </notice>
      <notice
        data-step="a"
        push-bottom
      >
        À <b>18 ans</b>, elles sont aux études et ont toutes le même <span class="income">revenu</span>, soit près de <b>7 000 $</b>.
      </notice>
      <div data-step="end">
        <span class="text-transparent">.</span>
      </div>
    </Scrollama>
    <div class="step1 notice">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit repudiandae fuga natus, vitae iure autem? Ab libero nobis eum consequatur porro, sed, quos fugit magni repudiandae aliquid enim, unde ipsam.
    </div>
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
	methods: {
		stepEnterHandler ({element, index, direction}) {
			// handle the step-event as required here
			//console.log(element, index, direction);
		}
	}
};
</script>

<style>

</style>
