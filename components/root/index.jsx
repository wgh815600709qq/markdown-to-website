import React, { Component } from 'react';
import './index.less';
import Menu from '../menu';
export default class Root extends Component {
    constructor() {
        super()
        this.state = {
            tree: [],
            array: []
        }
    }
    render() {
        return <div className="entry">
            <Menu data={this.state.tree} array={this.state.array}></Menu>
        </div>
    }

    componentDidMount() {
        fetch('/getMenu', {method: 'post'}).then(res => {
            return res.json()
        }).then(res => {
            console.log('data', res);
            this.setState({tree: res.data, array: res.array});
        })
    }
}   