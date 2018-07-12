import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { ThemeProvider } from "styled-components";

import theme from "./theme";
import Timeline from "./pages/Timeline";
import Topic from "./pages/Topic";
import Proposal from "./pages/Proposal";
import NotFound from "./pages/NotFound";

class ScrollToTopUtil extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
  }
}

const ScrollToTop = withRouter(ScrollToTopUtil);

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <ScrollToTop>
            <div className="App">
              <Switch>
                <Route exact path="/" component={Timeline} />
                <Route path="/not-found" component={NotFound} />
                <Route path="/:topicSlug/:proposalSlug" component={Proposal} />
                <Route path="/:topicSlug" component={Topic} />
              </Switch>
            </div>
          </ScrollToTop>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;