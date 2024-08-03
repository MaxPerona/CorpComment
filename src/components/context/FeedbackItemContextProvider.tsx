import { createContext, useMemo, useState } from "react";
import { useFeedbackItems } from "../../lib/hooks";
import { TFeedbackItem } from "../../lib/types";

type TFeedbackItemsContext = {
  filteredFeedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  companyList: string[];
  handleAddToList: (text: string) => void;
  handleCompanySelect: (company: string) => void;
};
type FeedbackItemContextProviderProps = {
  children: React.ReactNode;
};
export const FeedbackItemsContext = createContext<TFeedbackItemsContext | null>(
  null
);

export default function FeedbackItemContextProvider({
  children,
}: FeedbackItemContextProviderProps) {
  const { feedbackItems, isLoading, errorMessage, setFeedbackItems } =
    useFeedbackItems();
  const [selectedCompany, setSelectedCompany] = useState("");

  const companyList = useMemo(
    () =>
      feedbackItems
        .map((item) => item.company)
        .filter(
          (company, index, companies) => companies.indexOf(company) === index
        ),
    [feedbackItems]
  );

  const filteredFeedbackItems = useMemo(
    () =>
      selectedCompany
        ? feedbackItems.filter((item) => item.company === selectedCompany)
        : feedbackItems,

    [selectedCompany, feedbackItems]
  );

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };
  const handleAddToList = async (text: string) => {
    const companyName = text.split(" ").find((word) => word.startsWith("#"))!;
    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName.replace("#", ""),
      badgeLetter: companyName?.charAt(1).toLocaleUpperCase(),
    };
    setFeedbackItems([...feedbackItems, newItem]);
    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      }
    );
  };

  return (
    <FeedbackItemsContext.Provider
      value={{
        filteredFeedbackItems,
        isLoading,
        errorMessage,
        companyList,
        handleAddToList,
        handleCompanySelect,
      }}
    >
      {children}
    </FeedbackItemsContext.Provider>
  );
}
