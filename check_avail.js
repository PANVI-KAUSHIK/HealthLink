import sqlite3 from 'sqlite3';
const dbStr = "c:/Users/PANVI KAUSHIK/Desktop/Health123/server/database.sqlite";
const db = new sqlite3.Database(dbStr);
db.get("SELECT email, fullName, availabilityJSON FROM users WHERE email = 'doctor.mock@gmail.com'", (err, row) => {
    if (err) console.error(err);
    console.log(JSON.stringify(row));
    db.close();
});
