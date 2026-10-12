import path from "path";
import { saver } from "smart-saver";

// Configure once - all vacation images live in src/assets/images:
saver.config(path.join(__dirname, "..", "assets", "images"));

export { saver };
