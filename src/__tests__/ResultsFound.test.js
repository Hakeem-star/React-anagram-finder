import React from 'react';
import ResultsFound from '../ResultsFound';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';


it('renders without crashing', () => {
    shallow(<ResultsFound />);
  });

// describe('<ResultsFound />', () => {
//   it('matches the snapshot', () => {
//     var tree = renderer.create(<ResultsFound />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });