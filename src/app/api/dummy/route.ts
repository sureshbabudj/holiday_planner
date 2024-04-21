
import { NextResponse } from 'next/server'

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

        return NextResponse.json({ "addresses": Array.from({ length }, generateRandomAddress) }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}