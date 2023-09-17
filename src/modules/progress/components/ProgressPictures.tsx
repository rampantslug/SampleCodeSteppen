import { useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { FC, memo, useCallback, useMemo, useState } from "react"
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { Div, Icon, Skeleton } from "react-native-magnus"

import TakePicture from "assets/icon/colored/progress-picture.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import ReminderSchedule from "modules/progress/components/ReminderSchedule"
import { ProgressEvents } from "modules/progress/progressEvents"
import { GET_PROGRESS_PHOTOS, ProgressPhoto } from "modules/progress/progressTypes"
import { screenLibrary } from "navigation/screenLibrary"
import { ExtraSmall, Heading1, Paragraph, Small } from "theme/Typography"

type MemoReturnType = {
  progressPhotos: ProgressPhoto[]
  shouldShowMore: boolean
}

type ProgressPictureProps = ProgressPhoto & { onPress: () => void; loading?: boolean }

export const ProgressPicture: FC<ProgressPictureProps> = memo(
  ({ onPress, photo_uri, date, created_at, loading, secondary_photo_uri }) => {
    const datetime = useMemo(
      () => DateTime.fromJSDate(new Date(date || created_at)),
      [created_at, date],
    )

    if (loading) {
      return <Skeleton.Box h={160} mb={8} mr={8} rounded={8} w={96} />
    }

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ marginBottom: 8, marginRight: 8 }}
        onPress={onPress}
      >
        <Div bg="light3" h={160} overflow="hidden" rounded={8} w={96}>
          {!!secondary_photo_uri && (
            <Div
              h={68}
              left={4}
              overflow="hidden"
              position="absolute"
              rounded={8}
              top={4}
              w={48}
              zIndex={2}
            >
              <FastImage
                resizeMode="cover"
                source={{ uri: secondary_photo_uri }}
                style={{ width: "100%", height: "100%" }}
              />
            </Div>
          )}
          <FastImage
            resizeMode="cover"
            source={{ uri: photo_uri }}
            style={{ width: "100%", height: "100%" }}
          />
          <Div bottom={0} position="absolute" w="100%">
            <LinearGradient colors={["rgba(0, 0, 0, 0)", "#00000077"]}>
              <ExtraSmall color="light" m="halfMargin">
                {datetime.toFormat("DD")}
              </ExtraSmall>
            </LinearGradient>
          </Div>
        </Div>
      </TouchableOpacity>
    )
  },
)

const ProgressPictures = () => {
  const [addLayoverVisible, setLayoverVisibility] = useState(false)
  const { navigate } = useNavigation()
  const { data, loading } = useQuery(GET_PROGRESS_PHOTOS)

  const { progressPhotos, shouldShowMore }: MemoReturnType = useMemo(() => {
    const progressEdges: any[] = data?.getProgressPhotos?.edges

    if (loading || !progressEdges.length) {
      return {
        allProgressPhotos: [],
        progressPhotos: [],
        shouldShowMore: false,
      }
    }

    const allPhotos: ProgressPhoto[] = [...progressEdges]
      .filter((photo) => photo.photo_type === "progress")
      .sort((a, b) => (b.date || b.created_at) - (a.date || a.created_at))
      .map(({ photos, ...photo }) => ({
        photo_uri: photos[0],
        ...photo,
      }))

    return {
      allProgressPhotos: allPhotos,
      progressPhotos: allPhotos.slice(0, 5),
      shouldShowMore: allPhotos.length > 5,
    }
  }, [data?.getProgressPhotos?.edges, loading])

  const handleOnAddProgressPhoto = useCallback(
    (event: ProgressEvents) => () => {
      logAnalyticsEvent(event)
      navigate(screenLibrary.progressPhotos.add)
    },
    [navigate],
  )

  const onViewProgressPhoto = useCallback(
    (progressPhotoId: string) => () => {
      logAnalyticsEvent(ProgressEvents.VIEW_PROGRESS_PIC_FROM_PROGRESS_TAB_LIST)
      navigate(screenLibrary.progressPhotos.view, { progressPhotoId })
    },
    [navigate],
  )

  const onViewMore = useCallback(() => {
    logAnalyticsEvent(ProgressEvents.VIEW_ALL_PROGRESS_PICS_FROM_PROGRESS_TAB_LIST_SEE_ALL)
    navigate(screenLibrary.progressPhotos.viewAll)
  }, [navigate])

  const handleOnScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setLayoverVisibility(event.nativeEvent.contentOffset.x >= 100)
  }, [])

  const renderItem: ListRenderItem<ProgressPhoto> = useCallback(
    ({ item }) => <ProgressPicture {...item} onPress={onViewProgressPhoto(item.id)} />,
    [onViewProgressPhoto],
  )

  const Header = useMemo(() => {
    return (
      <Div row alignItems="center" h={160} ml="baseMargin" mr="halfMargin">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleOnAddProgressPhoto(ProgressEvents.ADD_PROGRESS_PIC_FROM_HEADER_BUTTON)}
        >
          <Div alignItems="center" bg="aqua" h={48} justifyContent="center" rounded="circle" w={48}>
            <Icon color="light" fontFamily="Ionicons" fontSize={36} name="add" />
          </Div>
        </TouchableOpacity>
        {!progressPhotos.length && !loading && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ marginLeft: 8 }}
            onPress={handleOnAddProgressPhoto(ProgressEvents.ADD_PROGRESS_PIC_FROM_HEADER_BUTTON)}
          >
            <Div bg="steppenPurple10" h={160} overflow="hidden" rounded={8} w={96}>
              <Div alignItems="center" h={80} justifyContent="center" w={96}>
                <Div h={48} w={48}>
                  <TakePicture />
                </Div>
              </Div>
              <Div bg="steppenPurple60" h={80} p="halfMargin" w={96}>
                <Small color="light">Add your first progress picture to see it here!</Small>
              </Div>
            </Div>
          </TouchableOpacity>
        )}
      </Div>
    )
  }, [handleOnAddProgressPhoto, loading, progressPhotos.length])

  const Footer = useMemo(() => {
    if (!shouldShowMore) return null

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ marginBottom: 8, marginRight: 8 }}
        onPress={onViewMore}
      >
        <Div
          alignItems="center"
          bg="light3"
          h={160}
          justifyContent="center"
          overflow="hidden"
          rounded={8}
          w={96}
        >
          <Div
            alignItems="center"
            bg="light"
            h={32}
            justifyContent="center"
            mb="halfMargin"
            rounded="circle"
            w={32}
          >
            <Icon color="dark2" fontFamily="AntDesign" fontSize="md" name="arrowright" />
          </Div>
          <Paragraph textAlign="center">See all my pictures</Paragraph>
        </Div>
      </TouchableOpacity>
    )
  }, [onViewMore, shouldShowMore])

  const LayoverAddButton = useMemo(() => {
    if (!addLayoverVisible) return null

    return (
      <Div
        alignItems="center"
        bg="light"
        h={48}
        justifyContent="center"
        position="absolute"
        roundedRight="circle"
        w={48}
        zIndex={2}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleOnAddProgressPhoto(ProgressEvents.ADD_PROGRESS_PIC_FROM_FLOATING_BUTTON)}
        >
          <Div alignItems="center" bg="aqua" h={36} justifyContent="center" rounded="circle" w={36}>
            <Icon color="light" fontFamily="Ionicons" fontSize={28} name="add" />
          </Div>
        </TouchableOpacity>
      </Div>
    )
  }, [addLayoverVisible, handleOnAddProgressPhoto])

  const Loading = useMemo(
    () => (
      <Div row mb="baseMargin">
        {Header}
        <Skeleton.Box h={160} mr="halfMargin" rounded={8} w={96} />
        <Skeleton.Box h={160} mr="halfMargin" rounded={8} w={96} />
        <Skeleton.Box h={160} mr="halfMargin" rounded={8} w={96} />
      </Div>
    ),
    [Header],
  )

  return (
    <>
      <Div row alignItems="center" justifyContent="space-between" m="baseMargin">
        <Heading1>Progress Pictures</Heading1>
        <Div row>
          <Small color="dark4">Private</Small>
          <Icon color="dark4" fontFamily="MaterialIcons" fontSize={16} ml={4} name="lock-outline" />
        </Div>
      </Div>
      <ReminderSchedule />
      {loading ? (
        Loading
      ) : (
        <Div row alignItems="center" mb="baseMargin">
          {LayoverAddButton}
          <FlatList
            horizontal
            data={progressPhotos}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={Footer}
            ListHeaderComponent={Header}
            renderItem={renderItem}
            scrollEventThrottle={50}
            showsHorizontalScrollIndicator={false}
            onScroll={handleOnScroll}
          />
        </Div>
      )}
    </>
  )
}

export default memo(ProgressPictures)
