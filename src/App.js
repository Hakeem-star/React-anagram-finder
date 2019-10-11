import React from 'react';
import celebAnagramFinder from './celebAnagramFinderAPICall';
import ResultsFound from './ResultsFound';
import './App.css';


function NothingFound(props) {
  return (
    <h4>"Nothing was found!"</h4>
  )
}

function ResultDivContain(props) {

  let results;

  if (Object.keys(props.results).length === 0) {
    results = <NothingFound />;
  } else {
    results = <ResultsFound
      page={props.resultsPage} results={props.results} />
  }

  return (
    <div className="container">
      {results}
    </div>
  )
}



function PageTitle(props) {

  return (
    <div className="headerPortion">
      <h1>{props.title + " Anagram Finder"}</h1>
    </div>
  )
}

function SearchSelector(props) {

  return (
    <div>
      <div >
        <select className="selector" onChange={props.handleClick} name="anagramQuerySelect" id="anagramQuerySelect">
          <option className="celebrities" value="Celebrities">Celebrities</option>
          <option className="general" value="General">General</option>
        </select>
      </div>
    </div>
  )
}


function SearchInput(props) {
  let placeholderText;
  props.placeholder === "General" ? placeholderText = "This feature is coming soon" : placeholderText = "Thanksmo,TRUMCDONALD,parsi/hl itno";

  return (
    <div className="searchInput">
      <input
        className="searchTextInput"
        onKeyPress={props.submitted}
        onChange={props.searchTerm}
        type="text"
        defaultValue={placeholderText}>
      </input>
      <input onClick={props.submitted} type="button" value="Search" />
    </div>
  )
}


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      anagramType: PageTitle.defaultProps.title,
      SearchInputName: PageTitle.defaultProps.title,
      searchTerm: "",
      results: "",
      resultsIndex: 0,

    }
  }

  searchSelected(e) {
    //console.dir(e.target)
    this.setState({ anagramType: e.target.value, SearchInputName: e.target.value });
  }

  async localCelebAnagramFinder(val) {
    let test = await celebAnagramFinder(val);
    this.setState({ results: test });
  }

  searchSubmitted(e) {
    if (e.key === "Enter" || e.target.type === "button") {
      this.localCelebAnagramFinder(document.querySelectorAll(".searchTextInput")[0].value);
    }
  }

  render() {
    let rows;
    if (typeof (this.state.results) === "string") {
      rows = [];
    } else {
      rows = <ResultDivContain
        results={this.state.results} prevResults={this.props.gotoPrevResults}
        nextResults={this.props.gotoNextResults} current={this.state.resultsIndex} />
    }


    return (
      <div>

        <div>
          <PageTitle title={this.state.anagramType} />

          <div className="inputSubmitContainer">
            <SearchSelector handleClick={(e) => this.searchSelected(e)} />
            <SearchInput placeholder={this.state.anagramType} submitted={(e) => this.searchSubmitted(e)} />
          </div>
          <div>
            {rows}
          </div>
        </div>
      </div>
    );
  }
}


PageTitle.defaultProps = {
  title: "Celebrity",
  SearchInputName: "Name",
}

export default App;
