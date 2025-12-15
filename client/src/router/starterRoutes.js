import OnboardingWrapper from "../views/starterViews/OnboardingWrapper.vue";
import Onboarding1 from "../views/starterViews/Onboarding1.vue";
import Onboarding2 from "../views/starterViews/Onboarding2.vue";
import Onboarding3 from "../views/starterViews/Onboarding3.vue";
import Onboarding4 from "../views/starterViews/Onboarding4.vue";

export default [
  {
    path: '/starter',
    component: OnboardingWrapper,
    children: [
      { path: 'onboarding1', name: 'Onboarding1', component: Onboarding1 },
      { path: 'onboarding2', name: 'Onboarding2', component: Onboarding2 },
      { path: 'onboarding3', name: 'Onboarding3', component: Onboarding3 },
    ]
  },
  { path: '/starter/onboarding4', name: 'Onboarding4', component: Onboarding4 }
];

