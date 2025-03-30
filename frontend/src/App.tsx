import { createSignal, createEffect, createMemo, createResource, Show } from "solid-js";
import { mockBooks, Book } from "./data/books";
import SearchFilter from "./components/SearchFilter";
import BookList from "./components/BookList";
import Header from "./components/header";
import './index.css';
import Alert from "./components/Alert/Alert";
import Tag, { CSSProperties } from "./components/Tag";
import { render } from "solid-js/web";
import NavBar from "./components/Nav";
import { localStorageCreateResource } from "./utils";
import { apiUrl } from "./settings";

function App() {
  const [search, setSearch] = createSignal<string>("");
  const [filterAvailable, setFilterAvailable] = createSignal<boolean>(false);
  const [selectedCategory, setSelectedCategory] = createSignal<string>("All");


  createEffect(() => console.log(search()))



  const [books, setBooks] = localStorageCreateResource('books', `${apiUrl}/booksWithComments`)


const [filteredBooks, setFilteredBooks] = createSignal<Book[]>([])
  createEffect(() =>
    setFilteredBooks(books().filter((book) =>
      book.title.toLowerCase().includes(search().toLowerCase()) &&
      (!filterAvailable() || book.available === 1) &&
      (selectedCategory() === "All" || book.category === selectedCategory())
    ))
  );

  return (
    <>
    <NavBar></NavBar>
    <Header></Header>
    <button onClick={() => {
      render(
        () => <Alert type="info"  >
          <h3>you need to be signed in to borrow a book </h3>
          <button
            style={{
              transform: "scale(.9)",
              "border-color": "lightblue",
              background: "black",
              color: "lightblue",
              padding: "4px 8px",
              "border-radius": "8px",
              "font-weight": "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            >Sign in</button>
        </Alert>, actualAlertContainer!
      );
    }}>show alert</button>
    <div class="alert-container" style={{
      position: "fixed",
      bottom: "10px",
      left: "10px",
      "z-index": "1000",
    }}>
      <div id="actualAlertContainer" style={{position: "relative"}}>


    <Alert type="info"  >
      {/* <div style={{display: "flex", "align-items": "center", gap: "10px", padding: "0px"}}> */}

       <h3>you need to be signed in to borrow a book </h3>
       <button
       style={{
        transform: "scale(.9)",
        "border-color": "lightblue",
         background: "black",
         color: "lightblue",
         padding: "4px 8px",
         "border-radius": "8px",
         "font-weight": "600",
        //  padding: "4px 8px",
         cursor: "pointer",
         transition: "background-color 0.3s",
        }}
        >Sign in</button>
        {/* </div> */}
    </Alert>
    <Alert duration={4000} type="warning" >
      <h3>

      you are a well respected member member
      </h3>

      </Alert>

  



      <Alert duration={10000} type="success" >
      <h3>

      you are a well respected member member
      </h3>


      </Alert>
      
      </div>

    </div>
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <Nav   setSearch={setSearch} setFilterAvailable={setFilterAvailable} setSelectedCategory={setSelectedCategory}  />
      <Show when={books()}>
        <BookList books={filteredBooks()!} />
      </Show>
    </div>
    </>
  );
}

export default App;













function Nav({ setSearch, setFilterAvailable, setSelectedCategory }: any) {
  const [isAvailableOpen, setIsAvailableOpen] = createSignal(false);
  const [isCategoryOpen, setIsCategoryOpen] = createSignal(false);

  const toggleAvailableDropdown = () => setIsAvailableOpen(!isAvailableOpen());
  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen());

  return (
    <div
      style={{
        "background-clip": "#2D3748",
        "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "border-radius": "8px",
        padding: "24px",
        width: "100%",
        "max-width": "640px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ "font-size": "24px", "font-weight": "bold", "margin-bottom": "16px", "text-align": "center" }}>
        📚 Library App
      </h1>

      <SearchFilter setSearch={setSearch} setFilterAvailable={setFilterAvailable} setSelectedCategory={setSelectedCategory} />

      <div style={{ "margin-top": "24px", display: "flex", "justify-content": "center", gap: "16px" }}>
        {/* Category Dropdown */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            style={{
              background: "#4A5568",
              color: "white",
              "font-weight": "600",
              padding: "12px",
              "border-radius": "6px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={toggleCategoryDropdown}
          >
            Category
          </button>
          {isCategoryOpen() && (
            <div
              style={{
                position: "absolute",
                background: "#1F2937",
                "border-radius": "8px",
                padding: "10px",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
                "z-index": "10",
                color: "white",

              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setSelectedCategory("adventure")}
              >
                adventure
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setSelectedCategory("holiday")}
              >
                holiday
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setSelectedCategory("building")}
              >
                building
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setSelectedCategory("inspiration")}
              >
                inspiration
              </div>
            </div>
          )}
        </div>

        {/* Availability Filter Dropdown */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            style={{
              background: "#4A5568",
              color: "white",
              "font-weight": "600",
              padding: "12px",
              "border-radius": "6px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={toggleAvailableDropdown}
          >
            Availability
          </button>
          {isAvailableOpen() && (
            <div
              style={{
                color: "white",

                position: "absolute",
                background: "#1F2937",
                "border-radius": "8px",
                padding: "10px",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
              "z-index": "10",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setFilterAvailable(false)}
              >
                All
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setFilterAvailable(true)}
              >
                Available Only
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}








export const CircularProgress = (props: { stroke: string; style?: CSSProperties; progress: number; width?: number; height?: number, max?: number }) => {
  const radius = 40; // Circle radius
  const circumference = 2 * Math.PI * radius;

  const progressOffset = () => {
    return circumference - (props.progress / (props.max || 100)) * circumference;
  };

  return (
    <svg style={props.style} width={props.width || 100} height={props.height || 100} viewBox="0 0 100 100">
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="lightgray"
        stroke-width="10"
        fill="none"
      />
      {/* Progress Circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke={props.stroke || "blue"}
        stroke-width="10"
        fill="none"
        stroke-dasharray={circumference}
        stroke-dashoffset={progressOffset()}
        stroke-linecap="round"
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
};


