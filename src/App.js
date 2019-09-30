import React from 'react';
import logo from './logo.svg';
import './App.css';

function PageTitle(props){

  return (
    <h1>{props.title} Anagram</h1>
  )
}

function SearchSelector (props){

  return(
        <div>
            <div>
                <select name="anagramQuerySelect" id="anagramQuerySelect">
                    <option selected="selected" className="celebrities" value="Celebrities">Celebrities</option>
                    <option className="general" value="General">General</option>

                </select>
            </div>
        </div>
  )
      }

      function SearchInput(){
return (
<div>
  <input type="text" placeholder = "Thanksmo,TRUMCDONALD,parsi/hl itno"></input>
  <input type="button" value="Search"/>
  </div>
)
      }

class App extends React.Component {

  render(){
  return (
    <div>
    <PageTitle/>
    <SearchSelector />
    <SearchInput />
    </div>
  );
  }
}

export default App;
