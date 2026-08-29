<script setup lang="ts">
import { getAvatarColor } from '~/utils/avatarColor'

const { t } = useI18n()

const features = [
  { key: 'progress', icon: 'spark' },
  { key: 'discover', icon: 'compass' },
  { key: 'trust', icon: 'shield' },
] as const

const quoteAuthors = [
  { id: 'thanh-tran', prefix: 'TT', nameKey: 'thanh', roleKey: 'thanh' },
  { id: 'nghia-truong', prefix: 'NT', nameKey: 'nghia', roleKey: 'nghia' },
] as const
</script>

<template>
  <aside
    class="relative hidden h-full min-h-0 flex-col justify-between overflow-hidden bg-[linear-gradient(158deg,#042E32_0%,#075056_52%,#0E7A74_100%)] px-11 py-9 text-white lg:flex"
  >
    <img
      src="/logo-cube.svg"
      alt=""
      class="pointer-events-none absolute top-[-70px] right-[-110px] size-[440px] rotate-10 opacity-10 select-none"
      aria-hidden="true"
    >
    <div
      class="pointer-events-none absolute -bottom-40 left-[-140px] size-[460px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent)_20%,transparent),transparent_64%)]"
      aria-hidden="true"
    />

    <div class="relative z-1 shrink-0">
      <span class="font-wordmark text-[32px] font-semibold leading-none tracking-[-0.01em] text-white">
        fund<span class="text-accent">e</span>dr
      </span>
    </div>

    <div class="relative z-1 min-h-0 max-w-[430px] flex-1 py-6">
      <h1 class="text-[32px] leading-[1.16] font-bold tracking-[-0.022em] text-pretty">
        {{ t('auth.brand.headline') }}
      </h1>
      <p class="mt-3 text-[15px] leading-relaxed text-white/78 text-pretty">
        {{ t('auth.brand.subline') }}
      </p>

      <ul class="mt-6 flex flex-col gap-4">
        <li
          v-for="feature in features"
          :key="feature.key"
          class="flex items-start gap-3"
        >
          <span
            class="mt-px flex size-7 shrink-0 items-center justify-center rounded-full bg-white/13 text-white"
            aria-hidden="true"
          >
            <svg
              v-if="feature.icon === 'spark'"
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <path d="M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M5 5l2.5 2.5M12.5 12.5 15 15M15 5l-2.5 2.5M7.5 12.5 5 15" />
            </svg>
            <svg
              v-else-if="feature.icon === 'compass'"
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <circle
                cx="10"
                cy="10"
                r="7.5"
              />
              <path d="M13 7l-1.6 4.4L7 13l1.6-4.4z" />
            </svg>
            <svg
              v-else
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <path d="M10 2.5l6 2.2v4.3c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8V4.7z" />
              <path d="M7.5 10l1.8 1.8 3.2-3.6" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="text-[14px] font-semibold">
              {{ t(`auth.brand.feature.${feature.key}.title`) }}
            </div>
            <p class="mt-0.5 text-[12.5px] leading-snug text-white/70">
              {{ t(`auth.brand.feature.${feature.key}.body`) }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <blockquote class="relative z-1 shrink-0 border-t border-white/16 pt-4">
      <p class="text-[14px] leading-relaxed text-white/92 text-pretty">
        "{{ t('auth.brand.quote.text') }}"
      </p>
      <footer class="mt-3 flex flex-col gap-2.5">
        <div
          v-for="author in quoteAuthors"
          :key="author.id"
          class="flex items-center gap-2.5"
        >
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            :style="{ backgroundImage: getAvatarColor(author.id) }"
          >
            {{ author.prefix }}
          </div>
          <div class="min-w-0">
            <div class="text-[12.5px] font-semibold text-white">
              {{ t(`auth.brand.quote.${author.nameKey}.name`) }}
            </div>
            <div class="text-xs text-white/60">
              {{ t(`auth.brand.quote.${author.roleKey}.role`) }}
            </div>
          </div>
        </div>
      </footer>
    </blockquote>
  </aside>
</template>
