import { gql, useMutation } from "@apollo/client"
import { useNavigation } from "@react-navigation/core"
import { DateTime } from "luxon"
import React, { useCallback, useMemo, useRef } from "react"
import { Alert } from "react-native"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { Div, Dropdown, Icon, StatusBar } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import EllipsisButton from "component/common/Buttons/EllipsisButton"
import { snackbarRef } from "helper/globalSnackbarRef"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import ProfileEvents from "modules/userProfile/ProfileEvents"
import PageHeader from "theme/PageHeader"
import { Paragraph, Small } from "theme/Typography"

const DELETE_PROGRESS_PHOTO = gql`
  mutation deleteProgressPhoto($progressPhotoId: String!) {
    deleteProgressPhoto(id: $progressPhotoId)
  }
`

const ProgressPhotoDisplay = ({ progressPhoto }) => {
  const navigation = useNavigation()
  const { bottom } = useSafeAreaInsets()

  const [deleteProgressPhoto] = useMutation(DELETE_PROGRESS_PHOTO, {
    variables: {
      progressPhotoId: progressPhoto.id,
    },
    refetchQueries: ["getProgressPhotos"],
  })

  const datetime = useMemo(
    () => DateTime.fromJSDate(new Date(progressPhoto?.date || progressPhoto?.created_at)),
    [progressPhoto],
  )

  const confirmDelete = useCallback(() => {
    const deletePhoto = async () => {
      logAnalyticsEvent(ProfileEvents.DELETE_PROGRESS_PICTURE, { photoId: progressPhoto.id })
      await deleteProgressPhoto()
      navigation.goBack()
      requestAnimationFrame(() => {
        snackbarRef?.current?.show("Progress picture successfully removed", {
          duration: 3000,
        })
      })
    }

    Alert.alert("Are you sure?", "There's no undo for this!", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: deletePhoto, style: "destructive" },
    ])
  }, [deleteProgressPhoto, navigation, progressPhoto.id])

  const editDropdownRef = useRef()

  return (
    <Div bg="dark" h="100%" w="100%">
      <StatusBar barStyle="light-content" />
      <PageHeader
        backButtonProps={{
          iconProps: {
            color: "light1",
            name: "close",
            fontFamily: "Ionicons",
          },
          buttonProps: {
            bg: "rgba(0, 0, 0, 0.3)",
            ml: "baseMargin",
            h: 32,
            p: 0,
            w: 32,
            rounded: "circle",
          },
        }}
        containerProps={{
          position: "absolute",
          top: 0,
          zIndex: 10,
        }}
        suffix={
          <EllipsisButton
            buttonProps={{
              bg: "transparent",
            }}
            iconProps={{
              color: "light1",
              fontSize: "4xl",
              rounded: "circle",
            }}
            onPress={() => editDropdownRef.current.open()}
          />
        }
      />
      <FastImage
        resizeMode="contain"
        source={{ uri: progressPhoto.photo_uri }}
        style={{ flex: 1 }}
      />
      <Div bottom={0} position="absolute" w="100%">
        <LinearGradient colors={["rgba(0, 0, 0, 0)", "#000"]}>
          <Div p="baseMargin" pb={bottom || "baseMargin"} roundedTop={5} w="100%">
            <Div row alignItems="center">
              <Paragraph color="light">{datetime.toFormat("LLLL dd, yyyy")}</Paragraph>
              {progressPhoto.weight && (
                <>
                  <Icon color="light" fontFamily="Entypo" fontSize={24} name="dot-single" />
                  <Paragraph color="light">{progressPhoto.weight}kg</Paragraph>
                </>
              )}
            </Div>
            {progressPhoto.notes && (
              <Small color="light" mt="halfMargin">
                {progressPhoto.notes.trim()}
              </Small>
            )}
          </Div>
        </LinearGradient>
      </Div>

      <Dropdown ref={editDropdownRef}>
        <Dropdown.Option block onPress={confirmDelete}>
          Delete This Photo
        </Dropdown.Option>
      </Dropdown>
    </Div>
  )
}

export default ProgressPhotoDisplay
