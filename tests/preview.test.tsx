// @vitest-environment jsdom
import React from 'react';
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import SparkPreview from '../components/SparkPreview';
afterEach(cleanup);
it('teaches the rule across six choices and resets without scoring the experiment',()=>{
 render(<SparkPreview/>);
 ['Catch it','Let it pass','Let it pass','Let it pass','Catch it','Let it pass'].forEach(name=>fireEvent.click(screen.getByRole('button',{name})));
 expect(screen.getByText('6 of 6 choices correct')).toBeTruthy();
 expect(screen.getByText('Untimed preview · not part of your results')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Play again'}));
 expect(screen.getByRole('img',{name:'blue circle'})).toBeTruthy();
});
