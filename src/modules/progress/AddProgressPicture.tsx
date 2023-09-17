import { gql, useMutation, useQuery } from "@apollo/client"
import { useNavigation, useRoute } from "@react-navigation/native"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Div, Icon } from "react-native-magnus"
import Uuid from "uuid"

import ActionSquareMediaSelector from "component/common/ActionsSquares/ActionSquareMediaSelector"
import TextInput from "component/common/Input/BaseTextInput"
import Datepicker from "component/common/Input/Datepicker"
import { snackbarRef } from "helper/globalSnackbarRef"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { logException } from "helper/logError"
import { SelectedMedia } from "hooks/useMediaSelector"
import { fileHelpers, useVideoUpload } from "modules/fileUploads"
import { useJourneyActivity } from "modules/journey/journeyActivity"
import ProfileEvents from "modules/userProfile/ProfileEvents"
import { screenLibrary } from "navigation/screenLibrary"
import { PageBackButton } from "theme/PageBackButton"
import PageHeader from "theme/PageHeader"
import { ParagraphHeavy } from "theme/Typography"

const ADD_PROGRESS_PICTURE = gql`
  mutation createProgressPhoto($input: CreateProgressPhotoInputType!) {
    createProgressPhoto(input: $input) {
      success
    }
  }
`

const useAddProgressPicture = (
  disableGoBackOnCreate: boolean,
  originallyHadProgressPhotos: boolean,
) => {
  const navigation = useNavigation()

  const [notes, setNotes] = useState("")
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(new Date())

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addProgressPhotoMutation] = useMutation(ADD_PROGRESS_PICTURE, {
    refetchQueries: ["getProgressPhotos", "userDayActivities"],
  })
  const [selectedImage, setSelectedImage] = useState<SelectedMedia | undefined>()
  const { uploadVideo, uploadedMediaUrl } = useVideoUpload()
  const [progressPhotoId] = useState(Uuid.v4())

  const handleOnSetSelectedImage = useCallback((mediaData: any) => {
    logAnalyticsEvent(ProfileEvents.PROGRESS_PICTURE_IMAGE_ADDED, {
      mediaData,
    })
    setSelectedImage(mediaData)
  }, [])

  const onComplete = useCallback(() => {
    setIsSubmitting(false)
    logAnalyticsEvent("progress-photos-created-progress-photo-success")
    if (!disableGoBackOnCreate) {
      navigation.goBack()

      if (!originallyHadProgressPhotos) {
        navigation.navigate(screenLibrary.modals.firstProgressPhoto)
      }
    }
    requestAnimationFrame(() => {
      snackbarRef?.current?.show("Progress picture successfully added", {
        duration: 3000,
      })
    })
  }, [disableGoBackOnCreate, navigation, originallyHadProgressPhotos])

  const onSubmit = useCallback(
    async (isRetry?: boolean) => {
      if (!selectedImage || !selectedImage?.safeUri) {
        Alert.alert("Please select an image")
        return
      }

      setIsSubmitting(true)

      /**
       * If we're trying again because the mutation failed, we don't want to re-upload
       * the image, this is why we're grabbing it from the state
       */
      let uploadedPhotoUrl = uploadedMediaUrl

      try {
        if (!isRetry) {
          const fileExtension = fileHelpers.getExtensionFromUri(selectedImage.uri)
          const [photoUrl, err] = await uploadVideo(selectedImage.safeUri, {
            fileName: `${progressPhotoId}.${fileExtension}`,
            uploadType: "PROGRESS_PHOTO",
          })

          if (err) {
            Alert.alert("Issue with upload", "Try again", [
              {
                text: "Cancel",
                onPress: () => {
                  logException(new Error(err), {
                    progressPhotoId,
                  })
                  logAnalyticsEvent("progress-photos-issue-with-upload-try-again-no")
                },
                style: "cancel",
              },
              {
                text: "Try Again",
                onPress: () => {
                  onSubmit(false)
                  logAnalyticsEvent("progress-photos-issue-with-upload-try-again-yes")
                },
              },
            ])
            setIsSubmitting(false)
            return
          }

          uploadedPhotoUrl = photoUrl
        }

        const input: any = {
          id: progressPhotoId,
          photos: [uploadedPhotoUrl],
        }

        if (notes) input.notes = notes
        if (weight) input.weight = parseInt(weight, 10)
        input.date = date

        await addProgressPhotoMutation({
          variables: {
            input,
          },
        })

        onComplete()
      } catch (err) {
        logException(err, {
          progressPhotoId,
        })
        logAnalyticsEvent("progress-photos-created-progress-photo-error")
        Alert.alert("Issue with creation", "Try again", [
          {
            text: "Cancel",
            onPress: () => {
              logException(err, {
                progressPhotoId,
              })
            },
            style: "cancel",
          },
          {
            text: "Try Again",
            onPress: () => {
              onSubmit(true)
            },
          },
        ])
        setIsSubmitting(false)
        return
      }
    },
    [
      addProgressPhotoMutation,
      date,
      notes,
      onComplete,
      progressPhotoId,
      selectedImage,
      uploadVideo,
      uploadedMediaUrl,
      weight,
    ],
  )

  return {
    onSubmit,
    isSubmitting,
    progressPhotoId,
    setSelectedImage: handleOnSetSelectedImage,
    date,
    notes,
    weight,
    setDate,
    setNotes,
    setWeight,
  }
}

const GET_PROGRESS_PHOTOS = gql`
  query getProgressPhotos {
    getProgressPhotos {
      edges {
        id
      }
    }
  }
`

const AddProgressPicture = () => {
  const navigation = useNavigation()

  const { params } = useRoute<any>()
  const { is_in_journey } = useMemo(() => params || {}, [params])

  const { data: progressPhotosData, loading: progressPhotosDataLoading } =
    useQuery(GET_PROGRESS_PHOTOS)
  const [originallyHadProgressPhotos, setOriginallyHadProgressPhotos] = useState(undefined)

  useEffect(() => {
    if (!progressPhotosDataLoading) {
      const hasPics = progressPhotosData?.getProgressPhotos?.edges?.length > 0

      setOriginallyHadProgressPhotos(hasPics)

      logAnalyticsEvent("add-progress-picture-screen", { hasPics })
    }
  }, [progressPhotosData, progressPhotosDataLoading])

  const { moveToNextActivity } = useJourneyActivity()

  const {
    onSubmit,
    isSubmitting,
    setSelectedImage,
    progressPhotoId,
    notes,
    weight,
    setWeight,
    setNotes,
    date,
    setDate,
  } = useAddProgressPicture(is_in_journey, originallyHadProgressPhotos)

  const handleOnFieldChange = useCallback(
    (ampEvent: string, callback: (...params: any) => void) =>
      (...event: any[]) => {
        callback(...event)
        logAnalyticsEvent(ampEvent)
      },
    [],
  )

  const BackOrCloseButton = useMemo(() => {
    return is_in_journey ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate(screenLibrary.tabMyJourney.dashboard)}
      >
        <Icon color="dark2" fontFamily="Ionicons" fontSize="4xl" ml={16} name="close" />
      </TouchableOpacity>
    ) : (
      <PageBackButton />
    )
  }, [is_in_journey, navigation])

  const uploadImage = useCallback(async () => {
    await onSubmit(false)

    if (is_in_journey) {
      await moveToNextActivity({ activityNotes: JSON.stringify({ id: progressPhotoId }) })
    }
  }, [is_in_journey, moveToNextActivity, onSubmit, progressPhotoId])

  return (
    <Div bg="light" flex={1}>
      <PageHeader
        border
        prefix={BackOrCloseButton}
        suffix={
          <Button bg="transparent" loaderColor="aqua" loading={isSubmitting} onPress={uploadImage}>
            <ParagraphHeavy color="aqua">Upload</ParagraphHeavy>
          </Button>
        }
      >
        Add Progress Picture
      </PageHeader>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Div row h={200} p="baseMargin">
          <ActionSquareMediaSelector
            actionSquareProps={{
              containerProps: {
                w: "35%",
                mr: "baseMargin",
                rounded: 8,
              },
              iconProps: {
                fontFamily: "SimpleLineIcons",
                name: "camera",
                alignSelf: "center",
                fontSize: 60,
              },
              label: "Upload",
            }}
            fromLocation="progress-photos"
            onChange={setSelectedImage}
          />
          <Div flex={1}>
            <TextInput
              isOptional
              multiline
              containerProps={{
                flex: 2,
                mb: 0,
              }}
              placeholder="Your note (optional)"
              style={{ padding: 0, paddingTop: 4, backgroundColor: "white", height: "100%" }}
              value={notes}
              onChangeText={handleOnFieldChange(
                ProfileEvents.PROGRESS_PICTURE_NOTE_ADDED,
                setNotes,
              )}
            />
          </Div>
        </Div>
        <Div mt="baseMargin" mx="baseMargin">
          <TextInput
            isOptional
            multiline
            keyboardType="decimal-pad"
            label="Weight"
            placeholder="Your current weight or PB lifted"
            value={weight}
            onChangeText={handleOnFieldChange(
              ProfileEvents.PROGRESS_PICTURE_WEIGHT_ADDED,
              setWeight,
            )}
          />
          <Datepicker
            label="Date"
            value={date}
            onSetDate={handleOnFieldChange(ProfileEvents.PROGRESS_PICTURE_DATE_CHANGED, setDate)}
          />
        </Div>
      </KeyboardAwareScrollView>
    </Div>
  )
}

export default memo(AddProgressPicture)
