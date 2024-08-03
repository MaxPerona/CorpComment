import Header from "../layout/Header";
import FeedbackList from "../feedback/FeedbackList";

export default function Container() {
  return (
    <main className="container">
      <Header />
      <FeedbackList />
    </main>
  );
}
