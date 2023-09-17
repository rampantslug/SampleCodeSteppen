import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo, useState } from "react"
import { Pressable } from "react-native"
import FastImage from "react-native-fast-image"
import { Div, Icon } from "react-native-magnus"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { screenLibrary } from "navigation/screenLibrary"
import theme from "theme/globalCustomisations"
import { Heading1, Paragraph, Small } from "theme/Typography"

export const SELFIE_LIST_FRAGMENT = gql`
  fragment SelfieListFragment on ProgressPhoto {
    id
    created_at
    date
    photo_type
    photos
    thumbnails
  }
`

const GET_SELFIES = gql`
  ${SELFIE_LIST_FRAGMENT}
  query getSelfies {
    getProgressPhotos {
      edges {
        ...SelfieListFragment
      }
    }
  }
`

const SweatySelfies = () => {
  const navigation = useNavigation()

  const { data: selfiesData } = useQuery(GET_SELFIES)

  const selfies = useMemo(() => {
    const rawPhotos = selfiesData?.getProgressPhotos?.edges

    if (!rawPhotos) return null

    const selfiesOnly = rawPhotos.filter((photo) => photo.photo_type === "sweaty-selfie")
    const selfiesWithDates = selfiesOnly.map((photo) => ({
      ...photo,
      datetime: photo.date ? DateTime.fromSQL(photo.date) : DateTime.fromMillis(photo.created_at),
      uri: photo.thumbnails[0] || photo.photos[0],
    }))

    return selfiesWithDates
  }, [selfiesData])

  const [monthDiff, setMonthDiff] = useState(0)

  const startOfMonth = useMemo(() => {
    const monthDate = DateTime.now().minus({ months: monthDiff })
    return monthDate.startOf("month")
  }, [monthDiff])
  const endOfMonth = useMemo(() => startOfMonth.endOf("month"), [startOfMonth])

  const todayDay = useMemo(() => DateTime.now().day, [])
  const todayMonth = useMemo(() => DateTime.now().month, [])

  const hasSelfieToday = useMemo(
    () =>
      selfies?.find((selfie) =>
        selfie.datetime.startOf("day").equals(DateTime.now().startOf("day")),
      ) != null,
    [selfies],
  )

  const daysInMonth = useMemo(
    () => Math.round(endOfMonth.diff(startOfMonth, "days").days),
    [endOfMonth, startOfMonth],
  )

  const days = useMemo(() => {
    const startOfMonthWeekDay = startOfMonth.weekday
    const endOfMonthWeekDay = endOfMonth.weekday
    return Array.from(Array(startOfMonthWeekDay - 1))
      .concat(Array.from(Array(daysInMonth), (_, i) => i + 1))
      .concat(Array.from(Array(7 - endOfMonthWeekDay)))
  }, [daysInMonth, endOfMonth, startOfMonth])

  const monthSelfiesMap = useMemo(() => {
    if (!selfies) return {}

    const monthPhotos = selfies.filter((photo) =>
      photo.datetime.startOf("month").equals(startOfMonth),
    )

    return Object.fromEntries(monthPhotos.map((photo) => [photo.datetime.day, photo]))
  }, [selfies, startOfMonth])

  const changeMonth = useCallback(
    (diff) => {
      logAnalyticsEvent("progressSelfies-changeMonth", { diff, monthDiff })
      setMonthDiff((prev) => prev + diff)
    },
    [monthDiff],
  )

  const makeGotoSelfie = useCallback(
    (id) => {
      if (id) {
        return () => navigation.navigate(screenLibrary.selfies.showSelfie, { id })
      }
    },
    [navigation],
  )

  return (
    <>
      <Div row alignItems="center" justifyContent="space-between" m="baseMargin">
        <Heading1>Sweaty Selfies</Heading1>
        <Icon color="dark4" fontFamily="MaterialIcons" fontSize={16} ml={4} name="lock-outline" />
      </Div>

      <Div bg="light2" mb={15} mx="baseMargin" py={10} rounded={6}>
        <Div row justifyContent="center">
          <Div
            row
            alignItems="center"
            alignSelf="center"
            bg="steppenPurple60"
            px={2}
            py={3}
            rounded={12}
          >
            <Pressable hitSlop={5} onPress={() => changeMonth(1)}>
              <Icon
                color="light1"
                fontFamily="FontAwesome"
                fontSize={10}
                ml={4}
                name="chevron-left"
              />
            </Pressable>
            <Div w={10} />
            <Small color="light1" minW={70} textAlign="center">
              {startOfMonth.monthLong}
            </Small>
            <Div w={10} />
            {startOfMonth.month !== todayMonth ? (
              <Pressable hitSlop={5} onPress={() => changeMonth(-1)}>
                <Icon
                  color="light1"
                  fontFamily="FontAwesome"
                  fontSize={10}
                  mr={4}
                  name="chevron-right"
                />
              </Pressable>
            ) : (
              <Div w={11} />
            )}
          </Div>

          {!hasSelfieToday && (
            <Div position="absolute" right={15}>
              <Pressable
                hitSlop={5}
                onPress={() => navigation.navigate(screenLibrary.selfies.promptSelfie)}
              >
                <Icon color="dark" fontFamily="Feather" fontSize={20} name="plus" />
              </Pressable>
            </Div>
          )}
        </Div>

        <Div row alignItems="center" flexWrap="wrap">
          {days.map((day, index) => (
            <Pressable
              key={`${monthDiff}-${index}`}
              style={{ height: 50, width: `${100 / 7}%` }}
              onPress={makeGotoSelfie(monthSelfiesMap[day]?.id)}
            >
              <Div alignItems="center" h="100%" justifyContent="center" w="100%">
                {monthSelfiesMap[day] && (
                  <Div h="100%" position="absolute" px={6} py={2} w="100%">
                    <FastImage
                      resizeMode="cover"
                      source={{ uri: monthSelfiesMap[day].uri }}
                      style={{
                        borderColor: theme.colors.aqua100,
                        borderWidth:
                          day === todayDay && startOfMonth.month === todayMonth ? 2 : undefined,
                        borderRadius: 4,
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Div>
                )}

                {!day ? undefined : day === todayDay &&
                  startOfMonth.month === todayMonth &&
                  !monthSelfiesMap[day] ? (
                  <Div aspectRatio={1} bg="aqua" p={6} rounded={100}>
                    <Paragraph color="light1" textAlign="center">
                      {day}
                    </Paragraph>
                  </Div>
                ) : (
                  <Paragraph
                    color={monthSelfiesMap[day] ? "light1" : "dark2"}
                    fontWeight={monthSelfiesMap[day] ? "700" : undefined}
                    textAlign="center"
                  >
                    {day}
                  </Paragraph>
                )}
              </Div>
            </Pressable>
          ))}
        </Div>
      </Div>
    </>
  )
}

export default memo(SweatySelfies)
