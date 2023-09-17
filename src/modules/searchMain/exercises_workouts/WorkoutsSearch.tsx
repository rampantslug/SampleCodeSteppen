import { gql, NetworkStatus, useQuery } from "@apollo/client"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { RefreshControl, Keyboard } from "react-native"
import { Div } from "react-native-magnus"
import Uuid from "uuid"

import { WorkoutsSearchList, WORKOUTS_SEARCH_LIST_FIELDS } from "./WorkoutsSearchList"
import CombinedTagModal from "../CombinedTagModal"
import FilterHeader from "../FilterHeader"
import { SearchTabEvents } from "../SearchEvents"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { DiscoveryTabs } from "modules/myfit/DiscoveryEvents"
import { VIEW_WORKOUT_FIELDS } from "modules/workoutViewing/workoutHook"
import { Heading3 } from "theme/Typography"

type Props = {
  searchQuery: string
}

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
    key: "timed",
    label: "Workout Type",
    icon: "play-box-multiple",
    iconFamily: "MaterialCommunityIcons",
    tagCategoryName: "timed",
  },
  {
    key: "time",
    label: "Time",
    icon: "stopwatch",
    iconFamily: "Entypo",
    tagCategoryName: "time",
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
  {
    key: "qualified",
    label: "Creator Type",
    icon: "account-outline",
    iconFamily: "MaterialCommunityIcons",
    tagCategoryName: "qualified",
  },
]

const PAGINATED_WORKOUT_SEARCH_RESULTS = gql`
  ${VIEW_WORKOUT_FIELDS}
  ${WORKOUTS_SEARCH_LIST_FIELDS}
  query paginatedWorkoutSearchResults(
    $after: String
    $first: Int!
    $id: String!
    $params: SearchQueryInputType!
  ) {
    searchWorkouts(after: $after, first: $first, id: $id, params: $params) {
      edges {
        node {
          id
          ...ViewWorkoutFields
          ...WorkoutsSearchListFields
        }
      }
      pageInfo {
        endCursor
        hasNextPage
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

const HIGHLIGHTED_WORKOUT_GROUP = gql`
  ${WORKOUTS_SEARCH_LIST_FIELDS}
  query highlightedWorkoutGroup($groupName: String!) {
    highlightedWorkoutGroup(groupName: $groupName) {
      id
      ...WorkoutsSearchListFields
    }
  }
`

const WorkoutsSearch: React.FC<Props> = ({ searchQuery }) => {
  const searchQueryId = useMemo(() => Uuid.v4(), [])
  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [openTagsModal, setOpenTagsModal] = useState(false)

  const {
    data: searchData,
    loading: searchLoading,
    fetchMore: fetchMoreResultsImpl,
    networkStatus: searchLoadingNetworkStatus,
  } = useQuery(PAGINATED_WORKOUT_SEARCH_RESULTS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: searchQueryId,
      first: 15,
      after: "-1",
      params: {
        keyword: searchQuery,
        tags: selectedTags,
      },
    },
  })

  const refresh = useCallback(() => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_LIST_REFRESHED(DiscoveryTabs.WORKOUTS))
    fetchMoreResultsImpl({
      variables: {
        first: 15,
        after: "-1",
        id: searchQueryId,
        params: {
          keyword: searchQuery,
          tags: selectedTags,
        },
      },
    })
  }, [fetchMoreResultsImpl, searchQuery, searchQueryId, selectedTags])

  useEffect(() => {
    refresh()
  }, [refresh])

  const { data: tagsData } = useQuery(TAGS)

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

  const isLoadingMoreResults = useMemo(
    () => searchLoadingNetworkStatus === NetworkStatus.fetchMore,
    [searchLoadingNetworkStatus],
  )

  const fetchMoreResults = useCallback(() => {
    if (
      !searchLoading &&
      !isLoadingMoreResults &&
      searchData?.searchWorkouts?.pageInfo?.hasNextPage
    ) {
      logAnalyticsEvent(SearchTabEvents.SEARCH_LOAD_MORE(DiscoveryTabs.WORKOUTS))
      fetchMoreResultsImpl({
        variables: {
          after: searchData?.searchWorkouts?.pageInfo?.endCursor,
          first: 15,
          tags: selectedTags,
          keyword: searchQuery,
        },
      })
      logAnalyticsEvent("workout-search-load-next-page", {
        searchQuery,
        nextPage: searchData?.searchWorkouts?.pageInfo?.endCursor,
        searchQueryId,
      })
    }
  }, [
    searchData,
    searchLoading,
    isLoadingMoreResults,
    fetchMoreResultsImpl,
    selectedTags,
    searchQuery,
    searchQueryId,
  ])

  const { data: splashData, loading: splashDataLoading } = useQuery(HIGHLIGHTED_WORKOUT_GROUP, {
    variables: {
      groupName: "trending",
    },
  })

  const splashWorkouts = useMemo(() => splashData?.highlightedWorkoutGroup, [splashData])

  const searchWorkouts = useMemo(
    () => searchData?.searchWorkouts?.edges?.map((edge: any) => edge.node) || [],
    [searchData],
  )

  const ListSeparator = useCallback(() => <Div h={8} />, [])

  const handleOpenTagsModal = useCallback(() => {
    Keyboard.dismiss()
    logAnalyticsEvent(SearchTabEvents.SEARCH_MODAL_TAG_CATEGORIES_VIEWED(DiscoveryTabs.WORKOUTS))
    setOpenTagsModal(true)
  }, [])

  const handleCloseTagsModal = useCallback(() => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_MODAL_TAG_CATEGORIES_CLOSED(DiscoveryTabs.WORKOUTS))
    setOpenTagsModal(false)
  }, [])

  const Content = useMemo(() => {
    if (searchQuery || selectedTags.length) {
      return (
        <WorkoutsSearchList
          fromLocation="search-workouts"
          isLoadingMore={isLoadingMoreResults}
          refreshControl={<RefreshControl refreshing={isLoadingMoreResults} onRefresh={refresh} />}
          searchQueryId={searchQueryId}
          workouts={searchWorkouts}
          onEndReached={fetchMoreResults}
        />
      )
    }

    return (
      <WorkoutsSearchList
        fromLocation="search-workouts-trending"
        isLoadingMore={splashDataLoading}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={<Heading3 m={16}>Trending</Heading3>}
        workouts={splashWorkouts}
      />
    )
  }, [
    ListSeparator,
    fetchMoreResults,
    isLoadingMoreResults,
    refresh,
    searchQuery,
    searchQueryId,
    searchWorkouts,
    selectedTags.length,
    splashDataLoading,
    splashWorkouts,
  ])

  return (
    <Div flex={1}>
      <FilterHeader
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onEditFilter={handleOpenTagsModal}
      />
      <CombinedTagModal
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        showModal={openTagsModal}
        tags={allTags}
        onClose={handleCloseTagsModal}
      />
      {Content}
    </Div>
  )
}

export default memo(WorkoutsSearch)
