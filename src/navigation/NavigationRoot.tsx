import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"

import CalendarActivityMood from "modules/calendarV2/completion/CalendarActivityMood"
import CompleteScheduledActivityV2 from "modules/calendarV2/completion/CompleteScheduledActivityV2"
import PostCalendarActivityComplete from "modules/calendarV2/completion/PostCalendarActivityComplete"
import TrackActivityScreen from "modules/calendarV2/completion/TrackActivityScreen"
import EditDeleteScheduledActivity from "modules/calendarV2/scheduleSelectedActivity/EditDeleteScheduledActivity"
import { ChallengeDrilldown } from "modules/challenges/screens/ChallengeDrilldown"
import { ChatbotScreen } from "modules/chatbot/ChatbotScreen"
import { DiscountOfferModal } from "modules/discounts/DiscountOfferModal"
import ActivityComplete from "modules/doActivity/ActivityComplete"
import ActivityMood from "modules/doActivity/ActivityMood"
import DoActivity from "modules/doActivity/DoActivity"
import { StartActivity } from "modules/doActivity/StartActivity"
import { FoodCategoryScreen } from "modules/food/CategoryScreen"
import JourneySelectionExplanation from "modules/journey/JourneySelectionExplanation"
import Badge from "modules/journey/pages/Badge"
import { ChallengeAndRewards } from "modules/journey/pages/ChallengeAndRewards"
import ComingSoon from "modules/journey/pages/ComingSoon"
import { Day1Explainer } from "modules/journey/pages/Day1Explainer"
import { Day1ProgressPicBreaker } from "modules/journey/pages/Day1ProgressPicBreaker"
import { Day1WorkoutExplainer } from "modules/journey/pages/Day1WorkoutExplainer"
import Day2Explainer from "modules/journey/pages/Day2Explainer"
import { Day3Explainer } from "modules/journey/pages/Day3Explainer"
import { Day4Explainer } from "modules/journey/pages/Day4Explainer"
import { Day5Explainer } from "modules/journey/pages/Day5Explainer"
import Day6Explainer from "modules/journey/pages/Day6Explainer"
import Day7Explainer, { Day7ExplainerBreaker } from "modules/journey/pages/Day7Explainer"
import JourneyTransformation from "modules/journey/pages/Day7ProgressBreakers/JourneyTransformation"
import TransformationTime from "modules/journey/pages/Day7ProgressBreakers/TransformationTime"
import { DiscoveredWorkoutsSelection } from "modules/journey/pages/DiscoveredWorkoutsSelection"
import { DiscoveryExplainer } from "modules/journey/pages/DiscoveryExplainer"
import { DiscoveryPreferences } from "modules/journey/pages/DiscoveryPreferences"
import JourneyDay7Summary from "modules/journey/pages/JourneyDay7Summary"
import JourneyDaySummary from "modules/journey/pages/JourneyDaySummary"
import { JourneyExplainer } from "modules/journey/pages/JourneyExplainer"
import JourneyNextDayExplainer from "modules/journey/pages/JourneyNextDayExplainer"
import { JourneyWorkoutFlow } from "modules/journey/pages/JourneyWorkoutFlow"
import { JourneyWorkoutPreview } from "modules/journey/pages/JourneyWorkoutPreview"
import { Reward } from "modules/journey/pages/Reward"
import WhatYouLearnt from "modules/journey/pages/WhatYouLearnt"
import { WorkoutCompletion } from "modules/journey/pages/WorkoutCompletion"
import { MotivationEditTimeScreen } from "modules/motivation/MotivationEditTimeScreen"
import { MotivationScreen } from "modules/motivation/MotivationScreen"
import { MotivationSplashScreen } from "modules/motivation/MotivationSplashScreen"
import { PersonalisedRecommendations } from "modules/myfit/screens/PersonalisedRecommendations"
import { PremiumCategory } from "modules/myfit/screens/PremiumCategory"
import RemindersScreen from "modules/myfit/screens/Reminders"
import { StandardCategory } from "modules/myfit/screens/StandardCategory"
import { NotificationsPushClickThroughScreen } from "modules/notifications/pushClickThrough"
import CalendarStreak from "modules/notInJourney/CalendarStreak"
import ActivityStarted from "modules/notInJourney/completeActivityNow/ActivityStarted"
import ActivitySummary from "modules/notInJourney/completeActivityNow/ActivitySummary"
import CompleteActivityNow from "modules/notInJourney/completeActivityNow/CompleteActivityNow"
import DoActivityNowMood from "modules/notInJourney/completeActivityNow/DoActivityNowMood"
import FinalizeActivity from "modules/notInJourney/completeActivityNow/FinalizeActivity"
import CompleteScheduledActivity from "modules/notInJourney/CompleteScheduledActivity"
import SelectWorkoutType from "modules/notInJourney/completeWorkoutNow/SelectWorkoutType"
import WorkoutOffSteppen from "modules/notInJourney/completeWorkoutNow/WorkoutOffSteppen"
import WorkoutOffSteppenStarted from "modules/notInJourney/completeWorkoutNow/WorkoutOffSteppenStarted"
import RescheduleActivity from "modules/notInJourney/scheduleActivity/RescheduleActivity"
import ScheduleActivity from "modules/notInJourney/scheduleActivity/ScheduleActivity"
import { OnboardingAgeScreen } from "modules/onboarding/screens/OnboardingAgeScreen"
import { OnboardingBuildHabitBreakerScreen } from "modules/onboarding/screens/OnboardingBuildHabitBreakerScreen"
import { OnboardingBuiltSteppenForYouScreen } from "modules/onboarding/screens/OnboardingBuiltSteppenForYouScreen"
import { OnboardingEmailScreen } from "modules/onboarding/screens/OnboardingEmailScreen"
import { OnboardingFirstStepCompleteScreen } from "modules/onboarding/screens/OnboardingFirstStepCompleteScreen"
import { OnboardingFitnessHowCanSteppenHelpScreen } from "modules/onboarding/screens/OnboardingFitnessHowCanSteppenHelpScreen"
import { OnboardingFitnessMeansToYouScreen } from "modules/onboarding/screens/OnboardingFitnessMeansToYouScreen"
import { OnboardingFitnessMotivatorsScreen } from "modules/onboarding/screens/OnboardingFitnessMotivatorsScreen"
import { OnboardingFitnessResultsWhenScreen } from "modules/onboarding/screens/OnboardingFitnessResultsWhenScreen"
import { OnboardingGenderScreen } from "modules/onboarding/screens/OnboardingGenderScreen"
import { OnboardingHowDoesItWorkBreakerScreen } from "modules/onboarding/screens/OnboardingHowDoesItWorkBreakerScreen"
import { OnboardingJourneyExplainerScreen } from "modules/onboarding/screens/OnboardingJourneyExplainerScreen"
import { OnboardingJourneyJoinedScreen } from "modules/onboarding/screens/OnboardingJourneyJoinedScreen"
import { OnboardingJourneySelectionScreen } from "modules/onboarding/screens/OnboardingJourneySelectionScreen"
import { OnboardingNameScreen } from "modules/onboarding/screens/OnboardingNameScreen"
import { OnboardingNotificationsScreen } from "modules/onboarding/screens/OnboardingNotificationsScreen"
import { OnboardingOver400kScreen } from "modules/onboarding/screens/OnboardingOver400kScreen"
import { OnboardingParentPayScreen } from "modules/onboarding/screens/OnboardingParentPayScreen"
import { OnboardingPowerOfTinyGainsScreen } from "modules/onboarding/screens/OnboardingPowerOfTinyGainsScreen"
import { OnboardingSubscriptionDiscountOfferScreen } from "modules/onboarding/screens/OnboardingSubscriptionDiscountOfferScreen"
import { OnboardingSubscriptionPlusSuccessScreen } from "modules/onboarding/screens/OnboardingSubscriptionPlusSuccessScreen"
import { OnboardingSubscriptionSqueezeScreen } from "modules/onboarding/screens/OnboardingSubscriptionSqueezeScreen"
import { OnboardingWelcomeScreen } from "modules/onboarding/screens/OnboardingWelcomeScreen"
import { OnboardingWhenDoYouWorkoutScreen } from "modules/onboarding/screens/OnboardingWhenDoYouWorkoutScreen"
import { PreferencesEquipmentScreen } from "modules/preferences/screens/PreferencesEquipmentScreen"
import { PreferencesExplainerScreen } from "modules/preferences/screens/PreferencesExplainerScreen"
import { PreferencesLoadingScreen } from "modules/preferences/screens/PreferencesLoadingScreen"
import { PreferencesTimeScreen } from "modules/preferences/screens/PreferencesTimeScreen"
import { PreferencesWorkoutStructureScreen } from "modules/preferences/screens/PreferencesWorkoutStructureScreen"
import { PreferencesWorkoutTypeScreen } from "modules/preferences/screens/PreferencesWorkoutTypeScreen"
import ProgressPictureAdd from "modules/progress/AddProgressPicture"
import { FirstProgressPhotoModal } from "modules/progress/FirstProgressPhotoModal"
import ViewAllProgressPictures from "modules/progress/ViewAllProgressPictures"
import ProgressPictureView from "modules/progress/ViewProgressPhotos"
import { ReviewPromptModal } from "modules/reviews/ReviewPrompt"
import { PreviewSelfie } from "modules/selfies/PreviewSelfie"
import { PromptSelfie } from "modules/selfies/PromptSelfie"
import { ShowSelfie } from "modules/selfies/ShowSelfie"
import { TakeSelfie } from "modules/selfies/TakeSelfie"
import ActivityStatistics from "modules/statistics/ActivityStatistics"
import CaloriesScreen from "modules/statistics/CaloriesScreen"
import LightActivitiesScreen from "modules/statistics/LightActivitiesScreen"
import TimeScreen from "modules/statistics/TimeScreen"
import WorkoutsScreen from "modules/statistics/WorkoutsScreen"
import { CompletedPrograms } from "modules/userProfile/CompletedPrograms"
import { CompletedWorkouts } from "modules/userProfile/CompletedWorkouts"
import { MyCreatedWorkouts } from "modules/userProfile/MyCreatedWorkouts"
import { MyPrograms } from "modules/userProfile/MyPrograms"
import { MyWorkouts } from "modules/userProfile/MyWorkouts"
import CreatedWorkoutsList from "modules/workoutCreation/CreatedWorkoutsList"
import CreateWorkout from "modules/workoutCreation/CreateWorkout"
import JoinProgramSuccess from "modules/workoutPrograms/JoinProgramSuccess"
import UserWorkoutProgramsScreen from "modules/workoutPrograms/UserWorkoutProgramsScreen"
import WorkoutInProgramScreen from "modules/workoutPrograms/viewWorkoutInProgram/WorkoutInProgramScreen"
import JoinedWorkoutProgramScreen from "modules/workoutPrograms/viewWorkoutProgram/JoinedWorkoutProgramScreen"
import WorkoutProgramView from "modules/workoutPrograms/viewWorkoutProgram/WorkoutProgramScreen"
import { WorkoutFlow } from "modules/workoutViewing/screens/WorkoutFlow"
import { MainTabs } from "navigation/MainTabs"
import { screenLibrary } from "navigation/screenLibrary"
import AppLaunchScreen from "page/auth/launch"
import { LockdownScreen } from "page/auth/LockdownScreen"
import { AfterLoginScreen } from "page/auth/login/afterLogin"
import { DoLoginScreen } from "page/auth/login/doLogin"
import { PhoneVerificationScreen } from "page/auth/login/PhoneVerificationScreen"
import { VerifyCodeScreen } from "page/auth/login/VerifyCodeScreen"
import SignUpStepNotificationsScreen from "page/auth/signup/stepNotifications"
import { ExerciseVideoTikTokScreen } from "page/exerciseVideoTikTok"
import SendInvitationsScreen from "page/invitations/SendInvitations"
import { SequenceWorkoutVideoScreen } from "page/sequenceWorkoutVideo"
import AboutScreen from "page/tab/account/about"
import { CancelSubscriptionSurveyScreen } from "page/tab/account/CancelSubscriptionSurvey"
import { CancelTrialOfferScreen } from "page/tab/account/CancelTrialOffer"
import { ChoosePlanScreen } from "page/tab/account/ChoosePlan"
import { EditAccountScreen } from "page/tab/account/editAccount"
import EditDobScreen from "page/tab/account/editDob"
import { EditGoals } from "page/tab/account/EditGoals"
import { ManageSubscriptionScreen } from "page/tab/account/ManageSubscription"
import { PlusSuccessScreen } from "page/tab/account/PlusSuccess"
import SettingsScreen from "page/tab/account/setting"
import StyleLibraryScreen from "theme/StyleLibrary"

export const NavigationRoot = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={screenLibrary.launch}
      screenOptions={({ route: { params } }) => ({
        animation: params?.noAnimation ? "none" : "default",
        headerShown: false,
      })}
    >
      <Stack.Screen component={ActivityStatistics} name={screenLibrary.tabProgress.myActivity} />
      <Stack.Screen component={AppLaunchScreen} name={screenLibrary.launch} />

      <Stack.Screen component={AfterLoginScreen} name={screenLibrary.login.afterLogin} />
      <Stack.Screen component={DoLoginScreen} name={screenLibrary.login.doLogin} />

      <Stack.Screen component={MainTabs} name={screenLibrary.tabroot} />

      <Stack.Screen component={LockdownScreen} name={screenLibrary.lockdown} />

      <Stack.Screen component={AboutScreen} name={screenLibrary.tabAccount.about} />

      <Stack.Screen component={ChallengeDrilldown} name={screenLibrary.challenges.drilldown} />
      <Stack.Screen component={CompletedPrograms} name={screenLibrary.tabMyfit.completedPrograms} />
      <Stack.Screen component={CompletedWorkouts} name={screenLibrary.tabMyfit.completedWorkouts} />

      <Stack.Screen component={CreateWorkout} name={screenLibrary.workouts.createWorkout} />
      <Stack.Screen
        component={CreatedWorkoutsList}
        name={screenLibrary.workouts.createdWorkoutsList}
      />
      <Stack.Screen component={EditAccountScreen} name={screenLibrary.tabAccount.editAccount} />
      <Stack.Screen component={EditDobScreen} name={screenLibrary.tabAccount.editDob} />
      <Stack.Screen component={EditGoals} name={screenLibrary.tabAccount.editGoals} />
      <Stack.Screen
        component={ExerciseVideoTikTokScreen}
        name={screenLibrary.exerciseVideoTikTok}
      />

      <Stack.Screen
        component={MotivationEditTimeScreen}
        name={screenLibrary.tabMyfit.motivationEditTime}
      />
      <Stack.Screen component={MotivationScreen} name={screenLibrary.tabMyfit.motivationScreen} />
      <Stack.Screen
        component={MotivationSplashScreen}
        name={screenLibrary.tabMyfit.motivationSplash}
      />
      <Stack.Screen component={MyCreatedWorkouts} name={screenLibrary.tabMyfit.myCreatedWorkouts} />
      <Stack.Screen component={MyPrograms} name={screenLibrary.tabMyfit.myPrograms} />
      <Stack.Screen component={MyWorkouts} name={screenLibrary.tabMyfit.myWorkouts} />

      <Stack.Screen component={OnboardingAgeScreen} name={screenLibrary.onboarding.ageRange} />
      <Stack.Screen
        component={OnboardingBuildHabitBreakerScreen}
        name={screenLibrary.onboarding.buildHabitBreaker}
      />
      <Stack.Screen
        component={OnboardingBuiltSteppenForYouScreen}
        name={screenLibrary.onboarding.builtSteppenForYou}
      />
      <Stack.Screen component={OnboardingEmailScreen} name={screenLibrary.onboarding.email} />
      <Stack.Screen
        component={OnboardingFirstStepCompleteScreen}
        name={screenLibrary.onboarding.firstStepComplete}
      />
      <Stack.Screen
        component={OnboardingJourneyExplainerScreen}
        name={screenLibrary.onboarding.journeyExplainer}
      />
      <Stack.Screen
        component={OnboardingJourneyJoinedScreen}
        name={screenLibrary.onboarding.journeyJoined}
      />
      <Stack.Screen
        component={OnboardingJourneySelectionScreen}
        name={screenLibrary.onboarding.journeySelection}
      />
      <Stack.Screen component={OnboardingOver400kScreen} name={screenLibrary.onboarding.over400k} />
      <Stack.Screen
        component={OnboardingParentPayScreen}
        name={screenLibrary.onboarding.parentPay}
      />
      <Stack.Screen
        component={OnboardingPowerOfTinyGainsScreen}
        name={screenLibrary.onboarding.powerOfTinyGains}
      />
      <Stack.Screen
        component={OnboardingFitnessMotivatorsScreen}
        name={screenLibrary.onboarding.fitnessMotivators}
      />
      <Stack.Screen
        component={OnboardingFitnessHowCanSteppenHelpScreen}
        name={screenLibrary.onboarding.fitnessHowCanSteppenHelp}
      />
      <Stack.Screen
        component={OnboardingFitnessMeansToYouScreen}
        name={screenLibrary.onboarding.fitnessMeansToYou}
      />
      <Stack.Screen
        component={OnboardingFitnessResultsWhenScreen}
        name={screenLibrary.onboarding.fitnessResultsWhen}
      />

      <Stack.Screen component={OnboardingGenderScreen} name={screenLibrary.onboarding.gender} />
      <Stack.Screen
        component={OnboardingHowDoesItWorkBreakerScreen}
        name={screenLibrary.onboarding.howDoesItWorkBreaker}
      />
      <Stack.Screen component={OnboardingNameScreen} name={screenLibrary.onboarding.name} />
      <Stack.Screen
        component={OnboardingNotificationsScreen}
        name={screenLibrary.onboarding.notifications}
      />
      <Stack.Screen
        component={OnboardingSubscriptionDiscountOfferScreen}
        name={screenLibrary.onboarding.subscriptionDiscountOffer}
      />
      <Stack.Screen
        component={OnboardingSubscriptionPlusSuccessScreen}
        name={screenLibrary.onboarding.subscriptionPlusSuccess}
      />
      <Stack.Screen
        component={OnboardingSubscriptionSqueezeScreen}
        name={screenLibrary.onboarding.subscriptionSqueeze}
      />
      <Stack.Screen
        component={OnboardingWelcomeScreen}
        name={screenLibrary.onboarding.welcome}
        options={{ animation: "none" }}
      />
      <Stack.Screen
        component={OnboardingWhenDoYouWorkoutScreen}
        name={screenLibrary.onboarding.whenDoYouWorkout}
      />
      <Stack.Screen
        component={PhoneVerificationScreen}
        name={screenLibrary.login.phoneVerification}
      />
      <Stack.Screen component={ProgressPictureAdd} name={screenLibrary.progressPhotos.add} />
      <Stack.Screen
        component={ProgressPictureView}
        name={screenLibrary.progressPhotos.view}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={PreferencesEquipmentScreen}
        name={screenLibrary.preferences.equipment}
      />
      <Stack.Screen
        component={PreferencesExplainerScreen}
        name={screenLibrary.preferences.explainer}
      />
      <Stack.Screen component={PreferencesLoadingScreen} name={screenLibrary.preferences.loading} />
      <Stack.Screen component={PreferencesTimeScreen} name={screenLibrary.preferences.time} />
      <Stack.Screen
        component={PreferencesWorkoutStructureScreen}
        name={screenLibrary.preferences.workoutStructure}
      />
      <Stack.Screen
        component={PreferencesWorkoutTypeScreen}
        name={screenLibrary.preferences.workoutType}
      />
      <Stack.Screen component={RemindersScreen} name={screenLibrary.tabMyfit.reminders} />
      <Stack.Screen component={SendInvitationsScreen} name={screenLibrary.sendInvitations} />
      <Stack.Screen
        component={SequenceWorkoutVideoScreen}
        name={screenLibrary.sequenceWorkoutVideo}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen component={ChoosePlanScreen} name={screenLibrary.tabAccount.choosePlan} />
      <Stack.Screen
        component={CancelTrialOfferScreen}
        name={screenLibrary.tabAccount.cancelTrialOffer}
      />
      <Stack.Screen
        component={CancelSubscriptionSurveyScreen}
        name={screenLibrary.tabAccount.cancelSubscriptionSurvey}
      />
      <Stack.Screen
        component={ManageSubscriptionScreen}
        name={screenLibrary.tabAccount.manageSubscription}
      />
      <Stack.Screen component={PlusSuccessScreen} name={screenLibrary.tabAccount.plusSuccess} />
      <Stack.Screen component={SettingsScreen} name={screenLibrary.tabAccount.setting} />
      <Stack.Screen
        component={SignUpStepNotificationsScreen}
        name={screenLibrary.signup.stepNotifications}
      />
      <Stack.Screen component={StyleLibraryScreen} name={screenLibrary.styleLibrary} />
      <Stack.Screen component={TimeScreen} name={screenLibrary.stats.time} />
      <Stack.Screen component={CaloriesScreen} name={screenLibrary.stats.calories} />
      <Stack.Screen component={WorkoutsScreen} name={screenLibrary.stats.workouts} />
      <Stack.Screen component={LightActivitiesScreen} name={screenLibrary.stats.activities} />
      <Stack.Screen component={VerifyCodeScreen} name={screenLibrary.login.verifyCode} />
      <Stack.Screen component={WorkoutFlow} name={screenLibrary.workouts.workoutDetail} />
      <Stack.Screen
        component={ViewAllProgressPictures}
        name={screenLibrary.progressPhotos.viewAll}
      />

      <Stack.Screen
        component={PremiumCategory}
        name={screenLibrary.workoutDiscovery.premiumCategory}
      />
      <Stack.Screen
        component={StandardCategory}
        name={screenLibrary.workoutDiscovery.standardCategory}
      />
      <Stack.Screen
        component={PersonalisedRecommendations}
        name={screenLibrary.workoutDiscovery.personalisedRecommendations}
      />

      {/* Workout Program Related Screens */}
      <Stack.Screen component={WorkoutProgramView} name={screenLibrary.workoutProgram.view} />
      <Stack.Screen
        component={JoinedWorkoutProgramScreen}
        name={screenLibrary.workoutProgram.joinedProgram}
      />
      <Stack.Screen
        component={WorkoutInProgramScreen}
        name={screenLibrary.workoutProgram.programWorkoutDetails}
      />
      <Stack.Screen
        component={UserWorkoutProgramsScreen}
        name={screenLibrary.workoutProgram.userProgramWorkouts}
      />

      <Stack.Screen component={ChatbotScreen} name={screenLibrary.chatbot} />

      <Stack.Screen component={FoodCategoryScreen} name={screenLibrary.food.category} />

      <Stack.Screen
        component={NotificationsPushClickThroughScreen}
        name={screenLibrary.notifications.pushClickThrough}
      />

      {/* Journey days explainers */}
      <Stack.Screen component={JourneyExplainer} name={screenLibrary.journey.journeyExplainer} />
      <Stack.Screen component={Day1Explainer} name={screenLibrary.journey.day1Explainer} />
      <Stack.Screen component={Day2Explainer} name={screenLibrary.journey.day2Explainer} />
      <Stack.Screen component={Day3Explainer} name={screenLibrary.journey.day3Explainer} />
      <Stack.Screen component={Day4Explainer} name={screenLibrary.journey.day4Explainer} />
      <Stack.Screen component={Day5Explainer} name={screenLibrary.journey.day5Explainer} />
      <Stack.Screen component={Day6Explainer} name={screenLibrary.journey.day6Explainer} />
      <Stack.Screen component={Day7Explainer} name={screenLibrary.journey.day7Explainer} />
      <Stack.Screen
        component={Day7ExplainerBreaker}
        name={screenLibrary.journey.day7ExplainerBreaker}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        component={JourneySelectionExplanation}
        name={screenLibrary.journey.journeySelectionExplanation}
      />

      <Stack.Screen
        component={Day1ProgressPicBreaker}
        name={screenLibrary.journey.progressPicExplainer}
      />
      <Stack.Screen
        component={Day1WorkoutExplainer}
        name={screenLibrary.journey.day1WorkoutExplainer}
      />
      <Stack.Screen
        component={DiscoveryExplainer}
        name={screenLibrary.journey.discoveryExplainer}
      />
      <Stack.Screen
        component={DiscoveryPreferences}
        name={screenLibrary.journey.discoveryPreferences}
      />

      <Stack.Screen component={Reward} name={screenLibrary.journey.reward} />
      <Stack.Screen component={Badge} name={screenLibrary.journey.badge} />
      <Stack.Screen component={JourneyDaySummary} name={screenLibrary.journey.summary} />
      <Stack.Screen component={JourneyDay7Summary} name={screenLibrary.journey.day7summary} />

      <Stack.Screen
        component={WhatYouLearnt}
        name={screenLibrary.journey.whatYouLearnt}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={ComingSoon}
        name={screenLibrary.journey.comingSoon}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        component={JourneyNextDayExplainer}
        name={screenLibrary.journey.nextDayExplainer}
      />
      <Stack.Screen component={DoActivity} name={screenLibrary.activity.doActivity} />
      <Stack.Screen
        component={StartActivity}
        name={screenLibrary.activity.startActivity}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={ActivityComplete}
        name={screenLibrary.activity.activityComplete}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen component={ActivityMood} name={screenLibrary.activity.activityMood} />
      <Stack.Screen component={ChallengeAndRewards} name={screenLibrary.journey.challenge} />
      <Stack.Screen
        component={DiscoveredWorkoutsSelection}
        name={screenLibrary.journey.discoveredWorkoutsSelection}
      />

      <Stack.Screen
        component={TransformationTime}
        name={screenLibrary.journey.transformationTime}
      />

      <Stack.Screen
        component={JourneyTransformation}
        name={screenLibrary.journey.progressTransformation}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen component={PreviewSelfie} name={screenLibrary.selfies.previewSelfie} />
      <Stack.Screen component={PromptSelfie} name={screenLibrary.selfies.promptSelfie} />
      <Stack.Screen component={ShowSelfie} name={screenLibrary.selfies.showSelfie} />
      <Stack.Screen component={TakeSelfie} name={screenLibrary.selfies.takeSelfie} />
      <Stack.Screen component={WorkoutCompletion} name={screenLibrary.journey.workoutCompletion} />
      <Stack.Screen component={JourneyWorkoutPreview} name={screenLibrary.journey.workoutPreview} />
      <Stack.Screen component={JourneyWorkoutFlow} name={screenLibrary.journey.workoutDoing} />

      {/* ScheduleActivityPages */}
      <Stack.Screen component={ScheduleActivity} name={screenLibrary.scheduleActivity.dashboard} />
      <Stack.Screen
        component={RescheduleActivity}
        name={screenLibrary.scheduleActivity.reschedule}
      />

      {/* Complete Workout Screens */}
      <Stack.Screen
        component={SelectWorkoutType}
        name={screenLibrary.completeWorkoutNow.dashboard}
      />
      <Stack.Screen
        component={WorkoutOffSteppen}
        name={screenLibrary.completeWorkoutNow.workoutDetails}
      />
      <Stack.Screen
        component={WorkoutOffSteppenStarted}
        name={screenLibrary.completeWorkoutNow.started}
      />

      {/* Complete Activity Screens */}
      <Stack.Screen
        component={CompleteScheduledActivity}
        name={screenLibrary.completeActivityNow.completeScheduledActivity}
      />
      <Stack.Screen
        component={CompleteActivityNow}
        name={screenLibrary.completeActivityNow.dashboard}
      />
      <Stack.Screen component={DoActivityNowMood} name={screenLibrary.completeActivityNow.mood} />
      <Stack.Screen
        component={ActivityStarted}
        name={screenLibrary.completeActivityNow.activityStarted}
      />
      <Stack.Screen
        component={FinalizeActivity}
        name={screenLibrary.completeActivityNow.finalizeActivity}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={ActivitySummary}
        name={screenLibrary.completeActivityNow.summary}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={CalendarStreak}
        name={screenLibrary.tabCalendar.calendarStreak}
        options={{ gestureEnabled: false }}
      />

      {/* Calendar V2 */}
      <Stack.Screen
        component={CalendarActivityMood}
        name={screenLibrary.tabCalendar.calendarActivityMood}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        component={CompleteScheduledActivityV2}
        name={screenLibrary.tabCalendar.completeScheduledActivity}
      />

      <Stack.Screen
        component={TrackActivityScreen}
        name={screenLibrary.tabCalendar.trackActivity}
      />

      <Stack.Screen
        component={PostCalendarActivityComplete}
        name={screenLibrary.tabCalendar.postCalendarActivityComplete}
      />

      {/* Modals */}
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={JoinProgramSuccess}
          name={screenLibrary.modals.joinProgramSuccess}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          component={EditDeleteScheduledActivity}
          name={screenLibrary.tabCalendar.editDeleteScheduledActivity}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ animation: "none", presentation: "transparentModal" }}>
        <Stack.Screen component={DiscountOfferModal} name={screenLibrary.modals.discountOffer} />
        <Stack.Screen
          component={FirstProgressPhotoModal}
          name={screenLibrary.modals.firstProgressPhoto}
        />
        <Stack.Screen component={ReviewPromptModal} name={screenLibrary.modals.reviewPrompt} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
