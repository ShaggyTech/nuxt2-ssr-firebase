<template>
  <footer>
      <div class="footer-flex-item">
        Made by <a href="https://www.davidroyer.me" target="_blank" rel="noopener">David Royer</a>
      </div>
      <div class="footer-flex-item">
        Original Source<a href="https://github.com/davidroyer/nuxt2-ssr-firebase" target="_blank" rel="noopener">Github Repo</a>
      </div>
      <div class="footer-flex-item">
        Updated by <a href="https://www.shaggytech.com" target="_blank" rel="noopener">Brandon Eichler</a>
      </div>
      <div class="footer-flex-item">
        Updated Source <a href="https://github.com/ShaggyTech/nuxt2-ssr-firebase" target="_blank" rel="noopener">Github Repo</a>
      </div>
  </footer>
</template>

<script>
  export default {
    name: 'AppFooter'
  }
</script>

<style lang="css" scoped>
  footer {
    box-sizing: border-box;
    background-color: #eee;
    border-top: 1px solid #e0e0e0;
    padding: .5em 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65px;
    z-index: 99;
  }

  .footer-flex-item {
    margin: .5em;
  }

  .footer-flex-item a {
    color: rgb(0, 112, 185);
  }
</style>
