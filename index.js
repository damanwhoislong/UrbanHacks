// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Code is based on Google's sample project "dialogflow quotes nodejs"

'use strict';

const {
  dialogflow,
  BasicCard,
  SimpleResponse,
} = require('actions-on-google');
const functions = require('firebase-functions');
const fetch = require('isomorphic-fetch');

const URL = 'https://raw.githubusercontent.com/damanwhoislong/UrbanHacks/master/Data/Tourism_Points_of_Interest.json';


const app = dialogflow({debug: true});

// Retrieve data from the external API.
app.intent('Default Welcome Intent', (conv) => {
  // Note: Moving this fetch call outside of the app intent callback will
  // cause it to become a global var (i.e. it's value will be cached across
  // function executions).
  return fetch(URL)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((json) => {
      // Grab random quote data from JSON.
      const jsonData = json;
      let validLoc = [];
      let info = [];
      const longCov = 80.00;
      const latCov = 111.045;
      const r = 1;
      const coordLong = -79.87;
      const coordLat = 43.25888889;
      for (let i = 0; i < jsonData.length; i++) {
        info.push({
          'name': jsonData[i].TITLE,
          'x': jsonData[i].LONGITUDE,
          'y': jsonData[i].LATITUDE,
          'address': jsonData[i].ADDRESS,
          'desc': jsonData[i].DESCRIPTION,
        });
      }


      for (let j = 0; j < info.length; j++) {
        if (info[j].x < coordLong + (r / longCov) &&
        info[j].x > coordLong - (r / longCov) &&
        info[j].y < coordLat + (r / latCov) &&
        info[j].y > coordLat - (r / latCov)) {
          // check if its within the circle
          let dist = Math.sqrt(Math.pow((info[j].x - coordLong) * longCov, 2)
          + Math.pow((info[j].y - coordLat) * latCov, 2));
          if (dist < r) {
            validLoc.push({
              'name': info[j].name,
              'dist': dist,
              'address': info[j].address,
              'fax': info[j].desc});
          }
        }
      }

      validLoc.sort((a, b) => (a.dist > b.dist) ? 1
      : ((b.dist > a.dist) ? -1 : 0));

      const data = validLoc[0];
      const title = data.name;
      const address = data.address;
      const description = data.fax;
      conv.close(new SimpleResponse({
        text: json.info,
        speech: `The closest Hamiton Point of Interest is ${title},`
        + ` at ${address}.`,
      }));
      if (conv.screen) {
        conv.close(new BasicCard({
          text: title,
          title: `${title}`,
          text: `Address: ${address} \n` +
          `Description: ${description}`
        }));
      }
    });
});

exports.quotes = functions.https.onRequest(app);
