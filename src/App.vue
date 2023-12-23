<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="logo" title="logo" src="@/assets/logo.png" />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style>
header {
  display: flex;
  height: 5rem;
  background: midnightblue;
}
main {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
