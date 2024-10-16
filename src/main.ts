const express = require('express')
const app = express()
const port = process.env.PORT
import { Request, Response } from "express";
import prisma from "./prisma";
const axios = require('axios')
import { computeRoutes } from "./maps";


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
}
)

app.post('/getaccesstoken', async (req: Request, res: Response) => {
  // const authcode = "dnsna"
  //
  // const gettoken = await axios.post(
  //   "https://oauth2.googleapis.com/token",
  //   new URLSearchParams({
  //     grant_type: "authorization_code",
  //     authcode,
  //     client_id: process.env?.CLIENT_ID,
  //     client_secret: process.env?.CLIENT_SECRET,
  //     redirect_uri: `your-domain/integrations/gcp-secret-manager/oauth2/callback`,
  //   })
  // )
  //
  // const access_token = gettoken?.data.access_token; // used to access the Google API
  // const refresh_token = gettoken?.data.refresh_token; // used to refresh the access token
  // const expires_in = gettoken?.data.expires_in; // used to know when to refresh the access token


  // 2. Construct the data object for request body
  const data = {
    grant_type: "authorization_code",
    code: req.body?.authcode, // Use 'code' instead of 'authcode' (common practice)
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: `your-domain/integrations/gcp-secret-manager/oauth2/callback`,
  };

  // 3. Use data object with axios.post
  try {
    const gettoken = await axios.post(
      "https://oauth2.googleapis.com/token",
      data
    );

    const access_token = gettoken?.data.access_token;
    const refresh_token = gettoken?.data.refresh_token;
    const expires_in = gettoken?.data.expires_in;

    // Use the access token and handle expires_in for refresh token logic
    res.json({ message: 'Access token retrieved' }); // Or send required data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get access token' });
  }
})


app.post("/getnewaccesstoken", async (req: Request, res: Response) => {
  const refresh_token = req.body?.refresh_token

  const data = {
    client_id: process.env.GCP_CLIENT_ID,
    client_secret: process.env.GCP_CLIENT_SECRET,
    refresh_token,
    grant_type: "refresh_token",
  }

  const getnewaccesstoken = await axios.post(
    "https://oauth2.googleapis.com/token",
    data
  );


  const access_token = getnewaccesstoken.data.access_token;
  const expires_in = getnewaccesstoken.data.expires_in;
})

app.post("/testmapsroutes", async (req: Request, res: Response) => {
  const abc = await computeRoutes(req.body.origin, req.body.destination)
  console.log(abc.data)
  res.json({
    msg: abc.data
  })
})



app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
