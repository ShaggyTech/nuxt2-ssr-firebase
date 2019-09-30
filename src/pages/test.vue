<template>
  <section class="container">
    <div>
      <h1 class="mui--text-display1">Hello from a {{ renderSource }} page</h1>
      <div class="headline">
        <div>
          Time: Local Interval:<span class="render-result">{{ now }}</span>
        </div>
      </div>
      <button
        id="reload-btn"
        class="mui-btn mui-btn--primary"
        @click="reloadPage"
      >
        Reload Page
      </button>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "TestPage",
  data() {
    return {
      now: new Date()
    };
  },
  created() {
    this.dateInterval = setInterval(() => (this.now = new Date()), 1000);
  },
  beforeDestroy() {
    clearInterval(this.dateInterval);
  },
  async asyncData() {
    return {
      renderSource: process.static
        ? "static"
        : process.server
        ? "server"
        : "client"
    };
  },
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
};
</script>
