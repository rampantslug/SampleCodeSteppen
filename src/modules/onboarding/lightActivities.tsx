import React from "react"

import JoggingSvg from "assets/img/activitiesWithCircleBackground/jogging.svg"
import LungesSvg from "assets/img/activitiesWithCircleBackground/lunges.svg"
import PlankSvg from "assets/img/activitiesWithCircleBackground/plank.svg"
import PushUpSvg from "assets/img/activitiesWithCircleBackground/push-up.svg"
import SitUpSvg from "assets/img/activitiesWithCircleBackground/sit-up.svg"
import SquatsSvg from "assets/img/activitiesWithCircleBackground/squats.svg"
import WalkingSvg from "assets/img/activitiesWithCircleBackground/walking.svg"
import YogaPoseSvg from "assets/img/activitiesWithCircleBackground/yoga-pose.svg"

export const ACTIVITIES = [
  {
    image: <SitUpSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Do 5 sit ups",
    backgroundColor: "#FFC466",
  },
  {
    image: <PushUpSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Do 3 push ups",
    backgroundColor: "#016D77",
  },
  {
    image: <WalkingSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Stand up and walk around",
    backgroundColor: "#56A0FA",
  },
  {
    image: <YogaPoseSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Touch your toes 3 times",
    backgroundColor: "#FF7F61",
  },
  {
    image: <PlankSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Plank for 15 seconds",
    backgroundColor: "#703EC2",
  },
  {
    image: <SquatsSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Do 5 squats",
    backgroundColor: "#6FDECB",
  },
  {
    image: <LungesSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Do 5 lunges",
    backgroundColor: "#3843D0",
  },
  {
    image: <JoggingSvg style={{ aspectRatio: 1 }} width="100%" />,
    text: "Jog on the spot for 15 seconds",
    backgroundColor: "#666666",
  },
]
