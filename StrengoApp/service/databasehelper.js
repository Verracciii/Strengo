import * as SQLite from 'expo-sqlite';
import test from '../app/test';

const db = SQLite.openDatabase('Strengo.db');

{/* 
Any code regarding await and async in initDatabase is referenced from Github Copilot:
[Github Copilot: 28/02/2024; 
Asked: "@workspace After initialising the database and inserting a test data in index.jsx. 
Why is the only data that is printed to console that test data, 
not actually any of the workouts in the database init method?",

"So what is the await doing?",

"You placed the resolve() and reject(error) at the end of the first executeSql in initDatabase. 
Should I not place those in the last executeSql statement instead? 
Where the workouts are inserted? Line 53"]

The use of promises in insertWorkout and ReadDb is not direct code from Github Copilot,
It is made using the knowledge it gave me about promises and the use of the executeSql method.
*/}

const databaseHelper = {
  initDatabase: () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {

        tx.executeSql(
          "DROP TABLE IF EXISTS Workouts", 
          [], 
          (tx, ResultSet) => {console.log("Workouts table deleted")}, 
          (tx, error) => {console.warn("Error deleting table, table might not already exist"); reject(error);});

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT)", 
          [], 
          (tx, ResultSet) => {console.log("Workouts table created")},
          (tx, error) => {console.warn("Error creating table"); reject(error);}
          );

          // Generate an array of workout names
          const workoutNames = [
            "Push-ups",
            "Squats",
            "Plank",
            "Bicep Curls",
            "Lunges",
            "Deadlifts",
            "Bench Press",
            "Crunches",
            "Shoulder Press",
            "Leg Press",
            "Pull-ups",
            "Chest Flys",
            "Russian Twists",
            "Tricep Dips",
            "Calf Raises"
          ];

          // Generate an array of workout types
          const workoutTypes = [
            "core",
            "arms",
            "shoulders",
            "legs",
            "back",
            "chest"
          ];

          // Insert the workouts into the table
          workoutNames.forEach((name, index) => {
            const type = workoutTypes[index % workoutTypes.length];
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO Workouts (name, type) VALUES (?, ?)",
                [name, type],
                (tx, ResultSet) => { console.log("Workout inserted"); resolve(); },
                (tx, error) => { console.warn("Error inserting workout"); reject(error); }
              );
            });
          });
        }
      );
      }
    );
    },

  insertWorkout: (name, type) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => { 
        tx.executeSql(
          "INSERT INTO Workouts (name, type) VALUES (?, ?)", 
          [name, type], 
          (tx, ResultSet) => { console.log("Workout inserted"); resolve(); },
          (tx, err) => { console.warn("Error inserting workout", err); reject(err); }
        );
      });
    });
  },

  //[Github Copilot: 28/02/2024; Asked: "How would I make the db readable in console?"]
  //Excluding the code regarding promises
  readDb: () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Workouts",
          [],
          (_, { rows: { _array } }) => {console.log(JSON.stringify(_array, null, 2)); resolve();},
          (_, error) => {reject(error);}
        )
      });
    }
    );
}
};

export default databaseHelper;
