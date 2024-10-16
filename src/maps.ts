
const COMPUTEROUTESAPI = "https://routes.googleapis.com/directions/v2:computeRoutes"
const axios = require("axios");



export async function computeRoutes(origin: string, destination: string, mode?: string) {
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
  }
  const getres = await axios.post(COMPUTEROUTESAPI, reqbody, {
    headers: {
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
      "X-Goog-Api-Key": process.env.GCP_MAPS_API,
      "Content-Type": "application/json"
    }
  })
  return getres.data
}

