import { createEffect, createSignal, JSX, Show } from "solid-js";
import { Book, placeholderImage } from "../data/books";
import CommentSection from './BookCard_CommentSection'; // import the new component
import styles from "./.module.css"
import Tag from "./Tag";

interface BookCardProps {
  book: Book;
}

const book_category_colors = new Map([
  ['adventure', '#C4421F'], // Darker Orange-Red
  ['holiday', '#B8860B'],   // Darker Gold (Bronze-like)
  ['building', '#2E5C94'],  // Darker Sky Blue
  ['inspiration', '#5B9E82'] // Darker Pastel Green
]);

  
  
function get_book_category_color(category: string) {
  if (!book_category_colors.has(category)) {
    book_category_colors.set(category, `#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return book_category_colors.get(category);
}

export default function BookCard({ book }: BookCardProps) {
    let cardRef: HTMLElement | undefined;


createEffect(() => {
    if (cardRef) {
      observer.observe(cardRef);
    }
  });
  return (
    <li data-name={book.title} ref={cardRef} style={{  
        "border-radius": "10px",
        border: "dashed 1px rgb(190, 190, 190)",
        padding: '12px',
        "backdrop-filter": "blur(10px)",
        // width: "300px",  
            "list-style": 'none', 
        // border: "dashed 1px black",
        display: "flex", "flex-direction": 'column', "align-items": 'center'
    }}>
     
    <div
    class="main-content"
      style={{
        "list-style": 'none',
        "padding-bottom": '12px',
        "border-radius": '12px',
        // "box-shadow": '0 10px 20px rgba(0, 0, 0, 0.1)',
        "background-clip": '#F7FAFC',
        display: 'flex',
        "flex-direction": 'column', // Change the layout to column
        "align-items": 'flex-start',
        gap: '16px',
        cursor: 'pointer',
        // "margin-bottom": '24px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: "relative"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ display: 'flex', "align-items": 'flex-start', gap: '20px' }}>
        <img
          src={book.image || placeholderImage}
          alt={book.title}
          style={{
            width: '100px',
            height: '140px',
            // "object-fit": 'cover',
            "border-top-left-radius": '12px',
            "border-bottom-left-radius": '12px',
            "border-top-right-radius": '8px',
            "border-bottom-right-radius": '8px',
            // "box-shadow": '0 6px 15px rgba(0, 0, 0, 0.1)',
          }}
        />
        <div style={{ flex: 1 }}>
          <p
            style={{
              "font-size": '22px',
              "font-weight": '600',
              color: '#2D3748',
              "margin-bottom": '12px',
              "text-transform": 'capitalize',
              "line-height": '1.5',
              "letter-spacing": '0.5px',
            }}
          >
            {book.title}
          </p>
          {/* <span
            style={{
              "font-size": '14px',
              "font-weight": '700',
              color: get_book_category_color(book.catagory),
              padding: '6px 12px',
              "border-radius": '20px',
              border: `2px solid ${get_book_category_color(book.catagory)}`,
              "color": get_book_category_color(book.catagory),
              "text-transform": 'uppercase',
              "letter-spacing": '1px',
              background: "white",

            //   "margin-bottom": '16px',
            }}
          >
            {book.category}
          </span> */}
          <Tag border_size="2px" padding_y="4px" background="white" color={get_book_category_color(book.category)}>{book.category}</Tag>
        </div>
      </div>
      <Show when={book.available}>

      <span
        style={{
        //   padding: '8px 16px',
        // border: "solid 1px black",
        padding: "2px 4px",
          "border-radius": '9999px',
          "font-size": '14px',
          "font-weight": '600',
          "text-align": "center",
          color: "rgb(0, 170, 180)",
          "color": 'green',
          "text-transform": 'uppercase',
          "letter-spacing": '1px',
          "font-family": "monospace",
            "text-decoration": "underline",
            "text-underline-offset": "2px",
          position: "absolute",
          top: "0",
          right: "0",
        }}
      >
            Available
      </span>
      </Show>


      {/* Separate comment section */}
    </div>
    <div style={{
        display: "flex",
        padding: "16px 0",
        gap: "10px",
    }} class="button-container">

    <SigninFirstButton
      Class={"borrow-button-btn"}
      style={{
        "background-color": "white",
        color: "rgb(50, 50, 50)",
        padding: "4px 12px",
        "border-radius": "16px",
      }} onClick={() => {alert(`you have borrowed ${book.title}`)}}>
        {isSignedIn() && !book.comments ? "Be The First to Comment" : "comment"}
      </SigninFirstButton>



      <SigninFirstButton
      Class={"borrow-button-btn"}
      style={{
        "background-color": "rgb(50, 50, 50)",
        color: "white",
        padding: "4px 12px",
        "border-radius": "16px",
      }} onClick={() => {alert(`you have borrowed ${book.title}`)}}>
        Borrow 
      </SigninFirstButton>
    </div>

    <hr />
      <CommentSection book={book} />
    </li>

  );
}


import * as csstype from "csstype";

export interface CSSProperties extends csstype.PropertiesHyphen {
  // Override
  [key: `-${string}`]: string | number | undefined;
}


const [isSignedIn, setIsSignedIn] = createSignal(false);
const [signedInDetails, setSignedInDetails] = createSignal({ email: "", id: "" });


fetch("http://localhost:5172/protected").then(res => res.json()).then(data => {
  if (data.email && data.id) {
    setSignedInDetails({ email: data.email, id: data.id });
    setIsSignedIn(true);
  }
});

function SigninFirstButton(props: {style: CSSProperties | string | undefined, children?: JSX.Element, onClick?: () => void, disabled?: boolean, Class?: string}) {
  const these_style = {
       border: "1px solid black", "border-radius": "10px", padding: "4px 8px"
  }
    return <button
    class={props.Class}
    style={{...these_style, ...props.style}}
    onClick={() => {
      if (isSignedIn()) {
        props.onClick?.()
      } else {
        if (confirm("do you want to sign in first?")) {
          window.location.href = "http://localhost:5172/swagger/index.html"
          setIsSignedIn(true)
          props.onClick?.()
        }
      }
    }}>
      <Show when={!isSignedIn()}>
        <span style={{
          "font-family": "-moz-initial",
        }}>

          sign in to 
        </span>
      </Show>
      {props.children}
    </button>
}


const seen = new Set()


const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target.getAttribute("data-name"))) {
            !seen.add(entry.target.getAttribute("data-name"))
          entry.target.classList.add(styles["pop-in"]);
        } else {
        //   entry.target.classList.remove(styles["pop-in"]);
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the card is visible
    }
  );
  

// Start observing the BookCard element when it is mounted

