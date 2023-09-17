import React, { useCallback } from "react"

import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { PlusSuccessScreenBody } from "modules/subscription/PlusSuccessScreen"

export const OnboardingSubscriptionPlusSuccessScreen = () => {
  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress(
    "subscription-plus-success",
    "subscription-squeeze",
  )

  const onNext = useCallback(async () => {
    updateOnboardingProgress()
    updateOnboardingProgress({
      variables: {
        step: "subscription-squeeze",
      },
    })
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  return <PlusSuccessScreenBody onNext={onNext} />
}
