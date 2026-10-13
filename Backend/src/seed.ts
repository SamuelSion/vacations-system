// Seed script - populates an empty database with real vacation data for grading/demo purposes
// and makes sure the demo accounts work. Safe to run more than once. Run with: npm run seed

import mongoose from "mongoose";
import { appConfig } from "./utils/app-config";
import { VacationModel } from "./models/vacation-model";
import { UserModel } from "./models/user-model";
import { LikeModel } from "./models/like-model";
import { Role } from "./models/enums";
import { cyber } from "./utils/cyber";

const vacations = [
    {
        destination: "Santorini, Greece",
        description: "Wander the whitewashed streets of Oia and watch the world-famous sunset melt over the caldera. Santorini vacation packages include boat trips to the volcanic islets, wine tastings at cliffside vineyards, and lazy afternoons on black-sand beaches.",
        startDate: new Date("2026-09-25"),
        endDate: new Date("2026-10-05"),
        price: 1780,
        imageName: "santorini-greece.jpg"
    },
    {
        destination: "Paris, France",
        description: "Fall in love with the City of Light. Climb the Eiffel Tower at golden hour, stroll along the Seine, and spend your mornings in cozy cafes over croissants and coffee before an afternoon at the Louvre.",
        startDate: new Date("2026-08-20"),
        endDate: new Date("2026-09-01"),
        price: 1450,
        imageName: "paris-france.jpg"
    },
    {
        destination: "Barcelona, Spain",
        description: "Soak up Gaudi's surreal architecture at the Sagrada Familia and Park Guell, then unwind on the golden sands of Barceloneta Beach. Evenings mean tapas, flamenco, and the lively buzz of Las Ramblas.",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-09-12"),
        price: 1290,
        imageName: "barcelona-spain.jpg"
    },
    {
        destination: "Stonehenge, England",
        description: "Stand among the ancient standing stones of Stonehenge and imagine the world of the people who raised them thousands of years ago. Includes visits to nearby Bath, the Cotswolds, and traditional countryside pubs.",
        startDate: new Date("2026-08-25"),
        endDate: new Date("2026-09-15"),
        price: 990,
        imageName: "stonehenge-england.jpg"
    },
    {
        destination: "Reykjavik, Iceland",
        description: "Chase the northern lights across dramatic lava fields, soak in the geothermal waters of the Blue Lagoon, and explore glaciers and waterfalls on the Golden Circle route.",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2026-10-10"),
        price: 1620,
        imageName: "reykjavik-iceland.jpg"
    },
    {
        destination: "Bora Bora, French Polynesia",
        description: "Sleep in an overwater bungalow above a lagoon of impossible turquoise, snorkel with reef sharks and stingrays, and watch the sun set behind Mount Otemanu from your private deck.",
        startDate: new Date("2026-11-10"),
        endDate: new Date("2026-11-20"),
        price: 4200,
        imageName: "bora-bora.jpg"
    },
    {
        destination: "Auckland, New Zealand",
        description: "Base yourself in Auckland and venture out to Milford Sound's towering fjords, hike volcanic craters, and enjoy world-class wine in Waiheke Island's vineyards.",
        startDate: new Date("2026-12-05"),
        endDate: new Date("2026-12-15"),
        price: 3150,
        imageName: "new-zealand.jpg"
    },
    {
        destination: "Sydney, Australia",
        description: "Take in the iconic Opera House and Harbour Bridge, surf at Bondi Beach, and take a day trip to the Blue Mountains. Sydney vacation packages include a sunset harbour cruise.",
        startDate: new Date("2027-01-10"),
        endDate: new Date("2027-01-20"),
        price: 2980,
        imageName: "australia.jpg"
    },
    {
        destination: "Kyoto, Japan",
        description: "Walk beneath thousands of vermillion torii gates at Fushimi Inari, visit serene bamboo groves, and experience a traditional tea ceremony in one of Japan's most beautiful historic cities.",
        startDate: new Date("2026-10-15"),
        endDate: new Date("2026-10-25"),
        price: 2340,
        imageName: "kyoto-japan.jpg"
    },
    {
        destination: "Machu Picchu, Peru",
        description: "Trek the Inca Trail through cloud forest and mountain passes to reach the lost city of Machu Picchu at sunrise - one of the most unforgettable views on Earth.",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-10"),
        price: 2150,
        imageName: "machu-picchu-peru.jpg"
    },
    {
        destination: "Jaipur, India",
        description: "Explore the Pink City's magnificent forts and palaces, ride an elephant up to Amber Fort, and shop for vibrant textiles and jewelry in the bustling bazaars.",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-10"),
        price: 1120,
        imageName: "india.jpg"
    },
    {
        destination: "Rio de Janeiro, Brazil",
        description: "Take the tram up to Christ the Redeemer for panoramic views, relax on Copacabana and Ipanema beaches, and hike Sugarloaf Mountain at sunset.",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-07-10"),
        price: 1680,
        imageName: "rio-de-janeiro-brazil.jpg"
    },
    {
        destination: "Dubai, UAE",
        description: "Marvel at the Burj Khalifa, ride a dune buggy through the desert at sunset, and shop in the world's largest malls. Dubai vacation packages include a traditional dhow dinner cruise.",
        startDate: new Date("2026-10-20"),
        endDate: new Date("2026-10-30"),
        price: 1990,
        imageName: "dubai-uae.jpg"
    },
    {
        destination: "Maldives",
        description: "Escape to a private overwater villa surrounded by coral reefs and crystal-clear water. Snorkel with manta rays, enjoy a candlelit dinner on the sand, and do absolutely nothing else.",
        startDate: new Date("2026-12-20"),
        endDate: new Date("2026-12-30"),
        price: 3800,
        imageName: "maldives.jpg"
    }
];

// Create a demo account, or repair it if it already exists with a password hash
// that does not match the current HASH_SALT (e.g. HASH_SALT was changed later):
async function ensureDemoUser(firstName: string, lastName: string, email: string, plainPassword: string, roleId: Role, previousEmail?: string) {
    const hashedPassword = cyber.hash(plainPassword);
    // A previous email lets an older database keep its user (and likes) while the email is renamed:
    const existingUser = await UserModel.findOne({ email }).exec() || (previousEmail ? await UserModel.findOne({ email: previousEmail }).exec() : null);

    if (!existingUser) {
        const createdUser = await UserModel.create({ firstName, lastName, email, password: hashedPassword, roleId });
        console.log(`Created demo account: ${email} / ${plainPassword}`);
        return createdUser;
    }

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = email;
    existingUser.password = hashedPassword;
    existingUser.roleId = roleId;
    await existingUser.save();
    console.log(`Demo account ${email} is ready (password reset to the documented demo password).`);
    return existingUser;
}

async function seed() {
    await mongoose.connect(appConfig.mongodbConnectionString);
    console.log("Connected to MongoDB for seeding.");

    // Demo accounts are always ensured, so the README credentials always work:
    await ensureDemoUser("Dana", "Levi", "dana@vacations.com", "dana1234", Role.Admin, "admin@vacations.com");
    const user = await ensureDemoUser("Moshe", "Cohen", "moshe@vacations.com", "moshe1234", Role.User, "user@vacations.com");
    await ensureDemoUser("Noa", "Shapira", "noa@vacations.com", "noa1234", Role.User);

    // Vacations and likes are seeded only into an empty database,
    // so running the seed again never deletes existing data:
    const vacationsCount = await VacationModel.countDocuments().exec();
    if (vacationsCount > 0) {
        console.log(`Database already has ${vacationsCount} vacations - skipping vacations and likes.`);
        await mongoose.disconnect();
        return;
    }

    const dbVacations = await VacationModel.insertMany(vacations);
    console.log(`Inserted ${dbVacations.length} vacations.`);

    // Seed a handful of likes from the demo user so the report page isn't empty:
    const likedDestinations = ["Santorini, Greece", "Bora Bora, French Polynesia", "Kyoto, Japan", "Maldives"];
    for (const destination of likedDestinations) {
        const vacation = dbVacations.find(v => v.destination === destination);
        if (vacation) {
            await LikeModel.create({ userId: user._id, vacationId: vacation._id });
        }
    }
    console.log("Seeded demo likes.");

    console.log("Seeding complete.");
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
