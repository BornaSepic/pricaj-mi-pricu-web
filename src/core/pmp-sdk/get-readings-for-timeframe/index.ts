import { ReadingsByDate } from "../types";
import { _get } from "../utilities"

export const _getReadingsForTimeframe = async (from: Date, to: Date) => {
  const formattedFrom = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
  const formattedTo = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;

  return _get(`/readings/user?from=${formattedFrom}&to=${formattedTo}`, ReadingsByDate)
}