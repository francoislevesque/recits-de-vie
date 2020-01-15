<template>
  <div 
    class="z-10"
    :class="{'push-top': pushTop, 'push-bottom': pushBottom}"
  >
    <div class="mx-auto max-w-2xl">
      <div class="bg-blue-100 p-10 shadow-lg ">
        <slot />
      </div>
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