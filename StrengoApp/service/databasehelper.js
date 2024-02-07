// import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'WorkoutDB.db', location: 'default' });

const databaseHelper = {
  initDatabase: () => {
    db.transaction((tx) => {
      // Create the first table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS workoutHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, duration INTEGER, date TEXT)', [],
        (tx, results) => {
          console.log('Workouts table created successfully');
        },
        (error) => {
          console.error('Error creating workouts table:', error);
        }
      );

      // Create the second table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT)', [],
        (tx, results) => {
          console.log('Exercises table created successfully');
        },
        (error) => {
          console.error('Error creating exercises table:', error);
        }
      );
    });
  },
};

export default databaseHelper;
