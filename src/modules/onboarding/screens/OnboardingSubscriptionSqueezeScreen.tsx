import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useMemo } from "react"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { ChoosePlanScreenBody } from "modules/subscription/ChoosePlanScreen"
import { screenLibrary } from "navigation/screenLibrary"

const FEATURES = gql`
  query features {
    featuresOnForCurrentUser
  }
`

export const OnboardingSubscriptionSqueezeScreen = () => {
  const navigation = useNavigation()

  const { data: featuresData } = useQuery(FEATURES)
  const isFullFreemium = useMemo(
    () => (featuresData?.featuresOnForCurrentUser || []).includes("full_freemium"),
    [featuresData],
  )

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("subscription-squeeze")

  const onSkip = useCallback(() => {
    logAnalyticsEvent("onboarding-subscription-squeeze-no-button-pressed")
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  const onSubscribe = useCallback(() => {
    logAnalyticsEvent("onboarding-subscription-squeeze-subscribed")
    updateOnboardingProgress()
    navigation.navigate(screenLibrary.onboarding.subscriptionPlusSuccess)
  }, [navigation, updateOnboardingProgress])

  return (
    <ChoosePlanScreenBody
      hasSkipButton={isFullFreemium}
      location="onboarding-subscription-squeeze"
      onSkip={onSkip}
      onSubscribe={onSubscribe}
    />
  )
}
