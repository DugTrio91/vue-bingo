<template>
  <div id="app">
    <img class="alex" src="./assets/alex.png" alt="">
    <bingo />
    <img class="rose" src="./assets/rose.png" alt="">
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
  @font-face {
    font-family: 'Bambina';
    src: url('../public/fonts/bambina/Bambina.woff2') format('woff2'),
    url('../public/fonts/bambina/Bambina.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: 'Bambina', sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(56deg, rgba(141, 210, 251, 1) 0%, rgba(155, 210, 232, 1) 12%, rgba(249, 213, 98, 1) 12%, rgba(250, 217, 113, 1) 20%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 79%, rgba(233, 171, 207, 1) 79%);
    text-align: center;

    #app {
      height: 100vh;
      width: 100vw;
    }

    .alex,
    .rose {
      position: absolute;
      bottom: 1em;
      left: 1em;
      padding: 1em 2.5em;
      background-color: #e9abcfff;
      border-radius: 50%;
      animation: rock 5s infinite;
      height: 150px;
    }

    .rose {
      top: 1em;
      right: 1em;
      left: auto;
      padding: 1em;
      background-color: #8dd2fbff;
    }

    @keyframes rock {
      0% {
        transform: rotate(-15deg);
      }

      50% {
        transform: rotate(15deg);
      }

      100% {
        transform: rotate(-15deg);
      }
    }
  }
</style>
