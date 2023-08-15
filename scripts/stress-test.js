import http from "k6/http";
import { check, sleep } from "k6";

const isNumeric = (value) => /^\d+$/.test(value);

const DEFAULT_VUS = 5;

const TARGET_VUS_ENV = `${__ENV.TARGET_VUS}`;
const TARGET_VUS = isNumeric(TARGET_VUS_ENV)
    ? Number(TARGET_VUS_ENV)
    : DEFAULT_VUS;

// Ramp VUs up and down in stages [You can ramp the number of VUs up and down during the test. To configure ramping, use the options.stages property.]
export let options = {
    stages: [
        { duration: "30s", target: 100 },
        { duration: "1m", target: 500 },
        { duration: "20s", target: 0 },
    ],
    thresholds: {
        //   http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ["p(95)<500"], // // 95% of requests should be below 500ms
    },
};

export default function () {
    let response = http.get("https://swapi.dev/api/people/30/",{headers: {Accepts: "application/json"}})
    check(response, {
        "status is 200": (r)=> r.status === 200,
    })
}