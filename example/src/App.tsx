import "./index.scss";
import * as React from "react";
import { KBarAnimator } from "../../src/KBarAnimator";
import { KBarProvider } from "../../src/KBarContextProvider";
import KBarResults from "../../src/KBarResults";
import KBarPortal from "../../src/KBarPortal";
import KBarPositioner from "../../src/KBarPositioner";
import KBarSearch from "../../src/KBarSearch";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Docs from "./Docs";
import SearchDocsActions from "./SearchDocsActions";

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const resultsStyle = {
  maxHeight: 400,
  overflow: "auto",
};

const animatorStyle = {
  maxWidth: "500px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

const App = () => {
  const history = useHistory();
  return (
    <KBarProvider
      actions={[
        {
          id: "homeAction",
          name: "Home",
          shortcut: ["h"],
          keywords: "back",
          section: "Navigation",
          perform: () => history.push("/"),
        },
        {
          id: "docsAction",
          name: "Docs",
          shortcut: ["g", "d"],
          keywords: "help",
          section: "Navigation",
          perform: () => history.push("/docs"),
        },
        {
          id: "contactAction",
          name: "Contact",
          shortcut: ["c"],
          keywords: "email hello",
          section: "Navigation",
          perform: () => window.open("mailto:timchang@hey.com", "_blank"),
        },
        {
          id: "twitterAction",
          name: "Twitter",
          shortcut: ["t"],
          keywords: "social contact dm",
          section: "Navigation",
          perform: () => window.open("https://twitter.com/timcchang", "_blank"),
        },
        {
          id: "theme",
          name: "Change theme…",
          shortcut: [],
          keywords: "interface color dark light",
          section: "",
          children: ["darkTheme", "lightTheme"],
        },
        {
          id: "darkTheme",
          name: "Dark",
          shortcut: [],
          keywords: "dark",
          section: "",
          perform: () =>
            document.documentElement.setAttribute("data-theme-dark", ""),
          parent: "theme",
        },
        {
          id: "lightTheme",
          name: "Light",
          shortcut: [],
          keywords: "light",
          section: "",
          perform: () =>
            document.documentElement.removeAttribute("data-theme-dark"),
          parent: "theme",
        },
      ]}
      options={{
        animations: {
          enterMs: 200,
          exitMs: 100,
        },
      }}
    >
      <SearchDocsActions />
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch
              style={searchStyle}
              placeholder="Type a command or search…"
            />
            <KBarResults
              style={resultsStyle}
              onRender={(action, handlers, state) => (
                <Render action={action} handlers={handlers} state={state} />
              )}
            />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      <Layout>
        <Switch>
          <Route path="/docs" exact>
            <Redirect to="/docs/overview" />
          </Route>
          <Route path="/docs/:slug">
            <Docs />
          </Route>
          <Route path="*">
            <Home />
          </Route>
        </Switch>
      </Layout>
    </KBarProvider>
  );
};

function Render({ action, handlers, state }) {
  const ownRef = React.useRef<HTMLDivElement>(null);

  const active = state.index === state.activeIndex;

  React.useEffect(() => {
    if (active) {
      // wait for the KBarAnimator to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          const element = ownRef.current;
          if (!element) {
            return;
          }
          // @ts-ignore
          element.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
            inline: "start",
          });
        })
      );
    }
  }, [active]);

  return (
    <div
      ref={ownRef}
      {...handlers}
      style={{
        padding: "12px 16px",
        background: active ? "var(--a1)" : "var(--background)",
        borderLeft: `2px solid ${active ? "var(--foreground)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <span>{action.name}</span>
      {action.shortcut?.length ? (
        <div style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
          {action.shortcut.map((sc) => (
            <kbd
              key={sc}
              style={{
                padding: "4px 6px",
                background: "rgba(0 0 0 / .1)",
                borderRadius: "4px",
              }}
            >
              {sc}
            </kbd>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
