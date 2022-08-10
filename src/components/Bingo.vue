<template>
  <div class="container">
    <div class="controls">
      <button @click="reset">Reset</button>
      <button @click="showConfigPane = !showConfigPane">Config</button>
      <button @click="verify">Bingo!</button>
    </div>

    <number-config
      v-if="showConfigPane"
      :config="specialNumbers"
      @saveConfig="saveConfigToLocalStorage"
      @closeConfig="showConfigPane = false"
    />

    <div
      v-else
      class="bingo"
      @click="callNumber(max)"
    >
      <div class="bingo__game-start" v-show="!gameStarted">
        <img src="../assets/woodos-bingo-logo.png">
      </div>
      <div :class="{ 'is-shown': hiddenVideo === false }">
        <youtube
          class="bingo__special-number"
          v-show="specialNumber"
          :video-id="videoId"
          :player-vars="playerVars"
          ref="youtube"
          @buffering="seekTo(startFrom)"
        />
        <p
          class="video-notes"
          v-show="specialNumber"
        >
          {{ videoNotes }}
        </p>
      </div>

      <p :class="['bingo__current-number', `bingo__current-number--${currentNumber}`, { 'video-playing': specialNumber && !hiddenVideo }]"
         v-if="!allNumbersCalled && gameStarted"
      >
        {{ currentNumber }}
      </p>
      <p class="bingo__all-numbers-called" v-else-if="gameStarted">
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
    import NumberConfig from './config/NumberConfig';

    export default {
        data() {
            return {
                max: 20,
                gameStarted: false,
                allNumbersCalled: false,
                specialNumber: false,
                currentNumber: null,
                videoId: null,
                hiddenVideo: null,
                startFrom: 0,
                videoNotes: '',
                calledNumbers: this.checkExistingCalledNumbers(),
                specialNumbers: this.numberYoutubeMapper(),
                playerVars: { autoplay: 1 },
                showConfigPane: false,
            };
        },

        components: {
            NumberConfig,
        },

        methods: {
            seekTo(seconds) {
                this.$refs.youtube.player.seekTo(seconds);
            },

            numberYoutubeMapper() {
                const storage = JSON.parse(localStorage.getItem('config'));

                if (storage.length) {
                    return storage;
                }

                return [
                    { number: 0, videoId: 'aR-kFIQh_hU', startFrom: 60, hidden: true, notes: 'Ebeneezer Goode' }, // Ebeneezer Goode
                    { number: 3, videoId: 'AgcTvoWjZJU', hidden: true, notes: 'Free Nelson Mandela' }, // Free Nelson Mandela
                    { number: 19, videoId: 'fREu-HCIEEg', hidden: false, notes: 'COVID-19' }, // COVID-19
                    { number: 33, videoId: 'DWDnnjh1Cj4', hidden: true, notes: 'Belle of Belfast City' }, // Belle of Belfast City
                    { number: 44, videoId: '0CSVKpwdgnM', hidden: false, notes: 'Knocking at the door' }, // Knocking at the door
                    { number: 55, videoId: 'ZPQBAN-0s74', hidden: true, notes: 'Staying Alive' }, // Staying Alive
                    { number: 69, videoId: 'eFjjO_lhf9c', hidden: true, notes: 'Summer of 69' }, // Summer of 69
                    { number: 99, videoId: 'xoMgnJDXd3k', hidden: true, notes: 'Nein' }, // Nein
                ];
            },

            saveConfigToLocalStorage(config) {
                localStorage.setItem('config', JSON.stringify(config));
            },

            callNumber(max) {
                let call;

                this.checkGameStarted();
                this.clearVideo();

                if (this.calledNumbers.length < max) {
                    do {
                        call = Math.floor(Math.random() * Math.floor(max));
                    } while (this.calledNumbers.includes(call));

                    this.isSpecialNumber(call);

                    this.calledNumbers.push(call);
                    this.currentNumber = call;
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
                    if (parseInt(sn.number) === call) {
                        this.specialNumber = true;
                        this.videoId = sn.videoId;
                        this.hiddenVideo = sn.hidden;
                        this.startFrom = sn.startFrom;
                        this.videoNotes = sn.notes;
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
      margin: 0 0 80px;
      padding: 200px 0 130px 50px;
      width: 880px;
      border-radius: 50%;
      background-color: #5071beff;
      font-size: 28em;
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: opacity 0.5s ease;

      &.video-playing {
        opacity: 0.75;
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
      padding: 0.1em 0 0 0.1em;
      font-size: 1.5em;
      color: #5071beff;
      border: 3px solid currentColor;
      border-radius: 50%;
      animation: appear 0.251s;
      cursor: pointer;
    }

    &__all-numbers-called {
      margin: 2.5em 0;
      font-size: 6em;
      color: #000;
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

  .video-notes {
    position: absolute;
    bottom: 0.5em;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.75em;
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
