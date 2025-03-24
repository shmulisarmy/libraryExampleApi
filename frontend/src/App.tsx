import { createResource, Show, type Component } from 'solid-js';
import { Book, TerinlaApi, TerinlaApi } from './api';  // Import generated types

const api = 'http://localhost:3030';

// Create resource for books
const [books, { mutate }] = createResource<Book[]>(() =>
  fetch(`${api}/books`).then((res) => res.json())
);




const app = new TerinlaApi()


app.booksGet()

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Show when={!books.loading} fallback={<div>Loading...</div>}>
        <Show when={books()} fallback={<div>No books available</div>}>
          <ul>
            {books()!.map((book) => (
              <li>{book.title}</li>
            ))}
          </ul>
        </Show>
      </Show>
    </div>
  );
};

export default App;
