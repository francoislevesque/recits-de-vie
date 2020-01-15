<template>
  <label 
    :for="uuid"
    class="flex items-center cursor-pointer mb-3"
  >
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        :id="uuid"
        v-model="isToggleOn"
        type="checkbox"
        class="hidden"
        :name="uuid"
        @change="$emit('input', isToggleOn)"
      >
      <!-- line -->
      <div
        class="toggle__line w-10 h-6 bg-gray-400 rounded-full shadow-inner"
        :class="classes"
      />
      <!-- dot -->
      <div
        class="toggle__dot absolute w-6 h-6 top-0 left-0"
      >
        <div
          class="h-full w-full bg-white rounded-full shadow"
        />
      </div>
    </div>
    <!-- label -->
    <div
      class="ml-3 text-sm text-gray-800 font-medium leading-tight"
      :class="`text-${color}-800`"
    >
      <slot />
    </div>
  </label>
</template>

<script>

import { uuid } from "../../services/utils";

export default {
	props: ["value", "color"],
	data() {
		return {
			uuid: uuid(),
			isToggleOn: this.value
		};
	},
	computed: {
		classes () {
			if (!this.isToggleOn) {
				return "bg-gray-400";
			}
			return "bg-" + this.color + "-500";
		}
	},
	watch: {
		"value" () {
			this.isToggleOn = this.value;
		}
	}
};
</script>

<style lang="scss">
.toggle__line {
  transition: background 0.3s ease-in-out;
}
.toggle__dot {
  padding: 2px;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(1rem);
}
</style>
