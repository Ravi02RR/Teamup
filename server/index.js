import app from "./src/app/app.js";
import { dbConnection } from "./src/db/db.js";
import { env } from "./src/config/confo.js";



try {
    dbConnection(env.db.uri);
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}
catch (err) {
    console.log("Server failed to start");
    process.exit(1);
}