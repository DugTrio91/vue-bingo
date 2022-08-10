<template>
  <div class="number-config">

    <config-list
      v-if="localConfig"
      :config="config"
      @deleteItem="deleteFromLocalConfig"
    />

    <new-config-item
      v-if="addNewItem"
      :config="config"
      @newEntry="addToLocalConfig"
    />

    <div class="number-config__controls">
      <button @click="addNewItem = !addNewItem" class="new">
        <span v-if="addNewItem">
          <font-awesome-icon icon="fa-solid fa-ban" />
          Cancel
        </span>
        <span v-else>
          <font-awesome-icon icon="fa-solid fa-plus" />
          Add
        </span>
      </button>
      <button
        v-if="!addNewItem"
        class="close"
        @click="$emit('closeConfig')"
      >
        <span>
          <font-awesome-icon icon="fa-solid fa-xmark" />
          Close
        </span>
      </button>
    </div>
  </div>
</template>

<script>
    import NewConfigItem from './NewConfigItem';
    import ConfigList from './ConfigList';

    export default {
        data() {
            return {
                localConfig: [],
                addNewItem: false,
                error: '',
            };
        },

        components: {
            NewConfigItem,
            ConfigList,
        },

        props: {
            config: {
                type: Array,
                default: () => ([]),
            },
        },

        mounted() {
            this.localConfig = this.config.sort((a, b) => a.number - b.number);
        },

        methods: {
            addToLocalConfig(entry) {
                const exists = this.localConfig.findIndex(el => el.number === entry.number);

                if (exists >= 0) {
                    this.deleteFromLocalConfig(entry.number);
                }

                this.localConfig.push(entry);
                this.saveLocalConfig();
            },

            deleteFromLocalConfig(number) {
                const index = this.localConfig.findIndex(el => el.number === number);

                this.localConfig.splice(index, 1);
                this.saveLocalConfig();
            },

            saveLocalConfig() {
                this.$emit('saveConfig', this.localConfig);
            },
        },
    };
</script>

<style lang="scss" scoped>
  .number-config {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .new,
  .close {
    margin: 15px;
    padding: 10px;
    background-color: #5071beff;
    border: 0;
    border-radius: 5px;
    font-size: 1.2em;
    color: #fff;
  }
</style>
