import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { memo, useLayoutEffect, useState } from "react"
import { Icon } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import JourneyDashboard from "modules/journey/JourneyDashboard"
import { MyfitDashboard } from "modules/myfit/screens/Dashboard"
import { NotInJourneyDashboard } from "modules/notInJourney/NotInJourneyDashboard"
import StatsProgressScreen from "modules/progress/StatsProgressScreen"
import { MyProfile } from "modules/userProfile/MyProfile"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"

const INITIAL_ROUTE_NAMES = {
  [screenLibrary.tabs.calendar]: screenLibrary.tabCalendar.dashboard,
  [screenLibrary.tabs.account]: screenLibrary.tabAccount.main,
  [screenLibrary.tabs.discovery]: screenLibrary.tabMyfit.main,
  [screenLibrary.tabs.myJourney]: screenLibrary.tabMyJourney.dashboard,
  [screenLibrary.tabs.progress]: screenLibrary.tabProgress.main,
}

const TabScreenDiscovery = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAMES[screenLibrary.tabs.discovery]}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen component={MyfitDashboard} name={screenLibrary.tabMyfit.main} />
    </Stack.Navigator>
  )
}

const TabScreenMyJourney = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAMES[screenLibrary.tabs.myJourney]}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen
        component={JourneyDashboard}
        name={screenLibrary.tabMyJourney.dashboard}
        options={({ route: { params } }) => ({
          animation: params?.noAnimation ? "none" : "default",
        })}
      />
    </Stack.Navigator>
  )
}

const TabScreenCalendar = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAMES[screenLibrary.tabs.calendar]}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen
        component={NotInJourneyDashboard}
        name={screenLibrary.tabCalendar.dashboard}
        options={({ route: { params } }) => ({
          animation: params?.noAnimation ? "none" : "default",
        })}
      />
    </Stack.Navigator>
  )
}

const TabScreenProfile = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAMES[screenLibrary.tabs.account]}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen component={MyProfile} name={screenLibrary.tabAccount.main} />
    </Stack.Navigator>
  )
}

const TabScreenProgress = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAMES[screenLibrary.tabs.progress]}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen component={StatsProgressScreen} name={screenLibrary.tabProgress.main} />
    </Stack.Navigator>
  )
}

const DiscoveryIcon = ({ color }) => (
  <Icon color={color} fontFamily="Ionicons" fontSize={20} name="search" />
)
const CalendarIcon = ({ color }) => (
  <Icon color={color} fontFamily="Ionicons" fontSize={20} name="calendar-outline" />
)
const MyJourneyIcon = ({ color }) => (
  <Icon color={color} fontFamily="Ionicons" fontSize={20} name="location-outline" />
)
const ProfileIcon = ({ color }) => (
  <Icon color={color} fontFamily="Ionicons" fontSize={20} name="person-outline" />
)
const ProgressIcon = ({ color }) => (
  <Icon color={color} fontFamily="Ionicons" fontSize={20} name="stats-chart" />
)

const Tab = createBottomTabNavigator()

const hideTabBar = (state) => {
  if (!state) {
    return false
  }

  const route = state.routes[state.index]

  if (!route) {
    return false
  }

  if (route.params?.noTabBar) {
    return true
  } else {
    return hideTabBar(route.state)
  }
}

export const MainTabs = memo(({ navigation }) => {
  const insets = useSafeAreaInsets()

  const [showing, setShowing] = useState(true)

  const state = navigation.getState()

  useLayoutEffect(() => {
    if (hideTabBar(state)) {
      logAnalyticsEvent("hiding-tab-bar", { state })
      setShowing(false)
    }
  }, [state])

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: globalCustomisations.colors.aqua100,
        tabBarStyle: {
          display: showing ? undefined : "none",
          paddingBottom: insets.bottom > 0 ? 25 : 6,
        },
      }}
    >
      {global.userSegment !== "guided-experience" && (
        <Tab.Screen
          component={TabScreenCalendar}
          name={screenLibrary.tabs.calendar}
          options={{
            tabBarIcon: CalendarIcon,
            title: "Calendar",
          }}
        />
      )}
      <Tab.Screen
        component={TabScreenMyJourney}
        name={screenLibrary.tabs.myJourney}
        options={{
          tabBarIcon: MyJourneyIcon,
          title: "Journey",
        }}
      />
      {global.userSegment === "guided-experience" && (
        <Tab.Screen
          component={TabScreenCalendar}
          name={screenLibrary.tabs.calendar}
          options={{
            tabBarIcon: CalendarIcon,
            title: "Calendar",
          }}
        />
      )}
      <Tab.Screen
        component={TabScreenProgress}
        name={screenLibrary.tabs.progress}
        options={{
          tabBarIcon: ProgressIcon,
          title: "Progress",
        }}
      />
      <Tab.Screen
        component={TabScreenDiscovery}
        name={screenLibrary.tabs.discovery}
        options={{
          tabBarIcon: DiscoveryIcon,
          title: "Discovery",
        }}
      />
      <Tab.Screen
        component={TabScreenProfile}
        name={screenLibrary.tabs.account}
        options={{
          tabBarIcon: ProfileIcon,
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  )
})
