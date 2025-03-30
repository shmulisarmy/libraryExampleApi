import BookCard from "./BookCard";
import { Book } from "../data/books";

interface BookListProps {
  books: Book[];
}

export default function BookList(props: BookListProps) {
  return (
    <ul class="space-y-4 " style={{
      display: "grid",
      "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
      margin: "40px",
      gap: "1rem",

    }}>
      {props.books.length > 0 ? (
        props.books.map((book) => <BookCard book={book} />)
      ) : (
        <p class="text-center">No books found.</p>
      )}
    </ul>
  );
}
