import { Activities } from "../types";
import { _get } from "../utilities";

export const _getEvents = async () => {
  return _get(`/events`, Activities)
}