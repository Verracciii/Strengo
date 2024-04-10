import React from 'react' 
import { useEffect, useState } from 'react'
import databaseHelper from '../service/databasehelper';


/**
 * StrengoContext is a context that provides the workout templates to the application.
 * A provider is used to fix the issue of data duplicating on every render.
 * The templates and all tables are only initialised once, preventing data from duplicating or being erased.
 */
const StrengoContext = React.createContext();

const StrengoProvider = ({children}) => {

    async function asyncInitDb() {

        /**
         * This try-catch block tries to fetch the value of the 'dbInit' operating value from the database.
         * If the value is 0, the database is initialised and the 'dbInit' value is set to 1.
         * If the value is 1, the database is already initialised and the function continues.
         * If an error occurs, the operatingValues table is not initialised, therefore, the database is not initialised.
         * The function then tries to initialise the database and read the database.
         */
        try {
            const dbInitVal = await databaseHelper.readOperatingValues("SELECT value FROM operatingValues WHERE name = 'dbInit'");
        
            if (dbInitVal === 0) {
                await databaseHelper.initDatabase()
                databaseHelper.readDb()
            } else {
                console.log("Database already initialised");
                await databaseHelper.initDatabase()
            }
            } catch (error) {
            console.log("DB not initialised or other error occurred:", error);
            try {
                await databaseHelper.initDatabase()
                databaseHelper.readDb()
            } catch (initError) {
                console.log("Error initializing database:", initError);
            }
            }
    };
    
      const [template1, setTemplate1] = useState([]);
      const [template2, setTemplate2] = useState([]);
      const [template3, setTemplate3] = useState([]);
      const [isLoading, setIsLoading] = useState(true);  //Prevents data from rendering before data is fetched from the database
    
        /**
         * Inserts workout templates into the database and reads all templates.
         * @returns {Promise<void>}
         */
        async function testTemplatesAndRead() {

            /**
             * Checks whether templates have been initialised based on the 'templatesInit' operating value.
             * There cannot be an error here as the operatingValues table is initialised in the initDb function.
             */

            const templatesInit = await databaseHelper.readOperatingValues("SELECT value FROM operatingValues WHERE name = 'templatesInit'");

            if (templatesInit[0].value === 0) {

                //Create template the "pull" template.
                await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 20, 1, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 15, 2, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 10, 3, 1);

                await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 6, 2, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 4, 3, 1);

                await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 6, 2, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 4, 3, 1);

                await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 10, 1, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 8, 2, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 6, 3, 1);

                await databaseHelper.insertWorkoutTemplate(1, "Push", 12, 30, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(1, "Push", 12, 30, 6, 2, 1);

                //The "push" template.
                await databaseHelper.insertWorkoutTemplate(2, "Pull", 4, 12, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(2, "Pull", 4, 12, 6, 2, 1);

                await databaseHelper.insertWorkoutTemplate(2, "Pull", 6, 120, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(2, "Pull", 6, 120, 6, 2, 1);

                await databaseHelper.insertWorkoutTemplate(2, "Pull", 11, 0, 8, 1, 1);
                await databaseHelper.insertWorkoutTemplate(2, "Pull", 11, 0, 6, 2, 1);

                //The 'core' template.
                await databaseHelper.insertWorkoutTemplate(3, "Core", 16, 0, 10, 1, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 16, 0, 8, 2, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 16, 0, 6, 3, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 15, 0, 10, 1, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 15, 0, 8, 2, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 15, 0, 6, 3, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 2, 0, 10, 1, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 2, 0, 8, 2, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 2, 0, 6, 3, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 8, 0, 10, 1, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 8, 0, 8, 2, 1);
                await databaseHelper.insertWorkoutTemplate(3, "Core", 8, 0, 6, 3, 1);


                await databaseHelper.readOperatingValues("UPDATE operatingValues SET value = 1 WHERE name = 'templatesInit'");
            }

            const tempTemplate1 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 1");
            setTemplate1(tempTemplate1);

            const tempTemplate2 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 2");
            setTemplate2(tempTemplate2);

            const tempTemplate3 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 3");
            setTemplate3(tempTemplate3);

            setIsLoading(false); //Indicates that the data has been fetched from the database
          
      };

      useEffect(() => {
        async function init() {
        /**
         * Await statement are used to ensure that the database is initialised before the templates are inserted and read.
         */
          await asyncInitDb();
          await testTemplatesAndRead();
        }
        init();
      }, []);
      
    return (
        /**
         * The below block of code provides the context to the application.
         * All of the values will be available anywhere that is wrapped in the StrengoProvider.
         */
        <StrengoContext.Provider value={{
            template1,
            setTemplate1,
            template2,
            setTemplate2,
            template3,
            setTemplate3,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </StrengoContext.Provider>
    )
}

export {StrengoContext, StrengoProvider};