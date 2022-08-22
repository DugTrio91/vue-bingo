<template>
  <div class="container">
    <div class="controls">
      <button @click="reset">Reset</button>
      <button :disabled="gameStarted" @click="showConfigPane = !showConfigPane">Config</button>
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
                max: 90,
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

                if (storage && storage.length) {
                    return storage;
                }

                return [
                    { number: 1, videoId: 'C-u5WLJ9Yk4', startFrom: 16, notes: 'Hit me baby one more time', hidden: true },
                    { number: 2, videoId: 'FA5jsa1lR9c', startFrom: 13, notes: 'Two become one', hidden: true },
                    { number: 3, videoId: 'RJqimlFcJsM', startFrom: 10, notes: 'Three Lions', hidden: true },
                    { number: 4, videoId: 'Abr-XWJMeu0', startFrom: 6, notes: 'Four kicks', hidden: true },
                    { number: 5, videoId: 'EK_LN3XEcnw', startFrom: 4, notes: 'Mambo No. 5', hidden: true },
                    { number: 7, videoId: '0J2QdDbelmY', notes: 'Seven Nation Army', hidden: true },
                    { number: 8, videoId: '4NO-h9PFum4', notes: '5,6,7,8', hidden: true },
                    { number: 9, videoId: 'UbxUSsFXYo4', notes: 'Nine to Five', hidden: true },
                    { number: 10, videoId: 'js-2cqqY1K8', startFrom: 15, notes: 'Perfect 10', hidden: true },
                    { number: 13, videoId: 'FC3y9llDXuM', startFrom: 10, notes: 'Teenage Dirtbag', hidden: true },
                    { number: 14, videoId: '2R-PbDIuWeM', startFrom: 12, notes: 'Fourteen', hidden: true },
                    { number: 17, videoId: 'xFrGuyw1V8s', notes: 'Dancing Queen', hidden: true },
                    { number: 19, videoId: 'YC8FET-EGVM', startFrom: 10, notes: 'Not Nineteen Forever', hidden: true },
                    { number: 20, videoId: 'c7nbXljpnq0', notes: '20th Century Boy', hidden: true },
                    { number: 21, videoId: 'g7VhofoV3qs', startFrom: 79, notes: '21 seconds to go', hidden: true },
                    { number: 22, videoId: 'AgFeZr5ptV8', notes: '22', hidden: true },
                    { number: 25, videoId: 'WkTOp0m6Uis', notes: 'Pretty good looking for a Girl', hidden: true },
                    { number: 33, videoId: 'UvjLgjtJKsc', notes: 'C’est la Vie', hidden: true },
                    { number: 41, videoId: 'emGri7i8Y2Y', startFrom: 4, notes: 'In Too Deep', hidden: true },
                    { number: 50, videoId: 'ABXtWqmArUU', startFrom: 30, notes: '50 ways to leave your lover', hidden: true },
                    { number: 55, videoId: 'fNFzfwLM72c', startFrom: 10, notes: 'Staying Alive', hidden: true },
                    { number: 62, videoId: 'etG-5EOX4pA', notes: 'M62', hidden: true },
                    { number: 63, videoId: 'mTUhnIY3oRM', startFrom: 6, notes: 'Oh what a night', hidden: true },
                    { number: 64, videoId: 'ckV2ogbt8W4', notes: 'when im 64', hidden: true },
                    { number: 65, videoId: '68ugkg9RePc', notes: 'Eifel 65 Blue', hidden: true },
                    { number: 69, videoId: 'eFjjO_lhf9c', notes: 'Summer of 69', hidden: true },
                    { number: 75, videoId: 'xeDGfk0UJw8', startFrom: 10, notes: 'Sex', hidden: true },
                    { number: 80, videoId: 'dOV5WXISM24', notes: 'Acceptable in the 80s', hidden: true },
                    { number: 84, videoId: 'CYpn8yUnX_c', notes: 'I bet you look good on the dancefloor', hidden: true },
                ];
            },

            saveConfigToLocalStorage(config) {
                localStorage.setItem('config', JSON.stringify(config));
            },

            callNumber(max) {
                let call;

                this.checkGameStarted();
                this.clearVideo();

                if (this.calledNumbers && this.calledNumbers.length < max) {
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
                    ? sessionStorage.getItem('storedCalledNumbers').split(',').map(num => parseInt(num))
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
    z-index: 2;
    top: 0.5em;
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
