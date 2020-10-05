<template>
  <div class="container">
    <div class="controls">
      <button @click="reset">Reset</button>
      <button @click="verify">Bingo!</button>
    </div>
    <div class="bingo" @click="callNumber(max)">
      <p class="bingo__game-start" v-if="!gameStarted">
        Let's Play
      </p>
      <div :class="{ 'is-shown': hiddenVideo === false }">
        <youtube
          class="bingo__special-number"
          v-show="specialNumber"
          :video-id="videoId"
          :player-vars="playerVars"
          ref="youtube"
        />
      </div>

      <p class="bingo__current-number"
         :class="`bingo__current-number--${currentNumber}`"
         v-if="!allNumbersCalled"
      >
        {{ currentNumber }}
      </p>
      <p class="bingo__all-numbers-called" v-else>
        All Numbers Called
      </p>
      <div class="bingo__called">
        <p
          class="bingo__called-number"
          v-for="(calledNumber, index) in calledNumbers"
          :key="index"
        >
          {{ calledNumber }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      max: 100,
      gameStarted: false,
      allNumbersCalled: false,
      specialNumber: false,
      currentNumber: null,
      videoId: null,
      hiddenVideo: null,
      calledNumbers: this.checkExistingCalledNumbers(),
      specialNumbers: this.numberYoutubeMapper(),
      playerVars: { autoplay: 1 },
    };
  },
  methods: {
    numberYoutubeMapper() {
      return [
        { number: 0, videoId: 'aR-kFIQh_hU', hidden: true }, // Ebeneezer Goode
        { number: 3, videoId: 'AgcTvoWjZJU', hidden: true }, // Free Nelson Mandella
        { number: 19, videoId: 'fREu-HCIEEg', hidden: false }, // COVID-19
        { number: 33, videoId: 'DWDnnjh1Cj4', hidden: true }, // Belle of Belfast City
        { number: 44, videoId: '0CSVKpwdgnM', hidden: false }, // Knocking at the door
        { number: 55, videoId: 'ZPQBAN-0s74', hidden: true }, // Staying Alive
        { number: 69, videoId: 'eFjjO_lhf9c', hidden: true }, // Summer of 69
        { number: 99, videoId: 'xoMgnJDXd3k', hidden: true }, // Nein
      ];
    },
    callNumber(max) {
      let call;
      let beautifiedNumber;

      this.checkGameStarted();
      this.clearVideo();

      if (this.calledNumbers.length < max) {
        do {
          call = Math.floor(Math.random() * Math.floor(max));
          beautifiedNumber = ('0' + call).slice(-2);
        } while (this.calledNumbers.includes(beautifiedNumber));

        this.isSpecialNumber(call);

        this.calledNumbers.push(beautifiedNumber);
        this.currentNumber = beautifiedNumber;
        sessionStorage.setItem('storedCalledNumbers', this.calledNumbers);
      } else {
        sessionStorage.setItem('storedCalledNumbers', []);
        this.allNumbersCalled = true;
      }
    },
    checkGameStarted() {
      if (!this.gameStarted || this.checkExistingCalledNumbers() !== []) {
        this.gameStarted = true;
      }
    },
    checkExistingCalledNumbers() {
      return sessionStorage.getItem('storedCalledNumbers')
          ? sessionStorage.getItem('storedCalledNumbers').split(',')
          : [];
    },
    isSpecialNumber(call) {
      this.specialNumbers.map(sn => {
        if (sn.number === call) {
          this.specialNumber = true;
          this.videoId = sn.videoId;
          this.hiddenVideo = sn.hidden;
        }
      });
    },
    clearVideo() {
      this.specialNumber = false;
      this.videoId = null;
      this.hiddenVideo = null;
    },
    reset() {
      this.gameStarted = false;
      this.currentNumber = null;
      this.calledNumbers = [];
      this.allNumbersCalled = false;
      this.clearVideo();
      sessionStorage.setItem('storedCalledNumbers', []);
    },
    verify() {
      const input = prompt('Please enter your numbers');

      if (input) {
        const numbers = input.substr(0, 10).match(/\d{2}/g);
        let found = 0;

        numbers.forEach(number => {
          if (this.calledNumbers.indexOf(number) > -1) {
            found++;
          }
        });

        if (found === 5) {
          alert(`BINGO! You're a winner!`);
        } else {
          alert(`Why you lying?! Not all those numbers have been called!`);
        }
      } else {
        alert(`You didn't provide any numbers`);
      }
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');

.container {
  height: inherit;
  width: inherit;
}

.controls {
  position: absolute;
  top: 0;
  padding: 0.5em;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
}

.bingo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: inherit;
  width: inherit;

  &__current-number {
    margin: 0;
    font-size: 28em;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &--33 {
      background: linear-gradient(
              to right,
              #009A49 0%,
              #009A49 33%,
              #FFF 33%,
              #FFF 66%,
              #FF7900 66%,
              #FF7900 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: breathe 0.5s infinite;
    }
  }

  &__called {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1350px;
  }

  &__called-number {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2em;
    width: 2em;
    margin: 0.25em;
    font-size: 1.5em;
    color: #fff;
    border: 3px solid currentColor;
    border-radius: 50%;
    animation: appear 0.251s;
    cursor: pointer;
  }

  &__game-start,
  &__all-numbers-called {
    margin: 2.5em 0;
    font-size: 6em;
    color: #fff;
    cursor: pointer;
  }

  &__game-start {
    animation: breathe 2s infinite;
  }

  &__special-number {
    position: absolute;
    z-index: -1;
    height: 100vh;
    width: 100vw;
  }
}

.is-shown {
  position: absolute;
  top: 0;
  left: 0;
}

.is-shown > iframe {
  display: block !important;
}

@keyframes breathe {
  0% {
    transform: scale(0.8) rotate(-5deg);
  }

  50% {
    transform: scale(1) rotate(5deg);
  }

  100% {
    transform: scale(0.8) rotate(-5deg);
  }
}

@keyframes appear {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
</style>
