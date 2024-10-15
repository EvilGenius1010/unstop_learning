const express = require('express')
const app = express()
const port = process.env.port || 3000
import { Request, Response } from "express";



app.use((req: Request, res: Response, next: any) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  // res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.post('/signup', async (req: any, res: any) => {
  res.json({
    msg: "fuck you"
  })
})

app.post('login', async (req: any, res: any) => {
  res.json({
    msg: "nigger go to /signup first! now piss off"
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
