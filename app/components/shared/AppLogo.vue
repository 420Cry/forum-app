<script setup lang="ts">
onMounted(() => {
  // #region agent log
  fetch('http://127.0.0.1:7333/ingest/53b70a4d-6607-4f4d-b21f-38ed2957c68f', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2c958a' }, body: JSON.stringify({ sessionId: '2c958a', runId: 'pre-fix', hypothesisId: 'D', location: 'AppLogo.vue', message: 'AppLogo mounted', data: { path: useRoute().path }, timestamp: Date.now() }) }).catch(() => {})
  // #endregion
})
</script>

<template>
  <span
    class="font-wordmark text-2xl font-bold tracking-tight text-ink select-none"
  >
    fund<span class="text-accent">e</span>dr
  </span>
</template>
