import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useState } from "react"
import { TextInput } from "react-native"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Path, Svg } from "react-native-svg"

import PinkyPromiseSvg from "assets/onboarding/pinky-promise.svg"
import SteppenLogoSvg from "assets/onboarding/steppen-logo.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { CheckBoxRadioStyle } from "src/designLibrary/CheckBoxRadioStyle"
import { BodyHeavy, Heading1, Paragraph } from "theme/Typography"

const UPDATE_USER_EMAIL = gql`
  mutation updateCurrentUserEmail($contactable: Boolean!, $email: String!) {
    updateCurrentUser(
      data: { addMemberOnboardingProgress: "email", contactableForFeedback: $contactable }
    ) {
      id
    }
    updateCurrentUserEmail(email: $email) {
      success
      error
    }
  }
`

export const OnboardingEmailScreen = () => {
  const insets = useSafeAreaInsets()

  const { gotoNextRoute } = useOnboardingProgress("email")

  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [dontContactMe, setDontContactMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [updateEmail] = useMutation(UPDATE_USER_EMAIL)

  const validateEmail = useCallback((text) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    setIsEmailValid(reg.test(text))
  }, [])

  const navToNext = useCallback(async () => {
    const result = await updateEmail({
      variables: {
        contactable: !dontContactMe,
        email,
      },
    })

    if (result.data.updateCurrentUserEmail.success) {
      gotoNextRoute()
    } else {
      setErrorMessage(result.data.updateCurrentUserEmail.error)
    }
  }, [dontContactMe, email, gotoNextRoute, updateEmail])

  return (
    <Div bg="aqua" flex={1} justifyContent="center" pt={insets.top}>
      <Heading1 color="light" mt={64} mx={16}>
        Your email (required)
      </Heading1>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        autoFocus={true}
        color="white"
        inputMode="email"
        keyboardType="email-address"
        placeholder="Email address"
        placeholderTextColor="#fff8"
        returnKeyType="done"
        style={{
          fontSize: 20,
          fontWeight: "500",
          marginHorizontal: 16,
          paddingVertical: 12,
        }}
        textContentType="emailAddress"
        value={email}
        onChangeText={(value) => {
          setErrorMessage("")
          setEmail(value)
          validateEmail(value)
        }}
      />

      {errorMessage ? (
        <Paragraph color="errorRed" pb={20} px={16}>
          {errorMessage}
        </Paragraph>
      ) : undefined}

      <Div flex={1} justifyContent="flex-start" py={64}>
        <CheckBoxRadioStyle
          isSelected={dontContactMe}
          text="Please do not send me Steppen motivational emails"
          onPress={() => setDontContactMe(!dontContactMe)}
        />
        <Button
          alignSelf="stretch"
          bg="light"
          color="aqua"
          disabled={!isEmailValid}
          fontSize={14}
          fontWeight="700"
          minH={56}
          mt={24}
          mx={40}
          rounded={8}
          onPress={navToNext}
        >
          Continue
        </Button>

        <Div h={16} />

        <Div bg="#FFFFFFCC" mx={28} pb={16} pt={12} px={24} roundedBottomRight={8} roundedTop={8}>
          <Paragraph color="alternateText80">
            Steppen will never sell any of your personal information.{" "}
            <BodyHeavy color="alternateText80">Ever.</BodyHeavy> That's a promise!
          </Paragraph>
          <PinkyPromiseSvg
            style={{ aspectRatio: 52 / 37, width: 48, position: "absolute", right: 0, bottom: 0 }}
          />
        </Div>
        <Div h={18} mx={28} w={25}>
          <Svg viewBox="0 0 25 18">
            <Path d="M24.5 0C3 0 .5 15.5 0 17.5V0h24.5Z" fill="white" fillOpacity="0.8" />
          </Svg>
          <SteppenLogoSvg
            style={{ aspectRatio: 1, width: 24, position: "absolute", left: 6, top: 6 }}
          />
        </Div>
      </Div>
    </Div>
  )
}
