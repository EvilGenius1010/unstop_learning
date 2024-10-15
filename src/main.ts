const express = require('express')
const app = express()
const port = process.env.port || 3000
import { Request, Response } from "express";
import prisma from "./prisma";

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
  res.setHeader("Content-Type", "application/json")
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  // res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.use(express.json())


app.post('/signup', async (req: Request, res: Response) => {
  console.log(req.body)
  const getinfo = await prisma.user.findUnique({
    where: {
      username: req.body.username,
      // password: req.body.password
    }
  })

  if (getinfo == null) {

    const pushinfo = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password
      }
    })
    res.json({
      msg: "Account created successfully."
    })
  }
  else {
    res.json({
      msg: "Username already exists."
    })
  }

})

app.post('/login', async (req: any, res: any) => {

  const checkcreds = await prisma.user.findUnique({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })

  if (checkcreds?.username == req.body.username && checkcreds?.password == req.body.password) {
    res.json({
      msg: "Login successful."
    })
  } else if (checkcreds == null) {
    res.json({
      msg: "Incorrect username or password."
    })
  }

  // res.json({
  //   msg: checkcreds
  // })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
