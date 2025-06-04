import { type Report, ReportCreateResponse } from "../types";
import { _patch, _post } from "../utilities";

export const _updateReport = async (report: Report) => {
  return _patch(`/reports/${report.id}`, {
    title: report.title,
    description: report.description,
  }, ReportCreateResponse)
}