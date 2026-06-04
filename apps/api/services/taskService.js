import { supabase } from "../lib/supabase.js";

const QUICK_SUGGEST_STATUSES = ["todo", "in_progress"];

/**
 * Rank năng lượng cho tie-break AC4-4 (high → medium → low).
 * Không dùng ORDER BY energy_level DESC trên DB vì TEXT sort theo alphabet
 * ('medium' > 'low' > 'high'), không phản ánh mức năng lượng thực tế.
 */
const ENERGY_RANK = { high: 3, medium: 2, low: 1 };

const SUGGEST_SELECT =
  "id, title, estimated_min, eisenhower_q, energy_level, status";

/**
 * PB_4 — gợi ý tối đa 2 task vừa khung thời gian (AC4-3, AC4-4).
 *
 * @param {string} userId - UUID từ JWT
 * @param {number} minutes - 15 | 30 | 60
 * @returns {Promise<Array<{ id: string, title: string, estimated_min: number, eisenhower_q: number, energy_level: string, status: string }>>}
 */
export async function getQuickSuggest(userId, minutes) {
  const { data, error } = await supabase
    .from("tasks")
    .select(SUGGEST_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .in("status", QUICK_SUGGEST_STATUSES)
    .lte("estimated_min", minutes);

  if (error) {
    throw error;
  }

  if (!data?.length) {
    return [];
  }

  // Sắp xếp: eisenhower_q tăng dần (1→4); nếu bằng nhau thì energy_level giảm dần (high→medium→low).
  // ORDER BY energy_level DESC trên TEXT không đúng thứ tự mong muốn — dùng ENERGY_RANK trong app.
  return [...data]
    .sort((a, b) => {
      if (a.eisenhower_q !== b.eisenhower_q) {
        return a.eisenhower_q - b.eisenhower_q;
      }
      return (
        (ENERGY_RANK[b.energy_level] ?? 0) - (ENERGY_RANK[a.energy_level] ?? 0)
      );
    })
    .slice(0, 2);
}
