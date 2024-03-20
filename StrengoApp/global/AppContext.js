import React from 'react'
import { useEffect, useState } from 'react'
import databaseHelper from '../service/databasehelper';

const StrengoContext = React.createContext();

const StrengoProvider = ({children}) => {

    useEffect(() => {
        async function asyncInitDb() {
    
          const dbInitVal = await databaseHelper.readOperatingValues("SELECT value FROM operatingValues WHERE name = 'dbInit'");
    
          try {
            if (dbInitVal === 0) {
              await databaseHelper.initDatabase()
              databaseHelper.readDb()
            }
          } catch (TypeError) {
            console.log("DB not initialised")
            await databaseHelper.initDatabase()
            databaseHelper.readDb()
          }
        }
    
          asyncInitDb();
      }, []);
    
      const [template1, setTemplate1] = useState([]);
      const [template2, setTemplate2] = useState([]);
      const [isLoading, setIsLoading] = useState(true);  //Prevents data from rendering before data is fetched from the database
    
      useEffect(() => {
          /**
           * Inserts workout templates into the database and reads all templates.
           * @returns {Promise<void>}
           */
          async function testTemplatesAndRead() {
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
    
                  await databaseHelper.readOperatingValues("UPDATE operatingValues SET value = 1 WHERE name = 'templatesInit'");
              }
    
              const tempTemplate1 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 1");
              console.log("This is template1" + tempTemplate1);
              setTemplate1(tempTemplate1);
    
              const tempTemplate2 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 2");
              console.log("This is template2" + tempTemplate2);
              setTemplate2(tempTemplate2);
    
              setIsLoading(false); //Indicates that the data has been fetched from the database
          
      }
      
      testTemplatesAndRead();
    }, []);

    return (
        <StrengoContext.Provider value={{
            template1,
            setTemplate1,
            template2,
            setTemplate2,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </StrengoContext.Provider>
    )
}

export {StrengoContext, StrengoProvider};