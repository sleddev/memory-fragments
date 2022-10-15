<script lang="ts">
  import {useRegisterSW} from 'virtual:pwa-register/svelte';
  const {offlineReady, needRefresh, updateServiceWorker} = useRegisterSW({
      onRegistered(swr) {
          console.log(`SW registered: ${swr}`);
      },
      onRegisterError(error) {
          console.log('SW registration error', error);
      },
      onOfflineReady() {
          console.log('SW ready for offline')
          setTimeout(() => close(), 5000)
      }
  });
</script>