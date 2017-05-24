import React from 'react';
import {render} from 'react-dom';

console.log('Hello');

class App extends React.Component {
    render() {
        return (
            <div>
                <p>Hello, list!</p>
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));