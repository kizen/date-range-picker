import { addDays, subDays, startOfMonth, startOfYear, setYear } from "date-fns";
import { setTimingMargin } from "./utils";

export default {
  today: {
    label: "today",
    value: [setTimingMargin(new Date()), setTimingMargin(new Date(), "right")],
    closeOverlay: false,
    customPlaceholderLabel: "Today"
  },
  yesterday: {
    label: "yesterday",
    value: [
      setTimingMargin(addDays(new Date(), -1)),
      setTimingMargin(addDays(new Date(), -1), "right")
    ],
    closeOverlay: false,
    customPlaceholderLabel: "Yesterday"
  },
  thisMonth: {
    label: "thisMonth",
    value: [
      setTimingMargin(startOfMonth(new Date())),
      setTimingMargin(new Date(), "right")
    ],
    closeOverlay: false,
    default: true,
    customPlaceholderLabel: "This Month"
  },
  last7Days: {
    label: "last7Days",
    value: [
      setTimingMargin(subDays(new Date(), 6)),
      setTimingMargin(new Date(), "right")
    ],
    closeOverlay: false
  },
  last30Days: {
    label: "last30Days",
    value: [
      setTimingMargin(subDays(new Date(), 29)),
      setTimingMargin(new Date(), "right")
    ],
    closeOverlay: false
  },
  thisYear: {
    label: "thisYear",
    value: [
      setTimingMargin(startOfYear(new Date())),
      setTimingMargin(new Date(), "right")
    ],
    closeOverlay: false,
    customPlaceholderLabel: "This Year"
  },
  allTime: {
    label: "allTime",
    value: [
      //hard coded to Jan 1, 2000... for now, potentially a prop to pass in

      setTimingMargin(setYear(startOfYear(new Date()), 2000)),
      setTimingMargin(new Date(), "right")
    ],
    closeOverlay: false,
    isAllTime: true,
    customPlaceholderLabel: "All Time"
  }
};
