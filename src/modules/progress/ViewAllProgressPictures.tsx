import { useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo } from "react"
import { ListRenderItem, RefreshControl, TouchableOpacity } from "react-native"
import FastImage from "react-native-fast-image"
import { FlatList } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import { Button, Div, Icon } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ProgressEvents } from "./progressEvents"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { GET_PROGRESS_PHOTOS, ProgressPhoto } from "modules/progress/progressTypes"
import { screenLibrary } from "navigation/screenLibrary"
import PageHeader from "theme/PageHeader"
import { ExtraSmall } from "theme/Typography"

const ViewAllProgressPictures = () => {
  const { bottom } = useSafeAreaInsets()
  const { navigate } = useNavigation()

  const { data, loading, refetch } = useQuery(GET_PROGRESS_PHOTOS, {
    notifyOnNetworkStatusChange: true,
  })

  const allProgressPhotos: ProgressPhoto[] = useMemo(() => {
    const progressEdges: any[] = data?.getProgressPhotos?.edges

    if (loading || !progressEdges.length) {
      return []
    }

    return progressEdges
      .filter((progressPic) => progressPic.photo_type === "progress")
      .map(({ photos, ...props }) => ({
        photo_uri: photos[0],
        ...props,
      }))
  }, [data?.getProgressPhotos?.edges, loading])

  const onViewProgressPhoto = useCallback(
    (progressPhotoId: string) => () => {
      logAnalyticsEvent(ProgressEvents.VIEW_PROGRESS_PIC_FROM_VIEW_ALL)
      navigate(screenLibrary.progressPhotos.view, { progressPhotoId })
    },
    [navigate],
  )

  const handleOnAddProgressPhoto = useCallback(() => {
    logAnalyticsEvent(ProgressEvents.ADD_PROGRESS_PIC_FROM_VIEW_ALL_PROGRESS_PICS)
    navigate(screenLibrary.progressPhotos.add)
  }, [navigate])

  const renderItem: ListRenderItem<ProgressPhoto> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ flex: 1, maxWidth: "33.4%" }}
        onPress={onViewProgressPhoto(item.id)}
      >
        <Div aspectRatio={0.6} mr={8} mt={8} overflow="hidden" rounded={8}>
          <FastImage
            resizeMode="cover"
            source={{ uri: item.photo_uri }}
            style={{ width: "100%", height: "100%" }}
          />
          <Div bottom={0} position="absolute" w="100%">
            <LinearGradient colors={["rgba(0, 0, 0, 0)", "#00000077"]}>
              <ExtraSmall color="light" p="halfMargin">
                {DateTime.fromJSDate(new Date(item.date || item.created_at)).toFormat("DD")}
              </ExtraSmall>
            </LinearGradient>
          </Div>
        </Div>
      </TouchableOpacity>
    ),
    [onViewProgressPhoto],
  )

  return (
    <Div bg="light1" flex={1}>
      <PageHeader border>Progress Pictures</PageHeader>
      <FlatList
        contentContainerStyle={{ paddingLeft: 8 }}
        data={allProgressPhotos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        renderItem={renderItem}
      />
      <Button
        alignItems="center"
        bg="aqua"
        bottom={bottom || 16}
        h={48}
        justifyContent="center"
        p={0}
        position="absolute"
        right={16}
        rounded="circle"
        w={48}
        onPress={handleOnAddProgressPhoto}
      >
        <Icon color="light" fontFamily="Ionicons" fontSize={32} name="add" />
      </Button>
    </Div>
  )
}

export default memo(ViewAllProgressPictures)
