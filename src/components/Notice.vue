<template>
  <div 
    ref="notice" 
    class="notice"
    :class="{'push-top': pushTop, 'push-bottom': pushBottom}"
  >
    <slot />
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