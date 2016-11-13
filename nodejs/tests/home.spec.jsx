import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Home from '../src/app/components/home';
import { Link } from 'react-router';
import { shallow } from 'enzyme';

describe('<Home />', () => {

  beforeEach(() => {
  });

  it('should exist', () => {
    // Render into document
    const wrapper = shallow(<Home />);
    expect(wrapper).toBeTruthy();
  });

  it('renders a table with found and lost links', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.find('table')).toBeTruthy();
    expect(wrapper.find('td').length).toBe(2);
    const links = wrapper.find(Link);
    expect(links.length).toBe(2);
    expect(links.nodes[0].props.to).toBe('found')
    expect(links.nodes[1].props.to).toBe('lost')
  });

});