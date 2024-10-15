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
const port = process.env.port || 3000;
const prisma_1 = __importDefault(require("./prisma"));
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
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
