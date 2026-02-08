import { getPageData } from './src/lib/api.js';

async function test() {
    console.log("Testing getPageData('home')...");
    const data = await getPageData('home');
    console.log("Data result:", data ? "Found (Object)" : "Not Found (null)");
    if (data) {
        console.log("Title:", data.title);
        console.log("Section count:", data.sections?.length);
    }

    console.log("\nTesting getPageData('services')...");
    const services = await getPageData('services');
    console.log("Services result:", services ? "Found (Object)" : "Not Found (null)");
}

test().catch(console.error);
