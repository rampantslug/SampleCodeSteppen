import React, { useCallback } from "react"

import { JourneySelection } from "modules/journey/JourneySelection"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"

export const OnboardingJourneySelectionScreen = () => {
  const { finishOnboarding, updateOnboardingProgress } = useOnboardingProgress("journey-selection")

  const onPress = useCallback(async () => {
    updateOnboardingProgress()
    finishOnboarding()
  }, [finishOnboarding, updateOnboardingProgress])

  return <JourneySelection onPress={onPress} />
}
