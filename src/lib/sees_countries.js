const fs = require("fs");
const https = require("https");
// const unzipper = require('unzipper');
const readline = require("readline");

const downloadUrl =
  "https://download.geonames.org/export/dump/allCountries.zip";
const zipFilePath = "./allCountries.zip";
const extractedFilePath = "./allCountries.txt";
const outputFilePath = "./countries.json";

// Function to download the zip file
const downloadZipFile = () => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipFilePath);
    https
      .get(downloadUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (error) => {
        fs.unlink(zipFilePath, () => reject(error));
      });
  });
};

// Function to extract the zip file
const extractZipFile = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        const fileName = entry.path;
        if (fileName === "allCountries.txt") {
          entry
            .pipe(fs.createWriteStream(extractedFilePath))
            .on("finish", resolve)
            .on("error", reject);
        } else {
          entry.autodrain();
        }
      })
      .on("error", reject);
  });
};

// Function to process the extracted file and create JSON
const processFile = () => {
  return new Promise((resolve, reject) => {
    const countries = {};
    const rl = readline.createInterface({
      input: fs.createReadStream(extractedFilePath, { encoding: "utf-8" }),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const [countryCode, postalCode, name, ...rest] = line.split("\t");
      const countryData = countries[countryCode] || {
        name: "",
        supports: "",
        states: [],
        provinces: [],
        districts: [],
      };
      if (!countryData.name) countryData.name = name;
      if (!countryData.supports && (postalCode || "").length > 0)
        countryData.supports = "state"; // Assuming postal code presence means it supports states
      if (countryData.supports === "state") {
        countryData.states.push({ name, postalCode });
      } else {
        // Logic to determine if it's province or district based on your requirements
      }
      countries[countryCode] = countryData;
    });

    rl.on("close", () => {
      fs.writeFile(
        outputFilePath,
        JSON.stringify(Object.values(countries), null, 2),
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    rl.on("error", reject);
  });
};

// Execute the script
(async () => {
  try {
    console.log("Downloading zip file...");
    //await downloadZipFile();
    console.log("Extracting zip file...");
    //await extractZipFile();
    console.log("Processing data...");
    await processFile();
    console.log("JSON file created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clean up: Delete the downloaded zip file and extracted text file
    fs.unlink(zipFilePath, () => {});
    fs.unlink(extractedFilePath, () => {});
  }
})();
