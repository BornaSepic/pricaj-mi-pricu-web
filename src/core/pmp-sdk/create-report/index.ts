import { type Report, ReportCreateResponse } from "../types";
import { _post } from "../utilities";

export const _createReport = async (report: {
  title: string,
  description: string,
  readingId: number
}) => {
  return _post('/reports', {
    ...report
  }, ReportCreateResponse)
}