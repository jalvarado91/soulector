import format from "date-fns/format";

export function createLargeSoundtrackThumbUrl(url: string) {
  const newUrl = url.replace("-large", "-t500x500");
  return newUrl;
}

export function formatTime(timeMillis: number) {
  const seconds = Math.floor((timeMillis / 1000) % 60);
  const minutes = Math.floor((timeMillis / (1000 * 60)) % 60);
  const hours = Math.floor((timeMillis / (1000 * 60 * 60)) % 24);

  const secsStr = `${seconds}`.padStart(2, "0");
  const minsStr = `${minutes}`.padStart(2, "0");
  const hrsStr = hours !== 0 ? `${hours}:` : "";

  return `${hrsStr}${minsStr}:${secsStr}`;
}

export function formatTimeSecs(timeSeconds: number) {
  return formatTime(timeSeconds * 1000);
}

export function formatDate(dateString: string) {
  var date = new Date(dateString);
  return format(date, "MMMM do yyyy");
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
