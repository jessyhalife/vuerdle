<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { KeyboardStatus } from "../types/attempt";
import KeyboardLetters from "../utils/keyboard";

export default defineComponent({
  name: "x-keyboard",
  props: {
    letters: {} as PropType<KeyboardStatus>,
  },
  mounted() {
    this.letters;
  },
  data() {
    return {
      KEYBOARD_LETTERS: KeyboardLetters,
    };
  },
  methods: {
    handleClick(index: number, letterIndex: number) {
      let letter;

      if (index === 2) {
        if (letterIndex === 0) letter = "ENTER";
        else if (letterIndex === this.KEYBOARD_LETTERS[index].length - 1)
          letter = "BACKSPACE";
        else letter = this.KEYBOARD_LETTERS[letterIndex].toUpperCase();
      } else {
        letter = this.KEYBOARD_LETTERS[index][letterIndex].toUpperCase();
      }

      this.$emit("on-key-press", { key: letter } as KeyboardEvent);
    },
  },
});
</script>
<template>
  <div class="d-flex flex-column mt-4">
    <div
      v-for="(line, index) in KEYBOARD_LETTERS"
      :key="line"
      class="d-flex flex-row justify-content-center align-items-center"
    >
      <div
        @click="handleClick(index, letterIndex)"
        class="letter mx-2 my-2 text-white"
        v-for="(letter, letterIndex) in line"
        :key="letter"
        :class="{
          long:
            index === 2 &&
            (letterIndex === 0 || letterIndex === line.length - 1),
          'bg-secondary': !letters?.[letter] || letters?.[letter] === 'ABSENT',
          'bg-success': letters?.[letter] === 'CORRECT',
          'bg-warning': letters?.[letter] === 'PRESENT',
        }"
      >
        <span class="h6" v-if="index === 2 && letterIndex === 0">ENTER</span>
        <span
          class="h6"
          v-else-if="index === 2 && letterIndex === line.length - 1"
          >BORRAR</span
        >
        <span class="h4" v-else>{{ letter }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter {
  width: 48px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.long {
  width: 124px;
}
</style>
