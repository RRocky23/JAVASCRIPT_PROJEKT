import { onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

export function useOnboardingAutoRotate() {
  const router = useRouter();
  const route = useRoute();

  let interval = null;

  const nextScreen = () => {
    const current = route.name;

    if (current === "Onboarding1") router.push("/starter/onboarding2");
    else if (current === "Onboarding2") router.push("/starter/onboarding3");
    else if (current === "Onboarding3") router.push("/starter/onboarding1");
  };

  onMounted(() => {
    interval = setInterval(nextScreen, 5000);
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
  });
}
