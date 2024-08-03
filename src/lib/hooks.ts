import { useContext, useEffect, useState } from "react";
import { TFeedbackItem } from "./types";
import { FeedbackItemsContext } from "../components/context/FeedbackItemContextProvider";

export const useFeedbackItemsContext = () => {
  const context = useContext(FeedbackItemsContext);
  if (!context) {
    throw new Error(
      "useFeedbackItemsContext must be used within a FeedbackItemContextProvider"
    );
  }
  return context;
};

export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setIsLoading(true);
    const fetchFeedbackItems = async () => {
      setIsLoading(true);
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback items");
      }
      const data = await response.json();
      setFeedbackItems(data.feedbacks);
      setIsLoading(false);
    };

    fetchFeedbackItems().catch((error) => {
      setErrorMessage(error.message);
      setIsLoading(false);
    });
  }, []);
  return {
    feedbackItems,
    setFeedbackItems,
    isLoading,
    errorMessage,
  };
}
