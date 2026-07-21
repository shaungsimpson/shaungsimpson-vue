<script setup lang="ts">
const {
  title = 'Article',
  description = '',
  published = '',
  tags = '',
} = defineProps<{
  title?: string
  description?: string
  published?: string
  tags?: string
}>()
</script>

<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '60px 72px 54px',
      backgroundColor: '#0b2239',
      color: '#d8e8f8',
      fontFamily: 'sans-serif',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '12px',
        backgroundColor: '#10bfa8',
      }"
    />

    <div
      :style="{
        position: 'absolute',
        right: '-90px',
        top: '82px',
        width: '330px',
        height: '330px',
        borderRadius: '999px',
        border: '2px solid #1f4a65',
      }"
    />

    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '18px' }">
        <div
          :style="{
            width: '54px',
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '999px',
            backgroundColor: '#10bfa8',
            color: '#062238',
            fontSize: '20px',
            fontWeight: '800',
          }"
        >
          &lt;/&gt;
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '3px' }">
          <span :style="{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }">
            Shaun Simpson
          </span>
          <span :style="{ fontSize: '17px', color: '#8faac1' }">
            shaungsimpson.com
          </span>
        </div>
      </div>

      <span
        :style="{
          padding: '10px 18px',
          border: '1px solid #31526b',
          borderRadius: '999px',
          color: '#10bfa8',
          fontSize: '16px',
          fontWeight: '700',
          letterSpacing: '0.12em',
        }"
      >
        ARTICLE
      </span>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '960px', gap: '22px' }">
      <h1
        :style="{
          margin: '0',
          color: '#d8e8f8',
          fontSize: '64px',
          fontWeight: '800',
          lineHeight: '1.04',
          letterSpacing: '-0.045em',
        }"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        :style="{
          margin: '0',
          maxWidth: '900px',
          color: '#96aec3',
          fontSize: '25px',
          lineHeight: '1.38',
        }"
      >
        {{ description }}
      </p>
    </div>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '22px',
        borderTop: '1px solid #26465f',
        color: '#88a2b8',
        fontSize: '17px',
      }"
    >
      <span>{{ published }}</span>
      <span v-if="tags" :style="{ color: '#10bfa8', fontWeight: '600' }">
        {{ tags }}
      </span>
    </div>
  </div>
</template>