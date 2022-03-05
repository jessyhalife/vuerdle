<script lang="ts">
import WORDS from "../contsants/words.json";
import { defineComponent } from "vue";
import type { Attempt, KeyboardStatus } from "../types/attempt";
import { AttemptStatus } from "../types/attempt";
import Keyboard from "./Keyboard.vue";
enum GAME_STATUS {
  "PLAYING" = "PLAYING",
  "WIN" = "WIN",
  "LOSE" = "LOSE",
}
export default defineComponent({
  name: "x-game",
  data() {
    return {
      word: "" as string,
      attempts: [] as Attempt[][],
      currentRow: 0 as number,
      currentCol: 0 as number,
      isPlaying: true as boolean,
      letters: {} as KeyboardStatus,
      error: null as string | null,
      status: GAME_STATUS.PLAYING as GAME_STATUS,
      messages: [
        "Genius",
        "Magnificent",
        "Impressive",
        "Splendid",
        "Great",
        "Phew",
        "Oops",
      ] as string[],
      interval: 10 as number,
    };
  },
  methods: {
    handleKey(event: KeyboardEvent) {
      const letter = event.key.toUpperCase();
      if (letter === "BACKSPACE") {
        if (this.currentCol > 0) {
          this.currentCol--;
          this.attempts[this.currentRow][this.currentCol] = {
            letter: "",
          };
        } else {
          return;
        }
      }
      //check if letter is Enter
      if (letter === "ENTER" && this.attempts[this.currentRow]?.length === 5) {
        this.handleEnter();
      }

      if (this.currentCol > 4) return;
      // check if letter is between A and Z
      if (!/^[A-Z]$/.test(letter) && letter !== "Ñ") return;
      if (!this.attempts[this.currentRow]) {
        this.attempts[this.currentRow] = [];
      }
      this.attempts[this.currentRow][this.currentCol] = {
        letter,
      };
      this.currentCol++;
    },
    handleEnter() {
      const word = this.attempts[this.currentRow].map((a) => a.letter).join("");
      if (!WORDS.includes(word.toLocaleLowerCase())) {
        this.error = "Esa palabra no existe!";
        setTimeout(() => {
          this.error = null;
        }, 1000);
        return;
      }
      this.error = null;
      this.attempts[this.currentRow].forEach((att, index) => {
        const status = this.processLetter(att.letter, index);
        this.attempts[this.currentRow][index].status = status;
        this.letters[att.letter] = status;
      });

      if (
        this.attempts[this.currentRow].every(
          (att) => att.status === AttemptStatus.CORRECT
        )
      ) {
        this.status = GAME_STATUS.WIN;
        this.refreshGame();
        return;
      } else {
        this.currentCol = 0;
      }
      this.currentRow++;

      if (this.currentRow >= 6) {
        this.status = GAME_STATUS.LOSE;
        this.isPlaying = false;
        this.refreshGame();
      }
    },
    refreshGame() {
      this.isPlaying = false;
      setTimeout(() => {
        window.location.reload();
      }, 10000);
      setInterval(() => {
        console.log("holis");
        this.interval--;
      }, 1000);
    },
    processLetter(letter: string, index: number) {
      if (letter === this.word[index]) {
        return AttemptStatus.CORRECT;
      } else if (this.word.includes(letter)) {
        return AttemptStatus.PRESENT;
      } else {
        return AttemptStatus.ABSENT;
      }
    },
    reset() {
      window.location.reload();
    },
  },
  async mounted() {
    this.word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    document.addEventListener("keyup", this.handleKey);
  },
  unmounted() {
    document.removeEventListener("keyup", this.handleKey);
  },
  components: { Keyboard },
});
</script>

<template>
  <div class="alert-container">
    <div class="alert alert-danger fade show" role="alert" v-if="error">
      <strong>Error!</strong> {{ error }}
    </div>
    <div
      class="alert fade show"
      role="alert"
      v-if="!isPlaying"
      :class="{
        'alert-success': status === 'WIN',
        'alert-danger': status === 'LOSE',
      }"
    >
      <strong
        >{{ messages[currentRow] }}:
        {{
          status === "WIN"
            ? "You won!"
            : `Next time maybe... the word was ` + word
        }}
      </strong>
      <p>Reiniciando juego en {{ interval }} segundos</p>

      <a @click="reset" href="#" class="alert-link">reiniciar ya!</a>
    </div>
  </div>
  <div class="d-flex flex-column mw-50 mx-auto">
    <div
      v-for="(row, index) in new Array(6).fill('')"
      :key="index"
      class="d-flex flex-row justify-content-center mt-2"
      :class="{ shake: currentRow === index && error }"
    >
      <div
        class="border mx-2 tile"
        v-for="(col, colIndex) in ['', '', '', '', '']"
        :key="col"
      >
        <span
          class="h1"
          :class="{
            'bg-success': attempts[index]?.[colIndex]?.status === 'CORRECT',
            'bg-secondary': attempts[index]?.[colIndex]?.status === 'ABSENT',
            'bg-warning': attempts[index]?.[colIndex]?.status === 'PRESENT',
            'text-white': currentRow > index,
          }"
          >{{
            attempts[index] ? attempts[index]?.[colIndex]?.letter : col
          }}</span
        >
      </div>
    </div>
  </div>
  <Keyboard :letters="letters" @on-key-press="handleKey" />
</template>

<style scoped>
.h1 {
  padding: 0;
  margin-bottom: 0;
}
.tile {
  width: 56px;
  height: 56px;
}

.tile span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.alert-container {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
}
.alert {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 480px;
  top: -52px;
}

.shake {
  animation: shake 0.52s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
