import { createSignal, JSX, onCleanup, Show } from "solid-js";
import "./Alert.css"
import { CircularProgress } from "../../App";
type AlertType = "error" | "warning" | "success" | "info";

const alertStyles = {
  error: { background: "#7f1d1d", color: "#fee2e2", borderLeft: "4px solid #dc2626" },
  warning: { background: "#78350f", color: "#fef3c7", borderLeft: "4px solid #f59e0b" },
  success: { background: "#14532d", color: "#d1fae5", borderLeft: "4px solid #22c55e" },
};






const icons = {
  error: () => <svg fill="red" width="22px" height="22px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>error-solid</title> <path class="clr-i-solid clr-i-solid-path-1" d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm-1.49,6a1.49,1.49,0,0,1,3,0v6.89a1.49,1.49,0,1,1-3,0ZM18,25.5a1.72,1.72,0,1,1,1.72-1.72A1.72,1.72,0,0,1,18,25.5Z"></path> <rect x="0" y="0" width="36" height="36" fill-opacity="0"></rect> </g></svg>,
  warning: () => <svg width="22px" height="22px" viewBox="0 0 24 24" fill="orange" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4 21V18.5C4 15.4624 6.46243 13 9.5 13H15M8 21V18M16.5 17V15M16.5 19.2V19M16 6.5C16 8.70914 14.2091 10.5 12 10.5C9.79086 10.5 8 8.70914 8 6.5C8 4.29086 9.79086 2.5 12 2.5C14.2091 2.5 16 4.29086 16 6.5ZM12.309 21H20.691C21.0627 21 21.3044 20.6088 21.1382 20.2764L16.9472 11.8944C16.763 11.5259 16.237 11.5259 16.0528 11.8944L11.8618 20.2764C11.6956 20.6088 11.9373 21 12.309 21Z" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"></path></g></svg>,
  success: () => <svg width="22px" height="22px" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M13.1318 11.3125L12.7388 10.7333L12.7388 10.7333L13.1318 11.3125ZM4.98688 10.3431L4.31382 10.5354L4.31382 10.5354L4.98688 10.3431ZM4.44847 8.45868L3.77541 8.65098L3.77541 8.65098L4.44847 8.45868ZM2.33917 9.0235L3.01827 8.85373L3.01827 8.85372L2.33917 9.0235ZM3.89881 15.262L4.57791 15.0923L4.57791 15.0923L3.89881 15.262ZM13.7445 21C13.7445 21.3866 14.0579 21.7 14.4445 21.7C14.8311 21.7 15.1445 21.3866 15.1445 21H13.7445ZM15.1445 18.3333C15.1445 17.9467 14.8311 17.6333 14.4445 17.6333C14.0579 17.6333 13.7445 17.9467 13.7445 18.3333H15.1445ZM18.5 10V9.3C18.3618 9.3 18.2267 9.34091 18.1117 9.41756L18.5 10ZM15.5 10H16.2C16.2 9.6134 15.8866 9.3 15.5 9.3V10ZM15.5 12H14.8C14.8 12.2582 14.9421 12.4954 15.1697 12.6172C15.3973 12.739 15.6735 12.7256 15.8883 12.5824L15.5 12ZM10.889 11.3C9.06642 11.3 7.58896 9.82255 7.58896 8.00001H6.18896C6.18896 10.5958 8.29322 12.7 10.889 12.7V11.3ZM7.58896 8.00001C7.58896 6.17746 9.06642 4.7 10.889 4.7V3.3C8.29322 3.3 6.18896 5.40427 6.18896 8.00001H7.58896ZM10.889 4.7C12.7115 4.7 14.189 6.17746 14.189 8.00001H15.589C15.589 5.40427 13.4847 3.3 10.889 3.3V4.7ZM14.189 8.00001C14.189 9.13616 13.6154 10.1386 12.7388 10.7333L13.5248 11.8918C14.769 11.0477 15.589 9.61973 15.589 8.00001H14.189ZM12.7388 10.7333C12.2115 11.091 11.5757 11.3 10.889 11.3V12.7C11.8647 12.7 12.7728 12.4019 13.5248 11.8918L12.7388 10.7333ZM18.2555 21V18.7778H16.8555V21H18.2555ZM12.6666 13.1889H9.68766V14.5889H12.6666V13.1889ZM5.65995 10.1508L5.12154 8.26637L3.77541 8.65098L4.31382 10.5354L5.65995 10.1508ZM1.66007 9.19328L3.21971 15.4318L4.57791 15.0923L3.01827 8.85373L1.66007 9.19328ZM3.21971 15.4318C3.48767 16.5037 4.45071 17.2556 5.55553 17.2556V15.8556C5.09312 15.8556 4.69006 15.5409 4.57791 15.0923L3.21971 15.4318ZM3.39853 6.9667C2.23273 6.9667 1.37732 8.06229 1.66007 9.19328L3.01827 8.85372C2.95643 8.60634 3.14353 8.3667 3.39853 8.3667V6.9667ZM5.12154 8.26637C4.90174 7.49708 4.1986 6.9667 3.39853 6.9667V8.3667C3.57353 8.3667 3.72733 8.48271 3.77541 8.65098L5.12154 8.26637ZM9.68766 13.1889C7.81741 13.1889 6.17375 11.9491 5.65995 10.1508L4.31382 10.5354C4.99934 12.9347 7.19234 14.5889 9.68766 14.5889V13.1889ZM18.2555 18.7778C18.2555 15.6911 15.7533 13.1889 12.6666 13.1889V14.5889C14.9801 14.5889 16.8555 16.4643 16.8555 18.7778H18.2555ZM15.1445 21V18.3333H13.7445V21H15.1445ZM14.5 3.7H19.5V2.3H14.5V3.7ZM20.8 5V8H22.2V5H20.8ZM19.5 9.3H18.5V10.7H19.5V9.3ZM15.5 9.3H14V10.7H15.5V9.3ZM18.1117 9.41756L15.1117 11.4176L15.8883 12.5824L18.8883 10.5824L18.1117 9.41756ZM16.2 12V10H14.8V12H16.2ZM20.8 8C20.8 8.71797 20.218 9.3 19.5 9.3V10.7C20.9912 10.7 22.2 9.49117 22.2 8H20.8ZM19.5 3.7C20.218 3.7 20.8 4.28203 20.8 5H22.2C22.2 3.50883 20.9912 2.3 19.5 2.3V3.7ZM14.5 2.3C13.3671 2.3 12.3988 2.99751 11.9979 3.98386L13.2949 4.51098C13.4887 4.03415 13.9562 3.7 14.5 3.7V2.3Z" ></path><circle cx="16.5" cy="6.5" fill="#000000" r="0.5"></circle><circle cx="18.5" cy="6.5" fill="#000000" r="0.5"></circle></g></svg>,
  info: () => <svg fill="rgb(59, 130, 246)" width="22px" height="22px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 10C10 10.5523 10.4477 11 11 11V17C10.4477 17 10 17.4477 10 18C10 18.5523 10.4477 19 11 19H13C13.5523 19 14 18.5523 14 18C14 17.4477 13.5523 17 13 17V9H11C10.4477 9 10 9.44772 10 10Z" ></path> <path d="M12 8C12.8284 8 13.5 7.32843 13.5 6.5C13.5 5.67157 12.8284 5 12 5C11.1716 5 10.5 5.67157 10.5 6.5C10.5 7.32843 11.1716 8 12 8Z" ></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z" ></path> </g></svg>
};

const colors = {
  error: "red",
  warning: "orange",
  success: "lightgreen",
  info: "rgb(59, 130, 246)",
};

interface AlertProps {
  children?: JSX.Element;
  type: AlertType;
  duration?: number; // Auto-dismiss duration (ms)
  closable?: boolean; // Show close button
}


let i = 0;

const Alert = ({ type, duration, closable = true, children }: AlertProps) => {
  const [visible, setVisible] = createSignal(true);
  const [timeLeft, setTimeLeft] = createSignal<number>(duration || 0);
  i++
  // Auto-dismiss logic
  setInterval(() => {
      setTimeLeft((prev) => prev - 10);
      if (duration && timeLeft() <= 0) {
        setVisible(false);
      }
  }, 10);

  return (
    <Show when={visible()}>
      <div class="alert-fixed-wrapper">

      <div 
        class="alert"
        style={{...alertStyles[type], border: `1px solid ${colors[type]}`, background: "rgba(25, 25, 25, 0.9)", padding: "10px", "border-radius": "5px",  "margin-bottom": "0", "box-shadow": "0px 0px 10px rgba(0, 0, 0, 0.3)", display: "flex", "flex-direction": "column",
        "--y-pos": `${i * 40}px`, "--delay": `${i * 60+200}ms`,
        gap: "10px", position: "relative"}}
      >
      <div style={{ color: "white", gap: "4px",  display: "flex", width: "100%", "align-items": "center", "justify-content": "start",  position: "relative"}}>

        <span style={{ "margin-right": "4px" }} class="icon">{icons[type]()}</span>
            {children}
            <Show when={duration}>
            <CircularProgress max={duration} stroke={colors[type]} style={{"margin-left": "10px"}} progress={
              timeLeft()
              } width={30} height={30}/>
            </Show>

        <Show when={closable}>
          <button style={{"margin-left": "auto", "padding-left": "8px"}} class="close-btn" onClick={() => setVisible(false)}>✖</button>
        </Show>
      {/* {duration && <progress  style={{opacity: "0.5", background: "transparent", border: "none", color: "white",   position: "absolute", bottom: "4px", width: "80%", left: "10%", height: "5px"}} value={timeLeft()} max={duration}></progress>} */}
        </div>
 </div>
 </div>

    </Show>
  );
};


const [progress, setProgress] = createSignal(10);

setInterval(() => {
  setProgress((prev) => prev + 1);
}, 10);

export default Alert;
