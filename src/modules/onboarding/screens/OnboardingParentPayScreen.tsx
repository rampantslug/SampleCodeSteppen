import { gql, useMutation } from "@apollo/client"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useRef, useState } from "react"
import { TextInput } from "react-native"
import FastImage from "react-native-fast-image"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import HugeHourglassSvg from "assets/steppen-plus/huge-hourglass.svg"
import ParentPayHeaderSvg from "assets/steppen-plus/parent-pay-header.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { Page } from "theme/Page"
import { PageBackButton } from "theme/PageBackButton"
import { BigMain, Body, BodyHeavy } from "theme/Typography"

const CREATE_USER_FEEDBACK = gql`
  mutation createUserFeedback($data: CreateUserFeedbackInputType!) {
    createUserFeedback(data: $data) {
      success
    }
  }
`

export const OnboardingParentPayScreen = () => {
  const navigation = useNavigation()

  const [createFeedback, { loading }] = useMutation(CREATE_USER_FEEDBACK)

  const [name, setName] = useState(null)
  const [number, setNumber] = useState(null)
  const [showingSuccessScreen, setShowingSuccessScreen] = useState(false)

  const doExit = useCallback(async () => {
    logAnalyticsEvent("onboarding-parent-pay-exit")

    navigation.goBack()
  }, [navigation])

  const doSubmit = useCallback(async () => {
    logAnalyticsEvent("onboarding-parent-pay-submit", { name, number })

    await createFeedback({
      variables: {
        data: {
          feedback: `Name: ${name.trim()} | Number: ${number.trim()}`,
          has_contact_permission: false,
          location: "request-parent-pay",
        },
      },
    })

    AsyncStorage.setItem("hasSubmittedParentPayPlease", "true")

    setShowingSuccessScreen(true)
  }, [createFeedback, name, number])

  const nameRef = useRef()
  const numberRef = useRef()

  const insets = useSafeAreaInsets()

  return (
    <Page>
      <FastImage
        source={require("assets/backgrounds/background-382.png")}
        style={{ height: "100%", position: "absolute", width: "100%" }}
      />

      <KeyboardAwareScrollView>
        <Div h={insets.top + 20} />

        {!showingSuccessScreen ? (
          <>
            <PageBackButton iconProps={{ color: "light" }} />

            <Div alignItems="center" flex={1} mx="baseMargin">
              <ParentPayHeaderSvg style={{ aspectRatio: 317 / 193, width: "90%" }} />

              <Div h={39} />

              <Div
                bg="#fff1"
                borderColor="steppenPurple60"
                borderWidth={1}
                px={16}
                py={24}
                rounded={16}
                w="100%"
              >
                <BodyHeavy color="light" textAlign="center">
                  Enter your parent's information below and we will do the rest!
                </BodyHeavy>

                <Div h={32} />

                <Body color="light">Parent Name</Body>

                <Div h={4} />

                <TextInput
                  ref={nameRef}
                  blurOnSubmit
                  backgroundColor="white"
                  borderRadius={8}
                  placeholder="Enter first name"
                  placeholderTextColor="#999"
                  returnKeyType="next"
                  style={{ paddingHorizontal: 16, paddingVertical: 12, width: "100%" }}
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={() => numberRef.current.focus()}
                />

                <Div h={24} />

                <Body color="light">Parent Phone Number</Body>

                <Div h={4} />

                <TextInput
                  ref={numberRef}
                  blurOnSubmit
                  backgroundColor="white"
                  borderRadius={8}
                  placeholder="(+1) 123-455-6789"
                  placeholderTextColor="#999"
                  returnKeyType="done"
                  style={{ paddingHorizontal: 16, paddingVertical: 12, width: "100%" }}
                  value={number}
                  onChangeText={setNumber}
                  onSubmitEditing={() => numberRef.current.blur()}
                />

                <Div h={12} />
              </Div>

              <Div h={39} />
            </Div>

            <Button
              alignSelf="center"
              bg="aqua"
              disabled={!name || !number}
              loading={loading}
              rounded={8}
              w="90%"
              onPress={doSubmit}
            >
              <BodyHeavy color="light">Submit</BodyHeavy>
            </Button>

            <Div flex={1} minH={50} />
          </>
        ) : (
          <Div alignItems="center" flex={1} mx="baseMargin">
            <Div h={12} />

            <BigMain color="light" textAlign="center">
              Hang Tight
            </BigMain>

            <Div h={32} />

            <Body color="light" textAlign="center">
              We'll contact your parents ASAP and convince them to pay for your Steppen
              subscription.
            </Body>

            <Div h={24} />

            <Body color="light" textAlign="center">
              Help is on the way :)
            </Body>

            <Div h={8} />

            <Body color="light" textAlign="center">
              We'll be in touch very shortly!
            </Body>

            <Div h={32} />

            <HugeHourglassSvg style={{ aspectRatio: 1, width: "100%" }} />

            <Div h={32} />

            <Button alignSelf="center" bg="aqua" rounded={8} w="90%" onPress={doExit}>
              <BodyHeavy color="light">Thank You!</BodyHeavy>
            </Button>

            <Div flex={1} minH={50} />
          </Div>
        )}
      </KeyboardAwareScrollView>
    </Page>
  )
}
