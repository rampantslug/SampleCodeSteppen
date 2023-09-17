import { gql, useMutation } from "@apollo/client"
import { CommonActions, useNavigation } from "@react-navigation/native"
import { useCallback, useMemo } from "react"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { screenLibrary } from "navigation/screenLibrary"

export const onboardingRoutes = {
  "age-range": screenLibrary.onboarding.ageRange,
  "power-of-tiny-gains": screenLibrary.onboarding.powerOfTinyGains,
  "over-400k": screenLibrary.onboarding.over400k,
  "build-habit-breaker": screenLibrary.onboarding.buildHabitBreaker,
  "built-steppen-for-you": screenLibrary.onboarding.builtSteppenForYou,
  email: screenLibrary.onboarding.email,
  "first-step-complete": screenLibrary.onboarding.firstStepComplete,
  "fitness-motivators": screenLibrary.onboarding.fitnessMotivators,
  "fitness-means-to-you": screenLibrary.onboarding.fitnessMeansToYou,
  "fitness-results-when": screenLibrary.onboarding.fitnessResultsWhen,
  "fitness-how-can-steppen-help": screenLibrary.onboarding.fitnessHowCanSteppenHelp,
  gender: screenLibrary.onboarding.gender,
  "how-does-it-work-breaker": screenLibrary.onboarding.howDoesItWorkBreaker,
  "journey-joined": screenLibrary.onboarding.journeyJoined,
  name: screenLibrary.onboarding.name,
  notifications: screenLibrary.onboarding.notifications,
  "subscription-discount-offer": screenLibrary.onboarding.subscriptionDiscountOffer,
  "subscription-squeeze": screenLibrary.onboarding.subscriptionSqueeze,
  "when-do-you-workout": screenLibrary.onboarding.whenDoYouWorkout,
  "journey-explainer": screenLibrary.onboarding.journeyExplainer,
  "journey-selection": screenLibrary.onboarding.journeySelection,
}

export const onboardingInOrder = () =>
  [
    "fitness-motivators",
    "fitness-how-can-steppen-help",
    "fitness-means-to-you",
    "fitness-results-when",
    "power-of-tiny-gains",
    "over-400k",
    "name",
    "gender",
    "age-range",
    "email",
    "build-habit-breaker",
    "built-steppen-for-you",
    "how-does-it-work-breaker",
    "first-step-complete",
    global.eligibleForDiscountOffer ? "subscription-discount-offer" : "subscription-squeeze",
    "journey-joined",
    "when-do-you-workout",
    "notifications",
    global.userSegment === "guided-experience" && "journey-explainer",
    global.userSegment === "guided-experience" && "journey-selection",
  ].filter(Boolean)

const FINISH_ONBOARDING = gql`
  mutation finishOnboarding {
    finishOnboarding {
      id
      member_onboarding_complete
    }
  }
`

const UPDATE_ONBOARDING_PROGRESS = gql`
  mutation updateOnboardingProgress($step: String!) {
    updateCurrentUser(data: { addMemberOnboardingProgress: $step }) {
      id
    }
  }
`

export const useOnboardingProgress = (currentStep, routeFromStep) => {
  const navigation = useNavigation()

  const [finishOnboardingMutation] = useMutation(FINISH_ONBOARDING)

  const finishOnboarding = useCallback(() => {
    finishOnboardingMutation()

    logAnalyticsEvent("finish-onboarding")
  }, [finishOnboardingMutation])

  const [updateOnboardingProgress] = useMutation(UPDATE_ONBOARDING_PROGRESS, {
    variables: {
      step: currentStep,
    },
  })

  const nextRoute = useMemo(() => {
    const nextStep = onboardingInOrder().findIndex(
      (step) => step === (routeFromStep || currentStep),
    )
    return onboardingRoutes[onboardingInOrder()[nextStep + 1]] || "**FINISH**"
  }, [currentStep, routeFromStep])

  const gotoNextRoute = useCallback(
    (params) => {
      if (nextRoute === "**FINISH**") {
        finishOnboarding()

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: screenLibrary.tabroot }],
          }),
        )
      } else {
        navigation.navigate(nextRoute, params)
      }
    },
    [finishOnboarding, navigation, nextRoute],
  )

  return {
    finishOnboarding,
    gotoNextRoute,
    updateOnboardingProgress,
  }
}
