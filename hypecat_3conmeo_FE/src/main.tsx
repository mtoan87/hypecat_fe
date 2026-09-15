import ReactDOM from "react-dom/client";
import App from "./App.tsx";

//GlobalStyle
import GlobalStyled from "./styles/GlobalStyles/index.tsx";
//toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

//font-family
import OverrideMuiTheme from "./theme/override.tsx";
import { AuthContextProvider } from "./hooks/useAuth.tsx";

// Quill styles
import "react-quill-new/dist/quill.snow.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AuthContextProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GlobalStyled>
        <OverrideMuiTheme>
          <App />
        </OverrideMuiTheme>
      </GlobalStyled>
    </AuthContextProvider>
  </>
);
