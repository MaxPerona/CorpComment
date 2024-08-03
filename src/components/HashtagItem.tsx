import { HashtagItemProps } from "../lib/types";

export default function HashtagItem({ onClick, company }: HashtagItemProps) {
  return (
    <li>
      <button onClick={() => onClick(company)}>#{company}</button>
    </li>
  );
}
