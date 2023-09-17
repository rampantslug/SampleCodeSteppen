import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { FlatList, ListRenderItem, RefreshControl } from "react-native"
import { Div } from "react-native-magnus"

import { SearchTabEvents } from "../SearchEvents"
import { getWordedLevel } from "helper/getWordedLevel"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import pluralize from "helper/pluralize"
import WorkoutProgram from "model/workoutProgram"
import { DiscoveryTabs } from "modules/myfit/DiscoveryEvents"
import TagHeader from "modules/searchMain/TagHeader"
import TagModal from "modules/searchMain/TagModal"
import { ProfileProgramItem } from "modules/userProfile/components/ProfileProgramItem"
import WorkoutProgramEvents from "modules/workoutPrograms/WorkoutProgramEvents"
import { screenLibrary } from "navigation/screenLibrary"
import GenericEmptyState from "src/designLibrary/generic/GenericEmptyState"
import {
  LoadingSkeleton,
  WORKOUT_RECTANGLE_CARD_FRAGMENT,
} from "src/designLibrary/workoutPrograms/cards/WorkoutProgramRectangleCard"
import { Body } from "theme/Typography"

const SEARCH_PROGRAM = gql`
  ${WORKOUT_RECTANGLE_CARD_FRAGMENT}
  query searchPrograms($after: String!, $searchTerm: String, $tagFilters: WorkoutProgramTags) {
    paginatedWorkoutPrograms(
      params: { first: 6, after: $after }
      searchTerm: $searchTerm
      tagFilters: $tagFilters
    ) {
      total
      edges {
        ...WorkoutProgramRectangleFragment
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`

const TAGS = gql`
  query tags {
    tags {
      id
      name
      tags {
        id
        tag
        is_common
      }
    }
  }
`

export const tagCategories = [
  {
    key: "style",
    label: "Style",
    icon: "star",
    iconFamily: "FontAwesome",
    tagCategoryName: "workout-type",
  },
  {
    key: "bodyPart",
    label: "Body Part",
    icon: "body-outline",
    iconFamily: "Ionicons",
    tagCategoryName: "body-part",
  },
  {
    key: "equipment",
    label: "Equipment",
    icon: "barbell-outline",
    iconFamily: "Ionicons",
    tagCategoryName: "equipment",
  },
  {
    key: "difficulty",
    label: "Difficulty",
    icon: "bar-chart-2",
    iconFamily: "Feather",
    tagCategoryName: "difficulty",
  },
  {
    key: "location",
    label: "Location",
    icon: "location-on",
    iconFamily: "MaterialIcons",
    tagCategoryName: "location",
  },
]

type Props = {
  searchQuery: string
}

const SearchProgramTab: React.FC<Props> = ({ searchQuery }) => {
  const navigation = useNavigation()

  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [openTagsModal, setOpenTagsModal] = useState<string | null>(null)

  const { data: tagsData } = useQuery(TAGS)

  const tagFilters = useMemo(() => {
    // {"bodyPart": ["Arms", "Calves"], "difficulty": ["Beginner"]}
    const lookup: { [key: string]: string[] } = {}

    selectedTags.forEach((selectedTag: any) => {
      const { category, tag } = selectedTag

      if (lookup[category]) lookup[category] = [...lookup[category], tag]
      else lookup[category] = [tag]
    })

    return {
      workout_type_tags: lookup.style || [],
      equipment_tags: lookup.equipment || [],
      location_tags: lookup.location || [],
      targeted_body_part_tags: lookup.bodyPart || [],
      level: lookup.difficulty || [],
    }
  }, [selectedTags])

  const { data, loading, fetchMore, refetch } = useQuery(SEARCH_PROGRAM, {
    notifyOnNetworkStatusChange: true,
    variables: {
      after: "0",
      searchTerm: searchQuery || "",
      tagFilters,
    },
  })

  useEffect(() => {
    refetch({
      after: "0",
      searchTerm: searchQuery || "",
      tagFilters,
    })
  }, [refetch, searchQuery, tagFilters])

  const allTags = useMemo(() => {
    const tagsCategoryNameDictionary: { [key: string]: string } = {}

    // Just build a mapping so that reducing would be dynamic from the declared tag categories
    // { "body-part": "bodyPart" }
    tagCategories.forEach(({ tagCategoryName, key }) => {
      tagsCategoryNameDictionary[tagCategoryName] = key
    })

    return tagsData?.tags?.reduce((acc: any, tagCategory: any) => {
      if (tagsCategoryNameDictionary[tagCategory.name]) {
        return Object.assign(acc, {
          [tagsCategoryNameDictionary[tagCategory.name]]: tagCategory.tags,
        })
      }
      return acc
    }, {})
  }, [tagsData])

  const programs: WorkoutProgram[] = useMemo(
    () =>
      data?.paginatedWorkoutPrograms?.reduce(
        (previous: any, current: any) => [...previous, ...current.edges],
        [],
      ) || [],
    [data],
  )

  const gotoProgramDetailPage = useCallback(
    (item) => {
      logAnalyticsEvent(WorkoutProgramEvents.VIEWED, {
        programId: item.id,
        programCreatorId: item.user_id,
        programDuration: item.program_length_weeks,
        fromLocation: "programs-search",
      })
      navigation.navigate(screenLibrary.workoutProgram.view, { workoutProgramId: item.id })
    },
    [navigation],
  )

  const renderItem: ListRenderItem<WorkoutProgram> = useCallback(
    ({ item }) => {
      return (
        <ProfileProgramItem
          creator={item.user?.username}
          duration={pluralize(item.program_length_weeks, "week", "1 week")}
          image={item.cover_image_uri}
          level={getWordedLevel(item.level)}
          title={item.title}
          onPress={() => gotoProgramDetailPage(item)}
        />
      )
    },
    [gotoProgramDetailPage],
  )

  const onRefresh = useCallback(() => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_LIST_REFRESHED(DiscoveryTabs.PROGRAMS))
    refetch({
      after: "0",
      searchTerm: searchQuery,
      tagFilters,
    })
  }, [refetch, searchQuery, tagFilters])

  const pageInfo = useMemo(
    () =>
      data?.paginatedWorkoutPrograms?.[(data?.paginatedWorkoutPrograms?.length || 0) - 1]
        ?.pageInfo || {},
    [data],
  )

  const handleOpenTagsModal = useCallback((category: string) => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_MODAL_TAG_CATEGORIES_VIEWED(DiscoveryTabs.PROGRAMS), {
      category,
    })
    setOpenTagsModal(category)
  }, [])

  const handleCloseTagsModal = useCallback(() => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_MODAL_TAG_CATEGORIES_CLOSED(DiscoveryTabs.PROGRAMS), {
      category: openTagsModal || "",
    })
    setOpenTagsModal(null)
  }, [openTagsModal])

  const onLoadMore = useCallback(() => {
    if (pageInfo.hasNextPage) {
      const variables = {
        after: pageInfo.endCursor,
        searchTerm: searchQuery,
        tagFilters,
      }

      fetchMore({ variables })
      logAnalyticsEvent(SearchTabEvents.SEARCH_LOAD_MORE(DiscoveryTabs.PROGRAMS))
    }
  }, [pageInfo, searchQuery, tagFilters, fetchMore])

  const FooterComponent = useMemo(() => {
    if (loading) {
      return (
        <>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      )
    }

    return null
  }, [loading])

  const Content = useMemo(() => {
    if (programs.length) {
      return (
        <FlatList
          data={programs}
          keyExtractor={(id, index) => index.toString()}
          ListFooterComponent={FooterComponent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          renderItem={renderItem}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
        />
      )
    }

    return (
      <GenericEmptyState>
        <Body>{"No results found\n"}</Body>
        <Body color="dark4">Try another search</Body>
      </GenericEmptyState>
    )
  }, [FooterComponent, loading, onLoadMore, onRefresh, programs, renderItem])

  return (
    <Div flex={1}>
      <TagHeader
        openTagsModal={handleOpenTagsModal}
        selectedTags={selectedTags}
        tagCategories={tagCategories}
      />
      <TagModal
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        showModal={openTagsModal}
        tab={DiscoveryTabs.PROGRAMS}
        tagCategories={tagCategories}
        tags={allTags}
        onClose={handleCloseTagsModal}
      />
      {Content}
    </Div>
  )
}

export default memo(SearchProgramTab)
