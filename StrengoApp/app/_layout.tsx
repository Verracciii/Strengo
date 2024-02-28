import { Stack } from "expo-router"

const RootLayout = () => {
{/* 
RootLayout is the main stack navigator from the expo-router package.
It can be used to configure the options for all screens in the app.
In this case, we are setting the headerShown option to false for all screens.
This will hide the header bar from all screens in the app.
*/}
    return (
        <Stack
        screenOptions={{headerShown: false}}
        />
        );
    };

    export default RootLayout;