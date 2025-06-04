
import { ReportDeleteResponse } from "../types";
import { _delete } from "../utilities";

export const _deleteReport = async (id: number) => {
  return _delete(`/reports/${id}`, ReportDeleteResponse)
}