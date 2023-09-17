import { gql } from "@apollo/client"

import { JourneyActivities } from "model/journey"

export type ProgressPhoto = {
  id: string
  photo_uri: string
  secondary_photo_uri?: string
  type?: JourneyActivities.PROGRESS_PIC | JourneyActivities.SELFIE
  created_at: number
  date: number
  notes: string
  weight: string
}

export const GET_PROGRESS_PHOTOS = gql`
  query getProgressPhotos {
    getProgressPhotos {
      edges {
        id
        date
        created_at
        photo_type
        photos
        weight
        notes
      }
    }
  }
`

export const GET_PROGRESS_PHOTO = gql`
  query getProgressPhoto($id: String!) {
    getProgressPhoto(id: $id) {
      id
      date
      created_at
      photo_type
      photos
      weight
      notes
    }
  }
`
