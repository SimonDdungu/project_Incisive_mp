import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "../models/";

const sqlite = openDatabaseSync("incisive_mp.db");

export const db = drizzle(sqlite, { schema });