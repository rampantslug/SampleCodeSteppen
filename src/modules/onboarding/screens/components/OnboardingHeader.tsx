import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useMemo } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Div, Icon } from "react-native-magnus"

import { Heading3 } from "theme/Typography"

const TOTAL_ONBOARDING_STEPS = 4

export const OnboardingHeader = ({ currentStepIndex, onBack }) => {
  const navigation = useNavigation()

  const percentComplete = useMemo(
    () => Math.round((currentStepIndex / TOTAL_ONBOARDING_STEPS) * 100).toString() + "%",
    [currentStepIndex],
  )

  const goBack = useCallback(() => (onBack ? onBack() : navigation.goBack()), [navigation, onBack])

  return (
    <Div mt={50} w="100%">
      <Div bg="aqua20" h={6} w="100%" />
      <Div bg="aqua100" h={6} position="absolute" roundedRight="circle" w={percentComplete} />
      <Div row alignItems="center" mx={16} my={8} pr={24}>
        <TouchableOpacity w={32} onPress={goBack}>
          <Icon fontFamily="AntDesign" fontSize={24} name="arrowleft" />
        </TouchableOpacity>
        <Heading3 color="dark2" flex={1} fontSize={16} fontWeight="700" textAlign="center">
          Let's Get You Set Up
        </Heading3>
      </Div>
    </Div>
  )
}
