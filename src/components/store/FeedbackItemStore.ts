import { create } from "zustand";
import { TFeedbackItem } from "../../lib/types";

type TFeedbackItemsStore = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  selectedCompany: string;
  errorMessage: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<TFeedbackItemsStore>(
  (set, get) => ({
    feedbackItems: [],
    isLoading: false,
    selectedCompany: "",
    errorMessage: "",
    getCompanyList: () => {
      const state = get();
      return state.feedbackItems
        .map((item) => item.company)
        .filter(
          (company, index, companies) => companies.indexOf(company) === index
        );
    },
    getFilteredFeedbackItems: () => {
      const state = get();

      return state.selectedCompany
        ? get().feedbackItems.filter(
            (item) => item.company === get().selectedCompany
          )
        : get().feedbackItems;
    },
    addItemToList: async (text: string) => {
      const companyName = text.split(" ").find((word) => word.startsWith("#"))!;
      const newItem: TFeedbackItem = {
        id: new Date().getTime(),
        text: text,
        upvoteCount: 0,
        daysAgo: 0,
        company: companyName.replace("#", ""),
        badgeLetter: companyName?.charAt(1).toLocaleUpperCase(),
      };
      set((state) => ({
        feedbackItems: [...state.feedbackItems, newItem],
      }));
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
    },
    selectCompany: (company: string) => {
      set(() => ({
        selectedCompany: company,
      }));
    },
    fetchFeedbackItems: async () => {
      set(() => ({
        isLoading: true,
      }));
      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch feedback items");
        }
        const data = await response.json();
        set(() => ({
          feedbackItems: data.feedbacks,
          isLoading: false,
        }));
      } catch (error) {
        set(() => ({
          errorMessage: "Failed to fetch feedback items",
          isLoading: false,
        }));
      }
    },
  })
);
