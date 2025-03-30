import { For, Show } from "solid-js";
import Tag from "./Tag";

interface CommentSectionProps {
    book: Book;
  }


  
  
  const CommentSection = ({ book }: CommentSectionProps) => {
    return (
      <div>
            <Show when={book.top_comment}>

                <Comment   book={book}  />
        </Show>
      </div>
    );
  };
  
  export default CommentSection;

    function Comment({ book }) {
      return (
        // <div
        // style={{
        //     display: "flex",
        //     "align-items": "center",
        //     "flex-direction": "column",
   
        //   }}
        // >
        <div
          style={{
            // background: "linear-gradient(45deg, rgba(185, 70, 40, 0.8), rgba(215, 50, 30, 0.8), rgba(245, 30, 30, 0.8))",
            display: "flex",
            "align-items": "center",
            // border: "solid 1px rgb(100, 100, 100)",
            "box-shadow": "2px 2px 10px rgb(230, 230, 230)",
            "padding": "2px 8px",
            "border-radius": "8px",
            position: "relative"
            // "box-shadow": "3px 2px 2px"
          }}
        >
          <img
            src="https://shmulisarmy.github.io/resume/images/profile.png"
            alt="Profile"
            style={{
              width: "38px",
              height: "38px",
              "border-radius": "50%",
              "object-fit": "cover",
              "margin-right": "12px",
              border: "2px solid #E2E8F0",
            }}
          />
          <p style={{
             display: "flex",
            "align-items": "start",
            "flex-direction": "column",
            color: "rgb(100, 100, 100)",
          }}>
            <strong
              style={{
                // color: "#2D3748",
                color: "black",
              }}
            >
              {book.top_comment.email}
            </strong>
            {book.top_comment.comment}
          </p>
          <Show when={book.comments}>

          <Tag style={{position: "absolute", bottom: "-4px", right: "0"}}>{book.comments} more</Tag>
          </Show>
        </div>

              

      );
    }
    



