import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import format from "date-fns-tz/format";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import differenceInDays from "date-fns/differenceInDays";
import store from "./store";
import createSnackAlert from "./actions/snackAlerts";
import { FastfoodOutlined, SmsFailedSharp } from "@material-ui/icons";

export const getTimezoneValue = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const toZonedFormat = (date, formatString = "dd/MM/yy") => {
  return format(utcToZonedTime(date, getTimezoneValue()), formatString);
};

export const timeDiffFromNow = (date) => {
  return formatDistanceToNowStrict(utcToZonedTime(date, getTimezoneValue()), {
    addSuffix: true,
  });
};

export const diffInDaysFromNow = (date) => {
  const dateLeft = new Date(date);
  const dateRight = new Date();
  return differenceInDays(dateLeft, dateRight);
};

export const copyTextToClipboard = async (text, successFn, failFn) => {
  if (!navigator.clipboard) return;
  await navigator.clipboard.writeText(text).then(
    () => {
      if (successFn && typeof successFn !== "undefined") {
        return successFn();
      }
      store.dispatch(createSnackAlert("copied to clipboard", 0));
    },
    () => {
      if (failFn && typeof failFn !== "undefined") {
        return failFn();
      }
      store.dispatch(createSnackAlert("clipboard copy failed", 1));
    }
  );
};
let navigatorRunning = false;
export const shareData = async (data) => {
  if (!navigator || !navigator.share) return;
  if (!navigatorRunning) {
    navigatorRunning = true;
    await navigator
      .share(data)
      .then(() => {
        navigatorRunning = false;
      })
      .catch((err) => {
        console.log("share error", err);
        navigatorRunning = false;
      });
  }
};
