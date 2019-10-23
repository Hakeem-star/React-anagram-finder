import React from "react";
let pageReset = 0;
export default class ResultsFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentResultsPage: 0,
      maxPages: 1
    };
  }

  componentDidMount() {
    //console.log( this.chunk(Object.keys(this.props.results),10));
    this.setState({
      maxPages: this.chunk(Object.keys(this.props.results), 10).length,
      currentResultsPage: 0
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.results !== this.props.results) {
      //pageReset = 0;
      console.log(pageReset);
      this.setState({
        maxPages: this.chunk(Object.keys(this.props.results), 10).length,
        currentResultsPage: 0
      });
    }

    if (prevProps.display !== this.props.display) {
      //pageReset = 0;
      this.setState({
        maxPages: this.chunk(Object.keys(this.props.results), 10).length,
        currentResultsPage: 0
      });
    }
  }

  //Seperate the results into chunks, so we can have different pages for the results
  chunk(arr, chunckSize) {
    // debugger;
    let newChunk = [];
    let j = 0;
    for (let i = 0; i < arr.length; i += chunckSize) {
      !i ? (j = 0) : (j += chunckSize);
      newChunk.push(arr.slice(j, j + chunckSize));
    }

    return newChunk;
  }

  navigateResults(e) {
    if (e.target.textContent === " » ") {
      if (this.state.currentResultsPage < this.state.maxPages - 1) {
        //pageReset++;
        this.setState({
          currentResultsPage: this.state.currentResultsPage + 1
        });
      }
    } else if (e.target.textContent === " « ") {
      if (this.state.currentResultsPage > 0) {
        //pageReset--;
        this.setState({
          currentResultsPage: this.state.currentResultsPage - 1
        });
      }
    }
    // console.log(this.state.currentResultsPage, this.state.maxPages - 1);
    // console.dir(e.target.textContent);
  }

  //This keeps a look at where you are in the viewing
  resultsCounter() {
    try {
      let chunked = this.chunk(this.rows(), 10)[this.state.currentResultsPage];
      if (this.state.currentResultsPage > 0) {
        return (
          //Showing 1 0f 10
          //length of the page minus (length of the page minus 1)

          `${this.state.currentResultsPage * 10 + 1} - ${this.state
            .currentResultsPage *
            10 +
            chunked.length} `
        );
      } else {
        return `1 - ${chunked.length}`;
      }
    } catch (error) {
      console.log("HERE");
      return `0 - ${this.chunk(this.rows(), 10)[0].length}`;
    }
  }

  rows() {
    // console.log(this.props.results);
    return Array(Object.keys(this.props.results).length)
      .fill("")
      .map((value, ind) => {
        const anagramName = Object.keys(this.props.results)[ind]; //Thanksmo
        const val = this.props.results[anagramName][0]; //return the array associated with the anagram
        /*0: {Tom Hanks: "100%"} */
        const celebName = Object.keys(val)[0]; //Create an array based off the keys in the returned object.
        //"Tom Hanks"
        const celebNameURL = (
          <a target="blank" href={"https://en.wikipedia.org/wiki/" + celebName}>
            {celebName}
          </a>
        ); //Create a wiki link based off the celebname.
        const innerCurrent = val[celebName];
        return (
          <tr key={anagramName + celebName}>
            <td>{anagramName}</td>
            <td>{celebNameURL}</td>
            <td>{innerCurrent}</td>
          </tr>
        );
      });
  }

  render() {
    const tableDisplay = () =>
      this.props.display === "none" ? "flex" : "none";
    return (
      <div style={{ display: tableDisplay() }} className="container">
        <table>
          <thead>
            <tr>
              <th>Anagram</th>
              <th>Name</th>
              <th>Match Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.chunk(this.rows(), 10)[this.state.currentResultsPage]}
          </tbody>
        </table>
        <ResultsPageNumber
          prevResults={e => this.navigateResults(e)}
          current={this.resultsCounter()}
          nextResults={e => this.navigateResults(e)}
          maximum={this.rows().length}
        />
      </div>
    );
  }
}

export function ResultsPageNumber(props) {
  return (
    <div className="ResultsPageNumber">
      <p className="previous" onClick={props.prevResults}>
        {" "}
        «{" "}
      </p>
      <p>
        Showing {props.current} of {props.maximum}
      </p>
      <p className="next" onClick={props.nextResults}>
        {" "}
        »{" "}
      </p>
    </div>
  );
}
