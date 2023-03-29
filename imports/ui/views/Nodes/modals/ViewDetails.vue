<template>
  <div id="details" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Details</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <pre>{{ record }}</pre>
    </section>
    <footer class="modal-card-foot">

      <b-button label="Close" @click="$emit('close')" />

    </footer>

  </div>
</template>
<script>
export default {
  props: ['record'],
  data() {
    return {}
  },
  methods: {
  }
}
</script>
<style lang="scss">
#details {
  background: #f0f0f0;

  border-radius .centered {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
}
</style>