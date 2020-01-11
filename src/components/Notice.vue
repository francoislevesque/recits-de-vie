<template>
  <div 
    class="shadow-lg p-10 z-10 bg-white"
    :class="{'push-top': pushTop, 'push-bottom': pushBottom}"
  >
    <div class="mx-auto max-w-2xl">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
	props: {
		pushTop: {
			default: false,
			type: Boolean
		},
		pushBottom: {
			default: false,
			type: Boolean
		}
	}
};
</script>

<style lang="scss">
.push-top {
  margin-top: 100vh;
}
.push-bottom {
  margin-bottom: 100vh;
}
</style>