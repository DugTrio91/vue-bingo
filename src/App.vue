<template>
  <div id="app">
    <bingo />
  </div>
</template>

<script>
import Bingo from './components/Bingo';

export default {
  name: 'App',
  components: {
    Bingo,
  },
};
</script>

<style lang="scss">
body {
  font-family: 'Oswald', sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-image: linear-gradient(135deg, #FF6FD8 10%, #3813C2 100%);
  text-align: center;

  #app {
    height: 100vh;
    width: 100vw;
  }
}
</style>
