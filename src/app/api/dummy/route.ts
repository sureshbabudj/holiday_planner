
import { NextResponse } from 'next/server'
import { samplePlans } from './sample';

// Sample data for generating random words
const cities = ['New York', 'Los Angeles', 'London', 'Paris', 'Berlin'];
const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois'];
const countries = ['USA', 'Canada', 'UK', 'France', 'Germany'];

// Function to generate a random word from an array
const randomWord = (array: string[]) => array[Math.floor(Math.random() * array.length)];

// Function to generate a random address object
const generateRandomAddress = () => {
    const latitude = Math.random() * (90 - (-90)) + (-90);
    const longitude = Math.random() * (180 - (-180)) + (-180);
    const city = randomWord(cities);
    const state = randomWord(states);
    const country = randomWord(countries);
    const countryCode = country.substring(0, 2).toUpperCase();
    const countryFlag = getCountryFlag(countryCode);
    const distance = Math.floor(Math.random() * 100000); // Random distance
    const stateCode = state.substring(0, 2).toUpperCase();
    const formattedAddress = `${city}, ${stateCode} ${countryCode}`;
    const addressLabel = state;

    return {
        latitude,
        longitude,
        geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
        },
        country,
        countryCode,
        countryFlag,
        distance,
        city,
        stateCode,
        state,
        layer: "state",
        formattedAddress,
        addressLabel
    };
};

// Function to get country flag emoji based on country code
const getCountryFlag = (countryCode: any) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char: any) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};



export async function GET(request: Request) {
    try {
        const query = new URL(request.url).searchParams.get('query');
        const length = parseInt(new URL(request.url).searchParams.get('length') || '10');

        // return NextResponse.json({ "addresses": Array.from({ length }, generateRandomAddress) }, { status: 200 });
        return NextResponse.json(samplePlans, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function returnEnv() {
    return {
        "GOOGLE_MAPS_API": "AIzaSyDTja02YJWoFhHT1Jn7n8kxQRD9DBtrTNo",
        "HUGGIG_FACE_TOKEN": "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",
        "RADAR_API_TOKEN": "prj_test_pk_befc3ea1d6615d799f0464facde134cefeee4b8a",
    }
}

function getPointOfinterests() {
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=point+of+interest&location=37.76999,-122.44696&radius=500&key=AIzaSyDTja02YJWoFhHT1Jn7n8kxQRD9DBtrTNo"
    return { "predictions": [{ "description": "Point of Interest (Majestic Plains), Carr, CO, USA", "matched_substrings": [{ "length": 17, "offset": 0 }], "place_id": "ChIJ-ddYMRnZbocR-OcXqjeEVlI", "reference": "ChIJ-ddYMRnZbocR-OcXqjeEVlI", "structured_formatting": { "main_text": "Point of Interest (Majestic Plains)", "main_text_matched_substrings": [{ "length": 17, "offset": 0 }], "secondary_text": "Carr, CO, USA" }, "terms": [{ "offset": 0, "value": "Point of Interest (Majestic Plains)" }, { "offset": 37, "value": "Carr" }, { "offset": 43, "value": "CO" }, { "offset": 47, "value": "USA" }], "types": ["point_of_interest", "establishment"] }, { "description": "point of interest, Atlanta Highway, Gainesville, GA, USA", "matched_substrings": [{ "length": 17, "offset": 0 }], "place_id": "ChIJ14UKTWn39YgRus_ng9NiZLw", "reference": "ChIJ14UKTWn39YgRus_ng9NiZLw", "structured_formatting": { "main_text": "point of interest", "main_text_matched_substrings": [{ "length": 17, "offset": 0 }], "secondary_text": "Atlanta Highway, Gainesville, GA, USA" }, "terms": [{ "offset": 0, "value": "point of interest" }, { "offset": 19, "value": "Atlanta Highway" }, { "offset": 36, "value": "Gainesville" }, { "offset": 49, "value": "GA" }, { "offset": 53, "value": "USA" }], "types": ["restaurant", "food", "point_of_interest", "establishment"] }, { "description": "Point of interest, Bone Road, Nebo, KY, USA", "matched_substrings": [{ "length": 17, "offset": 0 }], "place_id": "ChIJJ5NoNXwJcIgRHuRszOzKJpw", "reference": "ChIJJ5NoNXwJcIgRHuRszOzKJpw", "structured_formatting": { "main_text": "Point of interest", "main_text_matched_substrings": [{ "length": 17, "offset": 0 }], "secondary_text": "Bone Road, Nebo, KY, USA" }, "terms": [{ "offset": 0, "value": "Point of interest" }, { "offset": 19, "value": "Bone Road" }, { "offset": 30, "value": "Nebo" }, { "offset": 36, "value": "KY" }, { "offset": 40, "value": "USA" }], "types": ["point_of_interest", "establishment"] }, { "description": "Virginia Dale Point of Interest, Livermore, CO, USA", "matched_substrings": [{ "length": 17, "offset": 14 }], "place_id": "ChIJpSpayo3faIcRr8oSRXykTbs", "reference": "ChIJpSpayo3faIcRr8oSRXykTbs", "structured_formatting": { "main_text": "Virginia Dale Point of Interest", "main_text_matched_substrings": [{ "length": 17, "offset": 14 }], "secondary_text": "Livermore, CO, USA" }, "terms": [{ "offset": 0, "value": "Virginia Dale Point of Interest" }, { "offset": 33, "value": "Livermore" }, { "offset": 44, "value": "CO" }, { "offset": 48, "value": "USA" }], "types": ["point_of_interest", "establishment"] }, { "description": "Point of interest, The Drift, Grantham, UK", "matched_substrings": [{ "length": 17, "offset": 0 }], "place_id": "ChIJDzgjCiYpeEgRxE3Od5HiovU", "reference": "ChIJDzgjCiYpeEgRxE3Od5HiovU", "structured_formatting": { "main_text": "Point of interest", "main_text_matched_substrings": [{ "length": 17, "offset": 0 }], "secondary_text": "The Drift, Grantham, UK" }, "terms": [{ "offset": 0, "value": "Point of interest" }, { "offset": 19, "value": "The Drift" }, { "offset": 30, "value": "Grantham" }, { "offset": 40, "value": "UK" }], "types": ["point_of_interest", "establishment"] }], "status": "OK" }
}