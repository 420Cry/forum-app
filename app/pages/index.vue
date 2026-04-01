<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-bgColor">
    <header class="border-b bg-white">
      <div class="mx-auto max-w-3xl px-6 py-4">
        <h1 class="text-xl font-semibold text-slate-800">Forum</h1>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-12">
      <div class="space-y-10">
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-semibold text-slate-800">Welcome</h2>
          <p class="text-slate-500">Choose how you'd like to use the forum</p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <NuxtLink
            to="/dev"
            class="block rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <h3 class="text-lg font-semibold text-slate-800">Developer</h3>
            <p class="mt-1 text-sm text-slate-500">
              Test API calls and verify backend connectivity
            </p>
          </NuxtLink>

          <NuxtLink
            to="/auth"
            class="block rounded-lg border bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <h3 class="text-lg font-semibold text-slate-800">User</h3>
            <p class="mt-1 text-sm text-slate-500">
              Sign in to browse and participate in discussions
            </p>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
