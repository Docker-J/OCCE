import axios from "axios";

export async function loader() {
  try {
    const response = await axios.get("/api/bible291/today");
    return response.data;
  } catch (error) {
    console.error("Failed to load Bible 291 schedule from backend:", error);
    return { today: "", match: null };
  }
}
