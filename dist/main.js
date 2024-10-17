"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const prisma_1 = __importDefault(require("./prisma"));
const axios = require('axios');
const maps_1 = require("./maps");
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Content-Type", "application/json");
    // res.setHeader("Access-Control-Allow-Credentials", true);
    // res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    // res.setHeader("Access-Control-Max-Age", 7200);
    next();
});
app.use(express.json());
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const getinfo = yield prisma_1.default.user.findUnique({
        where: {
            username: req.body.username,
            // password: req.body.password
        }
    });
    if (getinfo == null) {
        const pushinfo = yield prisma_1.default.user.create({
            data: {
                username: req.body.username,
                password: req.body.password
            }
        });
        res.json({
            msg: "Account created successfully."
        });
    }
    else {
        res.json({
            msg: "Username already exists."
        });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkcreds = yield prisma_1.default.user.findUnique({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    });
    if ((checkcreds === null || checkcreds === void 0 ? void 0 : checkcreds.username) == req.body.username && (checkcreds === null || checkcreds === void 0 ? void 0 : checkcreds.password) == req.body.password) {
        res.json({
            msg: "Login successful."
        });
    }
    else if (checkcreds == null) {
        res.json({
            msg: "Incorrect username or password."
        });
    }
    // res.json({
    //   msg: checkcreds
    // })
}));
app.post('/getaccesstoken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var _a;
    // 2. Construct the data object for request body
    const data = {
        grant_type: "authorization_code",
        code: (_a = req.body) === null || _a === void 0 ? void 0 : _a.authcode, // Use 'code' instead of 'authcode' (common practice)
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `your-domain/integrations/gcp-secret-manager/oauth2/callback`,
    };
    // 3. Use data object with axios.post
    try {
        const gettoken = yield axios.post("https://oauth2.googleapis.com/token", data);
        const access_token = gettoken === null || gettoken === void 0 ? void 0 : gettoken.data.access_token;
        const refresh_token = gettoken === null || gettoken === void 0 ? void 0 : gettoken.data.refresh_token;
        const expires_in = gettoken === null || gettoken === void 0 ? void 0 : gettoken.data.expires_in;
        // Use the access token and handle expires_in for refresh token logic
        res.json({ message: 'Access token retrieved' }); // Or send required data
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get access token' });
    }
}));
app.post("/getnewaccesstoken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refresh_token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.refresh_token;
    const data = {
        client_id: process.env.GCP_CLIENT_ID,
        client_secret: process.env.GCP_CLIENT_SECRET,
        refresh_token,
        grant_type: "refresh_token",
    };
    const getnewaccesstoken = yield axios.post("https://oauth2.googleapis.com/token", data);
    const access_token = getnewaccesstoken.data.access_token;
    const expires_in = getnewaccesstoken.data.expires_in;
}));
app.post("/testmapsroutes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const abc = yield (0, maps_1.computeRoutes)(req.body.origin, req.body.destination);
    console.log(abc.data);
    res.json({
        msg: abc
    });
}));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
