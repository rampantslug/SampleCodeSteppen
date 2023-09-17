import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback } from "react"
import { Button, Div, WINDOW_HEIGHT, WINDOW_WIDTH } from "react-native-magnus"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import BadgeSvg from "assets/onboarding/badge.svg"
import TrophySvg from "assets/onboarding/trophy.svg"
import WinnersSvg from "assets/onboarding/winners.svg"
import WreathSvg from "assets/onboarding/wreath.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { BigMain, Body, BodyLight, Heading3, ParagraphLight } from "theme/Typography"

const TRANSLATE_HEIGHT = WINDOW_HEIGHT * 0.3

export const OnboardingOver400kScreen = () => {
  const insets = useSafeAreaInsets()

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("over-400k")

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  const topHalfOpacity = useSharedValue(1)
  const point1Translate = useSharedValue(WINDOW_HEIGHT)
  const point2Translate = useSharedValue(WINDOW_HEIGHT)
  const point3Translate = useSharedValue(WINDOW_HEIGHT)

  const pageTranslate = useSharedValue(0)

  const topHalfOpacityStyle = useAnimatedStyle(
    () => ({
      opacity: topHalfOpacity.value,
    }),
    [topHalfOpacity],
  )

  const point1TranslateStyle = useAnimatedStyle(
    () => ({
      marginVertical: 8,
      paddingHorizontal: 4,
      alignSelf: "stretch",
      width: WINDOW_WIDTH * 0.31,
      transform: [{ translateY: point1Translate.value }],
    }),
    [point1Translate],
  )

  const point2TranslateStyle = useAnimatedStyle(
    () => ({
      marginVertical: 8,
      paddingHorizontal: 4,
      alignSelf: "stretch",
      width: WINDOW_WIDTH * 0.31,
      transform: [{ translateY: point2Translate.value }],
    }),
    [point2Translate],
  )

  const point3TranslateStyle = useAnimatedStyle(
    () => ({
      marginVertical: 8,
      paddingHorizontal: 4,
      alignSelf: "stretch",
      width: WINDOW_WIDTH * 0.31,
      transform: [{ translateY: point3Translate.value }],
    }),
    [point3Translate],
  )

  const pageTranslateStyle = useAnimatedStyle(
    () => ({
      backgroundColor: "steppenYellow40",
      transform: [{ translateY: pageTranslate.value }],
    }),
    [pageTranslate],
  )

  const runAnimations = useCallback(() => {
    const timeout1 = setTimeout(() => {
      point1Translate.value = withTiming(32, { duration: 500 })
    }, 500)

    const timeout2 = setTimeout(() => {
      point2Translate.value = withTiming(0, { duration: 500 })
    }, 1000)

    const timeout3 = setTimeout(() => {
      point3Translate.value = withTiming(32, { duration: 500 })
    }, 1500)

    const timeout4 = setTimeout(() => {
      pageTranslate.value = withTiming(-TRANSLATE_HEIGHT, { duration: 500 })
    }, 4500)

    const timeout5 = setTimeout(() => {
      topHalfOpacity.value = withTiming(0, { duration: 400 })
    }, 4500)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      clearTimeout(timeout4)
      clearTimeout(timeout5)
    }
  }, [point1Translate, point2Translate, point3Translate, pageTranslate, topHalfOpacity])

  useFocusEffect(() => runAnimations())

  return (
    <Animated.View style={pageTranslateStyle}>
      <Div bg="steppenYellow40" h={WINDOW_HEIGHT + TRANSLATE_HEIGHT} pt={insets.top}>
        <Div alignItems="center" flex={1} px={24}>
          <Animated.View style={topHalfOpacityStyle}>
            <WinnersSvg aspectRatio={318 / 212} height={WINDOW_HEIGHT * 0.25} />
            <Body color="dark2" textAlign="center">
              That's why we are here to help!
            </Body>
          </Animated.View>
          <Div flex={1} />
          <BigMain color="alternateTextBrown" mx={36} my={16} textAlign="center">
            Over 400,000 Gen Zers
          </BigMain>
          <BodyLight color="dark2" mx={16} textAlign="center">
            have successfully hit their dream health & fitness goal on Steppen
          </BodyLight>

          <Div flex={1} h={16} />

          <Div row justifyContent="space-between" px={0} py={16}>
            <Animated.View style={point1TranslateStyle}>
              <Div
                alignItems="center"
                bg="steppenYellow20"
                h={190}
                justifyContent="center"
                px={6}
                py={16}
                rounded={12}
              >
                <TrophySvg
                  style={{
                    aspectRatio: 99 / 99,
                    position: "absolute",
                    top: -30,
                    width: 70,
                  }}
                />
                <Heading3 color="dark2">1 Million+</Heading3>
                <ParagraphLight color="dark3" textAlign="center">
                  Activities completed
                </ParagraphLight>
              </Div>
            </Animated.View>

            <Animated.View style={point2TranslateStyle}>
              <Div
                alignItems="center"
                bg="steppenYellow20"
                h={190}
                justifyContent="center"
                px={2}
                py={16}
                rounded={12}
              >
                <WreathSvg
                  style={{
                    aspectRatio: 99 / 99,
                    position: "absolute",
                    top: -30,
                    width: 70,
                  }}
                />
                <Heading3 color="dark2">75,000+</Heading3>
                <ParagraphLight color="dark3" textAlign="center">
                  Healthy transformations
                </ParagraphLight>
              </Div>
            </Animated.View>

            <Animated.View style={point3TranslateStyle}>
              <Div
                alignItems="center"
                bg="steppenYellow20"
                h={190}
                justifyContent="center"
                px={6}
                py={16}
                rounded={12}
              >
                <BadgeSvg
                  style={{
                    aspectRatio: 99 / 99,
                    position: "absolute",
                    top: -30,
                    width: 70,
                  }}
                />
                <Heading3 color="dark2" textAlign="center">
                  Average of 7x
                </Heading3>
                <ParagraphLight color="dark3" textAlign="center">
                  Increase in overall health & happiness
                </ParagraphLight>
              </Div>
            </Animated.View>
          </Div>
          <Div flex={1} />
        </Div>
        <Div alignItems="center" bg="light" h={TRANSLATE_HEIGHT} roundedTop={40}>
          <Heading3 mb={32} mt={64}>
            We're ready when you are!
          </Heading3>
          <Button
            alignSelf="stretch"
            bg="aqua"
            color="light"
            fontSize={14}
            fontWeight="700"
            mb={40}
            minH={56}
            mt={8}
            mx={40}
            rounded={8}
            onPress={navToNext}
          >
            I'm Ready
          </Button>
        </Div>
      </Div>
    </Animated.View>
  )
}
