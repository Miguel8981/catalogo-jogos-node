import records from "./wikiGames.json";
import { normalizeGame } from "./wikiGameUtils";

export { normalizeGame };
export default records.map(normalizeGame);
