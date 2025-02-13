import mongoose from "mongoose"
import SeedUsers from "./userSeeder.js";
import dotenv from "dotenv"

dotenv.config()

const seedDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://jandusayjoe14:1VpIMPNLXd2YLlMd@cluster0.g1x9p.mongodb.net/rev-2?retryWrites=true&w=majority&appName=Cluster0")
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB', err));

        // write the seeder logic here
        // await SeedRoles();

        // temporarily remove
        // await SeedUsers();

        console.log("Finish Seeding");

        await mongoose.disconnect();
    } catch (error) {
        console.log("Unexpected Error occured while running the seeder");
        console.log(error)
    }
}

seedDatabase();