import React from 'react';
import './App.css';

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
  let name;
  props.name === "General" ? name = "Value" : name = "Name";

  return (
    <div className="searchInput">
      <div className="inputName">{"Enter " + name}</div>
      <input onChange={props.searchTerm} type="text" placeholder="Thanksmo,TRUMCDONALD,parsi/hl itno"></input>
      <input type="button" value="Search" />
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
    }
  }

  searchSelected(e) {
    //console.dir(e.target)
    this.setState({ anagramType: e.target.value, SearchInputName: e.target.value });
  }

  searchTerm(e) {
    //console.log(e.target.value)
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <PageTitle title={this.state.anagramType} />
        <SearchSelector handleClick={(e) => this.searchSelected(e)} />
        <SearchInput name={this.state.anagramType} searchTerm={(e) => this.searchTerm(e)} />
      </div>
    );
  }
}


PageTitle.defaultProps = {
  title: "Celebrity",
  SearchInputName: "Name",
}

export default App;
