import { useQuery } from "@apollo/client"
import { useRoute } from "@react-navigation/native"
import React, { useMemo } from "react"
import { MaterialIndicator } from "react-native-indicators"
import PagerView from "react-native-pager-view"

import { GET_PROGRESS_PHOTOS, ProgressPhoto } from "./progressTypes"
import ProgressPhotoDisplay from "modules/progress/components/ProgressPhotoDisplay"
import globalCustomisations from "theme/globalCustomisations"
import { Page } from "theme/Page"

const useViewProgressPhotos = () => {
  const { data, loading: isLoading } = useQuery(GET_PROGRESS_PHOTOS)

  const progressPhotos: ProgressPhoto[] = useMemo(() => {
    const progressEdges = data?.getProgressPhotos?.edges
    if (!progressEdges) {
      return []
    }

    return progressEdges
      .filter((progressPic) => progressPic.photo_type === "progress")
      .map((progressPic: any) => ({
        ...progressPic,
        photo_uri: progressPic.photos[0],
      }))
  }, [data])

  return {
    progressPhotos,
    isLoading,
  }
}

const ViewProgressPhotos = () => {
  const route = useRoute()
  const progressPhotoId = route.params?.progressPhotoId
  const { progressPhotos, isLoading } = useViewProgressPhotos()

  const initialPagerViewIndex = useMemo(() => {
    const index = progressPhotos.findIndex((photo) => photo.id === progressPhotoId)
    return index === -1 ? 0 : index
  }, [progressPhotos, progressPhotoId])

  return (
    <Page>
      {isLoading && !progressPhotos.length ? (
        <MaterialIndicator color={globalCustomisations.colors.aqua100} />
      ) : (
        <PagerView
          scrollEnabled
          initialPage={initialPagerViewIndex}
          orientation="horizontal"
          style={{ height: "100%", width: "100%" }}
        >
          {progressPhotos.map((progressPhoto) => (
            <ProgressPhotoDisplay key={progressPhoto.id} progressPhoto={progressPhoto} />
          ))}
        </PagerView>
      )}
    </Page>
  )
}

export default ViewProgressPhotos
