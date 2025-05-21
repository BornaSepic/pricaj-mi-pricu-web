import { Events } from "../types";
import { get } from "../utilities";

export const _getEvents = async () => {
  return get(`/events`, Events)
}