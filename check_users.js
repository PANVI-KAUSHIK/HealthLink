import sqlite3 from 'sqlite3';
const dbStr = "c:/Users/PANVI KAUSHIK/Desktop/Health123/server/database.sqlite";
const db = new sqlite3.Database(dbStr);
db.all("SELECT email, role, fullName FROM users WHERE role = 'doctor'", (err, rows) => {
    if (err) console.error(err);
    rows.forEach(r => console.log(`${r.role}: ${r.email} (${r.fullName})`));
    db.close();
});
