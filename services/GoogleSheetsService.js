const fs = require('fs');
const { google } = require('googleapis');
const handlebars = require('handlebars');
const handlebarsHelpers = require('../helpers/handlebars-helpers.js');
const spreadSheetId = process.env.TF2_SPREADSHEET_ID;

// Configure the Google Sheets API client
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));
const client = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);

const sheets = google.sheets({ version: 'v4', auth: client });

module.exports = {
    getRTBStats: async (req, res) => {
        try {
            // Get the data from the Google Sheets spreadsheet
            let playerStatsData = {};
            playerStatsData.scout = await getScoutData();
            playerStatsData.soldier = await getSoldierData();
            playerStatsData.demoman = await getDemomanData();
            playerStatsData.medic = await getMedicData();

            // Read the Handlebars template file and compile it
            const templateString = fs.readFileSync('views/layouts/tf2StatsPage.hbs', 'utf8');
            const partialsString = fs.readFileSync('views/partials/tf2StatsTable.hbs', 'utf8');

            handlebars.registerPartial('tf2StatsTable', partialsString);
            handlebars.registerHelper('splitLogs', handlebarsHelpers.splitLogs);
            const template = handlebars.compile(templateString);
            
            const html = template(playerStatsData);
            return html;
        } catch (err) {
            throw err;
        }
    }
}

async function getScoutData() {
    const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetId,
        range: 'Scouts', // Replace with your sheet name and range
    });

    // Format the data into an object
    data.values.shift();
    const scouts = data.values.reduce((acc, [steam3id, aliases, kills, deaths, assists, avgDpm, avgDtm, deltaDmg, kd, kad, k30, d30, tdt, td, totalTime, logs, comboLogs, flankLogs, role, notes]) => {
        acc[steam3id] = {
          steam3id,
          aliases,
          kills,
          deaths,
          assists,
          avgDpm,
          avgDtm,
          deltaDmg,
          "K/D": kd,
          "KA/D": kad,
          "K/30": k30,
          "D/30": d30,
          totalTime,
          logs,
          role,
          notes
        };
        return acc;
      }, {});

    return scouts;
}

async function getSoldierData() {
    const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetId,
        range: 'Soldiers', // Replace with your sheet name and range
    });

    // Format the data into an object
    data.values.shift();
    const soldiers = data.values.reduce((acc, [steam3id, aliases, kills, deaths, assists, avgDpm, avgDtm, deltaDmg, kd, kad, k30, d30, tdt, td, totalTime, logs, comboLogs, flankLogs, role, notes]) => {
        acc[steam3id] = {
          steam3id,
          aliases,
          kills,
          deaths,
          assists,
          avgDpm,
          avgDtm,
          deltaDmg,
          "K/D": kd,
          "KA/D": kad,
          "K/30": k30,
          "D/30": d30,
          totalTime,
          logs,
          role,
          notes
        };
        return acc;
      }, {});

    return soldiers;
}

async function getDemomanData() {
    const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetId,
        range: 'Demos', // Replace with your sheet name and range
    });

    // Format the data into an object
    data.values.shift();
    const demos = data.values.reduce((acc, [steam3id, aliases, kills, deaths, assists, avgDpm, avgDtm, deltaDmg, kd, kad, k30, d30, tdt, td, totalTime, logs, role, notes]) => {
        acc[steam3id] = {
          steam3id,
          aliases,
          kills,
          deaths,
          assists,
          avgDpm,
          avgDtm,
          deltaDmg,
          "K/D": kd,
          "KA/D": kad,
          "K/30": k30,
          "D/30": d30,
          totalTime,
          logs,
          notes
        };
        return acc;
      }, {});

    return demos;
}

async function getMedicData() {
    const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetId,
        range: 'Medics', // Replace with your sheet name and range
    });

    // Format the data into an object
    data.values.shift();
    const medics = data.values.reduce((acc, [steam3id, aliases, kills, deaths, assists, avgDpm, avgDtm, deltaDmg, kd, kad, k30, d30, tdt, td, totalTime, logs, ubers, totalHealing, drops, avgHpm, ubers30, drops30, notes]) => {
        acc[steam3id] = {
          steam3id,
          aliases,
          kills,
          deaths,
          assists,
          avgDpm,
          avgDtm,
          deltaDmg,
          "K/D": kd,
          "KA/D": kad,
          "K/30": k30,
          "D/30": d30,
          totalTime,
          logs,
          ubers, 
          totalHealing, 
          drops, 
          avgHpm, 
          "Ubers/30": ubers30, 
          "Drops/30": drops30,
          notes
        };
        return acc;
      }, {});

    return medics;
}