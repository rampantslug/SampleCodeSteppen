import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from "react"
import { Pressable } from "react-native"
import { Button, Div, Icon, Skeleton } from "react-native-magnus"

import { CALORIES_BURNT_FACTS } from "./CaloriesBurntFacts"
import { SetWeeklyWorkoutGoalModal } from "./components/SetWeeklyWorkoutGoalModal"
import StarSVG from "assets/lightActivities/exerciseAndSport/star.svg"
import ChronoOutlineSvg from "assets/statistics/chrono-outline.svg"
import DumbellIcon from "assets/statistics/dumbell.svg"
import FireIcon from "assets/statistics/fire.svg"
import RunningIcon from "assets/statistics/running.svg"
import StopwatchIcon from "assets/statistics/stopwatch.svg"
import WorkoutSvg from "assets/statistics/workout.svg"
import { ProgressRing } from "component/general/ProgressRing"
import { ALL_LIGHT_ACTIVITIES } from "constant/enums/lightActivities"
import pluralize from "helper/pluralize"
import { toInitialCap } from "helper/toInitialCap"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"
import {
  BigMain,
  ExtraSmall,
  Heading1,
  Heading3,
  Paragraph,
  ParagraphLight,
  SmallLight,
} from "theme/Typography"
import logAnalyticsEvent from "helper/logAnalyticsEvent"

const ACTIVITY_TIME_PER_WEEK = gql`
  query userSumActivitiesTimePerWeek {
    userSumActivitiesTimePerWeek(limit: 7) {
      week_end
      time_minutes
    }
  }
`

const HoursComponent = () => {
  const navigation = useNavigation()

  const navToDetails = useCallback(
    () => navigation.navigate(screenLibrary.stats.time),
    [navigation],
  )

  const { data: activityTimePerWeekData } = useQuery(ACTIVITY_TIME_PER_WEEK)
  const activityTimePerWeek = useMemo(
    () => activityTimePerWeekData?.userSumActivitiesTimePerWeek,
    [activityTimePerWeekData],
  )

  const weekTotalHours = useMemo(
    () =>
      !activityTimePerWeek
        ? 0
        : Math.round(activityTimePerWeek[activityTimePerWeek.length - 1].time_minutes / 60),
    [activityTimePerWeek],
  )

  const progressPercentage = useMemo(
    () => (weekTotalHours > 2.5 ? 100 : Math.floor((weekTotalHours / 2.5) * 100)),
    [weekTotalHours],
  )

  return (
    <Pressable style={{ flex: 1 }} onPress={navToDetails}>
      <Div row bg="steppenPurple40" h={128} minW={168} p={12} rounded={12}>
        <Div justifyContent="space-between">
          <StopwatchIcon style={{ aspectRatio: 1, width: 32 }} />
          <Div>
            <Div bg="steppenDarkPurple" h={8} w={8} />
            <SmallLight color="dark2">{pluralize(weekTotalHours, "hour")}</SmallLight>
          </Div>
        </Div>
        <ChronoOutlineSvg
          style={{ aspectRatio: 80 / 88, width: 80, position: "absolute", bottom: 12, right: 12 }}
        />
        <Div bottom={16} position="absolute" right={18}>
          <ProgressRing
            indicatorColor={globalCustomisations.colors.steppenDarkPurple}
            indicatorWidth={5}
            progress={progressPercentage}
            size={70}
            trackColor={globalCustomisations.colors.light1}
            trackWidth={5}
          />
        </Div>
        <Div
          alignItems="center"
          bottom={16}
          h={70}
          justifyContent="center"
          position="absolute"
          right={18}
          w={70}
        >
          <Heading1 color="dark2">2.5</Heading1>
          <ExtraSmall color="dark3" mt={-6}>
            hours
          </ExtraSmall>
        </Div>
        <Icon
          color="dark3"
          fontFamily="Feather"
          fontSize={24}
          name="chevron-right"
          position="absolute"
          right={8}
          top={8}
        />
      </Div>
    </Pressable>
  )
}

const CALORIES_ALL_TIME = gql`
  query userLifetimeCalories {
    userLifetimeCalories {
      average_calories_per_activity
      all_activities_calories
    }
  }
`

const CaloriesComponent = () => {
  const navigation = useNavigation()

  const { data: caloriesAllTimeData, loading: isLoadingCalories } = useQuery(CALORIES_ALL_TIME)
  const caloriesAllTime = useMemo(
    () => caloriesAllTimeData?.userLifetimeCalories,
    [caloriesAllTimeData],
  )

  const navToDetails = useCallback(
    () => navigation.navigate(screenLibrary.stats.calories),
    [navigation],
  )

  const randomCalorieFact = useMemo(() => {
    const index = Math.floor(Math.random() * CALORIES_BURNT_FACTS.length)
    return CALORIES_BURNT_FACTS[index]
  }, [])

  return (
    <Pressable style={{ flex: 1 }} onPress={navToDetails}>
      <Div row bg="steppenPurple10" h={128} minW={168} p={12} rounded={12}>
        <Div justifyContent="space-between">
          <FireIcon style={{ aspectRatio: 1, width: 32 }} />
          <Div>
            <SmallLight color="dark3">Total Calories Burnt</SmallLight>
            <Div row alignItems="baseline">
              {isLoadingCalories ? (
                <Skeleton h={24} w={60} />
              ) : (
                <Heading1 color="dark2">
                  {caloriesAllTime?.all_activities_calories.toLocaleString() || "--"}
                </Heading1>
              )}
              <SmallLight color="dark3" ml={4}>
                kCal
              </SmallLight>
            </Div>
          </Div>
        </Div>
        <Div />
        <Icon
          color="dark3"
          fontFamily="Feather"
          fontSize={24}
          name="chevron-right"
          position="absolute"
          right={8}
          top={8}
        />
        <Div bottom={0} position="absolute" right={0} w={48}>
          {randomCalorieFact.image}
        </Div>
      </Div>
    </Pressable>
  )
}

const WORKOUTS_COMPLETED_THIS_WEEK = gql`
  query userSumWorkoutsCompletedThisWeek {
    userSumWorkoutsCompletedThisWeek
  }
`

const WEEKLY_WORKOUT_GOAL = gql`
  query getUser {
    getUser {
      id
      preference_weekly_workouts
    }
  }
`

const WorkoutsComponent = ({ onEditGoalPress }) => {
  const navigation = useNavigation()

  const navToDetails = useCallback(
    () => navigation.navigate(screenLibrary.stats.workouts),
    [navigation],
  )

  const { data: workoutsCompletedThisWeekData, loading: loadingCompletedData } = useQuery(
    WORKOUTS_COMPLETED_THIS_WEEK,
  )
  const workoutsCompletedThisWeek = useMemo(
    () => workoutsCompletedThisWeekData?.userSumWorkoutsCompletedThisWeek,
    [workoutsCompletedThisWeekData],
  )

  const { data: weeklyWorkoutGoalData, loading: loadingGoalData } = useQuery(WEEKLY_WORKOUT_GOAL)
  const weeklyWorkoutGoal = useMemo(
    () => weeklyWorkoutGoalData?.getUser?.preference_weekly_workouts,
    [weeklyWorkoutGoalData],
  )

  const GoalCount = useMemo(() => {
    if (loadingCompletedData || loadingGoalData) {
      return (
        <Div flex={1} justifyContent="flex-end" ml={24} pr={16}>
          <Skeleton h={48} w={60} />
          <Skeleton h={24} w={120} />
        </Div>
      )
    } else if (weeklyWorkoutGoal) {
      return (
        <Div flex={1} justifyContent="flex-end" ml={24} pr={16}>
          <BigMain color="dark2">{`${workoutsCompletedThisWeek}/${weeklyWorkoutGoal}`}</BigMain>
          <ParagraphLight color="dark3" numberOfLines={2} textAlign="left">
            Workouts completed this week
          </ParagraphLight>
        </Div>
      )
    } else {
      return (
        <Div flex={1} justifyContent="flex-end" ml={24} pr={16}>
          <Paragraph color="dark2" numberOfLines={2} textAlign="left">
            You haven't set a weekly goal
          </Paragraph>
          <Button bg="aqua100" color="light1" onPress={() => onEditGoalPress()}>
            Set My Goal
          </Button>
        </Div>
      )
    }
  }, [
    weeklyWorkoutGoal,
    loadingCompletedData,
    loadingGoalData,
    workoutsCompletedThisWeek,
    onEditGoalPress,
  ])

  return (
    <Pressable onPress={navToDetails}>
      <Div row bg="steppenBlue10" p={12} rounded={12}>
        <DumbellIcon style={{ aspectRatio: 1, width: 32 }} />
        <Div>
          <WorkoutSvg style={{ aspectRatio: 99 / 108, width: 99 }} />
          <Div left={-3} position="absolute" top={4}>
            <ProgressRing
              indicatorColor={globalCustomisations.colors.steppenBlue100}
              indicatorWidth={8}
              progress={
                workoutsCompletedThisWeek / weeklyWorkoutGoal > 1
                  ? 100
                  : (workoutsCompletedThisWeek / weeklyWorkoutGoal) * 100
              }
              size={106}
              trackColor={globalCustomisations.colors.steppenBlue40}
              trackWidth={8}
            />
          </Div>
        </Div>
        {GoalCount}
        <Icon
          color="dark3"
          fontFamily="Feather"
          fontSize={24}
          name="chevron-right"
          position="absolute"
          right={8}
          top={8}
        />
      </Div>
    </Pressable>
  )
}

const MOST_RECENT_LIGHT_ACTIVITY = gql`
  query userLastLightActivity {
    userLastLightActivity {
      data
    }
  }
`

const ActivitiesComponent = ({ isLoadingLightActivity, mostRecentLightActivity }) => {
  const navigation = useNavigation()

  const navToDetails = useCallback(
    () => navigation.navigate(screenLibrary.stats.activities),
    [navigation],
  )

  const activityName = useMemo(() => {
    if (mostRecentLightActivity) {
      const parse1 = JSON.parse(mostRecentLightActivity)
      if (!parse1.description) return null
      const parse2 = JSON.parse(parse1.description)
      return parse2.activity_type
    } else return null
  }, [mostRecentLightActivity])

  const SVG = useMemo(() => {
    return ALL_LIGHT_ACTIVITIES.find((i) => i.label === activityName)?.SVG || StarSVG
  }, [activityName])

  return (
    <Pressable onPress={navToDetails}>
      <Div row bg="steppenPurple20" p={12} rounded={12}>
        <Div justifyContent="space-between">
          <RunningIcon style={{ aspectRatio: 1, width: 32 }} />

          <Div h={16} />

          <Div>
            {isLoadingLightActivity ? (
              <Skeleton h={24} w={60} />
            ) : (
              <Heading3 color="dark2">{activityName ? toInitialCap(activityName) : "--"}</Heading3>
            )}
            <ParagraphLight color="dark4">Last exercise activity</ParagraphLight>
          </Div>
        </Div>
        <Icon
          color="dark3"
          fontFamily="Feather"
          fontSize={24}
          name="chevron-right"
          position="absolute"
          right={8}
          top={8}
        />

        <SVG style={{ aspectRatio: 1, width: 72, position: "absolute", right: 32, bottom: 8 }} />
      </Div>
    </Pressable>
  )
}

const ActivityStatistics = forwardRef(({ setLoadingStats }, ref) => {
  const [isShowingGoalModal, setIsShowingGoalModal] = useState(false)

  const {
    data: mostRecentLightActivityData,
    loading: isLoadingLightActivity,
    refetch,
  } = useQuery(MOST_RECENT_LIGHT_ACTIVITY)
  const mostRecentLightActivity = useMemo(
    () => mostRecentLightActivityData?.userLastLightActivity?.data,
    [mostRecentLightActivityData],
  )

  const showGoalModal = useCallback(() => {
    logAnalyticsEvent("showing-weekly-workout-goal-modal-for-the-first-time")
    setIsShowingGoalModal(true)
  }, [setIsShowingGoalModal])

  if (ref) {
    ref.current = {
      refetchData: () => refetch,
    }
  }
  useEffect(() => {
    setLoadingStats(isLoadingLightActivity)
  }, [isLoadingLightActivity, setLoadingStats])

  return (
    <Div bg="light1" flex={1} mx={0} px={16}>
      <Div row flex={1}>
        <HoursComponent />

        <Div w={8} />

        <CaloriesComponent />
      </Div>

      <Div h={16} />

      <WorkoutsComponent onEditGoalPress={showGoalModal} />

      <Div h={16} />

      <ActivitiesComponent
        isLoadingLightActivity={isLoadingLightActivity}
        mostRecentLightActivity={mostRecentLightActivity}
      />

      <SetWeeklyWorkoutGoalModal
        isVisible={isShowingGoalModal}
        setIsVisible={setIsShowingGoalModal}
      />
    </Div>
  )
})

export default memo(ActivityStatistics)
