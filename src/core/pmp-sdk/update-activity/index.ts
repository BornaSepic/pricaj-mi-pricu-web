import { GenericResponse, UpdateActivityPayload } from "../types";
import { _patch, _post } from "../utilities";

export const _updateActivity = async (activity: UpdateActivityPayload) => {
  return _patch(`/events/${activity.id}`, {
    title: activity.title,
    description: activity.description,
    date: activity.date,
    limit: activity.limit
  }, GenericResponse)
}
