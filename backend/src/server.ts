import { config } from "dotenv";
import { loadDatabaseDriver } from "./repo/Driver";

config();

let driver = loadDatabaseDriver();
