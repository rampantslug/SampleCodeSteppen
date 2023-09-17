import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/core"
import { useFocusEffect } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo, useState } from "react"
import FastImage from "react-native-fast-image"
import { Button, Div, WINDOW_WIDTH } from "react-native-magnus"
import { Circle, Svg } from "react-native-svg"
import {
  VictoryAxis,
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
} from "victory-native"

import { SetWeeklyWorkoutGoalModal } from "./components/SetWeeklyWorkoutGoalModal"
import StatsDetailsContainer from "./components/StatsDetailsContainer"
import { steppenGraphingTheme } from "./SteppenVictoryGraphingTheme"
import DumbellBlueIcon from "assets/statistics/dumbell-icon-blue.svg"
import DumbellWhiteIcon from "assets/statistics/dumbell-icon-white.svg"
import HeaderWorkoutsSvg from "assets/statistics/header-workouts.svg"
import WorkoutTrophyIcon from "assets/statistics/workout-trophy.svg"
import { ProgressRing } from "component/general/ProgressRing"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"
import {
  Body,
  BodyLight,
  ExtraSmall,
  Heading1,
  Heading3,
  Paragraph,
  ParagraphLight,
  SmallLight,
} from "theme/Typography"
import { Pressable } from "react-native"
import logAnalyticsEvent from "helper/logAnalyticsEvent"

const WORKOUT_COMPLETIONS_PER_WEEK = gql`
  query userWorkoutsPerWeek {
    userWorkoutsPerWeek {
      week_end
      completions
    }
  }
`

const USER_IN_JOURNEY = gql`
  query getUserActiveJourney {
    userActiveJourney {
      id
      journey_id
      title
      started_at
    }
  }
`

const WorkoutsGraph = ({ onEditGoalPress, weeklyWorkoutGoal }) => {
  const navigation = useNavigation()
  const [graphSelectedIndex, setGraphSelectedIndex] = useState(0)

  const { data: journeyData, loading: loadingJourney } = useQuery(USER_IN_JOURNEY)
  const isInJourney = useMemo(() => {
    if (journeyData?.userActiveJourney && !loadingJourney) {
      return true
    }
  }, [journeyData, loadingJourney])

  const { data: workoutsPerWeekData, loading: loadingWorkouts } = useQuery(
    WORKOUT_COMPLETIONS_PER_WEEK,
  )
  const workoutsPerWeek = useMemo(
    () => workoutsPerWeekData?.userWorkoutsPerWeek,
    [workoutsPerWeekData],
  )
  const workoutsForGraph = useMemo(() => {
    return workoutsPerWeek?.map((item) => {
      const endDate = DateTime.fromISO(item.week_end)
      const dateRange = endDate.minus({ days: 6 }).day.toString() + "-" + endDate.day.toString()
      return { x: dateRange, y: item.completions }
    })
  }, [workoutsPerWeek])

  const headerText = useMemo(() => {
    if (workoutsPerWeek?.length > 0 && graphSelectedIndex != null) {
      const activeDay = DateTime.fromISO(workoutsPerWeek[graphSelectedIndex]?.week_end)
      return `${activeDay.monthShort} ${activeDay.minus({ days: 6 }).day} - ${
        activeDay.monthShort
      } ${activeDay.day}`
    } else {
      return "No Data"
    }
  }, [graphSelectedIndex, workoutsPerWeek])

  const selectedDataValue = useMemo(() => {
    if (workoutsPerWeek?.length > 0 && graphSelectedIndex != null) {
      return workoutsPerWeek[graphSelectedIndex]?.completions
    } else {
      return 0
    }
  }, [workoutsPerWeek, graphSelectedIndex])

  useFocusEffect(
    useCallback(() => {
      const endIndex = workoutsPerWeek?.length - 1
      setGraphSelectedIndex(endIndex)
    }, [setGraphSelectedIndex, workoutsPerWeek]),
  )

  const totalCompletedWorkouts = useMemo(() => {
    return workoutsPerWeek?.reduce((acc, week) => acc + week.completions, 0) || 0
  }, [workoutsPerWeek])

  const navigateToFirstActivity = useCallback(() => {
    logAnalyticsEvent("stats-workouts-first-activity-pressed")
    if (isInJourney) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: screenLibrary.tabroot,
            state: {
              index: 0,
              routes: [{ name: screenLibrary.tabs.myJourney }],
            },
          },
        ],
      })
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: screenLibrary.tabroot,
            state: {
              index: 0,
              routes: [{ name: screenLibrary.tabs.calendar }],
            },
          },
        ],
      })
    }
  }, [isInJourney, navigation])

  return (
    <>
      <Div row alignItems="center" justifyContent="space-between">
        <ExtraSmall color="dark3">{headerText}</ExtraSmall>
        <Button
          bg="transparent"
          color="aqua100"
          fontSize={12}
          textDecorLine="underline"
          onPress={() => onEditGoalPress()}
        >
          Edit Goal
        </Button>
      </Div>
      <Div row alignItems="baseline">
        <Heading1>{selectedDataValue}</Heading1>
        <ParagraphLight ml={2}>workouts</ParagraphLight>
      </Div>
      <VictoryChart
        containerComponent={<VictoryContainer disableContainerEvents />}
        domainPadding={{ x: 20 }}
        height={WINDOW_WIDTH * 0.5}
        padding={{ left: 40, right: 20, top: 20, bottom: 30 }}
        theme={steppenGraphingTheme}
        width={WINDOW_WIDTH - 100}
      >
        <VictoryAxis
          dependentAxis
          domain={[0, 7]}
          standalone={false}
          theme={steppenGraphingTheme}
          tickFormat={(t) => `${Math.round(t)}`}
        />
        <VictoryAxis standalone={false} theme={steppenGraphingTheme} />
        <VictoryLine
          data={[
            { x: 0, y: weeklyWorkoutGoal },
            { x: 10, y: weeklyWorkoutGoal },
          ]}
          // domain={{ x: [0, 10] }}
          domainPadding={{ x: [0, 30] }}
          labels={() => "g"}
          standalone={true}
          style={{
            data: { stroke: "#3843D0", strokeDasharray: "6, 4" },
          }}
        />
        <VictoryBar
          animate={{ duration: 1000 }}
          barWidth={32}
          data={workoutsForGraph}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: (_event, _data) => {
                  return [
                    {
                      eventKey: "all",
                      mutation: () => null,
                    },
                    {
                      mutation: (props) => {
                        setGraphSelectedIndex(props.index)
                        return {
                          style: Object.assign({}, props.style, {
                            fill: globalCustomisations.colors.steppenBlue60,
                          }),
                        }
                      },
                    },
                  ]
                },
              },
            },
          ]}
          style={{ data: { fill: globalCustomisations.colors.steppenBlue100 } }}
        />
      </VictoryChart>
      {!weeklyWorkoutGoal && !loadingWorkouts ? (
        <Div left={0} position="absolute" top={164} w="100%">
          <Button alignSelf="center" bg="aqua100" px={16} onPress={onEditGoalPress}>
            Set Goal To See Stats
          </Button>
        </Div>
      ) : totalCompletedWorkouts === 0 && !loadingWorkouts ? (
        <Div left={0} position="absolute" top={164} w="100%">
          <Button alignSelf="center" bg="aqua100" px={16} onPress={navigateToFirstActivity}>
            Complete Your 1st Workout
          </Button>
        </Div>
      ) : null}
      <Div bg="steppenBlue10" position="absolute" px={4} py={8} right={24} rounded={4} top={160}>
        <WorkoutTrophyIcon style={{ aspectRatio: 1, width: 24, position: "absolute", top: -8 }} />
        <Div alignItems="flex-end">
          <ExtraSmall color="steppenDarkBlue">Goal</ExtraSmall>
          <ExtraSmall color="steppenDarkBlue">{weeklyWorkoutGoal} workouts</ExtraSmall>
        </Div>
      </Div>
    </>
  )
}

const MOST_WORKED_BODY_PARTS = gql`
  query userMostWorkedBodyPart {
    userMostWorkedBodyPart {
      tag
      count
    }
  }
`

const PIE_COLORS = ["#328FFF", "#4BD6BF", "#9D94F4", "#FFC466"]

const WorkoutsBodyPartsPieChart = () => {
  const { data: mostWorkedBodyPartsData } = useQuery(MOST_WORKED_BODY_PARTS)
  const mostWorkedBodyParts = useMemo(
    () => mostWorkedBodyPartsData?.userMostWorkedBodyPart || [],
    [mostWorkedBodyPartsData],
  )

  const workedBodyPartsTotal = useMemo(() => {
    return parseInt(
      mostWorkedBodyParts.reduce((acc, item) => acc + item.count, 0),
      10,
    )
  }, [mostWorkedBodyParts])

  return (
    <Div bg="steppenYellow20" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="steppenYellow100" p={4} rounded="circle">
          <DumbellWhiteIcon style={{ aspectRatio: 1, width: 20 }} />
        </Div>
        <Body color="dark2" ml={8}>
          Most worked body parts
        </Body>
      </Div>
      <Div h={16} />
      <Div row alignItems="center">
        <Svg height={150} width={150}>
          <Circle cx={75} cy={75} fill="transparent" r={42} stroke="#999999" strokeWidth={0.25} />
          <Circle cx={75} cy={75} fill="transparent" r={73} stroke="#999999" strokeWidth={0.25} />
          {mostWorkedBodyParts.length === 0 && (
            <Circle cx={75} cy={75} fill="transparent" r={58} stroke="#FFEDCF" strokeWidth={16} />
          )}
          <VictoryPie
            colorScale={PIE_COLORS}
            cornerRadius={2}
            data={mostWorkedBodyParts}
            endAngle={390}
            height={150}
            innerRadius={48}
            labels={() => null}
            radius={66}
            standalone={false}
            startAngle={30}
            width={150}
            x="tag"
            y="count"
          />
        </Svg>
        <Div w={16} />
        {mostWorkedBodyParts.length === 0 && (
          <ParagraphLight color="dark2" ml={32}>
            No data
          </ParagraphLight>
        )}
        <Div flex={1}>
          {mostWorkedBodyParts?.map((item, index) => (
            <Div
              key={index}
              row
              alignItems="center"
              alignSelf="stretch"
              justifyContent="space-between"
            >
              <Div row alignItems="center">
                <Div bg={PIE_COLORS[index]} h={12} p={4} rounded={4} w={12} />
                <Paragraph color="dark2" ml={8}>
                  {item.tag}
                </Paragraph>
              </Div>
              <SmallLight color="dark3">
                {Math.round((item.count / workedBodyPartsTotal) * 100)}%
              </SmallLight>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  )
}

const WEEKLY_WORKOUT_GOAL = gql`
  query getUser {
    getUser {
      id
      preference_weekly_workouts
    }
  }
`

const WORKOUTS_COMPLETED_THIS_WEEK = gql`
  query userSumWorkoutsCompletedThisWeek {
    userSumWorkoutsCompletedThisWeek
  }
`

const WorkoutsWeeklyGoal = ({ weeklyWorkoutGoal }) => {
  const { data: workoutsCompletedThisWeekData } = useQuery(WORKOUTS_COMPLETED_THIS_WEEK)
  const workoutsCompletedThisWeek = useMemo(
    () => workoutsCompletedThisWeekData?.userSumWorkoutsCompletedThisWeek,
    [workoutsCompletedThisWeekData],
  )

  return (
    <Div bg="steppenBlue20" flex={1} h={193} p={12} rounded={8}>
      <Div row alignItems="flex-start" flex={1}>
        <Div
          alignItems="center"
          bg="light1"
          h={32}
          justifyContent="center"
          p={4}
          rounded="circle"
          w={32}
        >
          <DumbellBlueIcon style={{ aspectRatio: 1, width: 20 }} />
        </Div>
        <Body color="dark2" flex={1} ml={8} numberOfLines={3}>
          Percentage weekly goal is hit
        </Body>
      </Div>
      <Div alignItems="center" alignSelf="center" flex={1} w={100}>
        <Div bottom={0} position="absolute">
          <ProgressRing
            indicatorColor={globalCustomisations.colors.steppenBlue100}
            indicatorWidth={8}
            progress={
              workoutsCompletedThisWeek / weeklyWorkoutGoal > 1
                ? 100
                : (workoutsCompletedThisWeek / weeklyWorkoutGoal) * 100
            }
            size={100}
            trackColor={globalCustomisations.colors.light1}
            trackWidth={8}
          />
        </Div>
        <Div
          alignItems="center"
          bottom={0}
          h={100}
          justifyContent="center"
          position="absolute"
          right={0}
          w={100}
        >
          {weeklyWorkoutGoal ? (
            <Heading1 color="dark2">
              {workoutsCompletedThisWeek / weeklyWorkoutGoal > 1
                ? 100
                : Math.round((workoutsCompletedThisWeek / weeklyWorkoutGoal) * 100)}
              %
            </Heading1>
          ) : (
            <ParagraphLight color="dark2">No data</ParagraphLight>
          )}
        </Div>
      </Div>
    </Div>
  )
}

const MOST_POPULAR_TAGS = gql`
  query userMostPopularTags {
    userMostPopularTags {
      tag
      count
    }
  }
`

const WorkoutsPopularTags = () => {
  const { data: mostPopularTagsData } = useQuery(MOST_POPULAR_TAGS)
  const mostPopularTags = useMemo(
    () => mostPopularTagsData?.userMostPopularTags || [],
    [mostPopularTagsData],
  )

  return (
    <Div bg="steppenPurple20" flex={1} h={193} p={12} rounded={8}>
      <Div row alignItems="flex-start">
        <Div
          alignItems="center"
          bg="steppenPurple100"
          h={32}
          justifyContent="center"
          p={4}
          rounded="circle"
          w={32}
        >
          <DumbellWhiteIcon style={{ aspectRatio: 1, width: 20 }} />
        </Div>
        <Body color="dark2" flex={1} ml={8}>
          Your most popular tags
        </Body>
      </Div>
      <Div h={16} />
      {mostPopularTags.length === 0 && (
        <ParagraphLight color="dark2" mt={32} textAlign="center">
          No data
        </ParagraphLight>
      )}
      <Div alignItems="flex-start">
        {mostPopularTags?.map((item, index) => (
          <Div
            key={index}
            bg="steppenPurple10"
            borderColor="steppenDarkPurple"
            borderWidth={1}
            h={28}
            justifyContent="center"
            my={2}
            px={8}
            rounded="circle"
          >
            <Paragraph color="steppenDarkPurple">{item.tag}</Paragraph>
          </Div>
        ))}
      </Div>
    </Div>
  )
}

const WORKOUTS_MOST_PERFORMED = gql`
  query userMostPerformedWorkouts {
    userMostPerformedWorkouts {
      workout {
        id
        w_id
        title
        cover_image_uri
        level
        workoutExercises {
          pictureAddress
        }
      }
      completions
    }
  }
`

const WorkoutsMostPerformed = () => {
  const navigation = useNavigation()
  const { data: mostPerformedWorkoutsData } = useQuery(WORKOUTS_MOST_PERFORMED)
  const mostPerformedWorkouts = useMemo(
    () => mostPerformedWorkoutsData?.userMostPerformedWorkouts || [],
    [mostPerformedWorkoutsData],
  )

  const gotoWorkoutDetailPage = useCallback(
    (item) => {   
      navigation.push(screenLibrary.workouts.workoutDetail, {
        fromLocation: "workouts-most-performed",
        workout: JSON.stringify(item),
      })
    },
    [navigation],
  )

  return (
    <Div>
      <Heading3 color="dark2">Most performed workouts</Heading3>
      <Div bg="light2" px={16} py={16} rounded={8}>
        {mostPerformedWorkouts?.map((item, index) => (
          <Pressable onPress={() => gotoWorkoutDetailPage(item.workout)}>
          <Div key={index} row alignItems="center" flex={1} my={8}>
            <Div row alignItems="center" flex={1}>
              <BodyLight color="dark2" mr={16}>
                {(index + 1).toString()}
              </BodyLight>
              <FastImage
                resizeMode="cover"
                source={{
                  uri:
                    item.workout.cover_image_uri ||
                    item.workout.workoutExercises?.[0]?.pictureAddress,
                }}
                style={{ aspectRatio: 1, height: 48, borderRadius: 8 }}
              />
              <Paragraph color="dark2" flex={1} mx={8} numberOfLines={2}>
                {item.workout.title}
              </Paragraph>
            </Div>
            <Div alignItems="flex-end">
              <Heading3 color="alternateText80">{item.completions}</Heading3>
              <ParagraphLight color="dark4">times</ParagraphLight>
            </Div>
          </Div>
          </Pressable>
        ))}
      </Div>
    </Div>
  )
}

const WorkoutsScreen = () => {
  const [isShowingGoalModal, setIsShowingGoalModal] = useState(false)

  const { data: weeklyWorkoutGoalData } = useQuery(WEEKLY_WORKOUT_GOAL)
  const weeklyWorkoutGoal = useMemo(
    () => weeklyWorkoutGoalData?.getUser?.preference_weekly_workouts,
    [weeklyWorkoutGoalData],
  )

  const showGoalModal = useCallback(() => {
    setIsShowingGoalModal(true)
  }, [setIsShowingGoalModal])

  return (
    <StatsDetailsContainer
      Background={HeaderWorkoutsSvg}
      backgroundColor="steppenBlue100"
      title="Workouts"
    >
      <WorkoutsGraph weeklyWorkoutGoal={weeklyWorkoutGoal} onEditGoalPress={showGoalModal} />

      <Div h={32} />

      <Heading1 color="dark2">Highlights</Heading1>

      <Div h={16} />

      <WorkoutsBodyPartsPieChart />

      <Div h={16} />

      <Div row alignItems="center">
        <WorkoutsWeeklyGoal weeklyWorkoutGoal={weeklyWorkoutGoal} />

        <Div w={8} />

        <WorkoutsPopularTags />
      </Div>

      <Div h={32} />

      <WorkoutsMostPerformed />

      <SetWeeklyWorkoutGoalModal
        isVisible={isShowingGoalModal}
        setIsVisible={setIsShowingGoalModal}
      />
    </StatsDetailsContainer>
  )
}

export default memo(WorkoutsScreen)
