import React from "react";

export default class ResultsFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentResultsPage: 0,
      maxPages: 1
    };
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
        this.setState({
          currentResultsPage: this.state.currentResultsPage + 1
        });
      }
    } else if (e.target.textContent === " « ") {
      if (this.state.currentResultsPage > 0) {
        this.setState({
          currentResultsPage: this.state.currentResultsPage - 1
        });
      }
    }
    console.log(this.state.currentResultsPage, this.state.maxPages - 1);
    console.dir(e.target.textContent);
  }

  // componentDidMount() {
  //   //console.log( this.chunk(Object.keys(this.props.results),10));
  //   this.setState({ maxPages: this.chunk(Object.keys(this.props.results),10).length });
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.results !== this.props.results) {
      this.setState({
        maxPages: this.chunk(Object.keys(this.props.results), 10).length
      });
    }
  }

  render() {
    let rows = Array(Object.keys(this.props.results).length)
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

    let resultsCounter =
      this.state.currentResultsPage > 0
        ? this.chunk(rows, 10)[this.state.currentResultsPage].length +
          this.state.currentResultsPage * 10
        : this.chunk(rows, 10)[this.state.currentResultsPage].length;

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
          <tbody>{this.chunk(rows, 10)[this.state.currentResultsPage]}</tbody>
        </table>
        <ResultsPageNumber
          prevResults={e => this.navigateResults(e)}
          current={resultsCounter}
          nextResults={e => this.navigateResults(e)}
          maximum={rows.length}
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
