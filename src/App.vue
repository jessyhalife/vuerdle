<script setup lang="ts">
import Game from "./components/Game.vue";
</script>

<template>
  <div class="layout">
    <header class="p-4 text-center">
      <h1>VUERDLE</h1>
      <hr />
    </header>

    <main class="container">
      <Game />
    </main>
    <footer>
      Made with ❤️ &nbsp; by
      <a href="https://github.com/jessyhalife" target="_blank">@jessyhalife</a>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.layout main {
  flex: 1;
}
footer {
  padding: 8px;
}
</style>
