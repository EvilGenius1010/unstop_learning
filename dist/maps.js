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
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRoutes = computeRoutes;
const COMPUTEROUTESAPI = "https://routes.googleapis.com/directions/v2:computeRoutes";
const axios = require("axios");
function computeRoutes(origin, destination, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqbody = {
            origin: {
                address: origin
            },
            destination: {
                address: destination
            },
            travelMode: "DRIVE",
            languageCode: "en-US",
            units: "IMPERIAL"
        };
        const getres = yield axios.post(COMPUTEROUTESAPI, reqbody, {
            headers: {
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
                "X-Goog-Api-Key": process.env.GCP_MAPS_API,
                "Content-Type": "application/json"
            }
        });
        return getres.data;
    });
}
