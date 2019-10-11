import React from 'react';
import celebAnagramFinder from './celebAnagramFinderAPICall';
import './App.css';


function NothingFound(props) {
  return (
    <h4>"Nothing was found!"</h4>
  )
}


class ResultsFound extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentResultsPage: 0,
      maxPages: 1,
    }
  }



  //Seperate the results into chunks, so we can have different pages for the results
  chunk(arr, chunckSize) {
    // debugger;
    let newChunk = [];
    let j = 0;
    for (let i = 0; i < arr.length; i += chunckSize) {
      !i ? j = 0 : j += chunckSize;
      newChunk.push(arr.slice(j, j + chunckSize))
    }

    return newChunk;
  }

  navigateResults(e) {
    if (e.target.textContent === " » ") {
      if (this.state.currentResultsPage < this.state.maxPages-1) {
        this.setState({ currentResultsPage: this.state.currentResultsPage + 1 })
      }
    } else if (e.target.textContent === " « "){
      if (this.state.currentResultsPage > 0) {
        this.setState({ currentResultsPage: this.state.currentResultsPage - 1 })
      }
    }
    console.dir(e.target.textContent);
  }
  componentDidMount() {
    //console.log( this.chunk(Object.keys(this.props.results),10));
    this.setState({ maxPages: this.chunk(Object.keys(this.props.results),10).length });
  }

  render() {

    let rows = (Array(Object.keys(this.props.results).length).fill("").map((value, ind) => {

      let anagramName = Object.keys(this.props.results)[ind]; //Thanksmo       
      let val = this.props.results[anagramName][0] //return the array associated with the anagram
      /*0: {Tom Hanks: "100%"} */
      let celebName = Object.keys(val)[0]; //Create an array based off the keys in the returned object. 
      //"Tom Hanks"
      let innerCurrent = val[celebName]
      return (
        <tr key={anagramName + celebName}>
          <td>{anagramName}</td>
          <td>{celebName}</td>
          <td>{innerCurrent}</td>
        </tr>
      )

    }));
    

    let resultsCounter = this.state.currentResultsPage > 0 ? 
    (this.chunk(rows, 10)[this.state.currentResultsPage].length) + (this.state.currentResultsPage *10) :
    this.chunk(rows, 10)[this.state.currentResultsPage].length

    return (
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Anagram</th>
              <th>Name</th>
              <th>Match Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.chunk(rows, 10)[this.state.currentResultsPage]}
          </tbody>
        </table>
        <ResultsPageNumber prevResults={(e) => this.navigateResults(e)}
          current={resultsCounter}
          nextResults={(e) => this.navigateResults(e)} maximum={rows.length} />
      </div>
    )
  }
}



function ResultsPageNumber(props) {

  return (
    <div className="ResultsPageNumber">
      <p className="next" onClick={props.prevResults}> « </p>
      <p>Showing {props.current} of {props.maximum}</p>
      <p className="previous" onClick={props.nextResults}> » </p>
    </div>
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
