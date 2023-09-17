import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { FC, Fragment, memo, useCallback, useMemo, useState } from "react"
import { Pressable } from "react-native"
import FastImage from "react-native-fast-image"
import { Button, Div, Icon, Modal } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

import SteppenPlusLogoSvg from "assets/steppen-plus/logo.svg"
import BlurredOverlay from "designLibrary/generic/BlurredOverlay"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { screenLibrary } from "navigation/screenLibrary"
import { Page } from "theme/Page"
import { PageContentContainer } from "theme/PageContentContainer"
import { BodyHeavy, ExtraSmall, Heading3, ParagraphHeavy, ParagraphLight } from "theme/Typography"

const MEALS = gql`
  query meals {
    meals {
      id
      category
      difficulty
      duration
      image_uri
      publication
      recipe_uri
      title
    }
  }
`

const FEATURES = gql`
  query features {
    featuresOnForCurrentUser
  }
`

const FoodSearch: FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [showingMeal, setShowingMeal] = useState(null)

  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const { data: mealsData } = useQuery(MEALS)
  const meals = useMemo(() => mealsData?.meals || [], [mealsData])

  const { data: featuresData } = useQuery(FEATURES)
  const features = useMemo(() => featuresData?.featuresOnForCurrentUser || [], [featuresData])

  const shouldUpgrade = useMemo(() => !features.includes("food"), [features])

  const categoryMeals = useMemo(() => {
    if (!searchQuery || shouldUpgrade) return meals

    return meals.filter(
      (meal: any) => meal.title.includes(searchQuery) || meal.category.includes(searchQuery),
    )
  }, [meals, searchQuery, shouldUpgrade])

  const startShowingMeal = useCallback((meal: any) => {
    logAnalyticsEvent("food-show-meal", { categoryKey: meal.category, title: meal.title })
    setShowingMeal(meal.recipe_uri)
  }, [])

  const stopShowingMeal = useCallback(() => setShowingMeal(null), [])

  const onUpgrade = useCallback(() => {
    logAnalyticsEvent("discovery-food-search-upgrade-plan")

    navigation.navigate(screenLibrary.tabAccount.choosePlan, {
      location: "discovery-food-search",
    })
  }, [navigation])

  return (
    <Page>
      <PageContentContainer>
        {categoryMeals.map((meal) => (
          <Fragment key={meal.id}>
            <Div h={16} />

            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#f6f6f6" : "white",
                borderRadius: 16,
                opacity: pressed ? 0.9 : 1,
                overflow: "hidden",
              })}
              onPress={() => startShowingMeal(meal)}
            >
              <Div row alignItems="center" overflow="hidden" rounded={16}>
                <Div aspectRatio={1} overflow="hidden" rounded={16} w={96}>
                  <FastImage
                    source={{ uri: meal.image_uri }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Div>

                <Div w={10} />

                <Div flex={1}>
                  <Div row alignItems="center">
                    <ExtraSmall color="steppenGreen">Meal</ExtraSmall>

                    <Div aspectRatio={1} bg="dark4" mx={4} rounded={100} w={4} />

                    <ExtraSmall color="dark4">{meal.difficulty}</ExtraSmall>

                    <Div aspectRatio={1} bg="dark4" mx={4} rounded={100} w={4} />

                    <ExtraSmall color="dark4">{meal.duration} minutes</ExtraSmall>
                  </Div>

                  <ParagraphHeavy>{meal.title}</ParagraphHeavy>

                  <ParagraphLight color="dark3">{meal.publication}</ParagraphLight>
                </Div>
              </Div>
            </Pressable>
          </Fragment>
        ))}

        <Div h={30} />
      </PageContentContainer>

      {shouldUpgrade && (
        <BlurredOverlay>
          <Div
            alignItems="center"
            h={220}
            justifyContent="center"
            overflow="hidden"
            rounded={8}
            w="90%"
          >
            <FastImage
              source={require("assets/backgrounds/background-23.png")}
              style={{ height: "100%", position: "absolute", width: "100%" }}
            />

            <Div
              alignItems="center"
              h="100%"
              justifyContent="space-between"
              p="baseMargin"
              position="absolute"
              w="100%"
              zIndex={1}
            >
              <SteppenPlusLogoSvg style={{ aspectRatio: 189 / 43, color: "white", width: "40%" }} />
              <Heading3 color="light">Food is a premium feature</Heading3>
              <ParagraphLight color="light" textAlign="center">
                See over 60 of the best healthy meals, pre workout snacks and more with Steppen Plus
              </ParagraphLight>
              <Button alignSelf="center" bg="aqua" rounded={8} w="60%" onPress={onUpgrade}>
                <BodyHeavy color="light" textAlign="center">
                  Upgrade
                </BodyHeavy>
              </Button>
            </Div>
          </Div>
        </BlurredOverlay>
      )}

      <Modal
        h="100%"
        isVisible={!!showingMeal}
        onBackdropPress={stopShowingMeal}
        onDismiss={stopShowingMeal}
      >
        <Div left={20} position="absolute" top={(insets.top || 10) + 10} zIndex={1}>
          <Pressable onPress={stopShowingMeal}>
            <Div
              alignItems="center"
              aspectRatio={1}
              bg="light"
              borderColor="dark2"
              borderWidth={1.5}
              justifyContent="center"
              opacity={0.9}
              rounded={100}
              w={24}
            >
              <Icon color="dark2" fontFamily="Feather" fontSize={16} name="x" />
            </Div>
          </Pressable>
        </Div>
        <WebView source={{ uri: showingMeal }} startInLoadingState={true} style={{ flex: 1 }} />
      </Modal>
    </Page>
  )
}

export default memo(FoodSearch)
