<template>
  <div class="config-list">
    <div
      class="list-item"
      v-for="{ number, videoId, hidden, startFrom, notes } in config"
      :key="number"
    >
      <p class="label number">
        <span>{{ ('0' + number).slice(-2) }}</span>
      </p>
      <p class="label notes">
        <a
          :href="`https://www.youtube.com/watch?v=${ videoId }`"
          target="_blank"
        >
          {{ notes || videoId }}
        </a>
      </p>
      <p v-if="startFrom" class="label start-from">
        <font-awesome-icon icon="fa-regular fa-clock" /> <span>{{ startFrom }}s</span>
      </p>
      <font-awesome-icon
        v-if="hidden"
        class="label"
        icon="fa-regular fa-eye-slash"
      />
      <font-awesome-icon
        v-else
        class="label"
        icon="fa-regular fa-eye"
      />
      <button @click="deleteItem(number)">
        <font-awesome-icon icon="fa-regular fa-trash-can" />
      </button>
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            config: {
                type: Array,
                default: () => ([]),
            },
        },

        methods: {
            deleteItem(number) {
                this.$emit('deleteItem', number);
            },
        },
    };
</script>

<style lang="scss" scoped>
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    font-family: sans-serif;

    &:nth-child(even) {
      background-color: rgba(#000, 0.05);
    }
  }

  .label {
    padding-right: 15px;
    color: #000;
    font-size: 20px;
  }

  .number > span {
    padding: 5px;
    border: 4px solid #5071beff;
    color: #5071beff;
    border-radius: 50%;
    width: 50px;
  }

  button {
    padding: 5px 10px;
    background-color: #ff2c2c;
    color: #fff;
    border: 0;
    border-radius: 5px;
    font-size: 16px;
  }
</style>
