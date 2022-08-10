<template>
  <div class="new-config-item">
    <label for="number">
      Number
      <input
        name="number"
        type="number"
        v-model="newConfigEntry.number"
      >
    </label>
    <label for="videoId">
      YouTube video ID
      <input
        name="videoId"
        type="text"
        v-model="newConfigEntry.videoId"
      >
    </label>
    <label for="hidden">
      Hide video
      <input
        name="hidden"
        type="checkbox"
        v-model="newConfigEntry.hidden"
      >
    </label>
    <label for="notes">
      Notes
      <input
        name="notes"
        type="text"
        v-model="newConfigEntry.notes"
      >
    </label>
    <button
      class="save"
      :disabled="!newConfigEntry.number || !newConfigEntry.videoId"
      @click="addNewConfigEntry"
    >
      Add
    </button>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                newConfigEntry: {},
            };
        },

        mounted() {
            this.resetConfig();
        },

        methods: {
            addNewConfigEntry() {
                this.$emit('newEntry', {
                    number: parseInt(this.newConfigEntry.number),
                    videoId: this.newConfigEntry.videoId,
                    hidden: this.newConfigEntry.hidden,
                    notes: this.newConfigEntry.notes,
                });

                this.resetConfig();
            },

            resetConfig() {
                this.newConfigEntry = {
                    number: null,
                    videoId: null,
                    hidden: false,
                    notes: null,
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
  .new-config-item {
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding: 15px;
    font-family: sans-serif;
    background-color: #5071beff;
    color: #fff;
  }

  label {
    margin-right: 25px;
  }

  .save {
    background-color: #fff;
    border: 0;
    border-radius: 3px;
    color: #5071beff;
    font-size: 1em;
    font-weight: bold;

    &:disabled {
      opacity: 0.5;
    }
  }
</style>
