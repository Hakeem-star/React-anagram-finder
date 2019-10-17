import React from "react";
import celebAnagramFinder from "./celebAnagramFinderAPICall";
import ResultsFound from "./ResultsFound";
import "./App.css";

function NothingFound(props) {
  return <h4>"Nothing was found!"</h4>;
}

function ResultDivContain(props) {
  let results;

  if (Object.keys(props.results).length === 0) {
    results = <NothingFound />;
  } else {
    results = <ResultsFound results={props.results} />;
  }

  return <div className="container">{results}</div>;
}

function PageTitle(props) {
  return (
    <div className="headerPortion">
      <h1>{props.title + " Anagram Finder"}</h1>
    </div>
  );
}

function SearchSelector(props) {
  return (
    <div>
      <div>
        <select
          className="selector"
          onChange={props.handleClick}
          name="anagramQuerySelect"
          id="anagramQuerySelect"
        >
          <option className="celebrities" value="Celebrities">
            Celebrities
          </option>
          <option className="general" value="General">
            General
          </option>
        </select>
      </div>
    </div>
  );
}

function SearchInput(props) {
  let placeholderText;
  props.placeholder === "General"
    ? (placeholderText = "This feature is coming soon")
    : (placeholderText = "Thanksmo,TRUMCDONALD,parsi/hl itno");

  return (
    <div className="searchInput">
      <input
        className="searchTextInput"
        onKeyPress={props.submitted}
        onChange={props.searchTerm}
        type="text"
        defaultValue={placeholderText}
      ></input>
      <input onClick={props.submitted} type="button" value="Search" />
    </div>
  );
}

function PreviousSearches(props) {
  // props.history.length > 0 ? console.log(props.history[0].searchTerm.split()) : console.log("it failed");
  let historyButtons = props.history.map((value, ind) => (
    <div
      className="history"
      key={value + ind}
      data-index={ind}
      onClick={props.goback}
      title={value.searchTerm.slice(0, 60)}
    >
      {value.searchTerm.replace(",", "").slice(0, 9)}...
    </div>
  ));

  return (
    <div className="container">
      <div>
        <p id="historyLabel">Previous Searches</p>
        <div id="historyLabelArrows"></div>
      </div>
      <div className="resultsContainer">{historyButtons}</div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anagramType: PageTitle.defaultProps.title,
      SearchInputName: PageTitle.defaultProps.title,
      searchTerm: "",
      results: "",
      resultsIndex: 0,
      resultsHistory: []
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      console.log(
        prevState,
        prevState.searchTerm,
        this.state,
        this.state.searchTerm
      );
      let history = this.state.resultsHistory.slice(-4);
      history.push({
        searchTerm: this.state.searchTerm,
        results: this.state.results
      });
      this.setState({
        resultsHistory: history
      });
      this.scrollToResults();
    }

    if (prevState.resultsHistory !== this.state.resultsHistory) {
      this.scrollToResults();
    }
  }

  searchSelected(e) {
    //console.dir(e.target)
    this.setState({
      anagramType: e.target.value,
      SearchInputName: e.target.value
    });
  }

  async localCelebAnagramFinder(val) {
    let searchResults = await celebAnagramFinder(val);

    this.setState({
      results: searchResults,
      searchTerm: val
    });
  }

  searchSubmitted(e) {
    if (e.key === "Enter" || e.target.type === "button") {
      this.localCelebAnagramFinder(
        document.querySelectorAll(".searchTextInput")[0].value
      );
    }
  }
  scrollToResults() {
    // document.querySelector("table").scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"})
    console.log(
      document.body.scrollHeight - document.querySelector("table").scrollHeight,
      document.body.scrollHeight,
      document.querySelector("table").scrollHeight
    );
    window.scrollTo(0, 500);
  }
  goback(e) {
    console.dir(e.target.dataset.index);
    //history.push({ searchTerm: this.state.searchTerm, results: this.state.results });

    this.setState({
      results: this.state.resultsHistory[e.target.dataset.index].results
    });
  }

  render() {
    let rows;
    if (typeof this.state.results === "string") {
      rows = [];
    } else {
      rows = (
        <ResultDivContain
          results={this.state.results}
          prevResults={this.props.gotoPrevResults}
          nextResults={this.props.gotoNextResults}
          current={this.state.resultsIndex}
        />
      );
    }

    return (
      <div>
        <div>
          <PageTitle title={this.state.anagramType} />

          <div className="inputSubmitContainer">
            <SearchSelector handleClick={e => this.searchSelected(e)} />
            <SearchInput
              placeholder={this.state.anagramType}
              submitted={e => this.searchSubmitted(e)}
            />
          </div>
          <PreviousSearches
            goback={e => this.goback(e)}
            history={this.state.resultsHistory}
          />
          <div>{rows}</div>
        </div>
      </div>
    );
  }
}

PageTitle.defaultProps = {
  title: "Celebrity",
  SearchInputName: "Name"
};

export default App;
