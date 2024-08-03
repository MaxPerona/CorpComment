import HashtagItem from "../HashtagItem";
import { useFeedbackItemsStore } from "../store/FeedbackItemStore";

export default function HashtagList() {
  const companyList = useFeedbackItemsStore((state) => state.getCompanyList());
  const selectCompany = useFeedbackItemsStore((state) => state.selectCompany);
  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashtagItem key={company} company={company} onClick={selectCompany} />
      ))}
    </ul>
  );
}
