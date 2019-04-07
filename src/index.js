require('./db/connection');
const express = require('express');
const userRouter = require('./routers/user-router');
const roleRouter = require('./routers/role-router');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(roleRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
