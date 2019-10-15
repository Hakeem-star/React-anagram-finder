import React from 'react';
import { ResultsFound } from '../ResultsFound';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';


describe('<ResultsFound />', () => {
  let wrapper;

  it('renders without crashing', () => {
    wrapper = shallow(<ResultsFound results={JSON.parse(JSON.stringify({ THANKSMO: [{ 'Tom Hanks': "100%" }], TRUMCDONALD: [{ 'Donald Trump': "100%" }] }))} />);
  });

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('lets <ResultsPageNumber/> navigate pages properly', () => {
    
  });
});