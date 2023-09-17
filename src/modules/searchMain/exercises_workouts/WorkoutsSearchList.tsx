import { gql } from "@apollo/client"
import { useNavigation } from "@react-navigation/core"
import React, { useCallback } from "react"
import { ActivityIndicator, FlatList, FlatListProps } from "react-native"
import { Div } from "react-native-magnus"

import { EmptyListData } from "component/container/emptyList"
import { getWordedLevel } from "helper/getWordedLevel"
import { secondsToMinutes } from "helper/secondsToMinutes"
import { ProfileWorkoutItem } from "modules/userProfile/components/ProfileWorkoutItem"
import { screenLibrary } from "navigation/screenLibrary"
import { useAddSearchResultInteraction } from "queries/SearchResultInteractions"
import globalCustomisations, { PAGE_SIDE_PADDING } from "theme/globalCustomisations"

export const WORKOUTS_SEARCH_LIST_FIELDS = gql`
  fragment WorkoutsSearchListFields on Workout {
    u_id
    w_id
    title
    level
    cover_image_uri
    is_publicly_visible
    user {
      id
      u_id
      username
      is_blue_tick_verified
      is_pt_verified
      is_verified_creator
    }
    workoutExercises {
      id
      pictureAddress
      user {
        id
        verified_creator_at
      }
    }
    created
    totalTime
  }
`

export interface WorkoutsSearchListProps extends Partial<FlatListProps<any>> {
  emptyListMessage?: string
  FooterComponentWhilstNotLoading?: any
  extraOnClick?: (any, number) => void
  fromLocation?: string
  horizontalListContainerPadding?: number
  isLoadingInitial?: boolean
  isLoadingMore?: boolean
  onEndReached?: () => void
  rectangleBg?: string
  searchQueryId?: any
  workouts: Array<object>
}

export const WorkoutsSearchList = ({
  ListHeaderComponent,
  FooterComponentWhilstNotLoading,
  emptyListMessage,
  extraOnClick,
  fromLocation,
  horizontalListContainerPadding,
  isLoadingInitial,
  isLoadingMore,
  onEndReached,
  searchQueryId,
  style,
  workouts,
  ...restFlatlistProps
}: WorkoutsSearchListProps) => {
  const navigation = useNavigation()
  const [addInteractionMutation] = useAddSearchResultInteraction()

  const gotoWorkoutDetailPage = useCallback(
    (item, index) => {
      if (extraOnClick) {
        extraOnClick(item, index)
      }

      if (searchQueryId) {
        addInteractionMutation({
          variables: {
            entityId: item.w_id.toString(),
            interactionType: "click-through",
            resultIndex: index,
            userSearchQueryId: searchQueryId,
          },
        })
      }

      navigation.push(screenLibrary.workouts.workoutDetail, {
        fromLocation,
        searchQueryId,
        searchResultIndex: index,
        workout: JSON.stringify(item),
      })
    },
    [addInteractionMutation, extraOnClick, fromLocation, navigation, searchQueryId],
  )

  const ItemSeparatorComponent = useCallback(() => <Div h={10} />, [])

  const keyExtractor = useCallback((item) => item.key || item.w_id, [])

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <Div
          px={
            horizontalListContainerPadding === undefined
              ? PAGE_SIDE_PADDING
              : horizontalListContainerPadding
          }
        >
          <ProfileWorkoutItem
            creator={item.user.username}
            duration={secondsToMinutes(parseInt(item.totalTime, 10), true)}
            image={item.cover_image_uri || item.workoutExercises[0]?.pictureAddress}
            level={getWordedLevel(item.level)}
            title={item.title}
            onPress={() => gotoWorkoutDetailPage(item, index)}
          />
        </Div>
      )
    },
    [gotoWorkoutDetailPage, horizontalListContainerPadding],
  )

  return (
    <FlatList
      contentContainerStyle={[{ paddingBottom: 20 }, style]}
      data={workouts}
      initialNumToRender={4}
      ItemSeparatorComponent={ItemSeparatorComponent}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isLoadingInitial ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <EmptyListData message={emptyListMessage} type="Workout" />
        )
      }
      ListFooterComponent={
        isLoadingMore ? (
          <Div pt={30}>
            <ActivityIndicator color={globalCustomisations.colors.aqua100} />
          </Div>
        ) : (
          FooterComponentWhilstNotLoading
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      {...restFlatlistProps}
    />
  )
}
