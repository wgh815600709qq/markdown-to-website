import React, { Component } from 'react';
import './index.less';
import Menu from '../menu';
export default class Root extends Component {
    constructor() {
        super()
        this.state = {
            menuData: null
        }
    }
    render() {
        return <div className="entry">
            
        </div>
    }

    componentDidMount() {
        fetch('/getMenu', {method: 'post'}).then(res => {
            return res.json()
        }).then(data => {
            console.log('data', data);
            this.setState({menuData: data});
        })
    }
}   