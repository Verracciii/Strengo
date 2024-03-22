import { Stack } from "expo-router"
import HomeScreen from "./home"
import NewWorkout from "./workout/[template]"
import { StrengoProvider } from "../global/AppContext"

const RootLayout = () => {
{/* 
RootLayout is the main stack navigator from the expo-router package.
It can be used to configure the options for all screens in the app.
In this case, we are setting the headerShown option to false for all screens.
This will hide the header bar from all screens in the app.
*/}
    return (
        <StrengoProvider>
            <Stack
                screenOptions={({ route }) => ({
                    headerShown: route.name === "workout/[template]",
                })}>
                <Stack.Screen name="index" />
                <Stack.Screen name="home" />
                <Stack.Screen 
                name="workout/[template]" 
                options={{
                    title: 'Workout', 
                    headerStyle:{backgroundColor: "#4386ff"}, 
                    headerTintColor:'black'
                    }}/>
                <Stack.Screen name="workout/workoutFinished" />
            </Stack>
        </StrengoProvider>
    );
}

    export default RootLayout;