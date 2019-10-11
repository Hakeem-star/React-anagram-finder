import React from 'react';
import ResultsPageNumber from '../ResultsFound';
import renderer from 'react-test-renderer';

describe('<ResultsPageNumber />', () => {
  it('matches the snapshot', () => {
    var tree = renderer.create(<ResultsPageNumber />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});