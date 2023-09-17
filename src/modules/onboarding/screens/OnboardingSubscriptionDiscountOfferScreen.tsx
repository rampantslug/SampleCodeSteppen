import { useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useMemo } from "react"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { DiscountOffer3, SUBSCRIPTION_PLANS } from "modules/discounts/DiscountOfferModal"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { screenLibrary } from "navigation/screenLibrary"

export const OnboardingSubscriptionDiscountOfferScreen = () => {
  const navigation = useNavigation()

  const { updateOnboardingProgress } = useOnboardingProgress(
    "subscription-discount-offer",
  )

  const { data: plansData } = useQuery(SUBSCRIPTION_PLANS)
  const plans = useMemo(
    () =>
      plansData?.subscriptionPlans?.filter(
        (p) => p.metadata?.plan_group_discount_offers_version_1_index,
      ) || [],
    [plansData],
  )

  const onSubscribe = useCallback(() => {
    logAnalyticsEvent("onboarding-subscription-discount-offer-subscribed")
    updateOnboardingProgress()
    navigation.navigate(screenLibrary.onboarding.subscriptionPlusSuccess)
  }, [navigation, updateOnboardingProgress])

  if (!plans?.length) {
    return null
  }

  return <DiscountOffer3 plans={plans} onSubscribe={onSubscribe} />
}
