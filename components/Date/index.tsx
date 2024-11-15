import dayjs from "dayjs";

export default function Date({ dateString }: { dateString: string }) {
  const date = dayjs(dateString).format('YYYY-MM-DD');
  return <time dateTime={dateString}>{date}</time>;
}